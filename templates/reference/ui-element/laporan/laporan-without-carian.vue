<template>
    <div id="laporan-without-carian">
        <spinner v-if="isLoading" />
        <div v-if="isModalVisible">
            <Modal :showModal="isModalVisible" @close="closeModal" size="lg" title="Tetapan Laporan">
                <setting-laporan :propSchemaDataReport="schemaList" :propSchemaDataReportAsal="schemaDataReportAsal"
                    ref="settingLaporan" @alterReportProps="alterReportProps" />
            </Modal>
        </div>
        <div v-show="!showDetailsForm">
            <div class="text-end mb-2" >
                <button class="btn btn-primary me-1" @click="$emit('backToList')">
                    Kembali
                </button>
            </div>
            <BCard class="mb-2">
                <BCardBody>
                    <h4 class="text-center">{{ schemaList.title }}</h4>
                    <generated-form-list-data v-if="hasListSchema" ref="listData"
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
import { Spinner } from "@2enapps/ui";
import { GeneratedFormListData } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { getDataLaporan } from "@/services/training/laporan";
import { errorSwal } from "@2enapps/ui";
import { assignSchemaToListData } from "@2enapps/ui";
import { getParams } from "@2enapps/ui";
import { GeneratedFormModal as Modal } from "@2enapps/ui";
import { SettingLaporan } from "@2enapps/ui";
import { useLayoutStore } from "@2enapps/ui";
import { reassingedFormValue } from "@/services/training/template-cetakan";


const layoutStore = useLayoutStore();
export default {
    name: "laporan-without-carian",
    props: {
        propMenuLaporan: Object,
        propViewsType: String,
        propRoleType: String,
    },
    components: {
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
        refreshList() {
            this.$refs.listData.goToPage(1);
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
            Object.assign(this.schemaList, data)

        },
        backToList() {
            this.id = "";
            this.showDetailsForm = false;
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
                fileName: "laporanWithoutCarian",
                // tableOverflow: this.schemaDataReport.tableOverflow,
                //listFontSize: this.schemaDataReport.listFontSize,
                showLogo: true,
                autoDownload: false,
                fontSize: 5,
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
