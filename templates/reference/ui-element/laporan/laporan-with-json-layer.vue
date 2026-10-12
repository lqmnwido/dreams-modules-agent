<template>
    <div id="laporan-with-json-layer">
        <spinner v-if="isLoading" />
        <div v-if="isModalVisible">
            <Modal :showModal="isModalVisible" @close="closeModal" size="lg" title="Tetapan Laporan">
                <setting-laporan :propSchemaDataReport="schemaList" :propSchemaDataReportAsal="schemaDataReportAsal"
                    ref="settingLaporan" @alterReportProps="alterReportProps" />
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
import { Spinner } from "@2enapps/ui";
import { standardValidation } from "@2enapps/ui";
import { GeneratedFormListData } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { getDataLaporan } from "@/services/training/laporan";
import { GeneratedFormData } from "@2enapps/ui";
import { warningSwal, errorSwal } from "@2enapps/ui";
import { assignSchemaToListData, insideSchemaFieldsFA } from "@2enapps/ui";
import { getParams } from "@2enapps/ui";
import { GeneratedFormModal as Modal } from "@2enapps/ui";
import { SettingLaporan } from "@2enapps/ui";
import { useLayoutStore } from "@2enapps/ui";
import { reassingedFormValue } from "@/services/training/template-cetakan";


const layoutStore = useLayoutStore();
export default {
    name: "laporan-with-json-layer",
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
            jsonPropLayer: {},
        };
    },
    async created() {
        this.viewsType = this.propViewsType;
        this.roleType = this.propRoleType;
        await this.getPropLayer();
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
            this.$refs.searchForm.formSubmit();
            this.openTemplete = {};
            if ((
                this.$refs.searchForm.formIsValid
            )
            ) {
                Object.assign(this.searchObject, this.$refs.searchForm.formData)
                this.refreshList();
            }
        },
        refreshList() {
            this.$refs.listData.goToPage(1);
        },
        cetak(type) {
            this.$refs.searchForm.formSubmit();
            //}
            if ((Object.keys(this.schemaFormCarian).length &&
                this.$refs.searchForm.formIsValid)
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
        },
        customValidator(field, self) {
            let errorMsg = standardValidation(field, self);
            if (errorMsg) {
                self.formErrors[field.name] = errorMsg;
            }

        },
        formActions(data) {
            insideSchemaFieldsFA(data.formSchema, (field) => {
                field
            })
        },


        restructTitle() {
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
                    // finalRes.list.forEach((item, index) => {
                    //     item.bil = index + 1;
                    // });
                    this.totalRecord = finalRes ? finalRes.total : 0;
                    this.list = finalRes ? finalRes.list : [];
                    this.listDataFooter = finalRes && finalRes.listFooter ? finalRes.listFooter : [];
                    this.restructTitle();
                    this.listCondition(this.list);

                })
                    .catch((error) => {
                        errorSwal('Ralat', error);
                    });
            } else {
                this.totalRecord = 0
                this.list = [];
                this.listDataFooter = [];
                this.restructTitle();
            }
        },

        getPropLayer() {
            this.jsonPropLayer = {
                firstLayerNo: true,
                layer: {
                    fields: [
                        {
                            name: "bil",
                            setName: "bil",
                        },
                        {
                            name: "name",
                            setName: "nameParent",
                        },
                    ],
                    children: {
                        name: "childLayer",
                        fields: [
                            {
                                name: "name",
                                setName: "nameChildLayerOne",
                            },
                        ],
                        children: {
                            name: "childLayer",
                            fields: [
                                {
                                    name: "name",
                                    setName: "nameChildLayerTwo",
                                },
                            ],
                        }
                    }
                }
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
                                        name: "nameParent",
                                        label: "Nama Parent",
                                        type: "text",
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
                hideBil: true,
                allowPrint: true,
                fields: [
                    { label: "No.", name: "bil", align: "center" },
                    { label: "Parent Layer", name: "nameParent", align: "left" },
                    { label: "Child Layer One", name: "nameChildLayerOne", align: "left" },
                    { label: "Child Layer Two", name: "nameChildLayerTwo", align: "left" },
                ],
                removeStripe: true,
                customHeaders: null,
                customFooters: null,
                orientation: "p",
                fileName: "laporanWithCarian",
                showLogo: true,
                autoDownload: false,
                fontSize: 8,
                headerMargin: 28,
                showPageFooter: true,
            }
        },

    },
};
</script>
