<!--
  TAB 4 · SKEMA & DATA

  Komponen tab yang terpisah sendiri, tetapi IA BUKAN borang. Tujuannya
  membolehkan pembangun sistem melihat bentuk JSON sebenar yang perlu disalin
  ke mana-mana modul, jadi ia memaparkan objek kosong itu sendiri, bukan
  medan yang sedang dirender.

  Kerana tiada borang, tab ini hanya ada butang Kembali. Tiada Simpan dan
  tiada Set Semula: tiada apa-apa untuk disimpan atau dikosongkan.
-->
<template>
  <div class="row p-1">
    <div class="col-md-6">
      <div class="d-flex align-items-center justify-content-between mb-1">
        <span class="fw-semibold">{{ $t("uiElement.sampleInput.schema.schemaFormLabel") }}</span>
        <div>
          <span v-if="copiedPanel == 'schema'" class="text-success small me-2">
            {{ $t("uiElement.sampleInput.schema.copied") }}
          </span>
          <BButton size="sm" variant="outline-secondary" @click="copyJson('schema')">
            {{ $t("uiElement.sampleInput.schema.copy") }}
          </BButton>
        </div>
      </div>
      <pre class="schema-box">{{ schemaJson }}</pre>
    </div>

    <div class="col-md-6">
      <div class="d-flex align-items-center justify-content-between mb-1">
        <span class="fw-semibold">{{ $t("uiElement.sampleInput.schema.schemaDataLabel") }}</span>
        <div>
          <span v-if="copiedPanel == 'data'" class="text-success small me-2">
            {{ $t("uiElement.sampleInput.schema.copied") }}
          </span>
          <BButton size="sm" variant="outline-secondary" @click="copyJson('data')">
            {{ $t("uiElement.sampleInput.schema.copy") }}
          </BButton>
        </div>
      </div>
      <pre class="schema-box">{{ dataJson() }}</pre>
    </div>
  </div>

  <div class="text-end">
    <button class="btn btn-primary me-1" @click="$emit('backToList')">
      {{ $t("button.common.kembali") }}
    </button>
  </div>
</template>

<script>
export default {
  name: "SampleInputTabSchema",

  props: {
    /**
     * Gabungan `fieldSets` ketiga-tiga tab borang. Dihantar oleh hos
     * halaman daripada skema yang didaftarkan oleh setiap tab.
     */
    fieldSets: { type: Array, default: () => [] },
    title: { type: String, default: "" },
    /**
     * Fungsi yang memulangkan `formData` ketiga-tiga tab. Ia fungsi, bukan
     * prop biasa, sebab `formData` setiap tab tinggal di dalam komponen
     * tabnya. Pembacaan objek reaktif itu di dalam `dataJson()` berlaku
     * semasa render, jadi panel dikemas kini secara automatik apabila
     * pengguna menaip.
     */
    getFormData: { type: Function, required: true },
  },

  emits: ["backToList"],

  data() {
    return {
      copiedPanel: "",
    };
  },

  computed: {
    /**
     * JSON penuh untuk panel kiri. `fieldSets` datang sebagai prop reaktif,
     * jadi ia dikemas kini secara automatik apabila mana-mana tab mengubah
     * skema mereka (contohnya `applyConditionRules` menetapkan `isHide`).
     */
    schemaJson() {
      return JSON.stringify({ title: this.title, pkField: "id", fieldSets: this.fieldSets }, null, 2);
    },
  },

  methods: {
    dataJson() {
      return JSON.stringify(this.getFormData(), null, 2);
    },

    async copyJson(panel) {
      const text = panel === "schema" ? this.schemaJson : this.dataJson();
      try {
        await navigator.clipboard.writeText(text);
        this.copiedPanel = panel;
        setTimeout(() => {
          this.copiedPanel = "";
        }, 2000);
      } catch (error) {
        errorSwal(this.$t("uiElement.sampleInput.message.errorTitle"), error);
      }
    },
  },
};
</script>

<style scoped>
.schema-box {
  max-height: 60vh;
  padding: 0.75rem;
  border: 1px solid var(--bs-border-color);
  border-radius: 0.375rem;
  background: var(--bs-tertiary-bg);
  font-size: 0.78rem;
  line-height: 1.45;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
