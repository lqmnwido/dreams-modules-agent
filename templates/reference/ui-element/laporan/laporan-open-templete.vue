<template>
    <div id="laporan-open-templete">
        <spinner v-if="isLoading" />
        <div v-if="isPrintSurat && notEmpty(this.schemaDataReport.openTemplete)">
            <sample-template-cetakan
                :cetakanName="openTemplete.templeteName" :propId="id" :PropCanEdit="false" :PropWaterMarkContent="''"
                :propViewsType="viewsType" :propRoleType="roleType" :propSchemaDataReport="schemaDataReport" />
        </div>
        <div v-show="!showDetailsForm">
            <BCard class="mb-2" v-if="schemaDataReport.carianFields">
                <BCardTitle>
                    Carian
                </BCardTitle>
                <BCardBody>
                    <generated-form-data v-if="hasSearchSchema" :propSchema="schemaFormCarian"
                        :propData="formCarianData" ref="searchForm" @formActions="formActions"
                        @customValidator="customValidator" :isCarianReportDisplay="true" />
                    <div class="text-center">
                        <button class="btn btn-success me-1" @click="searchList">
                            Cetak
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
        </div>
    </div>
</template>

<script>
import { Spinner } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { GeneratedFormData } from "@2enapps/ui";
import { useLayoutStore } from "@2enapps/ui";
import SampleTemplateCetakan from "@/views/ui-element/print/sample-template-cetakan.vue";


const layoutStore = useLayoutStore();
export default {
    name: "laporan-open-template",
    props: {
        propMenuLaporan: Object,
        propViewsType: String,
        propRoleType: String,
    },
    components: {
        GeneratedFormData,
        Spinner,
        SampleTemplateCetakan,
    },
    data() {
        return {
            // schemaDataReport: {
            //     title: this.propMenuLaporan.title,
            //     id: this.propMenuLaporan.id,
            //     openTemplete: {
            //         templeteName: "sample cetakan templete",
            //     },
            //     carianFields: [
            //         {
            //             name: "fieldCarian",
            //             label: "Field Carian",
            //             type: "text",
            //         },
            //     ],
            // },
            isModalVisible: false,
            showDetailsForm: false,
            schemaDataReport: {
                title: this.propMenuLaporan.title,
                id: this.propMenuLaporan.id,
                openTemplete: {
                    templeteName: "sample cetakan templete",
                },
                carianFields: [
                    {
                        name: "fieldCarian",
                        label: "Field Carian",
                        type: "text",
                    },
                ],
            },
            id: "",
            formDataViewMode: "",
            searchObject: {},
            schemaFormCarian: {},
            formCarianData: {},            
            isLoading: false,            
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
        //Object.assign(this.schemaDataReport, this.schemaDataReport)
        await this.getSchemaFormCarian();
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
            if (page && page.startIndex > -1 && page.endIndex) {
                await this.getList(page);
            }
        },
        searchList() {
            this.isSearch = true;
            if (this.schemaDataReport.carianFields) {
                this.$refs.searchForm.formSubmit();
            }
            this.openTemplete = {};
            if ((this.schemaDataReport.carianFields && this.$refs.searchForm.formIsValid) || !this.schemaDataReport.carianFields) {
                this.isPrintSurat = false;
                this.$nextTick(() => {
                    if (this.schemaDataReport.openTemplete) {
                        this.openTemplete = this.schemaDataReport.openTemplete;
                        this.isPrintSurat = true;
                    }
                })
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
        resetSearch() {
            this.isSearch = false;
            this.$refs.searchForm.formReset();
            this.searchObject = {};
        },
        backToList() {
            this.id = "";
            this.showDetailsForm = false;
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
                                colwidth: "12", //1-12
                                fieldwidth: "6", //1-12
                                fields: [
                                    {
                                        name: "fieldCarian",
                                        label: "Field Carian",
                                        type: "text",
                                    },
                                ]
                            }
                        ]
                    },
                ],
            };
        },
    },
};
</script>
