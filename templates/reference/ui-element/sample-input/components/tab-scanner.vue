<!--
  TAB 3 · PENGIMBAS QR

  Komponen tab yang terpisah sendiri. Ia memiliki fungsi `getSchemaScanner()`
  sendiri, `formData` sendiri dan satu `form-panel` sendiri, jadi ia tidak
  bergantung pada mana-mana tab lain.

  `created()` membina skema SEKALI sahaja. `form-data.vue` hanya mengisi
  `formData` daripada skema ketika ia dipasang, jadi skema tidak boleh
  digantikan selepas itu tanpa kehilangan nilai yang sudah ditaip.
-->
<template>
  <FormPanel
    :schema="schema"
    :formData="formData"
    :id="id"
    :viewModeForm="viewModeForm"
    @backToList="$emit('backToList')"
  />
</template>

<script>
import FormPanel from "./form-panel.vue";
import { setFormObjectBySchema } from "@2enapps/ui";
import { getDataYearList } from "@/services/training/lookups";

export default {
  name: "SampleInputTabScanner",

  components: { FormPanel },

  props: {
    propId: String,
    viewModeForm: String,
    /**
     * Data permulaan. Kosong pada laluan kosong; diisi daripada perkhidmatan
     * data dummy pada laluan `/details-dummy`.
     */
    propData: { type: Object, default: () => ({}) },
  },

  emits: ["backToList", "register"],

  data() {
    return {
      schema: null,
      formData: {},
      listYear: getDataYearList(
        new Date().getFullYear() - 20,
        new Date().getFullYear() + 10,
        true
      ),
    };
  },

  created() {
    this.id = this.propId || "";
    this.schema = this.getSchemaScanner();

    /**
     * `setFormObjectBySchema()` memberikan setiap kunci medan nilai lalai
     * yang betul: array kosong untuk medan berulang, `[]` untuk `chiptag`,
     * dan struktur yang tepat untuk medan upload. `propData` disepit di atasnya
     * supaya data dummy hanya menulis semula kunci yang memang dipunya
     * servicedata.
     */
    this.formData = {
      ...setFormObjectBySchema(this.schema),
      ...this.propData,
    };
  },

  mounted() {
    /**
     * Daftar skema kepada hos halaman supaya tab Skema & Data boleh
     * memaparkan JSON gabungan ketiga-tiga tab borang.
     */
    this.$emit("register", "scanner", this.schema);
  },

  methods: {
    /* ------------------------------------------------------------------ *
     * TAB 3 · PENGIMBAS QR                                                *
     * ------------------------------------------------------------------ */
    getSchemaScanner() {
      return {
        title: "uiElement.sampleInput.title.detailsOne",
        pkField: "id",
        fieldSets: [
          {
            legend: "uiElement.sampleInput.fieldset.sampleQrScanner",
            name: "scannerFieldset",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "scanner",
                    label: "uiElement.sampleInput.label.scanner",
                    type: "scanner",
                    /**
                     * `autoStart: false` tidak membuka kamera sehingga pengguna
                     * menekan butang mula — penting untuk halaman galeri yang
                     * dibuka pada desktop tanpa kebenaran kamera.
                     */
                    scanner: {
                      autoStart: false
                    }
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [],
              },
            ],
          },
        ],
      };
    },
  },
};
</script>
