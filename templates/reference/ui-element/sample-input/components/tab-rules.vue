<!--
  TAB 2 · ATURAN & KEADAAN

  Komponen tab yang terpisah sendiri, DAN satu-satunya tab yang mempunyai
  peraturan khusus: syarat paparan bersarang (`isHide`) dan semakan
  silang-medan. Kedua-duanya bergantung pada skema tab ini sahaja, jadi
  ia tinggal bersama komponen ini dan tidak perlu dikongsi.

  `form-panel` hanya emitting `form-actions` dan `custom-validator` ke atas.
-->
<template>
  <FormPanel
    :schema="schema"
    :formData="formData"
    :id="id"
    :viewModeForm="viewModeForm"
    @form-actions="applyConditionRules"
    @custom-validator="customValidator"
    @backToList="$emit('backToList')"
  />
</template>

<script>
import FormPanel from "./form-panel.vue";
import { setFormObjectBySchema } from "@2enapps/ui";
import { standardValidation, confirmPassword, dateCompareValidation } from "@2enapps/ui";

export default {
  name: "SampleInputTabRules",

  components: { FormPanel },

  props: {
    propId: String,
    viewModeForm: String,
    propData: { type: Object, default: () => ({}) },
  },

  emits: ["backToList", "register"],

  data() {
    return {
      schema: null,
      formData: {},
      id: "",
    };
  },

  created() {
    this.id = this.propId || "";
    this.schema = this.getSchemaRules();
    this.formData = {
      ...setFormObjectBySchema(this.schema),
      ...this.propData,
    };
  },

  mounted() {
    this.$emit("register", "rules", this.schema);
  },

  methods: {
    /**
     * `generated-form-data` TIDAK menyemak syarat paparan sendiri. Hos yang
     * menetapkan `isHide`, dan `v-show` di dalam penjana yang menyembunyikan
     * medianya. Bendiri yang disokong:
     *   - `field.isHide`      (baris medan)
     *   - `fieldset.isHide`   (keseluruh kumpulan)
     *   - `colGroup.isHide`   (satu lajur)
     *   - `joinField.isHide`  (satu medan dalam joinField)
     */
    applyConditionRules(newFormData) {
      const rulesSchema = this.schema;
      if (!rulesSchema) return;

      const adaKeluargaLain = newFormData.adaKeluargaLain == true;
      const adaTarikhLahir = !!newFormData.tarikhLahirAnak;

      rulesSchema.fieldSets.forEach((fieldset) => {
        // Kumpulan disembunyikan sepenuhnya mengikut satu syarat.
        if (fieldset.name == "conditionExtraFieldset") {
          fieldset.isHide = !adaKeluargaLain;
        }

        fieldset.colGroups.forEach((colGroup) => {
          // Satu lajur disembunyikan; medan dalam lajur lain kekal aktif.
          if (colGroup.name == "conditionExtraColGroup") {
            colGroup.isHide = !adaKeluargaLain;
          }

          colGroup.fields.forEach((field) => {
            if (field.name == "namaAhliKeluarga") {
              field.isHide = !adaKeluargaLain;
              // Bersama `isHide`, syarat juga boleh menukar status wajib:
              // medan tersembunyi tidak boleh menahan borang.
              field.validate = { required: adaKeluargaLain };
            }

            if (field.name == "tarikhLahirAnak") {
              // Medan ini hanya muncul selepas suis dihidupkan.
              field.isHide = !adaKeluargaLain;
            }

            if (field.joinField?.fields) {
              field.joinField.fields.forEach((joinField) => {
                // Rantaian peringkat dua: suis dahulu, kemudian medan
                // bergantung. joinField juga menyokong `isHide` sendiri.
                if (joinField.name == "tarikhAkhirKelahiran") {
                  joinField.isHide = !adaTarikhLahir;
                }
              });
            }
          });
        });

        // `bannerAlert` menyokong `isHide` sendiri, jadi amaran boleh muncul
        // hanya apabila syaratnya dipenuhi.
        (fieldset.bannerAlert || []).forEach((banner) => {
          if (banner.name == "conditionInfoBanner") {
            banner.isHide = !adaKeluargaLain;
          }
        });
      });
    },

    customValidator(field, self) {
      // 1. Aturan standard per-medan: `validate.required`, `validate.min`,
      //    `validate.minValue` / `maxValue`, format emel dan telefon.
      const errorMsg = standardValidation(field, self);
      self.formErrors[field.name] = errorMsg;
      if (errorMsg) return;

      // 2. Semakan silang-medan. Aturan silang bukan sebahagian
      //    `standardValidation`, jadi ia dilaksanakan di sini.
      if (field.name == "katalaluanBaru" || field.name == "sahkanKatalaluan") {
        confirmPassword(
          field,
          self,
          "katalaluanBaru",
          "sahkanKatalaluan",
          this.$t("uiElement.sampleInput.rules.message.passwordMismatch")
        );
        return;
      }

      if (field.name == "tarikhMulaTempahan" || field.name == "tarikhTamatTempahan") {
        dateCompareValidation(
          self,
          "tarikhMulaTempahan",
          "tarikhTamatTempahan",
          this.$t("uiElement.sampleInput.rules.message.dateRangeInvalid")
        );
      }
    },
    /* ------------------------------------------------------------------ *
     * TAB 2 · ATURAN & KEADAAN                                            *
     * ------------------------------------------------------------------ */
    getSchemaRules() {
      return {
        title: "uiElement.sampleInput.title.detailsOne",
        pkField: "id",
        fieldSets: [
          {
            legend: "uiElement.sampleInput.fieldset.rulesValidationFieldset",
            name: "validationFieldset",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "medanWajib",
                    label: "uiElement.sampleInput.label.requiredText",
                    type: "text",
                    /**
                     * `validate.required` dan bukan mesej ralat standard;
                     * `customErroMsg` menggantikannya.
                     */
                    validate: {
                      required: true,
                      customErroMsg: "Medan ini wajib diisi sebelum boleh disimpan.",
                    },
                  },
                  {
                    name: "medanMinimumAksara",
                    label: "uiElement.sampleInput.label.minLengthText",
                    type: "text",
                    /** `validate.min` ialah panjang aksara, bukan nilai. */
                    validate: { min: 10 },
                  },
                  {
                    name: "nilaiAntara",
                    label: "uiElement.sampleInput.label.minMaxNumber",
                    type: "number",
                    /** `minValue` / `maxValue` hanya disemak untuk `type: "number"`. */
                    validate: { minValue: 10, maxValue: 100 },
                  },
                  {
                    name: "emelWajib",
                    label: "uiElement.sampleInput.label.requiredEmail",
                    type: "email",
                    validate: { required: true },
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "telefonWajib",
                    label: "uiElement.sampleInput.label.requiredPhone",
                    type: "phone",
                    /** Format telefon disemak automatik (minimum 9 aksara). */
                    validate: { required: true },
                  },
                  {
                    name: "kotakSemakWajib",
                    label: "uiElement.sampleInput.label.requiredCheckbox",
                    type: "checkbox",
                    validate: { required: true },
                  },
                  {
                    name: "pilihanWajib",
                    label: "uiElement.sampleInput.label.requiredSelectMultiple",
                    type: "select-multiple",
                    isSearch: true,
                    validate: { required: true },
                    refData: {
                      listWidth: 4,
                      name: "Negeri",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/negeri",
                    },
                  },
                  {
                    name: "katalaluanBaru",
                    label: "uiElement.sampleInput.label.newPassword",
                    type: "password",
                    showPassword: true,
                    validate: { required: true },
                  },
                  {
                    name: "sahkanKatalaluan",
                    label: "uiElement.sampleInput.label.confirmNewPassword",
                    type: "password",
                    showPassword: true,
                    validate: { required: true },
                  },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.rulesConditionFieldset",
            name: "conditionFieldset",
            bannerAlert: [
              {
                name: "conditionInfoBanner",
                variant: "info",
                location: "top",
                content: "uiElement.sampleInput.banner.conditionInfo",
              },
            ],
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "adaKeluargaLain",
                    label: "uiElement.sampleInput.label.hasFamily",
                    type: "switch",
                  },
                  {
                    name: "tarikhLahirAnak",
                    label: "uiElement.sampleInput.label.childBirthDate",
                    type: "date",
                    /**
                     * Medan ini bergantung kepada `medanTarikhKelahiran` yang
                     * tidak dipaparkan; butirannya di bawah.
                     */
                  },
                  {
                    name: "jangkaanKelahiran",
                    label: "uiElement.sampleInput.label.birthDateRange",
                    joinField: {
                      layout: "horizontal",
                      separator: " - ",
                      fields: [
                        { name: "tarikhMulaKelahiran", label: "uiElement.sampleInput.label.dateStart", type: "date", colWidth: 5 },
                        { label: "uiElement.sampleInput.label.to", align: "center", colWidth: 2 },
                        {
                          name: "tarikhAkhirKelahiran",
                          label: "uiElement.sampleInput.label.dateEnd",
                          type: "date",
                          colWidth: 5,
                          /** joinField juga menyokong `isHide` pada setiap child. */
                        },
                      ],
                    },
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                name: "conditionExtraColGroup",
                fields: [
                  {
                    name: "namaAhliKeluarga",
                    label: "uiElement.sampleInput.label.familyMemberName",
                    type: "text",
                  },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.conditionExtraFieldset",
            name: "conditionExtraFieldset",
            colGroups: [
              {
                colwidth: "12",
                fieldwidth: "12",
                fields: [
                  {
                    name: "tarikhMulaTempahan",
                    label: "uiElement.sampleInput.label.loanStartDate",
                    type: "date",
                    validate: { required: true },
                  },
                  {
                    name: "tarikhTamatTempahan",
                    label: "uiElement.sampleInput.label.loanEndDate",
                    type: "date",
                    validate: { required: true },
                  },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.rulesDisplayFieldset",
            name: "displayFieldset",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "tajukBahagian",
                    label: "",
                    type: "title",
                    title: "uiElement.sampleInput.label.sectionTitle",
                  },
                  {
                    name: "barisKosong",
                    label: "",
                    type: "dummyRow",
                  },
                  {
                    name: "medanHanyaPapar",
                    label: "uiElement.sampleInput.label.viewOnlyField",
                    type: "text",
                    /** `viewOnly` menjadikan medan kotak kelabu dan tidak boleh disunting. */
                    viewOnly: true,
                    defaultValue: "Nilai ini datang daripada data terdahulu dan tidak boleh diubah.",
                  },
                  {
                    name: "medanTidakBolehEdit",
                    label: "uiElement.sampleInput.label.unEditableField",
                    type: "text",
                    /** `unEditable` berbeza daripada `viewOnly`: label masih dipapar. */
                    unEditable: true,
                    defaultValue: "Boleh dibaca tetapi tidak boleh diketik.",
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "nilaiWarna",
                    label: "uiElement.sampleInput.label.dynamicColorField",
                    type: "number",
                    /**
                     * `customCssValue` ialah ungkapan JavaScript. `{{nilai}}`
                     * digantikan dengan nilai borang sebelum ungkapan itu
                     * dijalankan, jadi hasilnya mesti ialah nama kelas CSS.
                     *
                     * PENTING: letak placeholder DALAM tanda petik. Nilai
                     * kosong digantikan dengan `""`, jadi `{{x}} >= 50`
                     * menjadi `>= 50` yang pecah sintaks. `'{{x}}' >= 50`
                     * pula kekal sah walaupun medannya kosong.
                     */
                    customCssValue:
                      "'{{nilaiWarna}}' >= 50 ? 'text-danger fw-bold' : 'text-primary'",
                  },
                  {
                    name: "labelDynamik",
                    label: "uiElement.sampleInput.label.dynamicColorHint",
                    type: "textarea",
                    areaRows: 2,
                    noLabelSpace: true,
                    /** `customCssLabel` guna penkaraian yang sama seperti `customCssValue`. */
                    customCssLabel:
                      "'{{nilaiWarna}}' >= 50 ? 'text-danger' : 'text-muted'",
                    unEditable: true,
                  },
                  {
                    name: "tagDilumpuhkan",
                    label: "uiElement.sampleInput.label.disabledTag",
                    type: "chiptag",
                    /** `disabled` berbeza daripada `viewOnly`: label masih dipapar. */
                    disabled: true,
                    defaultValue: ["TagA", "TagB"],
                  },
                ],
              },
            ],
          },

          {
            legend: "uiElement.sampleInput.fieldset.rulesAccordionFieldset",
            name: "accordionFieldset",
            /**
             * `accordion.id` menjadi sasaran `v-b-toggle`, jadi ia mesti unik
             * dalam halaman. `defaultHide: true` memulakan ia tertutup.
             */
            accordion: { id: "sampleInputAccordion", defaultHide: true },
            colGroups: [
              {
                colwidth: "12",
                fieldwidth: "12",
                fields: [
                  {
                    name: "medanDalamAkordeon",
                    label: "uiElement.sampleInput.label.accordionField",
                    type: "text",
                  },
                ],
              },
            ],
          },
        ],
      };
    },
  },
};
</script>
