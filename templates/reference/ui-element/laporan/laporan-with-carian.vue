<template>
    <div id="laporan-with-carian">
        <spinner v-if="isLoading" />
        <div v-if="isModalVisible">
            <Modal :showModal="isModalVisible" @close="closeModal" size="lg" title="Tetapan Laporan">
                <setting-laporan :propSchemaDataReport="schemaList" :propSchemaDataReportAsal="schemaDataReportAsal"
                    ref="settingLaporan" @alterReportProps="alterReportProps"
                    :reportSearch="effectiveReportSearch" />
            </Modal>
        </div>
        <div v-show="!showDetailsForm">
            <BCard class="mb-2">
                <BCardTitle>
                    Carian
                </BCardTitle>
                <BCardBody>
                    <generated-form-data v-if="hasSearchSchema" :propSchema="schemaFormCarian"
                        :propData="formCarianData" ref="searchForm" @formActions="formActions"
                        @customValidator="customValidator" :isCarianReportDisplay="true" />
                    <div class="text-center">
                        <button class="btn btn-success me-1" @click="searchList">
                            Carian
                        </button>
                        <button class="btn btn-warning me-1" @click="resetSearch" v-if="hasSearchSchema">
                            Set Semula
                        </button>
                        <button class="btn btn-primary me-1" @click="$emit('backToList')">
                            Kembali
                        </button>
                    </div>
                </BCardBody>
                <BAlert :model-value="showSchema" variant="warning" class="m-1" v-if="notEmpty(schemaDataReport)">
                    <label>Schema Data Report : </label>
                    <pre>{{ JSON.stringify(schemaDataReport, null, 4) }}</pre>
                </BAlert>
            </BCard>
            <BCard class="mb-2">
                <BCardBody>
                    <h4 class="text-center">{{ schemaList.title }}</h4>
                    <generated-form-list-data v-if="Object.keys(schemaList).length" ref="listData"
                        :backendPaginated="true" :listData="list" :listSchema="schemaList" :totalRecord="totalRecord"
                        @paginatedProps="paginatedProps" :listDataFooter="listDataFooter"
                        @getListForReport="getListForReport" :propSchemaDataReportAsal="schemaDataReportAsal"
                        :propSchemaDataReport="schemaDataReport" :propListDataReport="listDataReport"
                        @listLinkActions="listLinkActions" @listActions="listActions"
                        @listMultipleSelectActions="listMultipleSelectActions" @alterReportProps="alterReportProps"
                        @listSingleSelectActions="listSingleSelectActions"
                        :reportSearch="effectiveReportSearch" />

                </BCardBody>
            </BCard>
        </div>
    </div>
</template>

<script>
import { Spinner } from "@2enapps/ui";
import { standardValidation } from "@2enapps/ui";
import { GeneratedFormListData } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { getDataLaporan } from "@/services/training/laporan";
import { GeneratedFormData } from "@2enapps/ui";
import { warningSwal, errorSwal } from "@2enapps/ui";
import { fieldDropDownDependency, fieldDropDownDependency3layers, assignSchemaToListData, insideSchemaFieldsFA } from "@2enapps/ui";
import { getParams } from "@2enapps/ui";
import { GeneratedFormModal as Modal } from "@2enapps/ui";
import { SettingLaporan } from "@2enapps/ui";
import { useLayoutStore } from "@2enapps/ui";
import { reassingedFormValue } from "@/services/training/template-cetakan";


const layoutStore = useLayoutStore();
export default {
    name: "laporan-with-carian",
    props: {
        propMenuLaporan: Object,
        propViewsType: String,
        propRoleType: String,
    },
    components: {
        GeneratedFormData,
        Spinner,
        Modal,
        SettingLaporan,
        GeneratedFormListData,
    },
    data() {
        return {
            isModalVisible: false,
            showDetailsForm: false,
            backendPaginated: true,
            schemaDataReport: {
                title: this.propMenuLaporan.title,
                id: this.propMenuLaporan.id,

            },
            schemaDataReportAsal: {},
            id: "",
            formDataViewMode: "",
            searchObject: {},
            searchDisplayObject: {},
            reportSearchSchema: {},
            schemaFormCarian: {},
            schemaList: {},
            list: [],
            listFooter: [],
            listDataFooter: [],
            listDataReport: {},
            formCarianData: {},
            printExcel: false,
            isLoading: false,
            searchFirst: false,
            isSearch: false,
            openTemplete: {},
            viewsType: "",
            roleType: "",
            isPrintSurat: false,
        };
    },
    async created() {
        this.viewsType = this.propViewsType;
        this.roleType = this.propRoleType;
        await this.getSchemaFormCarian();
        await this.getSchemaList();
        Object.assign(this.schemaDataReport, this.schemaList)
        Object.assign(this.schemaDataReportAsal, this.schemaDataReport)
    },
    computed: {
        showSchema() {
            return layoutStore.showSchema
        },
        hasSearchSchema() {
            return Object.keys(this.schemaFormCarian).length > 0;
        },
        hasListSchema() {
            return Object.keys(this.schemaList).length > 0;
        },

        reportSearch() {
            return {
                schema: Object.keys(this.reportSearchSchema).length
                    ? this.reportSearchSchema
                    : this.schemaFormCarian,
                data: this.searchObject,
                displayData: this.searchDisplayObject,
            };
        },

        extraHeaderFeatureEnabled() {
            const envEnabled =
                String(process.env.VUE_APP_EXTRAHEADER || "")
                    .trim()
                    .toLowerCase() === "yes";

            const offExtraHeader =
                (this.schemaList &&
                    this.schemaList.offExtraHeader === true) ||
                (this.propMenuLaporan &&
                    this.propMenuLaporan.offExtraHeader === true);

            return envEnabled && !offExtraHeader;
        },

        effectiveReportSearch() {
            return this.extraHeaderFeatureEnabled
                ? this.reportSearch
                : {};
        },
    },
    methods: {
        async paginatedProps(page) {
            Object.assign(page, {
                search: { ...this.searchObject },
            });
            if (page && page.startIndex > -1 && page.endIndex) {
                await this.getList(page);
            }
        },
        searchList() {
            this.isSearch = true;
            this.$refs.searchForm.formSubmit();
            this.openTemplete = {};

            if (this.$refs.searchForm.formIsValid) {
                this.searchObject = {
                    ...this.$refs.searchForm.formData,
                };

                this.searchDisplayObject = {
                    ...(this.$refs.searchForm.formDataDisplayValue || {}),
                };

                this.reportSearchSchema = this.$refs.searchForm.formSchema
                    ? JSON.parse(JSON.stringify(this.$refs.searchForm.formSchema))
                    : JSON.parse(JSON.stringify(this.schemaFormCarian));

                this.refreshList();
            }
        },
        refreshList() {
            this.$refs.listData.goToPage(1);
        },
        cetak(type) {
            //if (Object.keys(this.schemaFormCarian).length && this.schemaDataReport.carianFields) {
            this.$refs.searchForm.formSubmit();
            //}
            if ((Object.keys(this.schemaFormCarian).length &&
                //this.schemaDataReport.carianFields && 
                this.$refs.searchForm.formIsValid)
                //|| !Object.keys(this.schemaFormCarian).length
            ) {
                this.getReport(type)
            } else {
                warningSwal('Peringatan', 'Pastikan maklumat adalah sah dan lengkap!.');
            }
        },
        openModal() {
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        },
        notEmpty(obj) {
            return notEmpty(obj);
        },
        alterReportProps(data) {
            this.isModalVisible = false;

            const updatedData = {
                ...data,
            };

            if (!this.extraHeaderFeatureEnabled) {
                updatedData.searchExtraHeaderConfig = {};
                updatedData.searchExtraHeader = null;
            }

            Object.assign(this.schemaList, updatedData);
        },
        resetSearch() {
            this.isSearch = false;
            this.$refs.searchForm.formReset();

            this.searchObject = {};
            this.searchDisplayObject = {};
            this.reportSearchSchema = {};

            this.refreshList();
        },
        sameSearchValue(valueA, valueB) {
            if (Array.isArray(valueA) || Array.isArray(valueB)) {
                return JSON.stringify(valueA || []) ===
                    JSON.stringify(valueB || []);
            }

            const normalize = (value) => {
                if (
                    value === null ||
                    value === undefined ||
                    value === ""
                ) {
                    return "";
                }

                return String(value);
            };

            return normalize(valueA) === normalize(valueB);
        },

        syncReportSearchDisplayValues() {
            if (!this.$refs.searchForm) {
                return;
            }

            const currentFormData =
                this.$refs.searchForm.formData || {};
            const currentDisplayData =
                this.$refs.searchForm.formDataDisplayValue || {};

            Object.keys(this.searchObject || {}).forEach((key) => {
                if (
                    this.sameSearchValue(
                        this.searchObject[key],
                        currentFormData[key]
                    ) &&
                    Object.prototype.hasOwnProperty.call(
                        currentDisplayData,
                        key
                    )
                ) {
                    this.searchDisplayObject[key] =
                        currentDisplayData[key];
                }
            });

            this.searchDisplayObject = {
                ...this.searchDisplayObject,
            };
        },

        backToList() {
            this.id = "";
            this.showDetailsForm = false;
        },
        customValidator(field, self) {
            let errorMsg = standardValidation(field, self);
            if (errorMsg) {
                self.formErrors[field.name] = errorMsg;
            }

        },
        formActions(data) {
            insideSchemaFieldsFA(data.formSchema, (field) => {
                fieldDropDownDependency3layers(data, field,
                    'idLokasiKuarters', 'idKawasanKuarters', 'idFasa',
                    'idLokasiKuarters', 'idKawasanKuarters',
                    process.env.VUE_API_URL_KOD + `/kawasan-kuarters`,
                    process.env.VUE_API_URL_KOD + `/fasa`)
                fieldDropDownDependency(data, field, 'idKawasanKuarters', 'jalan', process.env.VUE_API_URL_KUARTERS + `/kawasan-kuarters/${data.newFormData.idKawasanKuarters}/kuarters/jalan`)
                fieldDropDownDependency(data, field, 'idKementerian', 'idAgensi', process.env.VUE_API_URL_KOD + '/agensi')
            })
        },


        restructTitle() {
            //incase untuk custom title
            if (this.schemaDataReport.id == 'laporanWithHyperlink') {
                this.schemaDataReport.title = this.schemaDataReportAsal.title + ' PADA TAHUN '
                    + this.$refs.searchForm.formData['tahun']
            }
        },

        getListForReport(type) {
            if ((this.searchFirst && this.isSearch) || !this.searchFirst) {
                this.isLoading = true;

                this.syncReportSearchDisplayValues();

                let params = "";
                params = getParams(params, this.$refs.listData.paginationProps, this, true);
                if (this.schemaDataReport.extraParams) {
                    reassingedFormValue(this.schemaDataReport.extraParams, this)
                    params += `${params.indexOf("?") > -1 ? "&" : "?"}${this.schemaDataReport.extraParams}`;
                }
                getDataLaporan(this.jsonPropLayer, this.schemaDataReport.id, params).then((finalRes) => {
                    this.isLoading = false;
                    console.log("getListForReport Laporan finalRes : ", finalRes);
                    finalRes.list.forEach((item, index) => {
                        item.bil = index + 1;  // Bil starts from 1

                    });
                    if (!this.extraHeaderFeatureEnabled) {
                        this.schemaDataReport.searchExtraHeaderConfig = {};
                        this.schemaDataReport.searchExtraHeader = null;
                    }

                    this.listDataReport = {
                        type,
                        list: finalRes.list,
                        listFooter: finalRes && finalRes.listFooter ? finalRes.listFooter : [],
                        schemaDataReport: this.schemaDataReport,
                    }
                })
                    .catch((error) => {
                        errorSwal('Ralat', error);
                    });
            } else {
                this.isLoading = false;
                this.totalRecord = 0
                this.list = [];
                this.listDataFooter = [];
                this.restructTitle();
            }
        },
        listCondition(data) {
            data.forEach((element) => {
                assignSchemaToListData(element, this.schemaList);
            });
        },
        getList(page) {
            if ((this.searchFirst && this.isSearch) || !this.searchFirst) {
                let params = "";
                params = getParams(params, page, this);
                if (this.schemaDataReport.extraParams) {
                    reassingedFormValue(this.schemaDataReport.extraParams, this)
                    params += `${params.indexOf("?") > -1 ? "&" : "?"}${this.schemaDataReport.extraParams}`;
                }

                getDataLaporan(this.jsonPropLayer, this.schemaDataReport.id, params).then((finalRes) => {
                    console.log("Laporan finalRes : ", finalRes);
                    finalRes.list.forEach((item, index) => {
                        item.bil = index + 1;
                    });
                    this.totalRecord = finalRes ? finalRes.total : 0;
                    this.list = finalRes ? finalRes.list : [];
                    this.listDataFooter = finalRes && finalRes.listFooter ? finalRes.listFooter : [];
                    this.restructTitle();
                    this.listCondition(this.list);

                }).catch((error) => {
                    //this.isLoading = false;
                    errorSwal('Ralat', error);
                });
            } else {
                this.totalRecord = 0
                this.list = [];
                this.listDataFooter = [];
                this.restructTitle();
            }
        },

        getSchemaFormCarian() {
            this.schemaFormCarian = {
                title: "",
                pkField: "",
                fieldSets: [
                    {
                        legend: "",
                        name: "maklumat",
                        colGroups: [
                            {
                                colwidth: "12",
                                fieldwidth: "6",
                                fields: [
                                    {
                                        name: "idLokasiKuarters",
                                        label: "Sample Dropdown 1",
                                        type: "select-search",
                                        validate: {
                                            required: true,
                                        },
                                        refData: {
                                            name: "finishingChoice",
                                            keyColumn: "id",
                                            labelColumn: "keterangan",
                                            //url: process.env.VUE_API_URL_KOD + "/lokasi-kuarters",
                                            url: "",
                                        },
                                    },
                                    {
                                        name: "idKelasKuarters",
                                        label: "Sample Dropdown 2",
                                        type: "select-search",
                                        refData: {
                                            name: "tempohKerjaChoice",
                                            keyColumn: "id",
                                            labelColumn: "id",
                                            url: "",
                                        },
                                    },
                                    {
                                        name: "idStatusKuarters",
                                        label: "Sample Dropdown 3",
                                        type: "select-search",
                                        refData: {
                                            name: "integrasiSah",
                                            keyColumn: "id",
                                            labelColumn: "keterangan",
                                            url: "",
                                        },
                                    },

                                ]
                            }
                        ]
                    },
                ],
            };
        },
        getSchemaList() {
            this.schemaList = {
                title: this.schemaDataReport.title,
                key: "id",
                allowPrint: true,
                tableOverflow: 'auto',
                fields: [
                    { name: "noUnit", align: "left", width: "15" },
                    { name: "fasa", align: "left", width: "15" },
                    {
                        name: "jalan",
                        align: "left",
                        width: "15",
                    },
                    { name: "kawasanKuarters", align: "left", width: "15" },
                    { name: "lokasiKuarters", align: "left", width: "15" },
                    {
                        name: "jenisKediaman",
                        align: "left",
                        width: "15",
                    },
                    { name: "idKelasKuarters", align: "center", width: "15" },
                    { name: "status", align: "left", width: "15" },
                    {
                        name: "maklumatPenghuni",
                        align: "left",
                        width: "15",
                        multipleCols: [
                            {
                                name: "namaPenghuni",
                                label: "",
                            },
                            {
                                name: "noPengenalanPenghuni",
                                label: "",
                            },
                        ],
                    },
                    { name: "idGredPerkhidmatan", align: "center", width: "15" },
                    {
                        name: "kementerian",
                        align: "left",
                        width: "15",
                    },
                    {
                        name: "agensi",
                        align: "left",
                        width: "15",
                    },
                    { name: "jabatan", align: "left", width: "15" },
                    {
                        name: "tarikhMasukKuarters",
                        align: "center",
                        convertType: "date",
                        width: "15",
                    },
                    {
                        name: "tarikhJangkaBersara",
                        align: "center",
                        convertType: "date",
                        width: "15",
                    },
                    {
                        name: "umurBersara",
                        align: "center",
                        width: "15",
                    },
                ],
                customHeaders: [
                    [
                        // { label: "BIL", align: "center" }, // default utk keluarkan numbering
                        { label: "NO UNIT", align: "left" },
                        { label: "FASA", align: "left" },
                        {
                            label: "JALAN / KOMPLEKS",
                            align: "left",
                        },
                        { label: "KAWASAN", align: "left" },
                        { label: "LOKASI", align: "left" },
                        { label: "JENIS KEDIAMAN", align: "left" },
                        { label: "KELAS", align: "center" },
                        { label: "STATUS", align: "left" },
                        {
                            label: "MAKLUMAT PENGHUNI",
                            align: "left",
                        },
                        { label: "GRED", align: "center" },
                        {
                            label: "KEMENTERIAN",
                            align: "left",
                        },
                        {
                            label: "AGENSI / JABATAN",
                            align: "left",
                        },
                        { label: "BAHAGIAN", align: "left" },
                        {
                            label: "TARIKH MASUK",
                            align: "center",
                        },
                        {
                            label: "TARIKH JANGKA BERSARA",
                            align: "center",
                        },
                        {
                            label: "UMUR BERSARA",
                            align: "center",
                        },
                    ],
                ],
                customFooters: null,
                orientation: "l",
                fileName: "laporanWithCarian",
                // tableOverflow: this.schemaDataReport.tableOverflow,
                //listFontSize: this.schemaDataReport.listFontSize,
                showLogo: true,
                autoDownload: false,
                fontSize: 5,
                headerMargin: 28,
                showPageFooter: true,
                hideBil: false,

                offExtraHeader:
                    this.propMenuLaporan &&
                    this.propMenuLaporan.offExtraHeader === true,

                searchExtraHeaderConfig:
                    this.propMenuLaporan
                        ? this.propMenuLaporan.searchExtraHeaderConfig
                        : null,

                //**settingDisplayExtraHeader - legacy
                //schemaExtraHeader: this.schemaDataReport.schemaExtraHeader,
            }
        },

    },
};
</script>
