<template>
  <div id="details-two">
    <spinner v-if="isLoading" />
    <sampel-cetakan-a v-if="cetakanName == 'TEST - LAPORAN 3'" :cetakanName="cetakanName" :propId="id"
      :PropCanEdit="true" :PropWaterMarkContent="''" :propViewsType="viewsType" :propRoleType="roleType" />
    <sampel-cetakan-b v-if="cetakanName == 'TEST - LAPORAN 2'" :cetakanName="cetakanName" :propId="id"
      :PropCanEdit="true" :PropWaterMarkContent="''" :propViewsType="viewsType" :propRoleType="roleType" />

    <BCard class="mb-2">
      <div>
        <generated-form-data v-if="notEmpty(schemaForm) && (id ? notEmpty(formData) : true)" ref="detailsForm"
          :propSchema="schemaForm" :propData="formData" @formActions="formActions" @customValidator="customValidator"
          @formInputChange="formInputChange" @linkActions="linkActions" @fieldActions="fieldActions"
          @buttonActions="buttonActions" />

        <div class="text-end">
          <BDropdown :class="['card-drop me-1']" variant="secondary" menu-class="dropdown-menu-end"
            v-if="viewModeForm != 'view'">
            <template v-slot:button-content>
              {{ $t("uiElement.generalTabCrud.detailsTwo.dropdown.button") }}
              <i class="ms-1 fas fa-chevron-down"></i>
            </template>

            <BDropdownItem @click="printActions('TEST - LAPORAN 3')">
              {{ $t("uiElement.generalTabCrud.detailsTwo.dropdown.templateA") }}
            </BDropdownItem>
            <BDropdownItem @click="printActions('TEST - LAPORAN 2')">
              {{ $t("uiElement.generalTabCrud.detailsTwo.dropdown.templateB") }}
            </BDropdownItem>
          </BDropdown>

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
    </BCard>
  </div>
</template>

<script>
import { Spinner } from "@2enapps/ui";
import { GeneratedFormData } from "@2enapps/ui";
import { saveDetails, getDetailsOne } from "@/services/training/crud";
import { notEmpty, setFormObjectBySchema, insideSchemaFieldsFA } from "@2enapps/ui";
import SampelCetakanA from "@/views/ui-element/print/sampel-cetakan-a.vue";
import SampelCetakanB from "@/views/ui-element/print/sampel-cetakan-b.vue";
import { warningSwal, successSwal, errorSwal, confirmSwal, infoSwal } from "@2enapps/ui";
import { standardValidation } from "@2enapps/ui";
/* import { } from "@/components/functions/general.js"; */

export default {
  name: "details-two",
  components: {
    GeneratedFormData,
    Spinner,
    SampelCetakanA,
    SampelCetakanB
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
      cetakanName: "",
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
          errorSwal(this.$t("uiElement.generalTabCrud.detailsTwo.message.error"), error);
        });
    },
    async printActions(cetakanName) {
      this.cetakanName = "";
      this.$nextTick(() => {
        if (cetakanName) {
          this.cetakanName = cetakanName;
        }
      });
    },
    async saveForm() {
      if (!this.$refs.detailsForm) return;
      this.$refs.detailsForm.formSubmit();
      const detailsForm = this.$refs.detailsForm;
      if (!detailsForm.formIsValid) {
        warningSwal(
          this.$t("uiElement.generalTabCrud.detailsTwo.message.warning"),
          this.$t("uiElement.generalTabCrud.detailsTwo.message.invalidForm") + detailsForm.formIsValidMesej
        );
        return;
      }
      if (!(await confirmSwal("", this.$t("uiElement.generalTabCrud.detailsTwo.message.confirm")))) return;
      try {
        this.isLoading = true;
        const result = await saveDetails(this.id, detailsForm.formData);
        this.isLoading = false;
        successSwal(this.$t("uiElement.generalTabCrud.detailsTwo.message.success"), result.message);
        this.$emit("backToList");
        this.$emit("refreshList");
      } catch (error) {
        this.isLoading = false;
        errorSwal(this.$t("uiElement.generalTabCrud.detailsTwo.message.error"), error);
      }
    },
    async buttonActions(data) {
      if (data && data.buttonAction) {
        if (data.buttonAction.functionName == "actionButton") {
          infoSwal(
            this.$t("uiElement.generalTabCrud.detailsTwo.message.formButtonTitle"),
            this.$t("uiElement.generalTabCrud.detailsTwo.message.formButtonTrigger", {
              functionName: data.buttonAction.functionName
            })
          );
        } else if (data.buttonAction.functionName == "actionCetak") {
          this.printActions("TEST - LAPORAN 3");
        }
      }
    },
    resetForm() {
      this.$refs.detailsForm?.formReset();
    },
    fieldActions(data) {
      if (data.fieldAction.functionName == "semakNama") {
        infoSwal(
          this.$t("uiElement.generalTabCrud.detailsTwo.message.fieldActionTitle"),
          this.$t("uiElement.generalTabCrud.detailsTwo.message.fieldActionValue", {
            value: data.value
          })
        );
      }
    },
    formInputChange(field = null, event = null, data = null) {
      data; event; field;
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
        title: "uiElement.generalTabCrud.detailsTwo.form.title",
        pkField: "id",
        fieldSets: [
          {
            legend: " ",
            name: "fieldset1",
            buttonActions: [
              {
                label: "uiElement.generalTabCrud.detailsTwo.form.buttonActions.printTemplate",
                icon: "",
                type: "button",
                cssClass: "btn btn-primary me-1",
                functionName: "actionCetak",
              },
              {
                label: "uiElement.generalTabCrud.detailsTwo.form.buttonActions.buttonInsideForm",
                icon: "",
                type: "button",
                cssClass: "btn btn-info me-2",
                functionName: "actionButton",
              },
            ],
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "id",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.id",
                    type: "hidden",
                  },
                  {
                    name: "idKelasPerkhidmatan",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.serviceClass",
                    type: "select-search",
                    refData: {
                      name: "KelasPerkhidmatan",
                      keyColumn: "id",
                      labelColumn: "{{id}} - {{keterangan}}",
                      url: process.env.VUE_API_URL_KOD + "/kelas-perkhidmatan",
                    },
                  },
                  {
                    name: "idJenisPerkhidmatan",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.serviceType",
                    type: "select-search",
                    refData: {
                      name: "JenisPerkhidmatan",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/jenis-perkhidmatan",
                    },
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  // {
                  //   name: "idBahagian",
                  //   label: "uiElement.generalTabCrud.detailsTwo.form.fields.section",
                  //   type: "select-search",
                  //   refData: {
                  //     name: "Bahagian",
                  //     keyColumn: "id",
                  //     labelColumn: "keterangan",
                  //     url: process.env.VUE_API_URL_KOD + "/bahagian",
                  //   },
                  // },
                  {
                    name: "jabatan",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.department",
                    type: "text",
                    validate: {
                      required: true,
                    },
                  },
                ],
              },
            ],
          },
          {
            legend: " ",
            name: "fieldset2",
            bannerAlert: [
              {
                content: "uiElement.generalTabCrud.detailsTwo.form.banner.top",
                variant: "warning",
                location: "top",
                name: "banner1",
              },
              {
                content: "uiElement.generalTabCrud.detailsTwo.form.banner.bottom",
                variant: "danger",
                location: "bottom",
                name: "banner2",
              },
            ],
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "tarikhMulaLantikan",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.appointmentDate",
                    type: "date",
                    validate: {
                      required: true,
                    },
                  },
                  {
                    name: "tarikhJangkaBersara",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.expectedRetirementDate",
                    type: "date",
                    viewOnly: true
                  },
                  {
                    name: "noGaji",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.salaryNo",
                    type: "number",
                  },
                  {
                    name: "jumlahPendapatan",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.salary",
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
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.officePhoneNo",
                    type: "phone",
                    hint: "uiElement.generalTabCrud.detailsTwo.form.hint.officePhoneNo",
                    validate: {
                      required: true,
                    },
                  },
                  {
                    name: "emelPejabat",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.officeEmail",
                    type: "email",
                    hint: "uiElement.generalTabCrud.detailsTwo.form.hint.officeEmail",
                  },
                  {
                    name: "tarikhSemakanHrmis",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.hrmisReviewDate",
                    type: "datetime-local",
                    viewOnly: true,
                  },
                ],
              },
            ],
          },
          {
            legend: "uiElement.generalTabCrud.detailsTwo.form.legend.sampleAccordion",
            name: "fieldset3",
            accordion: {
              id: "fieldset3",
              defaultHide: false,
            },
            fieldsetButtons: [
              {
                label: "uiElement.generalTabCrud.detailsTwo.form.fieldsetButtons.play",
                class: "btn-success",
                emitFunction: "play"
              },
              {
                label: "uiElement.generalTabCrud.detailsTwo.form.fieldsetButtons.pause",
                class: "btn-warning",
                emitFunction: "pause"
              },
              {
                label: "uiElement.generalTabCrud.detailsTwo.form.fieldsetButtons.reset",
                class: "btn-info",
                emitFunction: "reset"
              }
            ],
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "dirSlipGaji",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.salarySlip",
                    type: "upload",
                    upload: {
                      type: "file",
                      fileType: "pdf",
                      size: 5,
                      bucketname: process.env.VUE_APP_BUCKET_PENTADBIR,
                    },
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "dirLampiranPerjawatan",
                    label: "uiElement.generalTabCrud.detailsTwo.form.fields.latestAppointmentLetter",
                    type: "upload",
                    upload: {
                      type: "file",
                      fileType: "pdf",
                      size: 5,
                      bucketname: process.env.VUE_APP_BUCKET_PENTADBIR,
                    },
                  },
                ],
              },
            ],
          },
        ]
      };
    },
  },
};
</script>

<style></style>