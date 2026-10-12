<template>
  <div id="sample-data-kpi-one">
    <form-chart :propChartOptions="chartOptions" @clickData="selectValue" :propShowLoading="!isLoad" />
  </div>
</template>

<script>
import { FormChart } from "@2enapps/ui";
import { getSampleDataKpiOne } from "@/services/training/dashboard";
// /* import { // convertMonthToMonthString, // getFirstDayOfYear, getLastDayOfYear // } from "@/components/functions/general.js"; */
import { notEmpty } from "@2enapps/ui";
import { errorSwal } from "@2enapps/ui";
export default {
  name: "sample-data-kpi-one",
  components: {
    FormChart
  },
  props: {
    propRoleType: String,
    propFinalSearchData: String,
    propTypeContent: String,
  },
  data() {
    return {
      roleType: "",
      isLoad: true,
      finalSearchData: {},

      chartOptions: {
        chart: {
          id: "sample-data-kpi-one",
          type: 'KPI',
        },
        size:3,
        align: 'text-center',
        emitter: true,
        data:
          []
      }

    };
  },
  async created() {
    this.roleType = this.propRoleType;
    this.finalSearchData = this.propFinalSearchData
    this.chartOptions['data'] = this.getDefaultData(this.propTypeContent, this.propFinalSearchData)
  },
  watch: {
    propFinalSearchData: {
      handler(newData) {
        this.finalSearchData = newData
        if (newData['tarikhMula'] && newData['tarikhTamat']) {
          this.chartOptions['data'] = this.getDefaultData(this.propTypeContent, newData)
          this.getList()
        } else {
          this.isLoad = false;
          this.chartOptions['data'] = this.getDefaultData(this.propTypeContent, newData)
        }
      },
      immediate: true,
    },
  },
  methods: {
    getDefaultData(typeContent, finalSearchData) {
      finalSearchData
      typeContent
      return [
        {
          id: '1',
          cardClass: 'bg-grey ',
          title: 'SAMPLE KPI A' + (finalSearchData.tahunMula ? ' PADA ' + finalSearchData.tahunMula : ''),
          titleClass: 'text-primary ',
          value: 0,
          valueClass: 'h1 text-primary',
        },
        {
          id: '2',
          cardClass: 'bg-grey ',
          title: 'SAMPLE KPI B' + (finalSearchData.tahunMula ? ' PADA ' + finalSearchData.tahunMula : ''),
          titleClass: 'text-success ',
          value: 0,
          valueClass: 'h1 text-success',
        },
        {
          id: '3',
          cardClass: 'bg-grey ',
          title: 'SAMPLE KPI B' + (finalSearchData.tahunMula ? ' PADA ' + finalSearchData.tahunMula : ''),
          titleClass: 'text-danger ',
          value: 0,
          valueClass: 'h1 text-danger',
        },
         {
          id: '4',
          cardClass: 'bg-grey ',
          title: 'SAMPLE KPI B' + (finalSearchData.tahunMula ? ' PADA ' + finalSearchData.tahunMula : ''),
          titleClass: 'text-dark ',
          value: 0,
          valueClass: 'h1 text-dark',
        },
      ]
    },
    notEmpty(obj) {
      return notEmpty(obj);
    },
    getList() {
      let params = "";
      if (this.finalSearchData && this.finalSearchData.tarikhMula && this.finalSearchData.tarikhTamat) {       
        params = `?tarikhMula=${this.finalSearchData.tarikhMula}&tarikhTamat=${this.finalSearchData.tarikhTamat}`;
      }
      this.isLoad = false;
      let self = this;
      getSampleDataKpiOne(params, this.propTypeContent).then((finalRes) => {
        if (finalRes && finalRes.list) {
          finalRes.list.map(function (obj) {
            if (self.chartOptions['data']) {
              const getObj = self.chartOptions['data'].find(item => item.id === obj["id"]);
              if (getObj) {
                getObj.value = obj["jumlah"]
                getObj.displayValue = obj["jumlah"]
              }
            }
          });
        }
        this.isLoad = true;
      }).catch((error) => {
        errorSwal('Ralat', error);
      });
    },
    selectValue(data) {
    data
    },
    onPointClick(event) {event
     
    },
  }
};
</script>
