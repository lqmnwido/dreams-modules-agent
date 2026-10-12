<template>
  <div class="module-view">
    <PageHeader ref="pageHeader" :title="$t('uiElement.generalTabCrud.listMain.pageHeader.title')"
      :pageTitle="$t('uiElement.generalTabCrud.listMain.pageHeader.pageTitle')"
      :breadcrumbSteps="breadcrumbSteps" :starterKey="listStepKey"
      @screen-change="onBreadcrumbScreenChange" />
    <div id="list-main">
      <div v-if="showDetailsForm">
        <tab ref="tab" :propId="id" :propFormDataViewMode="formDataViewMode" :propViewsType="viewsType"
          :propRoleType="roleType" @backToList="backToList" @refreshList="refreshList" />
      </div>

      <div v-show="!showDetailsForm">
        <!--
          Dashboard ringkasan (shared `stat-card-grid` dari @2enapps/ui), di
          atas panel carian & senarai. Schema-driven: struktur kad dalam
          `statsSchema`, nilai dinamik dari service (`getDashboardStats` —
          sample hardcode). `statsLoading` memaparkan skeleton sementara
          menunggu response (BE disimulasikan dengan delay dalam service).
        -->
        <stat-card-grid v-if="Object.keys(statsSchema).length" class="mb-2" :propSchema="statsSchema"
          :propData="statsData" :loading="statsLoading" @card-action="onStatCardAction" />
        <!--
          One card holds the search and the list, as on
          `v2t/src/views/program/senarai-program.vue:12-42`. The card is titled
          after the list rather than after the search: the search is a control
          inside this panel, not a panel of its own, so a "Carian" title on the
          outer card would label the whole thing after its least important part.

          In the global mode there is no inner title at all, because
          `ComponentCarian` only renders its `BCardTitle` in the detailed mode —
          so naming the outer card "Senarai Utama" also keeps exactly one title
          on screen per mode instead of two.
        -->
        <BCard class="mb-2">
          <BCardTitle>{{ $t("uiElement.generalTabCrud.listMain.card.mainList") }}</BCardTitle>
          <BCardBody>
            <!--
              `ComponentCarian` owns both search modes. It opens on the global box
              and swaps to the detailed form on request, clearing the other side
              as it goes (`component-carian.vue:166-178`), so `qSearch` and
              `searchObject` are never both set by the UI. It is used here for
              the same reason and with the same wiring as
              `v2t/src/views/program/senarai-program.vue:15-27`.
            -->
            <component-carian v-if="hasSearchSchema" ref="searchForm" :propData="formCarianData"
              :schemaFormCarian="schemaFormCarian"
              :title="$t('uiElement.generalTabCrud.listMain.searchForm.detailedTitle')" @formActions="formActions"
              @customValidator="customValidator" @onSearch="onSearchClick" @onReset="onResetSearchClick"
              @globalSearch="globalSearch" @globalSearchReset="globalSearchReset"
              @globalSearchButton="globalSearchButton" :propGlobalSearchButtons="[
                {
                  label: 'button.common.tambah',
                  icon: 'fas fa-plus',
                  class: 'btn-success',
                  emitFunction: 'add',
                },
              ]" />

            <!--
              The global mode carries its own action buttons, so `Tambah` would be
              reachable twice on screen at once. It is rendered here only while
              the detailed form is showing, which is where it sat before the
              global search existed.

              Reading `$refs` in a template is not reactive on its own, so the
              condition is only re-evaluated when something else re-renders this
              component. That is enough here because both ways of changing mode
              reset the other side first (`component-carian.vue:166-178`), which
              emits `onReset` or `globalSearchReset`, and both of those call
              `refreshList()` below. The same pattern is used at
              `v2t/src/views/program/senarai-program.vue:29`.
            -->
            <div class="text-end mb-2" v-if="this.$refs?.searchForm?.searchType == 'terperinci'">
              <button type="button" class="btn btn-success" @click="onAddClick">
                <i class="fas fa-plus me-1" aria-hidden="true"></i>
                {{ $t("button.common.tambah") }}
              </button>
            </div>

            <generated-form-list-data v-if="hasListSchema" ref="listData" :backendPaginated="true" :listData="list"
              :listSchema="schemaList" :totalRecord="totalRecord" :propListDataReport="listDataReport"
              :customDisplayField="true" @paginatedProps="paginatedProps" @listActions="listActions"
              @updateDisplayListField="updateDisplayListField" @listMultipleSelectActions="listMultipleSelectActions"
              @getListForReport="getListForReport" @listLinkActions="listLinkActions" :reportSearch="reportSearch" />
          </BCardBody>
        </BCard>
      </div>
    </div>
  </div>
</template>

<script>
/* import Layout from "@/layouts/main.vue"; */
import { PageHeader } from "@2enapps/ui";
import { GeneratedFormListData } from "@2enapps/ui";
import { ComponentCarian } from "@2enapps/ui";
import { StatCardGrid } from "@2enapps/ui";
import Tab from "@/views/ui-element/general-tab-crud/tab.vue";
import { confirmSwal, errorSwal, privSwal, infoSwal } from "@2enapps/ui";
import { assignSchemaToListData } from "@2enapps/ui";

import { getParams } from "@2enapps/ui";
import { standardValidation } from "@2enapps/ui";
import { getMainList, deleteRecord, getDashboardStats } from "@/services/training/crud";
import { useLayoutStore, useNotificationStore } from "@2enapps/ui";

// Breadcrumb untuk senarai -> details. Mixin ini yang pegang
// `showDetailsForm` / `id` / `formDataViewMode` dan yang tolak step
// breadcrumb bila `openDetails()` dipanggil.
import { detailsBreadcrumbMixin } from "@2enapps/ui";

const layoutStore = useLayoutStore();
const notificationStore = useNotificationStore();

export default {
  name: "list-main",
  components: {
    PageHeader,
    ComponentCarian,
    GeneratedFormListData,
    StatCardGrid,
    Tab,
  },
  mixins: [detailsBreadcrumbMixin()],
  data() {
    return {
      // `showDetailsForm`, `id`, `formDataViewMode`, `screenTitle` dan
      // `breadcrumbSteps` datang daripada `detailsBreadcrumbMixin`.
      //
      // Dashboard ringkasan — schema (struktur kad) + data (nilai dinamik).
      statsSchema: {},
      statsData: {},
      statsLoading: true,
      // The two search modes' results, kept apart. `searchObject` becomes
      // `page.search` in `paginatedProps`; `qSearch` is read directly by
      // `getParams`, which turns it into `gSearch`. Both are cleared together on
      // reset so a refresh never carries a filter the user cannot see.
      qSearch: "",
      searchObject: {},
      searchDisplayObject: {},
      reportSearchSchema: {},
      schemaList: {},
      schemaFormCarian: {},
      list: [],
      totalRecord: 0,
      formCarianData: {},
      listDataReport: {},
      viewsType: "",
      roleType: "",
    };
  },

  async created() {
    this.viewsType = this.$route.params.viewsType || "";
    this.roleType = this.$route.params.roleType || "";
    this.initStatsSchema();
    this.loadDashboardStats();
    this.getSchemaList();
    this.getSchemaFormCarian();
  },

  computed: {
    reportSearch() {
      return {
        schema: Object.keys(this.reportSearchSchema).length
          ? this.reportSearchSchema
          : this.schemaFormCarian,
        data: this.searchObject,
        displayData: this.searchDisplayObject,
      };
    },
    priv() {
      return layoutStore.priv;
    },
    notificationProp: {
      get() {
        return notificationStore.notificationProp;
      },
      set(value) {
        notificationStore.changeNotificationProp(value);
      },
    },
    hasSearchSchema() {
      return Object.keys(this.schemaFormCarian).length > 0;
    },
    hasListSchema() {
      return Object.keys(this.schemaList).length > 0;
    },
  },

  methods: {
    /* ------------------- Dashboard (StatCardGrid) ------------------ */
    /**
     * Skema kad statistik — struktur statik; nilai dinamik datang dari
     * service (`propData`). Setiap elemen (ikon, nilai, trend, subtajuk,
     * chips, butang) optional mengikut kad.
     */
    initStatsSchema() {
      this.statsSchema = {
        columns: 3,
        cards: [
          {
            key: "permohonanProgram",
            title:
              "uiElement.generalTabCrud.listMain.dashboard.cards.permohonanProgram.title",
            icon: "fas fa-calendar",
            description:
              "uiElement.generalTabCrud.listMain.dashboard.cards.permohonanProgram.desc",
            chips: [
              {
                key: "baharu",
                label:
                  "uiElement.generalTabCrud.listMain.dashboard.chips.baharu",
              },
              {
                key: "proses",
                label:
                  "uiElement.generalTabCrud.listMain.dashboard.chips.proses",
              },
              {
                key: "selesai",
                label:
                  "uiElement.generalTabCrud.listMain.dashboard.chips.selesai",
              },
            ],
            // button: {
            //   label:
            //     "uiElement.generalTabCrud.listMain.dashboard.button.paparSemua",
            //   icon: "fas fa-arrow-right",
            //   variant: "primary",
            //   emitFunction: "paparSemua",
            // },
          },
          {
            key: "jalinanCerita",
            title:
              "uiElement.generalTabCrud.listMain.dashboard.cards.jalinanCerita.title",
            icon: "fas fa-share-nodes",
            description:
              "uiElement.generalTabCrud.listMain.dashboard.cards.jalinanCerita.desc",
            chips: [
              {
                key: "baharu",
                label:
                  "uiElement.generalTabCrud.listMain.dashboard.chips.baharu",
              },
              {
                key: "proses",
                label:
                  "uiElement.generalTabCrud.listMain.dashboard.chips.proses",
              },
              {
                key: "selesai",
                label:
                  "uiElement.generalTabCrud.listMain.dashboard.chips.selesai",
              },
            ],
            // button: {
            //   label:
            //     "uiElement.generalTabCrud.listMain.dashboard.button.paparSemua",
            //   icon: "fas fa-arrow-right",
            //   variant: "primary",
            //   emitFunction: "paparSemua",
            // },
          },
          {
            key: "laporanProgram",
            title:
              "uiElement.generalTabCrud.listMain.dashboard.cards.laporanProgram.title",
            icon: "fas fa-file-lines",
            description:
              "uiElement.generalTabCrud.listMain.dashboard.cards.laporanProgram.desc",
            chips: [
              {
                key: "baharu",
                label:
                  "uiElement.generalTabCrud.listMain.dashboard.chips.baharu",
              },
              {
                key: "proses",
                label:
                  "uiElement.generalTabCrud.listMain.dashboard.chips.proses",
              },
              {
                key: "selesai",
                label:
                  "uiElement.generalTabCrud.listMain.dashboard.chips.selesai",
              },
            ],
            // button: {
            //   label:
            //     "uiElement.generalTabCrud.listMain.dashboard.button.paparSemua",
            //   icon: "fas fa-arrow-right",
            //   variant: "primary",
            //   emitFunction: "paparSemua",
            // },
          },
        ],
      };
    },

    /**
     * Muat nilai statistik dari service (sample hardcode + simulasi delay
     * BE). `statsLoading` benar semasa menunggu response → skeleton.
     */
    async loadDashboardStats() {
      this.statsLoading = true;
      try {
        this.statsData = await getDashboardStats();
      } catch (error) {
        this.statsData = {};
        errorSwal(this.$t("uiElement.generalTabCrud.listMain.message.errorTitle"), error);
      } finally {
        this.statsLoading = false;
      }
    },

    onStatCardAction({ card, emitFunction }) {
      infoSwal(
        this.$t(card.title),
        this.$t("uiElement.generalTabCrud.listMain.dashboard.cardAction", {
          action: emitFunction,
        })
      );
    },

    async paginatedProps(page) {
      if (!page || page.startIndex < 0 || !page.endIndex) return;
      Object.assign(page, {
        search: { ...this.searchObject },
      });
      await this.getList(page);
    },

    async getList(page) {
      try {
        let params = "";
        params = getParams(params, page, this);
        const finalRes = await getMainList(params, this.viewsType, this.roleType);
        this.totalRecord = finalRes.total || 0;
        this.list = finalRes.list || [];
        this.listCondition(this.list);
      } catch (error) {
        errorSwal(this.$t("uiElement.generalTabCrud.listMain.message.errorTitle"), error);
      }
    },

    updateDisplayListField(payload) {
      this.schemaList = payload;
      this.listCondition(this.list);
    },

    listCondition(data) {
      data.forEach((element) => {
        assignSchemaToListData(element, this.schemaList);
      });
    },

    refreshList() {
      this.$refs.listData?.goToPage(1);
    },

    /**
     * The `GeneratedFormData` instance behind the detailed search.
     *
     * `ComponentCarian` is a two-mode panel and holds that form itself
     * (`component-carian.vue:12` gives it `ref="searchForm"`), so from here the
     * chain is one level deeper than it was before the global search existed.
     * The report export needs it: a dropdown's submitted value is its id, and
     * the PDF has to show the label the user actually picked. Returns `null`
     * rather than throwing, because in global mode the form is not rendered at
     * all and there is nothing to read.
     */
    detailedSearchForm() {
      return this.$refs.searchForm?.$refs?.searchForm || null;
    },

    onSearchClick(data) {
      // Raw value digunakan untuk API carian.
      this.searchObject = { ...data };

      // `ComponentCarian` hands over the form's data but not its display map, so
      // the labels are read back off the form for the export.
      const searchForm = this.detailedSearchForm();

      this.searchDisplayObject = { ...(searchForm?.formDataDisplayValue || {}) };

      // Runtime schema, because select/select-search may already carry
      // `refData.listData` from a finished lookup.
      this.reportSearchSchema =
        searchForm?.formSchema || this.schemaFormCarian;

      this.refreshList();
    },

    onResetSearchClick() {
      this.qSearch = "";
      this.searchObject = {};
      this.searchDisplayObject = {};
      this.reportSearchSchema = {};
      this.refreshList();
    },

    globalSearch(qSearch) {
      this.qSearch = qSearch;
      this.refreshList();
    },

    globalSearchReset() {
      this.qSearch = "";
      this.refreshList();
    },

    globalSearchButton(data) {
      if (data === "add") {
        this.onAddClick();
      }
    },

    sameSearchValue(value1, value2) {
      if (value1 === value2) {
        return true;
      }

      if (
        value1 === null || typeof value1 === "undefined" ||
        value2 === null || typeof value2 === "undefined"
      ) {
        return false;
      }

      if (typeof value1 === "object" || typeof value2 === "object") {
        try {
          return JSON.stringify(value1) === JSON.stringify(value2);
        } catch (error) {
          error;
          return false;
        }
      }

      return String(value1) === String(value2);
    },

    syncReportSearchDisplayValues() {
      const searchForm = this.detailedSearchForm();

      if (!searchForm) {
        return;
      }

      const currentFormData = searchForm.formData || {};
      const currentDisplayData = searchForm.formDataDisplayValue || {};
      const nextDisplayData = { ...this.searchDisplayObject };

      // Refresh label lookup async hanya jika raw value pada form masih
      // sama dengan filter yang benar-benar telah disubmit.
      Object.keys(this.searchObject || {}).forEach((name) => {
        if (
          this.sameSearchValue(this.searchObject[name], currentFormData[name]) &&
          Object.prototype.hasOwnProperty.call(currentDisplayData, name)
        ) {
          nextDisplayData[name] = currentDisplayData[name];
        }
      });

      this.searchDisplayObject = nextDisplayData;
      this.reportSearchSchema =
        searchForm.formSchema ||
        this.reportSearchSchema ||
        this.schemaFormCarian;
    },

    customValidator(field, self) {
      const errorMsg = standardValidation(field, self);
      if (errorMsg) {
        self.formErrors[field.name] = errorMsg;
      }
    },

    formActions(data) {
      data;
    },

    listActions(actionList) {
      const { functionName } = actionList.functionProps || {};
      const { data } = actionList;
      this.formDataViewMode = "";

      if (functionName === "show") {
        this.openDetails(data.id, "view", data.nama);
      } else if (functionName === "edit") {
        if (this.priv && !this.priv.flagKemaskini) {
          privSwal("U");
        } else {
          this.openDetails(data.id, "", data.nama);
        }
      } else if (functionName === "delete") {
        if (this.priv && !this.priv.flagHapus) {
          privSwal("D");
        } else {
          this.deleteData(data.id);
        }
      }
    },

    async deleteData(id) {
      const isConfirm = await confirmSwal(
        this.$t("uiElement.generalTabCrud.listMain.message.deleteTitle"),
        this.$t("uiElement.generalTabCrud.listMain.message.deleteConfirmation")
      );
      if (!isConfirm) return;

      try {
        await deleteRecord(id);
        this.refreshList();
      } catch (error) {
        errorSwal(this.$t("uiElement.generalTabCrud.listMain.message.errorTitle"), error);
      }
    },

    onAddClick() {
      if (this.priv && !this.priv.flagDaftar) {
        privSwal("I");
        return;
      }
      this.openDetails("", "");
    },

    // `openDetails` / `backToList` / `onBreadcrumbScreenChange` datang
    // daripada `detailsBreadcrumbMixin`.

    async getListForReport(type) {
      try {
        // Pastikan display label dropdown/date terkini sebelum export.
        this.syncReportSearchDisplayValues();
        let params = "";
        params = getParams(params, this.$refs.listData.paginationProps, this, true);
        const finalRes = await getMainList(params, this.viewsType, this.roleType);

        this.listDataReport = {
          type,
          list: finalRes.data?.data || [],
          listFooter: [],
          schemaDataReport: this.schemaList,
        };
      } catch (error) {
        errorSwal(this.$t("uiElement.generalTabCrud.listMain.message.errorTitle"), error);
      }
    },


    listMultipleSelectActions(payload) {
      payload;
    },

    listLinkActions(linkActions) {
      if (linkActions.field.name === "nama") {
        this.openDetails(linkActions.data.id, "", linkActions.data.nama);
      }
    },

    getSchemaFormCarian() {
      // Sample fields for the detailed search. Every one of them names a real
      // column on the fixture rows, and every dropdown's `listData` is taken
      // from the values those columns actually hold — a filter that offers an
      // option matching no row is a filter the user learns to distrust. The
      // lists are inline rather than looked up because there is no code table
      // behind this fixture; `input-type-select` reads `refData.listData`
      // directly when `refData.name` is set (`select.vue:25-38`).
      this.schemaFormCarian = {
        title: "uiElement.generalTabCrud.listMain.searchForm.title",
        pkField: "id",
        fieldSets: [
          {
            legend: "",
            name: "maklumat",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "nama",
                    label: "uiElement.generalTabCrud.listMain.searchForm.fields.name",
                    type: "text",
                  },
                  {
                    name: "noKadPengenalan",
                    label: "uiElement.generalTabCrud.listMain.searchForm.fields.identityCardNo",
                    type: "text",
                  },
                  {
                    name: "emel",
                    label: "uiElement.generalTabCrud.listMain.searchForm.fields.email",
                    type: "text",
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "idKategoriPengguna",
                    label: "uiElement.generalTabCrud.listMain.searchForm.fields.userCategory",
                    type: "select",
                    refData: {
                      name: "KategoriPengguna",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      listData: [
                        { id: "01", keterangan: "PENJAWAT AWAM" },
                        { id: "10", keterangan: "PENJAWAT AWAM KONTRAK" },
                        { id: "03", keterangan: "BADAN BERKANUN" },
                      ],
                    },
                  },
                  {
                    name: "idStatusPerkhidmatan",
                    label: "uiElement.generalTabCrud.listMain.searchForm.fields.serviceStatus",
                    type: "select",
                    refData: {
                      name: "StatusPerkhidmatan",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      listData: [
                        { id: "01", keterangan: "LANTIKAN TETAP" },
                        { id: "20", keterangan: "LANTIKAN KONTRAK (INTERIM)" },
                      ],
                    },
                  },
                  {
                    name: "tarikhDaftar",
                    label: "uiElement.generalTabCrud.listMain.searchForm.fields.registrationDate",
                    type: "date",
                  },
                ],
              },
            ],
          },
        ],
      };
    },

    getSchemaList() {
      this.schemaList = {
        id: "mainList",
        title: "uiElement.generalTabCrud.listMain.list.title",
        key: "id",
        allowPrint: true,

        // Optional. Jika dibuang, user masih boleh ON-kan Extra Header
        // melalui Tetapan Laporan apabila VUE_APP_EXTRAHEADER=yes.
        searchExtraHeaderConfig: {
          panelCol: 2,
          flow: "left-to-right",
          showTitle: false,
          labelWidthPercent: 34,
          separatorWidthPercent: 4,
        },

        actionCols: [
          {
            name: "uiElement.generalTabCrud.listMain.list.actionColumn",
            width: "150px",
            listFuntions: [
              {
                label: "uiElement.generalTabCrud.listMain.list.actions.show",
                type: "icon",
                icon: "fas fa-file-alt",
                cssClass: "text-primary font-size-16",
                functionName: "show",
              },
              {
                label: "uiElement.generalTabCrud.listMain.list.actions.edit",
                type: "icon",
                icon: "fas fa-edit",
                cssClass: "text-success font-size-16",
                functionName: "edit",
              },
              {
                label: "uiElement.generalTabCrud.listMain.list.actions.delete",
                type: "icon",
                icon: "fas fa-trash-alt",
                cssClass: "text-danger font-size-16",
                functionName: "delete",
              },
            ],
          },
        ],
        fields: [
          {
            name: "id",
            label: "uiElement.generalTabCrud.listMain.list.fields.id",
            isHidden: true,
          },
          {
            name: "nama",
            label: "uiElement.generalTabCrud.listMain.list.fields.sampleHyperlink",
            isSort: true,
            hyperlink: true,
          },
          {
            name: "noKadPengenalan",
            label: "uiElement.generalTabCrud.listMain.list.fields.identityCardNo",
            isSort: true,
          },
          {
            name: "nama",
            label: "uiElement.generalTabCrud.listMain.list.fields.name",
            isSort: true,
          },
          {
            name: "tarikhDaftar",
            label: "uiElement.generalTabCrud.listMain.list.fields.registrationDate",
            isSort: true,
            align: "center",
            convertType: "datetime-local",
          },
          {
            name: "tarikhAkhirLogMasuk",
            label: "uiElement.generalTabCrud.listMain.list.fields.lastLoginDate",
            isSort: true,
            align: "center",
            convertType: "datetime-local",
          },
          {
            name: "sampleMultiple",
            label: "uiElement.generalTabCrud.listMain.list.fields.multipleColumnSample",
            multipleCols: [
              {
                name: "keteranganAgama",
                label: "uiElement.generalTabCrud.listMain.list.fields.religion",
              },
              {
                name: "keteranganBangsa",
                label: "uiElement.generalTabCrud.listMain.list.fields.race",
              },
              {
                name: "keteranganWarganegara",
                label: "uiElement.generalTabCrud.listMain.list.fields.citizenship",
              },
            ],
          },
          {
            name: "flagAktif",
            label: "Badge",
            isSort: true,
            displayType: "badge",
            badgeConditionColumn: "flagAktif",
            badgeDisplayColumn: "flagAktif",
            badgeDefault: "secondary",
            badgeMap: {
              true: "primary",
              false: "danger",
            },
          },
          {
            name: "senaraiBadge",
            label: "Multple Badges",
            isSort: false,
            displayType: "badge",
            badgeMultiple: true,
            badgeItemsColumn: "senaraiBadge",
            badgeConditionColumn: "id",
            badgeDisplayColumn: "label",
            badgeDefault: "secondary",
            badgeMap: {
              "001": "success",
              "002": "danger",
              "003": "warning",
              "004": "info",
              "005": "primary",
            },
          }
        ],
      };
    }
  },
};
</script>