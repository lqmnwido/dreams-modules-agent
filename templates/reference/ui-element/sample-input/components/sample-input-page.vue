<!--
  Hos tab untuk galeri `sample-input`.

  Hos ini tidak memegang sebarang skema atau `formData`. Setiap tab
  yang terpisah sendiri dan mendaftarkan skemanya ke sini semasa
  `mounted`; tab Skema & Data pula membaca semula `$refs` setiap tab untuk
  memaparkan JSON gabungan.

  Hos ini dikongsi oleh dua laluan:
    - `/ui-element/sample-input/details`        (borang kosong)
    - `/ui-element/sample-input/details-dummy`  (diisi data dummy)

  Kedua-duanya berbeza HANYA pada `propData` yang dihantar ke setiap tab.
-->
<template>
  <div class="module-view">
    <PageHeader
      :title="$t('uiElement.sampleInput.title.pageHeader')"
      :pageTitle="$t('uiElement.sampleInput.title.pageHeader')"
    />

    <div id="details">
      <BCard class="mb-2">
        <!--
          Tiada `lazy` pada `BTabs` atau `BTab`: badan setiap tab dirender
          serta-merta pada pemasangan pertama dan kekal dalam DOM. Dua sebab-sebab berikut bergantung pada itu:

          1. Nilai yang ditaip kekal apabila pengguna bertukar tab, kerana
             komponen tab tidak pernah dibina semula.
          2. Ketiga-tiga tab borang mendaftarkan skema mereka semasa
             `mounted`, jadi tab Skema & Data sentiasa mempunyai
             JSON gabungan yang lengkap walaupun tab lain belum dibuka.
        -->
        <BTabs v-model="activeTabIndex" justified nav-class="nav-tabs-custom">
          <BTab :class="['nav-link', activeTab == 'input' ? 'active' : '']">
            <template #title>
              <span>{{ $t("uiElement.sampleInput.tab.input") }}</span>
            </template>

            <TabInput
              ref="tabInput"
              :propId="id"
              :viewModeForm="viewModeForm"
              :propData="propData"
              @register="registerSchema"
              @backToList="$emit('backToList')"
            />
          </BTab>

          <BTab :class="['nav-link', activeTab == 'rules' ? 'active' : '']">
            <template #title>
              <span>{{ $t("uiElement.sampleInput.tab.rules") }}</span>
            </template>

            <TabRules
              ref="tabRules"
              :propId="id"
              :viewModeForm="viewModeForm"
              :propData="propData"
              @register="registerSchema"
              @backToList="$emit('backToList')"
            />
          </BTab>

          <BTab :class="['nav-link', activeTab == 'scanner' ? 'active' : '']">
            <template #title>
              <span>{{ $t("uiElement.sampleInput.tab.scanner") }}</span>
            </template>

            <TabScanner
              ref="tabScanner"
              :propId="id"
              :viewModeForm="viewModeForm"
              :propData="propData"
              @register="registerSchema"
              @backToList="$emit('backToList')"
            />
          </BTab>

          <BTab :class="['nav-link', activeTab == 'schema' ? 'active' : '']">
            <template #title>
              <span>{{ $t("uiElement.sampleInput.tab.schema") }}</span>
            </template>

            <TabSchema :fieldSets="allFieldSets" :title="schemaTitle" :getFormData="allFormData" />
          </BTab>
        </BTabs>
      </BCard>
    </div>
  </div>
</template>

<script>
import { PageHeader } from "@2enapps/ui";

import TabInput from "./tab-input.vue";
import TabRules from "./tab-rules.vue";
import TabScanner from "./tab-scanner.vue";
import TabSchema from "./tab-schema.vue";

export default {
  name: "SampleInputPage",

  components: {
    PageHeader,
    TabInput,
    TabRules,
    TabScanner,
    TabSchema,
  },

  props: {
    propId: String,
    viewMode: String,
    propViewsType: String,
    propRoleType: String,

    /**
     * Data permulaan untuk ketiga-tiga tab. Hos tidak membacanya; ia hanya
     * menyalurkannya. Setiap tab menggabungkan `propData` di atas nilai
     * lalai skema sendiri, jadi kunci yang tidak dibekalkan kekal lalai.
     */
    propData: { type: Object, default: () => ({}) },
  },

  emits: ["backToList"],

  data() {
    return {
      /**
       * Kunci tab mengikut urutan tab yang dipapar. `activeTabIndex` diikat
       * terus kepada `BTabs`, jadi senarai ini tidak boleh diacak tanpa
       * menyusun semula susun atur tab.
       */
      tabKeys: ["input", "rules", "scanner", "schema"],
      activeTabIndex: 0,

      viewModeForm: "",
      id: "",

      /**
       * Skema yang didaftarkan oleh setiap tab borang. Nilai diambil
       * daripada komponen tab, jadi rujukan yang disimpan di sini adalah
       * rujukan yang sama — mutasi `isHide` oleh `applyConditionRules`
       * kelihatan serta-merta pada panel Skema.
       */
      schemaByTab: {},
    };
  },

  created() {
    this.viewModeForm = this.viewMode || "";
    this.id = this.propId || "";
  },

  computed: {
    activeTab() {
      return this.tabKeys[this.activeTabIndex] || this.tabKeys[0];
    },

    /** Gabungan ketiga-tiga skema tab supaya panel Skema memaparkan keseluruhan borang. */
    allFieldSets() {
      return ["input", "rules", "scanner"].flatMap((key) => this.schemaByTab[key]?.fieldSets || []);
    },

    schemaTitle() {
      return this.schemaByTab.input?.title || "";
    },
  },

  methods: {
    registerSchema(key, schema) {
      this.schemaByTab[key] = schema;
    },

    /**
     * `formData` setiap tab tinggal di dalam komponen tabnya. Fungsi ini
     * membaca semuanya untuk panel Skema & Data.
     *
     * Ia METHOD, bukan computed, kerana `$refs` tidak reaktif. Ia dipanggil
     * dari dalam `dataJson()` semasa render, jadi pembacaan objek reaktif
     * di dalamnya tetap terdaftar sebagai kebergantungan render.
     */
    allFormData() {
      return {
        input: this.$refs.tabInput?.formData || {},
        rules: this.$refs.tabRules?.formData || {},
        scanner: this.$refs.tabScanner?.formData || {},
      };
    },
  },
};
</script>
