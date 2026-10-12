<template>
  <div id="details-four">
    <spinner v-if="isLoading" />
    <div>
      <generated-form-data
        v-if="notEmpty(schemaForm) && (id ? notEmpty(formData) : true)"
        ref="detailsForm"
        :propSchema="schemaForm"
        :propData="formData"
        @formActions="formActions"
        @customValidator="customValidator"
        @formInputChange="formInputChange"
        @linkActions="linkActions"
        @fieldActions="fieldActions"
      />
      <div class="text-end">
        <button
          v-if="viewModeForm !== 'view'"
          class="btn btn-success me-1"
          @click="saveForm"
        >
          {{ $t("button.common.simpan") }}
        </button>
        <button
          v-if="viewModeForm !== 'view'"
          class="btn btn-warning me-1"
          @click="resetForm"
        >
          {{ $t("button.common.setSemula") }}
        </button>
        <button class="btn btn-primary me-1" @click="$emit('backToList')">
          {{ $t("button.common.kembali") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Spinner } from "@2enapps/ui";
import { GeneratedFormData } from "@2enapps/ui";
import { saveDetails, getDetailsOne } from "@/services/training/crud";
import { notEmpty, setFormObjectBySchema, insideSchemaFieldsFA } from "@2enapps/ui";

import { warningSwal, successSwal, errorSwal, confirmSwal } from "@2enapps/ui";
import { standardValidation } from "@2enapps/ui";

export default {
  name: "details-four",

  components: {
    GeneratedFormData,
    Spinner,
  },

  props: {
    propId: String,
    viewMode: String,
    propViewsType: String,
    propRoleType: String,
  },

  data() {
    return {
      schemaForm: {},
      formData: setFormObjectBySchema(this.schemaForm),
      viewModeForm: "",
      id: "",
      viewsType: "",
      roleType: "",
      isLoading: false,
    };
  },

  computed: {},

  async created() {
    this.viewModeForm = this.viewMode || "";
    this.viewsType = this.propViewsType || "";
    this.roleType = this.propRoleType || "";
    this.id = this.propId || "";
    await this.getSchemaForm();
    if (this.id) {
      this.getData(this.id);
    }
  },

  methods: {
    notEmpty(obj) {
      return notEmpty(obj);
    },

    getData(id) {
      this.isLoading = true;
      getDetailsOne(id)
        .then((result) => {
          console.log(" getDetailsOne :::::: ", result);
          this.isLoading = false;
          Object.assign(this.formData, result.data);
          this.$emit("dataPengguna", result.data);
        })
        .catch((error) => {
          this.isLoading = false;
          errorSwal("Ralat", error);
        });
    },

    async saveForm() {
      if (!this.$refs.detailsForm) return;
      this.$refs.detailsForm.formSubmit();
      const detailsForm = this.$refs.detailsForm;

      if (!detailsForm.formIsValid) {
        warningSwal(
          "Peringatan",
          "Pastikan maklumat adalah sah dan lengkap!." +
            detailsForm.formIsValidMesej
        );
        return;
      }

      if (!(await confirmSwal("", "Adakah anda pasti?"))) return;

      try {
        this.isLoading = true;
        const result = await saveDetails(this.id, detailsForm.formData);
        this.isLoading = false;
        successSwal("Berjaya", result.message);
        this.$emit("backToList");
        this.$emit("refreshList");
      } catch (error) {
        this.isLoading = false;
        errorSwal("Ralat", error);
      }
    },

    resetForm() {
      this.$refs.detailsForm?.formReset();
    },

    formInputChange(field = null, event = null, data = null) {
      data;
      event;
      field;
    },

    formActions(data) {
      if (!data.formSchema?.fieldSets) return;
      insideSchemaFieldsFA(data.formSchema, (field) => {
        field["viewMode"] = this.viewModeForm ? this.viewModeForm : "";
        field;
      });
    },

    linkActions(payload) {
      payload;
    },

    customValidator(field, self) {
      const errorMsg = standardValidation(field, self);
      if (errorMsg) {
        self.formErrors[field.name] = errorMsg;
      }
    },

    getSchemaForm() {
      this.schemaForm = {
        title: "uiElement.generalTabCrud.detailsFour.form.title",
        pkField: "id",
        fieldSets: [
          {
            legend: "uiElement.generalTabCrud.detailsFour.form.fieldsets.fieldset1.legend",
            name: "fieldset1",
            colGroups: [
              {
                colwidth: "12",
                fieldwidth: "12",
                fields: [
                  {
                    name: "id",
                    label: "uiElement.generalTabCrud.detailsFour.form.fields.id",
                    type: "hidden",
                  },
                  {
                    name: "noKadPengenalan",
                    label:
                      "uiElement.generalTabCrud.detailsFour.form.fields.noKadPengenalan",
                    type: "number",
                    hint:
                      "uiElement.generalTabCrud.detailsFour.form.hints.noKadPengenalan",
                    maxLength: 12,
                    validate: {
                      required: true,
                      min: 12,
                      max: 12,
                    },
                  },
                  {
                    name: "nama",
                    label:
                      "uiElement.generalTabCrud.detailsFour.form.fields.nama",
                    type: "text",
                    validate: {
                      required: true,
                    },
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

<style></style>