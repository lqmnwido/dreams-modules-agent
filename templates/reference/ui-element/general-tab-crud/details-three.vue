<template>
  <div id="details-three">
    <spinner v-if="isLoading" />
    <BCard class="mb-2">
      <generated-form-data v-if="notEmpty(schemaForm) && (id ? notEmpty(formData) : true)" ref="detailsForm"
        :propSchema="schemaForm" :propData="formData" @formActions="formActions" @customValidator="customValidator"
        @formInputChange="formInputChange" @linkActions="linkActions" @fieldActions="fieldActions"
        @buttonActions="buttonActions" />
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
    </BCard>

    <list-three :propId="id" :viewMode="formDataViewMode" ref="detailsThree" @backToList="backToList"
      :propViewsType="viewsType" :propRoleType="roleType" @refreshList="refreshList" />
  </div>
</template>

<script>
import { Spinner } from "@2enapps/ui";
import { GeneratedFormData } from "@2enapps/ui";
import { saveDetails, getDetailsOne } from "@/services/training/crud";
import { notEmpty, setFormObjectBySchema, insideSchemaFieldsFA } from "@2enapps/ui";
import { warningSwal, successSwal, errorSwal, confirmSwal, infoSwal } from "@2enapps/ui";
import { standardValidation } from "@2enapps/ui";
import { defineAsyncComponent } from "vue";

export default {
  name: "details-three",

  components: {
    GeneratedFormData,
    Spinner,
    ListThree: defineAsyncComponent(() =>
      import("@/views/ui-element/general-tab-crud/list-three.vue")
    ), // untuk guna same component balik
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
        this.$emit("refreshList");
        this.$emit("backToList");
      } catch (error) {
        this.isLoading = false;
        errorSwal("Ralat", error);
      }
    },

    async buttonActions(data) {
      if (data && data.buttonAction) {
        if (data.buttonAction.functionName == "actionButton") {
          infoSwal(
            "Button Inside Form",
            "Tigger button '" + data.buttonAction.functionName + "''"
          );
        }
      }
    },

    resetForm() {
      this.$refs.detailsForm?.formReset();
    },

    fieldActions(data) {
      if (data.fieldAction.functionName == "semakNama") {
        infoSwal("Field Action Button", "semakNama : " + data.value);
      }
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
        title: "uiElement.generalTabCrud.detailsThree.form.title",
        pkField: "id",
        fieldSets: [
          {
            legend: "",
            name: "fieldset2",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "id",
                    label: "uiElement.generalTabCrud.detailsThree.form.fields.id",
                    type: "hidden",
                  },
                  {
                    name: "tarikhMulaLantikan",
                    label:
                      "uiElement.generalTabCrud.detailsThree.form.fields.tarikhMulaLantikan",
                    type: "date",
                    validate: {
                      required: true,
                    },
                  },
                  {
                    name: "tarikhJangkaBersara",
                    label:
                      "uiElement.generalTabCrud.detailsThree.form.fields.tarikhJangkaBersara",
                    type: "date",
                    viewOnly: true,
                  },
                  {
                    name: "noGaji",
                    label:
                      "uiElement.generalTabCrud.detailsThree.form.fields.noGaji",
                    type: "number",
                  },
                  {
                    name: "jumlahPendapatan",
                    label:
                      "uiElement.generalTabCrud.detailsThree.form.fields.jumlahPendapatan",
                    type: "currency",
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "noTelefonPejabat",
                    label:
                      "uiElement.generalTabCrud.detailsThree.form.fields.noTelefonPejabat",
                    type: "phone",
                    hint:
                      "uiElement.generalTabCrud.detailsThree.form.hints.noTelefonPejabat",
                    validate: {
                      required: true,
                    },
                  },
                  {
                    name: "emelPejabat",
                    label:
                      "uiElement.generalTabCrud.detailsThree.form.fields.emelPejabat",
                    type: "email",
                    hint:
                      "uiElement.generalTabCrud.detailsThree.form.hints.emelPejabat",
                  },
                  {
                    name: "tarikhSemakanHrmis",
                    label:
                      "uiElement.generalTabCrud.detailsThree.form.fields.tarikhSemakanHrmis",
                    type: "datetime-local",
                    viewOnly: true,
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