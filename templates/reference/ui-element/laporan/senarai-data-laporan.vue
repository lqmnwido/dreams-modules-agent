<template>
    <div id="senarai-data-laporan">
        <spinner v-if="isLoading" />
        <div v-if="isPrintSurat && notEmpty(this.schemaDataReport.openTemplete)">
            <sample-template-cetakan v-if="openTemplete.templeteName == 'sample cetakan templete'"
                :cetakanName="openTemplete.templeteName" :propId="id" :PropCanEdit="false" :PropWaterMarkContent="''"
                :propViewsType="viewsType" :propRoleType="roleType" :propSchemaDataReport="propSchemaDataReport" />
            <sample-custom-template v-if="openTemplete.templeteName == 'sample cetakan custom templete'"
                :cetakanName="openTemplete.templeteName" :propId="id" :propSchemaDataReport="propSchemaDataReport"
                :PropCanEdit="false" :PropWaterMarkContent="''" :propViewsType="viewsType" :propRoleType="roleType" />
        </div>
        <div v-if="isModalVisible">
            <Modal :showModal="isModalVisible" @close="closeModal" size="lg" title="Tetapan Laporan">
                <setting-laporan :propSchemaDataReport="this.schemaDataReport"
                    :propSchemaDataReportAsal="propSchemaDataReport" ref="settingLaporan"
                    @alterReportProps="alterReportProps" :reportSearch="effectiveReportSearch" />
            </Modal>
        </div>
        <div v-if="isModalLinkComponentVisible && Object.keys(schemaFormCarian).length">
            <Modal :showModal="isModalLinkComponentVisible" @close="closeModal" size="xl" :title="linkComponentTitle">
                <senarai-data-laporan :propSchemaDataReport="linkSchemaDataReport" ref="linkSenaraiDataLaporan"
                    class="mt-2" @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType" />
            </Modal>
        </div>
        <div v-show="!showDetailsForm">
            <BCard class="mb-2" v-if="propSchemaDataReport.carianFields">
                <BCardTitle>
                    Carian
                </BCardTitle>
                <BCardBody>
                    <generated-form-data v-if="hasSearchSchema" :propSchema="schemaFormCarian"
                        :propData="formCarianData" ref="searchForm" @formActions="formActions"
                        @customValidator="customValidator" :isCarianReportDisplay="true" />
                    <div class="text-center">
                        <button class="btn btn-success me-1" @click="searchList">
                            {{ notEmpty(this.schemaDataReport.openTemplete) ? 'Cetak' : 'Carian' }}
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
            <div class="text-end mb-2" v-if="!propSchemaDataReport.carianFields">
                <button class="btn btn-primary me-1" @click="$emit('backToList')">
                    Kembali
                </button>
            </div>
            <BCard class="mb-2" v-if="!notEmpty(this.schemaDataReport.openTemplete)">
                <BCardBody>
                    <h4 class="text-center">{{ schemaDataReport.title }}</h4>
                    <generated-form-list-data v-if="hasListSchema" ref="listData"
                        :backendPaginated="true" :listData="list" :listSchema="schemaList" :totalRecord="totalRecord"
                        @paginatedProps="paginatedProps" :listDataFooter="listDataFooter"
                        @getListForReport="getListForReport" :propSchemaDataReportAsal="propSchemaDataReport"
                        :propSchemaDataReport="schemaDataReport" :propListDataReport="listDataReport"
                        @listLinkActions="listLinkActions" @listActions="listActions"
                        @listMultipleSelectActions="listMultipleSelectActions" @alterReportProps="alterReportProps"
                        @listSingleSelectActions="listSingleSelectActions" :reportSearch="effectiveReportSearch" />

                </BCardBody>
            </BCard>
        </div>
    </div>
</template>

<script>
import ListLaporan from "@/views/ui-element/laporan/list-laporan";
import { Spinner } from "@2enapps/ui";
import { standardValidation, dateCompareValidation } from "@2enapps/ui";
import { GeneratedFormListData } from "@2enapps/ui";
//import { convertDateToDisplay } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { getDataLaporan } from "@/services/training/laporan";
import { GeneratedFormData } from "@2enapps/ui";
// The monolith imported this component from itself here, to render the
// `<senarai-data-laporan>` child it nests at the top of its own template. A
// self-import makes the module its own dependency, and the registration below
// then reads the default export while the module is still initialising, which
// throws `Cannot access '__WEBPACK_DEFAULT_EXPORT__' before initialization` and
// takes the whole route down to the fallback page. Recursion does not need it:
// the `name` option below is what Vue 2 matches a tag against when there is no
// local registration, so dropping the import changes no rendering.
import { warningSwal, errorSwal } from "@2enapps/ui";
import { fieldDropDownDependency, fieldDropDownDependency3layers, assignSchemaToListData } from "@2enapps/ui";
import { getParams } from "@2enapps/ui";
import { GeneratedFormModal as Modal } from "@2enapps/ui";
import { SettingLaporan } from "@2enapps/ui";
import { useLayoutStore } from "@2enapps/ui";
import { reconstructSchemaExtraHeader, listLinkActionsLaporan, reassingedFormValue } from "@/services/training/template-cetakan";

import SampleTemplateCetakan from "@/views/ui-element/print/sample-template-cetakan.vue";
import SampleCustomTemplate from "@/views/ui-element/print/sample-custom-template.vue";

const layoutStore = useLayoutStore();
export default {
    name: "senarai-data-laporan",
    props: {
        propSchemaDataReport: Object,
        propViewsType: String,
        propRoleType: String,
    },
    components: { GeneratedFormData, Spinner, Modal, SettingLaporan, GeneratedFormListData, SampleTemplateCetakan, SampleCustomTemplate },
    data() {
        return {
            isModalVisible: false,
            isModalLinkComponentVisible: false,
            showDetailsForm: false,
            backendPaginated: true,
            schemaDataReport: {},
            schemaDataReportAsal: {},
            id: "",
            formDataViewMode: "",
            searchObject: {},
            searchDisplayObject: {},
            reportSearchSchema: {},
            linkSchemaDataReport: {},
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
            linkComponentTitle: "",
            isPrintSurat: false,
            jsonPropLayer: {},
            schemaExtraHeaderAsal: {},
        };
    },
    async created() {

        this.viewsType = this.propViewsType;
        this.roleType = this.propRoleType;
        Object.assign(this.schemaDataReport, this.propSchemaDataReport)
        Object.assign(this.schemaDataReportAsal, this.propSchemaDataReport)
        this.searchFirst = this.propSchemaDataReport.searchFirst != undefined ? this.propSchemaDataReport.searchFirst : this.searchFirst
        this.backendPaginated = this.propSchemaDataReport.backendPaginated != undefined ? this.propSchemaDataReport.backendPaginated : this.backendPaginated
        this.jsonPropLayer = this.getPropLayer(this.propSchemaDataReport.id);
        if (this.propSchemaDataReport.carianFields) {
            await this.getSchemaFormCarian();
        }
        if (this.propSchemaDataReport.listColumns) {
            await this.getSchemaList();
        }
        if (!this.backendPaginated) {
            this.setupListData();
        }
        //**settingDisplayExtraHeader
        this.schemaExtraHeaderAsal = notEmpty(this.schemaDataReport['schemaExtraHeader']) ? JSON.parse(JSON.stringify(this.schemaDataReport['schemaExtraHeader'])) : {}
    },
    computed: {
        showSchema() {
            return layoutStore.showSchema
        },
        priv() {
            return layoutStore.priv;
        },
        hasSearchSchema() {
            return Object.keys(this.schemaFormCarian).length > 0;
        },
        hasListSchema() {
            return Object.keys(this.schemaList).length > 0;
        },

        /**
         * Snapshot carian terakhir yang telah disubmit.
         * schema  : runtime form schema
         * data    : raw value untuk API
         * displayData : display value untuk Extra Header
         */
        reportSearch() {
            return {
                schema: Object.keys(this.reportSearchSchema).length
                    ? this.reportSearchSchema
                    : this.schemaFormCarian,
                data: this.searchObject,
                displayData: this.searchDisplayObject,
            };
        },

        /**
         * Extra Header hanya aktif bila:
         * - VUE_APP_EXTRAHEADER=yes
         * - offExtraHeader !== true
         *
         * Digunakan juga untuk parent setting-laporan supaya
         * report yang offExtraHeader=true langsung tidak expose setting Extra Header.
         */
        extraHeaderFeatureEnabled() {
            const envEnabled =
                String(process.env.VUE_APP_EXTRAHEADER || "")
                    .trim()
                    .toLowerCase() === "yes";

            const offExtraHeader =
                this.propSchemaDataReport &&
                this.propSchemaDataReport.offExtraHeader === true;

            return envEnabled && !offExtraHeader;
        },

        effectiveReportSearch() {
            return this.extraHeaderFeatureEnabled
                ? this.reportSearch
                : {};
        },
    },
    methods: {
        async setupListData() {
            if (!this.backendPaginated && !this.schemaDataReport.openTemplete) {
                this.searchList()
            }
        },
        async paginatedProps(page) {
            // console.log("SK paginatedProps data : ", page);
            Object.assign(page, {
                search: { ...this.searchObject },
            });
            if (this.backendPaginated) {
                if (page && page.startIndex > -1 && page.endIndex) {
                    await this.getList(page);
                }
            }
        },

        searchList() {
            this.isSearch = true;

            if (this.propSchemaDataReport.carianFields) {
                this.$refs.searchForm.formSubmit();
            }

            this.openTemplete = {};

            if (
                (this.propSchemaDataReport.carianFields &&
                    this.$refs.searchForm.formIsValid) ||
                !this.propSchemaDataReport.carianFields
            ) {
                /**
                 * Snapshot search hanya selepas form sah / user submit.
                 * Ini memastikan Extra Header ikut carian terakhir yang
                 * benar-benar digunakan, bukan value UI yang belum disubmit.
                 */
                if (
                    this.propSchemaDataReport.carianFields &&
                    this.$refs.searchForm
                ) {
                    this.searchObject = {
                        ...this.$refs.searchForm.formData,
                    };

                    this.searchDisplayObject = {
                        ...(this.$refs.searchForm.formDataDisplayValue || {}),
                    };

                    this.reportSearchSchema = this.$refs.searchForm.formSchema
                        ? JSON.parse(
                            JSON.stringify(this.$refs.searchForm.formSchema)
                        )
                        : JSON.parse(
                            JSON.stringify(this.schemaFormCarian)
                        );
                }

                if (this.schemaDataReport.openTemplete) {
                    this.isPrintSurat = false;

                    this.$nextTick(() => {
                        if (this.schemaDataReport.openTemplete) {
                            this.openTemplete =
                                this.schemaDataReport.openTemplete;
                            this.isPrintSurat = true;
                        }
                    });
                } else {
                    this.refreshList();
                }
            }
        },
        refreshList() {
            if (this.backendPaginated) {
                this.$refs.listData.goToPage(1);
            } else {
                Object.assign(this.$refs.listData.paginationProps, {
                    search: { ...this.searchObject },
                });
                this.getList(this.$refs.listData.paginationProps);
            }
        },
        cetak(type) {
            if (Object.keys(this.schemaFormCarian).length && this.propSchemaDataReport.carianFields) {
                this.$refs.searchForm.formSubmit();
            }
            if ((Object.keys(this.schemaFormCarian).length && this.propSchemaDataReport.carianFields && this.$refs.searchForm.formIsValid) || !Object.keys(this.schemaFormCarian).length) {
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

            const updatedData = {
                ...data,
            };

            if (!this.extraHeaderFeatureEnabled) {
                updatedData.searchExtraHeaderConfig = {};
                updatedData.searchExtraHeader = null;
            }

            Object.assign(this.schemaDataReport, updatedData);
        },
        listLinkActions(linkActions) {
            listLinkActionsLaporan(ListLaporan, linkActions, this)
        },
        resetSearch() {
            this.isSearch = false;
            this.$refs.searchForm.formReset();

            this.searchObject = {};
            this.searchDisplayObject = {};
            this.reportSearchSchema = {};

            if (!this.backendPaginated) {
                this.setupListData();
            } else {
                this.refreshList();
            }
        },
        /**
         * Compare raw submitted value dengan raw value semasa.
         * Digunakan supaya async dropdown display value tidak overwrite
         * snapshot carian lama jika user sudah ubah field tetapi belum submit.
         */
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

        /**
         * Refresh display label daripada generated-form-data.
         *
         * Berguna untuk dropdown dependency / async lookup yang mungkin
         * dapat display label selepas snapshot awal dibuat.
         *
         * Display value hanya disalin jika raw value masih sama dengan
         * searchObject yang terakhir disubmit.
         */
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
            dateCompareValidation(
                self,
                "tarikhMulaDaftar",
                "tarikhAkhirDaftar",
                "Sila pastikan tarikh mula tidak melebihi tarikh akhir ; "
            );
            dateCompareValidation(
                self,
                "tarikhMulaAgih",
                "tarikhAkhirAgih",
                "Sila pastikan tarikh mula tidak melebihi tarikh akhir ; "
            );
            dateCompareValidation(
                self,
                "tarikhMulaTawaran",
                "tarikhAkhirTawaran",
                "Sila pastikan tarikh mula tidak melebihi tarikh akhir ; "
            );
            dateCompareValidation(
                self,
                "tarikhMulaMasuk",
                "tarikhAkhirMasuk",
                "Sila pastikan tarikh mula tidak melebihi tarikh akhir ; "
            );
            dateCompareValidation(
                self,
                "tarikhMulaTerima",
                "tarikhAkhirTerima",
                "Sila pastikan tarikh mula tidak melebihi tarikh akhir ; "
            );
        },
        formActions(data) {
            data.formSchema.fieldSets.forEach((fieldset) => {
                fieldset.colGroups.forEach((colGroup) => {
                    if (colGroup.fields) {
                        colGroup.fields.forEach((field) => {
                            fieldDropDownDependency3layers(data, field,
                                'idLokasiKuarters', 'idKawasanKuarters', 'idFasa',
                                'idLokasiKuarters', 'idKawasanKuarters',
                                process.env.VUE_API_URL_KOD + `/kawasan-kuarters`,
                                process.env.VUE_API_URL_KOD + `/fasa`)
                            fieldDropDownDependency(data, field, 'idKawasanKuarters', 'jalan', process.env.VUE_API_URL_KUARTERS + `/kawasan-kuarters/${data.newFormData.idKawasanKuarters}/kuarters/jalan`)
                            fieldDropDownDependency(data, field, 'idKementerian', 'idAgensi', process.env.VUE_API_URL_KOD + '/agensi')
                        });
                    }
                });
            });
        },


        restructTitle() {
            //incase untuk custom title
            if (this.schemaDataReport.id == 'laporanWithHyperlink') {
                this.schemaDataReport.title = this.schemaDataReportAsal.title + ' PADA TAHUN '
                    + this.$refs.searchForm.formData['tahun']
            }
        },

        getPropLayer(type) {
            if (type == 'laporanWithCarian'
                //|| type == 'laporanWithCarianPenghuniTerkini'
            ) {
                return {
                    firstLayerNo: true,
                    layer: {
                        fields: [
                            {
                                name: "bil",
                                setName: "bil",
                            },
                            {
                                name: "noUnit",
                                setName: "noUnit",
                            },
                            {
                                name: "keteranganFasa",
                                setName: "keteranganFasa",
                            },
                            {
                                name: "jalanKompleks",
                                setName: "jalanKompleks",
                            },
                            {
                                name: "keteranganKawasanKuarters",
                                setName: "keteranganKawasanKuarters",
                            },
                            {
                                name: "keteranganLokasiKuarters",
                                setName: "keteranganLokasiKuarters",
                            },
                            {
                                name: "keteranganJenisKediaman",
                                setName: "keteranganJenisKediaman",
                            },
                            {
                                name: "keteranganKelasKuarters",
                                setName: "keteranganKelasKuarters",
                            },
                            {
                                name: "keteranganStatus",
                                setName: "keteranganStatus",
                            },
                        ],
                        children: {
                            name: "penghuni",
                            fields: [
                                {
                                    name: "namaPenghuni",
                                    setName: "namaPenghuni",
                                },
                                {
                                    name: "noPengenalanPenghuni",
                                    setName: "noPengenalanPenghuni",
                                },
                                {
                                    name: "noTelefon",
                                    setName: "noTelefon",
                                },
                                {
                                    name: "keteranganKementerian",
                                    setName: "keteranganKementerian",
                                },
                                {
                                    name: "keteranganGred",
                                    setName: "keteranganGred",
                                },
                                {
                                    name: "keteranganAgensi",
                                    setName: "keteranganAgensi",
                                },
                                {
                                    name: "jabatan",
                                    setName: "jabatan",
                                },
                                {
                                    name: "tarikhMasukKuarters",
                                    setName: "tarikhMasukKuarters",
                                },
                                {
                                    name: "tarikhKeluarKuarters",
                                    setName: "tarikhKeluarKuarters",
                                },
                                {
                                    name: "tarikhBersara",
                                    setName: "tarikhBersara",
                                },
                                {
                                    name: "umurBersara",
                                    setName: "umurBersara",
                                },
                            ],
                        }
                    }
                }
            } else {
                return {}
            }

        },


        getListForReport(type) {
            if ((this.searchFirst && this.isSearch) || !this.searchFirst) {
                this.isLoading = true;

                /**
                 * Pastikan display label terbaru tersedia sebelum
                 * build Extra Header PDF / Excel.
                 */
                this.syncReportSearchDisplayValues();

                let params = "";
                params = getParams(params, this.$refs.listData.paginationProps, this, true);
                if (this.propSchemaDataReport.extraParams) {
                    reassingedFormValue(this.propSchemaDataReport.extraParams, this)
                    params += `${params.indexOf("?") > -1 ? "&" : "?"}${this.propSchemaDataReport.extraParams}`;
                }
                if (notEmpty(this.schemaDataReport['schemaExtraHeader'])) {
                    /**
                     * Legacy schemaExtraHeader kekal disokong.
                     * Gunakan snapshot display value yang sama dengan
                     * Extra Header Carian baru.
                     */
                    if (notEmpty(this.searchDisplayObject)) {
                        for (let key in this.searchDisplayObject) {
                            if (key) {
                                this.schemaDataReport['schemaExtraHeader']['data'][key] =
                                    this.searchDisplayObject[key];
                            }
                        }
                    }

                    Object.assign(
                        this.schemaDataReport['schemaExtraHeader'],
                        reconstructSchemaExtraHeader(
                            this.schemaDataReport['schemaExtraHeader'],
                            this.schemaExtraHeaderAsal
                        )
                    );
                }
                getDataLaporan(this.jsonPropLayer, this.propSchemaDataReport.id, this.propSchemaDataReport.apiName, params).then((finalRes) => {
                    this.isLoading = false;
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
                }).catch((error) => {
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
                if (this.propSchemaDataReport.extraParams) {
                    reassingedFormValue(this.propSchemaDataReport.extraParams, this)
                    params += `${params.indexOf("?") > -1 ? "&" : "?"}${this.propSchemaDataReport.extraParams}`;
                }

                getDataLaporan(this.jsonPropLayer, this.propSchemaDataReport.id, this.propSchemaDataReport.apiName, params).then((finalRes) => {
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




            // if (!this.backendPaginated) {
            //     //this.listCondition(this.list);
            // }
            //this.tempSortIndex(page)
        },

        //...........................................................................................................
        //....SSSSSSSSSS.......CCCCCCCCCC.....HHHH......HHHH...EEEEEEEEEEEEEE..MMMMMMM....MMMMMMM......AAAAAA........
        //...SSSSSSSSSSSS.....CCCCCCCCCCCC....HHHH......HHHH...EEEEEEEEEEEEEE..MMMMMMM....MMMMMMM.....AAAAAAAA.......
        //..SSSSSSSSSSSSS....CCCCCCCCCCCCCC...HHHH......HHHH...EEEEEEEEEEEEEE..MMMMMMM....MMMMMMM.....AAAAAAAA.......
        //..SSSSSS.SSSSSSS..CCCCCCCCCCCCCCCC..HHHH......HHHH...EEEEE...........MMMMMMM...MMMMMMMM.....AAAAAAAAA......
        //..SSSSS....SSSSS..CCCCCC....CCCCC...HHHH......HHHH...EEEEE...........MMMMMMMM..MMMMMMMM....AAAAAAAAAA......
        //..SSSSSSS.........CCCCC.............HHHH......HHHH...EEEEE...........MMMMMMMM..MMMMMMMM....AAAAAAAAAA......
        //..SSSSSSSSSS.....SCCCCC.............HHHH......HHHH...EEEEE...........MMMMMMMM.MMMMMMMMM....AAAAAAAAAAA.....
        //...SSSSSSSSSSSS..SCCCC..............HHHHHHHHHHHHHH...EEEEEEEEEEEEE...MMMMMMMMMMMMMMMMMM...AAAAA..AAAAA.....
        //....SSSSSSSSSSSS.SCCCC..............HHHHHHHHHHHHHH...EEEEEEEEEEEEE...MMMMMMMMMMMMMMMMMM...AAAAA..AAAAA.....
        //......SSSSSSSSSS.SCCCC..............HHHHHHHHHHHHHH...EEEEEEEEEEEEE...MMMMMMMMMMMMMMMMMM...AAAAA...AAAAA....
        //..........SSSSSS.SCCCCC.............HHHH......HHHH...EEEEE...........MMMMMMMMMMMMMMMMMM..AAAAAAAAAAAAAA....
        //.SSSSS......SSSSS.CCCCC.............HHHH......HHHH...EEEEE...........MMMMMMMMMMMMMMMMMM..AAAAAAAAAAAAAAA...
        //.SSSSSS....SSSSSS.CCCCCC....CCCCCC..HHHH......HHHH...EEEEE...........MMMMMMMMMMMM.MMMMM..AAAAAAAAAAAAAAA...
        //..SSSSSSSSSSSSSS..CCCCCCCCCCCCCCCC..HHHH......HHHH...EEEEE...........MMMMM.MMMMMM.MMMMM.AAAAAA.....AAAAA...
        //..SSSSSSSSSSSSSS...CCCCCCCCCCCCCC...HHHH......HHHH...EEEEEEEEEEEEEE..MMMMM.MMMMMM.MMMMM.AAAAA......AAAAAA..
        //...SSSSSSSSSSSS.....CCCCCCCCCCCCC...HHHH......HHHH...EEEEEEEEEEEEEE..MMMMM.MMMMMM.MMMMMMAAAAA.......AAAAA..
        //....SSSSSSSSSS.......CCCCCCCCCC.....HHHH......HHHH...EEEEEEEEEEEEEE..MMMM..MMMMM..MMMMMMAAAAA.......AAAAA..
        //...........................................................................................................


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
                                fields: this.propSchemaDataReport.carianFields
                            }
                        ]
                    },
                ],
            };
        },
        getSchemaList() {
            this.schemaList = {
                title: this.propSchemaDataReport.title,
                key: this.propSchemaDataReport.pkField,
                allowPrint: true,
                tableOverflow: 'auto',
                fields: this.propSchemaDataReport.listColumns,
                customHeaders: this.propSchemaDataReport.customHeaders,
                customFooters: this.propSchemaDataReport.customFooters,
                orientation: this.propSchemaDataReport.orientation,
                fileName: this.propSchemaDataReport.fileName,
                // tableOverflow: this.propSchemaDataReport.tableOverflow,
                listFontSize: this.propSchemaDataReport.listFontSize,
                showLogo: this.propSchemaDataReport.showLogo,
                autoDownload: this.propSchemaDataReport.autoDownload,
                fontSize: this.propSchemaDataReport.fontSize,
                headerMargin: this.propSchemaDataReport.headerMargin,
                showPageFooter: this.propSchemaDataReport.showPageFooter,
                hideBil: this.propSchemaDataReport.hideBil,

                /**
                 * Extra Header Carian baru.
                 *
                 * offExtraHeader=true:
                 * - list-data akan disable feature sepenuhnya
                 * - config dikosongkan
                 * - popup setting tidak expose section Extra Header
                 *
                 * Jika searchExtraHeaderConfig tiada, list-data akan
                 * gunakan default framework / runtime Tetapan Laporan.
                 */
                offExtraHeader: this.propSchemaDataReport.offExtraHeader,
                searchExtraHeaderConfig:
                    this.propSchemaDataReport.searchExtraHeaderConfig,

                //**settingDisplayExtraHeader - legacy
                schemaExtraHeader: this.propSchemaDataReport.schemaExtraHeader,
            }
        },

    },
};
</script>
