<template>
  <div id="filter-simple">
    <div class="card pt-3 pe-3 ps-3 pb-0">
      <generated-form-data v-if="hasSearchSchema" :propSchema="schemaFormCarian" :propData="formCarianData"
        ref="searchForm" @formActions="formActions" @customValidator="customValidator"
        @formInputChange="formInputChange" />
    </div>
    <div class="chart-space">
      <BRow>
        <BCol lg="12">
          <sample-data-kpi-one :propFinalSearchData="finalSearchData" />
        </BCol>
        <BCol lg="6">
          <simple-pie :propFinalSearchData="finalSearchData" />
        </BCol>
        <BCol lg="6">
          <simple-bar :propFinalSearchData="finalSearchData" />
        </BCol>
        <BCol lg="6">
          <simple-column :propFinalSearchData="finalSearchData" />
        </BCol>
        <BCol lg="6">
          <simple-line :propFinalSearchData="finalSearchData" />
        </BCol>
        <BCol lg="12">
          <sample-title-one :propFinalSearchData="finalSearchData" />
        </BCol>
        <BCol lg="6">
          <simple-scatter :propFinalSearchData="finalSearchData" />
        </BCol>
        <BCol lg="6">
          <simple-area :propFinalSearchData="finalSearchData" />
        </BCol>
      </BRow>
    </div>
  </div>
</template>
<script>
import SimpleLine from "@/views/ui-element/dashboards/sample/simple-line.vue";
import SampleTitleOne from "@/views/ui-element/dashboards/sample/sample-title-one.vue";
import SampleDataKpiOne from "@/views/ui-element/dashboards/sample/sample-data-kpi-one.vue";
import SimplePie from "@/views/ui-element/dashboards/sample/simple-pie.vue";
import SimpleBar from "@/views/ui-element/dashboards/sample/simple-bar.vue";
import SimpleColumn from "@/views/ui-element/dashboards/sample/simple-column.vue";
import SimpleScatter from "@/views/ui-element/dashboards/sample/simple-scatter.vue";
import SimpleArea from "@/views/ui-element/dashboards/sample/simple-area.vue";
import { GeneratedFormData } from "@2enapps/ui";
import { standardValidation, dateCompareValidation, monthCompareValidation, intCompareValidation } from "@2enapps/ui";

import { getFirstDayOfYear, getLastDayOfYear, getFirstDayOfMonth, getLastDayOfMonth, getYearByDate, getYearByMonth, getMonthByDate, getFirstMonthOfYear, getLastMonthOfYear } from "@2enapps/ui";

import { getDataYearList } from "@/services/training/lookups";

import { notEmpty, setFormObjectBySchema, insideSchemaFieldsFA, isFieldUpdateFA } from "@2enapps/ui";
export default {
  name: "filter-simple",
  components: {
    GeneratedFormData,
    SimplePie,
    SimpleBar,
    SimpleColumn,
    SimpleLine,
    SimpleScatter,
    SimpleArea,
    SampleDataKpiOne,
    SampleTitleOne
  },
  data() {
    return {
      roleType: "",
      schemaFormCarian: {},
      formCarianData: setFormObjectBySchema(this.schemaFormCarian),
      finalSearchData: {},
      validateByField: '',
      listYear: getDataYearList((new Date().getFullYear()) - 20, new Date().getFullYear() + 10, true)
    };
  },
  async created() {
    this.finalSearchData = {
      tarikhMula: getFirstDayOfYear(new Date().getFullYear()),
      tarikhTamat: getLastDayOfYear(new Date().getFullYear()),
      jenisTempoh: 'tahun',
      bulanMula: getFirstMonthOfYear(new Date().getFullYear()),
      bulanTamat: getLastMonthOfYear(new Date().getFullYear()),
      tahunMula: new Date().getFullYear() - 10,
      tahunTamat: new Date().getFullYear(),
    }
    this.roleType = this.$route.params.roleType;
    await this.getSchemaFormCarian();
  },
  computed: {
    hasSearchSchema() {
      return Object.keys(this.schemaFormCarian).length > 0;
    },
  },
  methods: {
    notEmpty(obj) {
      return notEmpty(obj);
    },
    customValidator(field, self) {
      let errorMsg = standardValidation(field, self);
      if (errorMsg) {
        self.formErrors[field.name] = errorMsg;
      }

      intCompareValidation(
        self,
        "tahunMula",
        "tahunTamat",
        "Sila pastikan tahun mula tidak melebihi tahun tamat ; "
      );

      monthCompareValidation(
        self,
        "bulanMula",
        "bulanTamat",
        "Sila pastikan bulan mula tidak melebihi bulan tamat ; "
      );

      dateCompareValidation(
        self,
        "tarikhMula",
        "tarikhTamat",
        "Sila pastikan tarikh mula tidak melebihi tarikh tamat ; "
      );
    },
    searchData() {
      this.finalSearchData = {};
      this.$refs.searchForm.formSubmit();
      if (this.$refs.searchForm.formIsValid) {
        Object.assign(this.finalSearchData, this.$refs.searchForm.formData)
      }
    },
    async formActions(data) {
      data
      if (!data.formSchema?.fieldSets) return;
      insideSchemaFieldsFA(data.formSchema, (field) => {
        
        if (["tarikhMula", "tarikhTamat"].includes(field.name)
          && isFieldUpdateFA(data, "jenisTempoh")) {
          if (data.newFormData.jenisTempoh == 'tahun' || data.newFormData.jenisTempoh == 'bulan') {
            field["isHide"] = true;
          } else {
            field["isHide"] = false;
          }
        } else if (["bulanMula", "bulanTamat"].includes(field.name)
          && isFieldUpdateFA(data, "jenisTempoh")) {
          if (data.newFormData.jenisTempoh == 'hari' || data.newFormData.jenisTempoh == 'tahun') {
            field["isHide"] = true;
          } else {
            field["isHide"] = false;
          }
        } else if (["tahunMula", "tahunTamat"].includes(field.name)
          && isFieldUpdateFA(data, "jenisTempoh")) {
          if (data.newFormData.jenisTempoh == 'hari' || data.newFormData.jenisTempoh == 'bulan') {
            field["isHide"] = true;
          } else {
            field["isHide"] = false;
          }
        }
      });
    },
    formInputChange(field = null, event = null, data = null) {
      this.finalSearchData = {};
      event
      if (field.name == 'tarikhMula') {
        data['tarikhTamat'] = null;
        data['bulanTamat'] = null;
        data['tahunTamat'] = null;
        this.$refs.searchForm.validateByField = 'tarikhTamat'
        this.$refs.searchForm.formErrors["tarikhTamat"] = "Sila isi 'Tarikh Tamat'"
        data['bulanMula'] = data['tarikhMula'] ? getMonthByDate(data['tarikhMula']) : null
        data['tahunMula'] = data['tarikhMula'] ? getYearByDate(data['tarikhMula']) : null
      } else if (field.name == 'tarikhTamat') {
        data['bulanTamat'] = data['tarikhTamat'] ? getMonthByDate(data['tarikhTamat']) : null
        data['tahunTamat'] = data['tarikhTamat'] ? getYearByDate(data['tarikhTamat']) : null
      }
      else if (field.name == 'bulanMula') {
        data['bulanTamat'] = null;
        data['tarikhTamat'] = null;
        data['tahunTamat'] = null;
        this.$refs.searchForm.validateByField = 'bulanTamat'
        this.$refs.searchForm.formErrors["bulanTamat"] = "Sila isi 'Bulan Tamat'"
        data['tarikhMula'] = data['bulanMula'] ? getFirstDayOfMonth(data['bulanMula']) : null
        data['tahunMula'] = data['bulanMula'] ? getYearByMonth(data['bulanMula']) : null
      } else if (field.name == 'bulanTamat') {
        data['tarikhTamat'] = data['bulanTamat'] ? getLastDayOfMonth(data['bulanTamat']) : null
        data['tahunTamat'] = data['bulanTamat'] ? getYearByMonth(data['bulanTamat']) : null
      }
      else if (field.name == 'tahunMula') {
        data['bulanTamat'] = null;
        data['tarikhTamat'] = null;
        data['tahunTamat'] = null;
        this.$refs.searchForm.validateByField = 'tahunTamat'
        this.$refs.searchForm.formErrors["tahunTamat"] = "Sila isi 'Tahun Tamat'"
        data['tarikhMula'] = data['tahunMula'] ? getFirstDayOfYear(data['tahunMula']) : null
        data['bulanMula'] = data['tahunMula'] ? getFirstMonthOfYear(data['tahunMula']) : null
      } else if (field.name == 'tahunTamat') {
        data['tarikhTamat'] = data['tahunTamat'] ? getLastDayOfYear(data['tahunTamat']) : null
        data['bulanTamat'] = data['tahunTamat'] ? getLastMonthOfYear(data['tahunTamat']) : null
      }
      this.$nextTick(() => {
        if (data['tarikhTamat'] && data['tarikhMula']) {
          this.searchData()
        }
      })
    },
    getSchemaFormCarian() {
      this.schemaFormCarian = {
        title: "",
        pkField: "id",
        fieldSets: [
          {
            legend: "",
            name: "carian",
            colGroups: [
              {
                colwidth: "12", //1-12
                fieldwidth: "4", //1-12
                fields: [
                  {
                    name: "jenisTempoh",
                    label: "Jenis Tempoh",
                    type: "select-search",
                    //viewOnly: true,
                    defaultValue: this.finalSearchData.jenisTempoh,
                    validate: {
                      required: true,
                    },
                    refData: {
                      name: "jenisTempoh",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      url: "/jenis-tempoh-dashboard"
                    },
                  },

                  {
                    name: "bulanMula",
                    label: "Bulan Mula",
                    type: "month",
                    defaultValue: this.finalSearchData.bulanMula,
                    validate: {
                      required: true,
                    },
                    //max: getCurrentDate()
                  },

                  {
                    name: "bulanTamat",
                    label: "Bulan Tamat",
                    type: "month",
                    defaultValue: this.finalSearchData.bulanTamat,
                    validate: {
                      required: true,
                    },
                    //max: getCurrentDate()
                  },

                  {
                    name: "tahunMula",
                    label: "Tahun Mula",
                    type: "select-search",
                    defaultValue: this.finalSearchData.tahunMula,
                    validate: {
                      required: true,
                    },
                    refData: {
                      name: "tahunMula",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      listData: this.listYear,
                    },
                  },

                  {
                    name: "tahunTamat",
                    label: "Tahun Tamat",
                    type: "select-search",
                    defaultValue: this.finalSearchData.tahunTamat,
                    validate: {
                      required: true,
                    },
                    refData: {
                      name: "tahunTamat",
                      keyColumn: "id",
                      labelColumn: "keterangan",
                      listData: this.listYear,
                    },
                  },

                  {
                    name: "tarikhMula",
                    label: "Tarikh Mula",
                    type: "date",
                    defaultValue: this.finalSearchData.tarikhMula,
                    //max: getCurrentDate(),
                    validate: {
                      required: true,
                    },
                  },

                  {
                    name: "tarikhTamat",
                    label: "Tarikh Tamat",
                    type: "date",
                    defaultValue: this.finalSearchData.tarikhTamat,
                    //max: getCurrentDate(),
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
  }

}
</script>

<style scoped>
.card-body {
  padding: 3px;
  min-height: 30px;
}

.row {
  --bs-gutter-x: 1rem;
}

.card {
  margin-bottom: 1rem;
}
</style>