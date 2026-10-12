<template>
  <div class="module-view">
    <PageHeader ref="pageHeader" :title="$t('uiElement.generalCrud.listMain.pageHeader.title')"
      :pageTitle="$t('uiElement.generalCrud.listMain.pageHeader.pageTitle')"
      :breadcrumbSteps="breadcrumbSteps" :starterKey="listStepKey"
      @screen-change="onBreadcrumbScreenChange" />

    <div id="list-main">
      <div v-if="showDetailsForm">
        <details-one :propId="id" :viewMode="formDataViewMode" ref="detailsOne"
          @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType" @refreshList="refreshList"
         />
      </div>

      <div v-show="!showDetailsForm">
        <!--
          Bar ringkasan (shared `summary-stats` dari @2enapps/ui), di atas
          panel carian & senarai. Schema-driven: struktur dalam
          `summarySchema`, nilai dinamik daripada service `getSummaryStats`
          (kiraan daripada senarai yang sama + `delay` simulating response
          API), jadi `summaryLoading` memaparkan skeleton semasa menunggu.

          Skema yang dihantar ialah `summarySchemaView`, bukan `summarySchema`:
          ia skema yang sama dengan flag `isActive` pada item yang sedang
          menapis, jadi `summarySchema` kekal data statik.
        -->
        <summary-stats
          v-if="Object.keys(summarySchema).length"
          class="mb-2"
          :propSchema="summarySchemaView"
          :propData="summaryData"
          :loading="summaryLoading"
          @stat-action="onSummaryStatAction"
        />

        <!--
          Satu kad memegang carian dan senarai, seperti
          `general-tab-crud/list-main.vue`. Kad diberi tajuk selepas senarai
          (`mainList`) dan bukan selepas carian: carian ialah kawalan di dalam
          panel ini, bukan panel berasingan. Dalam mod global tiada tajuk dalaman
          langsung kerana `ComponentCarian` hanya render `BCardTitle` dalam mod
          terperinci — jadi satu tajuk sahaja di skrin bagi setiap mod.

          `ComponentCarian` memiliki kedua-dua mod carian. Ia buka pada kotak
          global dan bertukar ke borang terperinci atas permintaan, mengosongkan
          sisi lain semasa bertukar (`component-carian.vue`), jadi `qSearch` dan
          `searchObject` tidak pernah terisi serentak oleh UI.
        -->
        <BCard class="mb-2">
          <BCardTitle>{{ $t("uiElement.generalCrud.listMain.card.mainList") }}</BCardTitle>
          <BCardBody>
            <component-carian v-if="hasSearchSchema" ref="searchForm" :propData="formCarianData"
              :schemaFormCarian="schemaFormCarian"
              :title="$t('uiElement.generalCrud.listMain.searchForm.detailedTitle')"
              @formActions="formActions" @customValidator="customValidator" @onSearch="onSearchClick"
              @onReset="onResetSearchClick" @globalSearch="globalSearch" @globalSearchReset="globalSearchReset"
              @globalSearchButton="globalSearchButton" :propGlobalSearchButtons="[
                {
                  label: 'button.common.tambah',
                  icon: 'fas fa-plus',
                  class: 'btn-success',
                  emitFunction: 'add',
                },
              ]" />

            <!--
              Mod global membawa butang tindakannya sendiri (`Tambah` dalam
              `propGlobalSearchButtons`), jadi `Tambah` di sini hanya dipaparkan
              semasa borang terperinci ditunjukkan.

              Membaca `$refs` dalam templat tidak reaktif dengan sendirinya,
              tetapi itu memadai: kedua-dua cara bertukar mod mengosongkan sisi
              lain dahulu, yang melepas `onReset` atau `globalSearchReset`, dan
              kedua-duanya memanggil `refreshList()`.
            -->
            <div class="text-end mb-2" v-if="this.$refs?.searchForm?.searchType == 'terperinci'">
              <button type="button" class="btn btn-success" @click="onAddClick">
                <i class="fas fa-plus me-1" aria-hidden="true"></i>
                {{ $t("button.common.tambah") }}
              </button>
            </div>

            <generated-form-list-data v-if="hasListSchema" ref="listData" :backendPaginated="true" :listData="list"
              :listSchema="schemaList" :totalRecord="totalRecord" :propListDataReport="listDataReport"
              @paginatedProps="paginatedProps" @listActions="listActions"
              @listMultipleSelectActions="listMultipleSelectActions" @getListForReport="getListForReport"
              @listLinkActions="listLinkActions" :reportSearch="reportSearch" />
          </BCardBody>
        </BCard>
      </div>
    </div>
  </div>
</template>

<script>
/* import Layout from "@/layouts/main.vue"; */
import { PageHeader } from "@2enapps/ui";
import DetailsOne from "@/views/ui-element/general-crud/details-one.vue";
import { GeneratedFormListData } from "@2enapps/ui";
import { ComponentCarian } from "@2enapps/ui";
import { SummaryStats } from "@2enapps/ui";

import { confirmSwal, errorSwal, privSwal } from "@2enapps/ui";

import { assignSchemaToListData } from "@2enapps/ui";

import { getParams } from "@2enapps/ui";
import { standardValidation } from "@2enapps/ui";

import {
  getMainList,
  deleteRecord,
  getSummaryStats,
  RINGKASAN_STATUS,
} from "@/services/training/crud";

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
    SummaryStats,
    DetailsOne
  },

  mixins: [detailsBreadcrumbMixin()],

  data() {
    return {
      // `showDetailsForm`, `id`, `formDataViewMode`, `screenTitle` dan
      // `breadcrumbSteps` datang daripada `detailsBreadcrumbMixin`.
      //
      // Keputusan dua mod carian, diasingkan. `searchObject` menjadi
      // `page.search` dalam `paginatedProps`; `qSearch` dibaca terus oleh
      // `getParams`, yang menukarnya menjadi `gSearch`. Kedua-dua dibersihkan
      // bersama semasa reset supaya refresh tidak membawa filter yang
      // pengguna tidak nampak.
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
      // Bar ringkasan (SummaryStats) — schema (struktur) + data (nilai).
      summarySchema: {},
      summaryData: {},
      summaryLoading: true,
      // Kunci `item.key` (atau "jumlah") yang sedang menapis senarai;
      // `null` bermakna tiada filter status.
      activeSummaryStat: null,
      viewsType: "",
      roleType: "",
    };
  },

  async created() {
    this.viewsType = this.$route.params.viewsType || "";
    this.roleType = this.$route.params.roleType || "";

    this.initSummarySchema();
    this.loadSummaryStats();

    // init schema
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

    /**
     * `summarySchema` dengan flag `isActive` pada item yang sedang menapis.
     *
     * Flag ini tidak disimpan dalam `summarySchema` sebab skema itu data
     * statik; menetakkannya di sini menjadikan `activeSummaryStat` satu-satunya
     * sumber kebenaran, jadi skema statik tak perlu ditulis semula setiap klik.
     *
     * Blok jumlah aktif apabila tiada filter status — ia paparan "semua",
     * jadi ia yang aktif, bukan item mana-mana.
     */
    summarySchemaView() {
      return {
        ...this.summarySchema,
        items: (this.summarySchema.items || []).map((item) => ({
          ...item,
          isActive: item.key === this.activeSummaryStat,
        })),
        total: this.summarySchema.total
          ? {
              ...this.summarySchema.total,
              isActive: this.activeSummaryStat === null,
            }
          : this.summarySchema.total,
      };
    },
  },

  methods: {
    /* ------------------- Bar Ringkasan (SummaryStats) ------------------- */
    /**
     * Skema bar ringkasan. Struktur statik; nilai dinamik datang dari
     * service melalui `propData`. Semua bahagian optional — `header`,
     * setiap item (label/ikon) dan blok jumlah boleh dibuang mengikut
     * keperluan; `itemMinWidth` mengawal bilangan item per baris supaya
     * bar tetap responsive.
     *
     * `emitFunction` menjadikan item boleh diklik dan memaksa komponen
     * mengeluarkan `stat-action` (@see onSummaryStatAction). Nilainya hanya
     * perlu mengulang kunci item supaya payload boleh dibaca, tetapi penanda
     * `role="button"` dan `tabindex` datang daripada kehadiran medan tersebut,
     * bukan daripada nilainya.
     */
    initSummarySchema() {
      this.summarySchema = {
        itemMinWidth: 120,
        header: {
          icon: "fas fa-calendar-check",
          title: "uiElement.generalCrud.listMain.summaryStats.header.title",
          description: "uiElement.generalCrud.listMain.summaryStats.header.desc",
        },
        items: [
          {
            key: "semakSemula",
            label: "uiElement.generalCrud.listMain.summaryStats.items.semakSemula",
            icon: "fas fa-rotate-right",
            emitFunction: "semakSemula",
          },
          {
            key: "draf",
            label: "uiElement.generalCrud.listMain.summaryStats.items.draf",
            icon: "fas fa-pen-to-square",
            emitFunction: "draf",
          },
          {
            key: "baharu",
            label: "uiElement.generalCrud.listMain.summaryStats.items.baharu",
            icon: "fas fa-circle-dot",
            emitFunction: "baharu",
          },
          {
            key: "dalamProses",
            label: "uiElement.generalCrud.listMain.summaryStats.items.dalamProses",
            icon: "fas fa-arrows-rotate",
            emitFunction: "dalamProses",
          },
          // {
          //   key: "sediaMuatTurun",
          //   label: "uiElement.generalCrud.listMain.summaryStats.items.sediaMuatTurun",
          //   icon: "fas fa-cloud-arrow-down",
          // },
          // {
          //   key: "sediaAmbil",
          //   label: "uiElement.generalCrud.listMain.summaryStats.items.sediaAmbil",
          //   icon: "fas fa-box",
          // },
          // {
          //   key: "berjayaAmbil",
          //   label: "uiElement.generalCrud.listMain.summaryStats.items.berjayaAmbil",
          //   icon: "fas fa-circle-check",
          // },
          {
            key: "selesai",
            label: "uiElement.generalCrud.listMain.summaryStats.items.selesai",
            icon: "fas fa-check",
            emitFunction: "selesai",
          },
          {
            key: "ditolak",
            label: "uiElement.generalCrud.listMain.summaryStats.items.ditolak",
            icon: "fas fa-circle-xmark",
            emitFunction: "ditolak",
          },
        ],
        total: {
          key: "jumlah",
          label: "uiElement.generalCrud.listMain.summaryStats.total.label",
          emitFunction: "jumlah",
        },
      };
    },

    /**
     * Muat nilai bar ringkasan daripada service (sample data + `delay`).
     * `summaryLoading` benar semasa menunggu response, jadi komponen
     * memaparkan skeleton sepanjang masa itu.
     */
    async loadSummaryStats() {
      this.summaryLoading = true;
      try {
        this.summaryData = await getSummaryStats();
      } catch (error) {
        this.summaryData = {};
        errorSwal(this.$t("uiElement.generalCrud.listMain.message.errorTitle"), error);
      } finally {
        this.summaryLoading = false;
      }
    },

    /**
     * Item bar ringkasan yang diklik menjadi filter status pada senarai.
     *
     * `key` yang dihantar komponen ialah `item.key` dalam `summarySchema`, dan
     * nilainya sudah sama dengan `idStatus` pada rekod senarai — jadi tiada
     * peta translate di sini. Klik status yang sama membatalkan filter
     * (toggle), dan blok jumlah sentiasa membatalkannya.
     *
     * @param {{ type: "item" | "total", key: string }} stat
     */
    onSummaryStatAction({ type, key }) {
      const next = type === "total" || this.activeSummaryStat === key ? null : key;

      this.activeSummaryStat = next;

      if (next) {
        this.searchObject = { ...this.searchObject, idStatus: next };
      } else {
        // Kunci dibuang, bukan dikosongkan: `getParams` sudah melangkau nilai
        // falsy, tetapi membuang kunci pun memastikan `applyFilters` tak perlu
        // menilai filter kosong.
        const cleared = { ...this.searchObject };
        delete cleared.idStatus;
        this.searchObject = cleared;
      }

      // Borang carian terperinci berkongsi objek yang sama dengan
      // `searchObject` (@see component-carian.vue `created`), jadi medan status
      // di situ ikut berubah tanpa perlu memuat semula borang.
      if (next) {
        this.formCarianData.idStatus = next;
      } else {
        delete this.formCarianData.idStatus;
      }

      this.refreshList();
    },

    /* ---------------------- Pagination & List ---------------------- */
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
        errorSwal(this.$t("uiElement.generalCrud.listMain.message.errorTitle"), error);
      }
    },

    listCondition(data) {
      data.forEach((element) => {
        assignSchemaToListData(element, this.schemaList);

        // Label status diterjemah di sini, bukan dalam service: badge hanya
        // menerima teksMentah dan service tidak ada `$t`. Kunci locale status
        // sama dengan nilai `idStatus` (@see RINGKASAN_STATUS).
        element.keteranganStatus = element.idStatus
          ? this.$t(
            `uiElement.generalCrud.listMain.summaryStats.items.${element.idStatus}`
          )
          : "";
      });
    },

    refreshList() {
      this.$refs.listData?.goToPage(1);
    },

    /**
     * Instans `GeneratedFormData` di belakang borang carian terperinci.
     *
     * `ComponentCarian` memegang borang itu sendiri (`component-carian.vue`
     * memberi `ref="searchForm"` kepadanya), jadi rantai dari sini satu aras
     * lebih dalam daripada sebelum mod global wujud. Eksport laporan
     * memerlukannya: nilai submit dropdown ialah id, dan PDF perlu tunjuk
     * label yang sebenarnya dipilih pengguna. Pulang `null` daripada membuang
     * ralat, kerana dalam mod global borang tidak dirender langsung.
     */
    detailedSearchForm() {
      return this.$refs.searchForm?.$refs?.searchForm || null;
    },

    /* ------------------------ Search form ------------------------- */
    onSearchClick(data) {
      // Raw value digunakan untuk API carian.
      this.searchObject = { ...data };

      // `ComponentCarian` menyerahkan data borang tetapi bukan peta paparannya,
      // jadi label dibaca semula dari borang untuk eksport.
      const searchForm = this.detailedSearchForm();

      this.searchDisplayObject = { ...(searchForm?.formDataDisplayValue || {}) };

      // Schema runtime, kerana select/select-search mungkin sudah membawa
      // `refData.listData` dari lookup yang selesai.
      this.reportSearchSchema =
        searchForm?.formSchema || this.schemaFormCarian;

      // Borang carian terperinci boleh menetapkan status sendiri, jadi bar
      // ringkasan perlu menunjuk ke filter yang sama. Submit borang juga
      // menggantikan keseluruhan `searchObject`, jadi apa-apa filter status
      // daripada klik kad hilang di sini secara wajar.
      this.activeSummaryStat = this.searchObject.idStatus || null;

      this.refreshList();
    },

    onResetSearchClick() {
      this.qSearch = "";
      this.searchObject = {};
      this.searchDisplayObject = {};
      this.reportSearchSchema = {};
      this.activeSummaryStat = null;
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

      // Refresh label lookup async hanya jika raw value pada borang masih
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
      // placeholder if needed
      void data;
    },

    /* ----------------------- List actions ------------------------- */
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
        this.$t("uiElement.generalCrud.listMain.message.deleteTitle"),
        this.$t("uiElement.generalCrud.listMain.message.deleteConfirmation")
      );
      if (!isConfirm) return;
      try {
        await deleteRecord(id);
        this.refreshList();
      } catch (error) {
        errorSwal(this.$t("uiElement.generalCrud.listMain.message.errorTitle"), error);
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

    /* ------------------------- Reporting -------------------------- */
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
        errorSwal(this.$t("uiElement.generalCrud.listMain.message.errorTitle"), error);
      }
    },

    listMultipleSelectActions(payload) {
      // kalau ada feature multiple-select, handle di sini
      void payload;
    },

    listLinkActions(linkActions) {
      if (linkActions.field.name == 'nama') {
        this.openDetails(linkActions.data.id, "", linkActions.data.nama);
      }
    },

    /* ------------------------- Schemas ---------------------------- */
    getSchemaFormCarian() {
      this.schemaFormCarian = {
        title: "uiElement.generalCrud.listMain.searchForm.title",
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
                    name: "name",
                    label: "uiElement.generalCrud.listMain.searchForm.fields.name",
                    type: "text",
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "date",
                    label: "uiElement.generalCrud.listMain.searchForm.fields.date",
                    type: "date",
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "idStatus",
                    label: "uiElement.generalCrud.listMain.searchForm.fields.status",
                    type: "select",
                    // Senarai statik (bukan `refData.url`) kerana status demo
                    // ini tiada endpoint. Label diterjemah di sini kerana
                    // service tidak ada `$t`.
                    refData: {
                      name: "status",
                      keyColumn: "id",
                      labelColumn: "label",
                      listData: RINGKASAN_STATUS.map((status) => ({
                        id: status.id,
                        label: this.$t(
                          `uiElement.generalCrud.listMain.summaryStats.items.${status.id}`
                        ),
                      })),
                    },
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
        title: "uiElement.generalCrud.listMain.list.title",
        key: "id",
        allowPrint: true,
        actionCols: [
          {
            name: "uiElement.generalCrud.listMain.list.actionColumn",
            width: "150px",
            listFuntions: [
              {
                label: "uiElement.generalCrud.listMain.list.actions.show",
                type: "icon",
                icon: "fas fa-file-alt",
                cssClass: "text-primary font-size-16",
                functionName: "show",
              },
              {
                label: "uiElement.generalCrud.listMain.list.actions.edit",
                type: "icon",
                icon: "fas fa-edit",
                cssClass: "text-success font-size-16",
                functionName: "edit",
              },
              {
                label: "uiElement.generalCrud.listMain.list.actions.delete",
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
            label: "uiElement.generalCrud.listMain.list.fields.id",
            isHidden: true,
          },
          {
            name: "nama",
            label: "uiElement.generalCrud.listMain.list.fields.sampleHyperlink",
            isSort: true,
            hyperlink: true,
          },
          {
            name: "noKadPengenalan",
            label: "uiElement.generalCrud.listMain.list.fields.identityCardNo",
            isSort: true,
          },
          {
            name: "nama",
            label: "uiElement.generalCrud.listMain.list.fields.name",
            isSort: true,
          },
          {
            name: "tarikhDaftar",
            label: "uiElement.generalCrud.listMain.list.fields.registrationDate",
            isSort: true,
            align: "center",
            convertType: "datetime-local",
          },
          {
            name: "tarikhAkhirLogMasuk",
            label: "uiElement.generalCrud.listMain.list.fields.lastLoginDate",
            isSort: true,
            align: "center",
            convertType: "datetime-local",
          },
          {
            name: "keteranganStatus",
            label: "uiElement.generalCrud.listMain.list.fields.status",
            displayType: "badge",
            // Kriteria dan teks badge ialah dua lajur berbeza: `idStatus`
            // ialah nilai yang ditapis (kunci status), manakala
            // `keteranganStatus` ialah label yang sudah diterjemah
            // (@see listCondition).
            badgeConditionColumn: "idStatus",
            badgeDisplayColumn: "keteranganStatus",
            badgeDefault: "secondary",
            // Warna diambil daripada senarai status yang sama, jadi warna
            // tidak ditulis dua kali.
            badgeMap: RINGKASAN_STATUS.reduce((map, status) => {
              map[status.id] = status.variant;
              return map;
            }, {}),
            isSort: true,
            align: "center",
          },
          {
            name: "sampleMultiple",
            label: "uiElement.generalCrud.listMain.list.fields.multipleColumnSample",
            multipleCols: [
              {
                name: "keteranganAgama",
                label: "uiElement.generalCrud.listMain.list.multipleColumns.religion",
              },
              {
                name: "keteranganBangsa",
                label: "uiElement.generalCrud.listMain.list.multipleColumns.race",
              },
              {
                name: "keteranganWarganegara",
                label: "uiElement.generalCrud.listMain.list.multipleColumns.citizenship",
              },

            ],
          },




        ],
      };
    },
  },
};
</script>