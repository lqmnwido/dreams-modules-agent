<template>
  <div id="details-one-general-crud">
    <BCard class="mb-2">
      <spinner v-if="isLoading" />
      <BCardTitle v-if="!fromTab" variant="primary">
        {{ $t("uiElement.generalTabCrud.detailsOne.form.titleCard") }}
      </BCardTitle>

      <!--
        Versi 2 (V2) demo Stepper: `:clickable="true"` (click pada marker
        langkah dibenarkan — lompat terus tanpa validasi) + `variant="vertical"`.
        Komponen shared yang sama (@2enapps/ui), diguna pakai dalam modul MFE
        lain (general-crud), sama konsep seperti dynamic-form & input.
      -->
      <stepper
        v-if="notEmpty(schemaForm) && (id ? notEmpty(formData) : true)"
        ref="wizard"
        :propSchema="stepperSchema"
        :propData="formData"
        :validateAllOnSubmit="true"
        :clickable="true"
        variant="horizontal"
        @finish="saveForm"
        @formActions="formActions"
        @customValidator="customValidator"
        @formInputChange="formInputChange"
        @linkActions="linkActions"
        @fieldActions="fieldActions"
      >
        <template #actions>
          <button v-if="viewModeForm !== 'view'" class="btn btn-success me-1" @click="submitWizard">
            {{ $t("button.common.simpan") }}
          </button>
          <button v-if="viewModeForm !== 'view'" class="btn btn-warning me-1" @click="resetWizard">
            {{ $t("button.common.setSemula") }}
          </button>
          <button class="btn btn-primary me-1" @click="$emit('backToList')">
            {{ $t("button.common.kembali") }}
          </button>
        </template>
      </stepper>
    </BCard>
  </div>
</template>

<script>
import { Spinner, Stepper } from "@2enapps/ui";
import { saveDetails, getDetailsOne } from "@/services/training/crud";
import { notEmpty, setFormObjectBySchema, insideSchemaFieldsFA, isFieldUpdateFA, fieldDropDownDependency, reloadUploadFA } from "@2enapps/ui";

import { successSwal, errorSwal, confirmSwal, infoSwal } from "@2enapps/ui";
import { standardValidation, dateCompareValidation } from "@2enapps/ui";
import { getCurrentDateTime, convertDateTimeToDisplay } from "@2enapps/ui";

export default {
  name: "details-one-general-crud",

  components: {
    Stepper,
    Spinner,
  },

  props: {
    propId: String,
    viewMode: String,
    propViewsType: String,
    propRoleType: String,
    fromTab: Boolean,
  },

  data() {
    return {
      schemaForm: {},
      stepperSchema: {},
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
          errorSwal(this.$t("uiElement.generalTabCrud.detailsOne.message.error"), error);
        });
    },

    /**
     * Dipanggil oleh event `finish` stepper (butang Hantar langkah terakhir
     * ATAU butang Simpan MFE). Stepper sudah menjalankan validasi penuh
     * (`validateAllOnSubmit`); di sini hanya pengesahan + simpan.
     */
    async saveForm(data) {
      if (!(await confirmSwal("", this.$t("uiElement.generalTabCrud.detailsOne.message.confirm")))) return;

      await saveDetails(this.id, data)
        .then((result) => {
          this.isLoading = false;
          if (!this.id) {
            this.id = "admin_sistem";
            this.$emit("setId", this.id);
          }
          Object.assign(this.formData, data);
          this.$emit("refreshList");
          successSwal(this.$t("uiElement.generalTabCrud.detailsOne.message.success"), result.message);
        })
        .catch((error) => {
          this.isLoading = false;
          errorSwal(this.$t("uiElement.generalTabCrud.detailsOne.message.error"), error);
        });
    },

    submitWizard() {
      this.$refs.wizard?.submit();
    },

    resetWizard() {
      this.$refs.wizard?.reset();
    },

    fieldActions(data) {
      if (data.fieldAction.functionName == "semakNama") {
        infoSwal(
          this.$t("uiElement.generalTabCrud.detailsOne.message.fieldActionButton"),
          this.$t("uiElement.generalTabCrud.detailsOne.message.checkName") + " : " + data.value
        );
      }
    },

    formInputChange(field = null, event = null, data = null) {
      data;
      event;
      console.log("formInputChange Onblur data.firstLoad : ", data);

      if (field) {
        if (field.name == "noKadPengenalan" && data?.noKadPengenalan?.length == 12) {
          infoSwal(
            this.$t("uiElement.generalTabCrud.detailsOne.message.inputChanged"),
            this.$t("uiElement.generalTabCrud.detailsOne.message.triggerInputChanged", {
              label: field.label
            })
          );
        } else if (field.name == "copyAlamat") {
          if (!data["copyAlamat"]) {
            data["alamatSemasa1"] = null;
            data["alamatSemasa2"] = null;
            data["alamatSemasa3"] = null;
            data["poskodSemasa"] = null;
            data["idNegeriSemasa"] = null;
            data["idBandarSemasa"] = null;
          }
        }
      }
    },

    formActions(data) {
      if (!data.formSchema?.fieldSets) return;

      insideSchemaFieldsFA(data.formSchema, (field) => {
        field["viewMode"] = this.viewModeForm ? this.viewModeForm : "";

        let copyAlamat = false;
        if (
          ["idJenisDokumenStatusPerkahwinan", "dirDokumenStatusPerkahwinan", "bilAnak"].includes(field.name) &&
          isFieldUpdateFA(data, "idStatusPerkahwinan")
        ) {
          if (["02"].includes(data.newVal.idStatusPerkahwinan)) {
            data.newVal.idJenisDokumenStatusPerkahwinan = "43";
          } else if (["03", "04"].includes(data.newVal.idStatusPerkahwinan)) {
            data.newVal.idJenisDokumenStatusPerkahwinan = "43";
          } else if (["05"].includes(data.newVal.idStatusPerkahwinan)) {
            data.newVal.idJenisDokumenStatusPerkahwinan = "43";
          } else {
            data.newVal.idJenisDokumenStatusPerkahwinan = null;
          }

          reloadUploadFA(this, field, "dirDokumenStatusPerkahwinan");
          const arrIdStatusPerkahwinan = ["02", "03", "04", "05"];
          data.newVal.dirDokumenStatusPerkahwinan = arrIdStatusPerkahwinan.includes(data.newVal.idStatusPerkahwinan)
            ? data.newVal.dirDokumenStatusPerkahwinan
            : null;
          data.newVal.bilAnak = arrIdStatusPerkahwinan.includes(data.newVal.idStatusPerkahwinan)
            ? data.newVal.dirDokumenStatusPerkahwinan
            : null;

          field["isHide"] = arrIdStatusPerkahwinan.includes(data.newVal.idStatusPerkahwinan) ? false : true;

          if (
            field.name == "dirDokumenStatusPerkahwinan" ||
            field.name == "idJenisDokumenStatusPerkahwinan"
          ) {
            field["validate"] = false;
          }
        } else if (["tarikhMati"].includes(field.name) && isFieldUpdateFA(data, "flagHidup")) {
          data.newVal.tarikhMati =
            data.newVal.flagHidup == true ? null : data.newVal.tarikhMati;

          field["isHide"] =
            data.newVal.flagHidup || data.newVal.flagHidup == null ? true : false;

          field["validate"] = {
            required: data.newVal.flagHidup || data.newVal.flagHidup == null ? false : true,
          };
        } else if (["dirSalinanKadPengenalan", "dirGambarProfil"].includes(field.name)) {
          const arrIdKategoriPengguna = ["02", "13", "05", "16"];
          if (isFieldUpdateFA(data, "idKategoriPengguna")) {
            field["validate"] = {
              required: !arrIdKategoriPengguna.includes(data.newVal.idKategoriPengguna)
                ? true
                : false,
            };
          } else if (isFieldUpdateFA(data, "noKadPengenalan")) {
            field["upload"]["watermarkDownloadSetting"] = {
              label:
                "D-ReAMS - " +
                data.newFormData["noKadPengenalan"] +
                " - " +
                convertDateTimeToDisplay(getCurrentDateTime()),
            };
          }
        } else if (
          ["alamatSemasa1", "alamatSemasa2", "alamatSemasa3", "poskodSemasa", "idNegeriSemasa", "idBandarSemasa"].includes(field.name) &&
          isFieldUpdateFA(data, "copyAlamat")
        ) {
          copyAlamat = data.newVal.copyAlamat;
        }

        if (copyAlamat) {
          fieldDropDownDependency(
            data,
            field,
            "idNegeriSemasa",
            "idBandarSemasa",
            process.env.VUE_API_URL_KOD + `/bandar?idNegeri=${data.newVal.idNegeriTetap}`
          );

          if (field.name == "alamatSemasa1") {
            data.newVal.alamatSemasa1 = data.newVal.alamatTetap1;
          } else if (field.name == "alamatSemasa2") {
            data.newVal.alamatSemasa2 = data.newVal.alamatTetap2;
          } else if (field.name == "alamatSemasa3") {
            data.newVal.alamatSemasa3 = data.newVal.alamatTetap3;
          } else if (field.name == "poskodSemasa") {
            data.newVal.poskodSemasa = data.newVal.poskodTetap;
          } else if (field.name == "idNegeriSemasa") {
            data.newVal.idNegeriSemasa = data.newVal.idNegeriTetap;
          } else if (field.name == "idBandarSemasa") {
            data.newFormData.newVal = data.newVal.idBandarTetap;
          }
        } else {
          fieldDropDownDependency(
            data,
            field,
            "idNegeriTetap",
            "idBandarTetap",
            process.env.VUE_API_URL_KOD + `/bandar?idNegeri=${data.newVal.idNegeriTetap}`
          );

          fieldDropDownDependency(
            data,
            field,
            "idNegeriSemasa",
            "idBandarSemasa",
            process.env.VUE_API_URL_KOD + `/bandar?idNegeri=${data.newVal.idNegeriSemasa}`
          );
        }
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

      dateCompareValidation(
        self,
        "tarikhMulaLantikan",
        "tarikhTamatLantikan",
        "uiElement.generalTabCrud.detailsOne.validation.dateCompare"
      );
    },

    getSchemaForm() {
      // Borang details sedia ada disimpan dalam `schemaPlain`, kemudian
      // `fieldSets`-nya dibahagikan kepada langkah-langkah wizard stepper.
      const schemaPlain = {
        title: "uiElement.generalTabCrud.detailsOne.form.title",
        pkField: "id",
        fieldSets: [
          {
            legend: " ",
            name: "maklumat",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "dirGambarProfil",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.profilePicture",
                    type: "upload",
                    upload: {
                      type: "image",
                      size: 5,
                      align: "center",
                      onEditImage: true,
                      bucketname: process.env.VUE_APP_BUCKET_PENTADBIR,
                    },
                    hint: "uiElement.generalTabCrud.detailsOne.form.hint.profilePicture",
                    validate: {
                      required: true,
                    },
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
          {
            legend: " ",
            name: "maklumat",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "id",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.id",
                    type: "hidden",
                  },
                  {
                    name: "idKategoriPengguna",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.userCategory",
                    type: "select-search",
                    validate: {
                      required: !this.id ? true : false,
                    },
                    refData: {
                      name: "Gelaran",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/kategori-pengguna?sortBy=keterangan&sortOrder=asc",
                    },
                  },
                  {
                    name: "idGelaran",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.title",
                    type: "select-search",
                    refData: {
                      name: "Gelaran",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/gelaran",
                    },
                  },
                  {
                    name: "noKadPengenalan",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.identityCardNo",
                    type: "number",
                    hint: "uiElement.generalTabCrud.detailsOne.form.hint.identityCardNo",
                    viewOnly: this.id ? true : false,
                    maxLength: 12,
                    validate: {
                      required: true,
                      min: 12,
                      max: 12,
                    },
                  },
                  {
                    name: "nama",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.name",
                    type: "text",
                    validate: {
                      required: true,
                    },
                    fieldActions: [
                      {
                        label: "uiElement.generalTabCrud.detailsOne.form.actions.check",
                        type: "button",
                        cssClass: "btn-success",
                        functionName: "semakNama",
                      }
                    ],
                  },
                  {
                    name: "idJenisPengenalanLain",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.otherIdentificationType",
                    type: "select-search",
                    refData: {
                      name: "JenisPengenalanLain",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/jenis-pengenalan",
                      scriptExclude: " '{{id}}' == '0' ",
                    },
                  },
                  {
                    name: "noKadPengenalanLain",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.otherIdentificationNo",
                    type: "text",
                    maxLength: 20,
                  },
                  {
                    name: "tarikhLahir",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.birthDate",
                    type: "date",
                  },
                  {
                    name: "dirSalinanKadPengenalan",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.identityCardCopy",
                    type: "upload",
                    upload: {
                      type: "file",
                      fileType: "pdf",
                      size: 5,
                      bucketname: process.env.VUE_APP_BUCKET_PENTADBIR,
                    },
                    validate: {
                      required: true,
                    },
                  },
                  {
                    name: "idAgama",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.religion",
                    type: "select",
                    validate: {
                      required: true,
                    },
                    refData: {
                      name: "Agama",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/agama",
                    },
                  },
                  {
                    name: "jantina",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.gender",
                    type: "select-search",
                    viewShowAll: false,
                    validate: {
                      required: true,
                    },
                    refData: {
                      name: "jantina",
                      keyColumn: "id",
                      labelColumn: "name",
                      url: "",
                    },
                  },
                  {
                    name: "idBangsa",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.race",
                    type: "select-search",
                    validate: {
                      required: true,
                    },
                    refData: {
                      name: "Bangsa",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/bangsa",
                    },
                  },
                  {
                    name: "idEtnik",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.ethnic",
                    type: "select-search",
                    validate: {
                      required: true,
                    },
                    refData: {
                      name: "Bangsa",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/etnik",
                    },
                  },
                  {
                    name: "idWarganegara",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.citizenship",
                    type: "select-search",
                    validate: {
                      required: true,
                    },
                    refData: {
                      name: "Warganegara",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/warganegara",
                    },
                  },
                  {
                    name: "idStatusPerkahwinan",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.maritalStatus",
                    type: "select-search",
                    validate: {
                      required: true,
                    },
                    refData: {
                      name: "StatusPerkahwinan",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/status-perkahwinan",
                    },
                  },
                  // {
                  //   name: "idJenisDokumenStatusPerkahwinan",
                  //   label: "uiElement.generalTabCrud.detailsOne.form.fields.maritalStatusDocumentType",
                  //   type: "select-search",
                  //   viewOnly: true,
                  //   refData: {
                  //     name: "JenisDokumenStatusPerkahwinan",
                  //     keyColumn: "id",
                  //     labelColumn: "keterangan",
                  //     url: process.env.VUE_API_URL_KOD + "/dokumen-perkahwinan/jenis-dokumen",
                  //   },
                  // },
                  {
                    name: "dirDokumenStatusPerkahwinan",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.maritalStatusDocument",
                    type: "upload",
                    upload: {
                      type: "file",
                      fileType: "pdf",
                      size: 5,
                      bucketname: process.env.VUE_APP_BUCKET_PENTADBIR,
                    },
                    hint: "uiElement.generalTabCrud.detailsOne.form.hint.maritalStatusDocument"
                  },
                  {
                    name: "bilAnak",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.totalChildren",
                    type: "number",
                    maxLength: 2,
                  },
                  {
                    name: "flagHidup",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.lifeStatus",
                    type: "radio",
                    inline: true,
                    refData: {
                      name: "flagHidup",
                      keyColumn: "id",
                      labelColumn: "name",
                      url: "",
                    },
                  },
                  {
                    name: "tarikhMati",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.deathDate",
                    type: "date",
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "noTelefonBimbit",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.mobileNo",
                    type: "phone",
                    hint: "uiElement.generalTabCrud.detailsOne.form.hint.mobileNo",
                  },
                  {
                    name: "emel",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.personalEmail",
                    type: "email",
                    hint: "uiElement.generalTabCrud.detailsOne.form.hint.email",
                    validate: {
                      required: true,
                    },
                  },
                  {
                    name: "emelPejabat",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.officeEmail",
                    type: "email",
                    hint: "uiElement.generalTabCrud.detailsOne.form.hint.email",
                    validate: {
                      required: true,
                    },
                  },
                  {
                    name: "alamatTetap1",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.permanentAddress",
                    type: "text",
                  },
                  {
                    name: "alamatTetap2",
                    label: "",
                    type: "text",
                  },
                  {
                    name: "alamatTetap3",
                    label: "",
                    type: "text",
                  },
                  {
                    name: "poskodTetap",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.postcode",
                    type: "number",
                    maxLength: 5,
                    validate: {
                      min: 5,
                      max: 5,
                    },
                  },
                  {
                    name: "idNegeriTetap",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.state",
                    type: "select-search",
                    refData: {
                      name: "Negeri",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/negeri",
                    },
                  },
                  {
                    name: "idBandarTetap",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.city",
                    type: "select-search",
                    refData: {
                      name: "Bandar",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: "",
                      noDefault: true,
                    },
                  },
                  {
                    name: "copyAlamat",
                    label: " ",
                    type: "switch",
                    isHide: this.viewModeForm == "view",
                    checkboxLabel: "uiElement.generalTabCrud.detailsOne.form.fields.currentAddressSameAsPermanent",
                  },
                  {
                    name: "alamatSemasa1",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.currentAddress",
                    type: "text",
                  },
                  {
                    name: "alamatSemasa2",
                    label: "",
                    type: "text",
                  },
                  {
                    name: "alamatSemasa3",
                    label: "",
                    type: "text",
                  },
                  {
                    name: "poskodSemasa",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.postcode",
                    type: "number",
                    maxLength: 5,
                    validate: {
                      min: 5,
                      max: 5,
                    },
                  },
                  {
                    name: "idNegeriSemasa",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.state",
                    type: "select",
                    refData: {
                      name: "Negeri",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: process.env.VUE_API_URL_KOD + "/negeri",
                    },
                  },
                  {
                    name: "idBandarSemasa",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.city",
                    type: "select",
                    refData: {
                      name: "Bandar",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: "",
                      noDefault: true,
                    },
                  },
                  {
                    name: "tarikhMulaAkhirLantikan",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.appointmentDate",
                    joinField: {
                      layout: "horizontal",
                      separator: " - ",
                      fields: [
                        {
                          name: "tarikhMulaLantikan",
                          label: "uiElement.generalTabCrud.detailsOne.form.fields.appointmentStartDate",
                          type: "date",
                          colWidth: 5,
                          validate: {
                            required: true,
                          },
                        },
                        {
                          name: "labelTarikhJoin",
                          label: "uiElement.generalTabCrud.detailsOne.form.fields.until",
                          align: "center",
                          colWidth: 2,
                        },
                        {
                          name: "tarikhTamatLantikan",
                          label: "uiElement.generalTabCrud.detailsOne.form.fields.appointmentEndDate",
                          type: "date",
                          colWidth: 5,
                          validate: {
                            required: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    name: "flagAktif",
                    viewOnly: true,
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.active",
                    type: "switch",
                    showIcon: true,
                  },
                ],
              },
            ],
          },
          {
            legend: "uiElement.generalTabCrud.detailsOne.form.legend.password",
            name: "katalaluan",
            colGroups: [
              {
                colwidth: "12",
                fieldwidth: "6",
                fields: [
                  {
                    name: "katalaluan",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.password",
                    type: "password",
                    showPassword: true,
                    validate: {
                      required: false,
                    },
                  },
                  {
                    name: "hintKatalaluan",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.passwordConfirmation",
                    type: "password",
                    showPassword: true,
                    validate: {
                      required: false,
                    },
                  },
                ],
              },
            ],
          },
          {
            legend: "uiElement.generalTabCrud.detailsOne.form.legend.userRole",
            name: "maklumat",
            colGroups: [
              {
                colwidth: "12",
                fieldwidth: "12",
                sizelabel: "2",
                sizefield: "10",
                fields: [
                  {
                    name: "flagAgensiBerkanun",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.statutoryAgency",
                    type: "switch",
                  },
                  {
                    name: "senaraiPeranan",
                    label: "uiElement.generalTabCrud.detailsOne.form.fields.selectRole",
                    type: "select-multiple",
                    isSearch: true,
                    refData: {
                      listWidth: 4,
                      selectAll: true,
                      name: "Peranan",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      scriptExclude: " '{{id}}' == '2ec1f331ac7894129d30a4783d026ff9' || '{{id}}' == '2ec1f331a12242c29d30a4783d026ff9' ",
                      url: process.env.VUE_API_URL_PENTADBIR + "/peranan?sortBy=keterangan&sortOrder=asc",
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      // Skema wizard stepper — langkah = fieldset sedia ada, dibahagikan
      // mengikut aliran borang. `fieldsets` setiap langkah dirender oleh
      // `GeneratedFormData` yang sama (lihat stepper.vue dalam @2enapps/ui).
      const [fsProfil, fsMaklumat, fsKatalaluan, fsPeranan] = schemaPlain.fieldSets;

      this.schemaForm = schemaPlain;
      this.stepperSchema = {
        pkField: "id",
        steps: [
          {
            title: "uiElement.generalTabCrud.detailsOne.stepper.steps.profile",
            icon: "fas fa-user",
            fieldsets: [fsProfil],
          },
          {
            title: "uiElement.generalTabCrud.detailsOne.stepper.steps.personal",
            icon: "fas fa-address-card",
            fieldsets: [fsMaklumat],
          },
          {
            title: "uiElement.generalTabCrud.detailsOne.stepper.steps.password",
            icon: "fas fa-key",
            fieldsets: [fsKatalaluan],
          },
          {
            title: "uiElement.generalTabCrud.detailsOne.stepper.steps.role",
            icon: "fas fa-user-shield",
            fieldsets: [fsPeranan],
          },
        ],
      };
    },
  },
};
</script>

<style></style>