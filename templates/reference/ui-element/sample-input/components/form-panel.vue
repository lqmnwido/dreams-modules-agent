<!--
  Panel borang generik untuk galeri `sample-input`.

  SATU instans `form-panel` = SATU tab. Setiap tab borang membina panelnya
  sendiri, jadi setiap tab ada `generated-form-data` sendiri, `formData`
  sendiri, dan butang Simpan / Set Semula / Kembali sendiri.

  `BTab` tidak diberi `lazy`, jadi badan setiap tab dirender serta-merta pada
  pemasangan pertama dan kekal dalam DOM. Itulah sebabnya nilai yang sudah
  ditaip kekal apabila pengguna bertukar tab — tiada komponen dibina semula.

  Panel ini TIDAK mengetahui sebarang peraturan khusus kepada satu tab. Contohnya
  semakan silang-medan pada tab Aturan & Keadaan dihantar keluar melalui
  event `custom-validator` dan `form-actions`, lalu tab pemilik yang
  mengendalikannya. Panel ini hanya bertanggungjawab atas borang, butang dan
  satu panggilan simpan.
-->
<template>
  <div v-if="notEmpty(schema)">
    <spinner v-if="isLoading" />

    <div class="p-1">
      <generated-form-data
        ref="form"
        :propSchema="schema"
        :propData="formData"
        @formActions="formActions"
        @customValidator="customValidator"
        @formInputChange="formInputChange"
        @linkActions="linkActions"
      />
    </div>

    <div class="text-end">
      <button v-if="viewModeForm !== 'view'" class="btn btn-success me-1" @click="saveForm">
        {{ $t("button.common.simpan") }}
      </button>
      <button v-if="viewModeForm !== 'view'" class="btn btn-warning me-1" @click="resetForm">
        {{ $t("button.common.setSemula") }}
      </button>
      <button class="btn btn-primary me-1" @click="$emit('backToList')">
        {{ $t("button.common.kembali") }}
      </button>
    </div>
  </div>
</template>

<script>
import { Spinner } from "@2enapps/ui";
import { GeneratedFormData } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { warningSwal, successSwal, errorSwal, confirmSwal } from "@2enapps/ui";
import { saveDetails } from "@/services/training/crud";

export default {
  name: "SampleInputFormPanel",

  components: {
    GeneratedFormData,
    Spinner,
  },

  props: {
    schema: { type: Object, required: true },
    formData: { type: Object, required: true },
    id: { type: String, default: "" },
    viewModeForm: { type: String, default: "" },
  },

  emits: ["backToList", "form-actions", "custom-validator"],

  data() {
    return {
      isLoading: false,
    };
  },

  methods: {
    notEmpty(obj) {
      return notEmpty(obj);
    },

    /**
     * Skop simpan ialah skop tab ini sahaja.
     *
     * Versi lama satu butang "Simpan" kepada seluruh halaman, jadi ia
     *ZXJana `validateAllTabs()` yang berulang kali menukar tab untuk
     * menyemak setiap instans borang. Sekarang setiap tab mempunyai panel
     * sendiri dan butang sendiri, jadi satu klik hanya menyemak `formData`
     * panel ini sahaya — tiada pertukaran tab, tiada rujukan silang.
     */
    async saveForm() {
      const formComp = this.$refs.form;
      if (!formComp) return;

      formComp.formSubmit();
      if (!formComp.formIsValid) {
        warningSwal(
          this.$t("uiElement.sampleInput.message.warningTitle"),
          this.$t("uiElement.sampleInput.message.invalidForm") + (formComp.formIsValidMesej || "")
        );
        return;
      }

      if (!(await confirmSwal("", this.$t("uiElement.sampleInput.message.confirmSave")))) return;

      try {
        this.isLoading = true;
        const result = await saveDetails(this.id, formComp.formData);
        this.isLoading = false;
        successSwal(this.$t("uiElement.sampleInput.message.saved"), result.message);
      } catch (error) {
        this.isLoading = false;
        errorSwal(this.$t("uiElement.sampleInput.message.errorTitle"), error);
      }
    },

    resetForm() {
      this.$refs.form?.formReset();
    },

    formActions(data) {
      this.$emit("form-actions", data?.newFormData || {});
    },

    customValidator(field, self) {
      this.$emit("custom-validator", field, self);
    },

    formInputChange(field = null, event = null, data = null) {
      // Hook ini sengaja kosong: ia titik sambungan piawai untuk log atau
      // kesan tambahan yang tidak diperlukan oleh galeri ini.
      field;
      event;
      data;
    },

    linkActions(payload) {
      // Stub untuk handle type: "links" (listLinkInput)
      payload;
    },
  },
};
</script>
