<template>
    <div id="laporan-statistik-with-hyperlink">
        <spinner v-if="isLoading" />
        <div v-if="isModalVisible">
            <Modal :showModal="isModalVisible" @close="closeModal" size="lg" title="Tetapan Laporan">
                <setting-laporan :propSchemaDataReport="schemaList" :propSchemaDataReportAsal="schemaDataReportAsal"
                    ref="settingLaporan" @alterReportProps="alterReportProps" />
            </Modal>
        </div>
        <div v-if="isModalLinkComponentVisible && Object.keys(schemaFormCarian).length">
            <Modal :showModal="isModalLinkComponentVisible" @close="closeModal" size="xl" ref="modalLink" :title="linkComponentTitle">
                <laporan-with-carian :propMenuLaporan="linkSchemaDataReport" ref="link-laporan-with-carian" class="mt-2"
                    @backToList="$refs.modalLink.closeModal()" :propViewsType="viewsType" :propRoleType="roleType"
                    />
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
                        <button class="btn btn-warning me-1" @click="resetSearch"
                            v-if="hasSearchSchema">
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
                        @listSingleSelectActions="listSingleSelectActions" />

                </BCardBody>
            </BCard>
        </div>
    </div>
</template>

<script>
import ListLaporan from "@/views/ui-element/laporan/list-laporan";
import { Spinner } from "@2enapps/ui";
import { standardValidation } from "@2enapps/ui";
import { GeneratedFormListData } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { getDataLaporan } from "@/services/training/laporan";
import { GeneratedFormData } from "@2enapps/ui";
import LaporanWithCarian from "@/views/ui-element/laporan/laporan-with-carian.vue";
import { warningSwal, errorSwal } from "@2enapps/ui";
import { assignSchemaToListData } from "@2enapps/ui";
import { getParams } from "@2enapps/ui";
import { GeneratedFormModal as Modal } from "@2enapps/ui";
import { SettingLaporan } from "@2enapps/ui";
import { useLayoutStore } from "@2enapps/ui";
import { reassingedFormValue } from "@/services/training/template-cetakan";
import { getCurrentYear } from "@2enapps/ui";
import { listLinkActionsLaporan } from "@/services/training/template-cetakan";

const layoutStore = useLayoutStore();
export default {
    name: "laporan-statistik-with-hyperlink",
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
        LaporanWithCarian
    },
    data() {
        return {
            isModalVisible: false,
            isModalLinkComponentVisible: false,
            linkComponentTitle: "",
            showDetailsForm: false,
            backendPaginated: true,
            schemaDataReport: {
                title: this.propMenuLaporan.title,
                id: this.propMenuLaporan.id,

            },
            schemaDataReportAsal: {},
            linkSchemaDataReport: {},
            id: "",
            formDataViewMode: "",
            searchObject: {},
            schemaFormCarian: {},
            schemaList: {},
            list: [],
            listFooter: [],
            listDataFooter: [],
            listDataReport: {},
            formCarianData: {},
            printExcel: false,
            isLoading: false,
            searchFirst: true,
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
            //if (this.schemaDataReport.carianFields) {
            this.$refs.searchForm.formSubmit();
            //}
            this.openTemplete = {};
            if ((
                // this.schemaDataReport.carianFields && 
                this.$refs.searchForm.formIsValid
            )
                //|| !this.schemaDataReport.carianFields
            ) {
                //if (this.schemaDataReport.carianFields) {
                Object.assign(this.searchObject, this.$refs.searchForm.formData)
                //}
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
            this.linkComponentTitle = "";
            this.isModalVisible = false;
            this.isModalLinkComponentVisible = false;
        },
        notEmpty(obj) {
            return notEmpty(obj);
        },
        alterReportProps(data) {
            this.linkComponentTitle = "";
            this.isModalVisible = false;
            this.isModalLinkComponentVisible = false;
            Object.assign(this.schemaList, data)

        },
        resetSearch() {
            this.isSearch = false;
            this.$refs.searchForm.formReset();
            this.searchObject = {};
            this.refreshList()
        },
        backToList() {
            this.id = "";
            this.showDetailsForm = false;
            this.isModalLinkComponentVisible = false;
        },
        customValidator(field, self) {
            let errorMsg = standardValidation(field, self);
            if (errorMsg) {
                self.formErrors[field.name] = errorMsg;
            }
        },
        formActions(data) {
            data
        },
        listLinkActions(linkActions) {
            listLinkActionsLaporan(ListLaporan, linkActions, this)
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
                                        name: "tahun",
                                        label: "Tahun",
                                        type: "number",
                                        defaultValue: getCurrentYear(),
                                        maxLength: 4,
                                        validate: {
                                            //required: true,
                                            min: 4,
                                            max: 4,
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
                    { name: "bulan", align: "left", width: "15" },
                    {
                        name: "jumlahBerpenghuni",
                        align: "center",
                        width: "15",
                        hyperlink: true,
                        linkComponent: {
                            id: "laporanWithCarian",
                            paramsFilter: "bulan={{bulan}}&tahun={{tahun}}&idStatusKuarters=01",
                            paramsDisplay: " PADA {{bulan}} {{tahun}} BERSTATUS BERPENGHUNI",
                        },
                    },
                    {
                        name: "jumlahPembaikan",
                        align: "center",
                        width: "15",
                        hyperlink: true,
                        linkComponent: {
                            id: "laporanWithCarian",
                            paramsFilter:
                                "idBulan={{idBulan}}&tahun={{tahun}}&idStatusKuarters=02",
                            paramsDisplay: " PADA {{bulan}} {{tahun}} BERSTATUS PEMBAIKAN",
                        },
                    },
                    {
                        name: "jumlahSediaDiduduki",
                        align: "center",
                        width: "15",
                        hyperlink: true,
                        linkComponent: {
                            id: "laporanWithCarian",
                            paramsFilter:
                                "idBulan={{idBulan}}&tahun={{tahun}}&idStatusKuarters=03",
                            paramsDisplay: " PADA {{bulan}} {{tahun}} BERSTATUS SEDIA DIDUDUKI",
                        },
                    },
                    {
                        name: "jumlah",
                        align: "center",
                        width: "15",
                        hyperlink: true,
                        linkComponent: {
                            id: "laporanWithCarian",
                            paramsFilter: "idBulan={{idBulan}}&tahun={{tahun}}",
                            paramsDisplay: " PADA {{bulan}} {{tahun}}",
                        },
                    },
                ],
                customHeaders: [
                    [
                        { label: "BULAN", align: "left", valign: "middle", rowSpan: 2 },
                        { label: "KUARTERS", align: "center", colSpan: 4 },
                    ],
                    [
                        { label: "BERPENGHUNI", align: "center" },
                        { label: "PEMBAIKAN", align: "center" },
                        { label: "SEDIA DIDUDUKI", align: "center" },
                        { label: "JUMLAH", align: "center" },
                    ],
                ],

                customFooters: null,
                orientation: "l",
                fileName: "laporanWithHyperlink",
                // tableOverflow: this.schemaDataReport.tableOverflow,
                //listFontSize: this.schemaDataReport.listFontSize,
                showLogo: true,
                autoDownload: false,
                fontSize: 9,
                headerMargin: 28,
                showPageFooter: true,
                hideBil: false,

                //**settingDisplayExtraHeader
                //schemaExtraHeader: this.schemaDataReport.schemaExtraHeader,
            }
        },

    },
};
</script>
