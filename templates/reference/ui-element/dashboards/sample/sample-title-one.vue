<template>
  <div id="sample-title-one">
    <form-chart :propChartOptions="chartOptions" @clickData="selectValue" :propShowLoading="!isLoad" />
  </div>
</template>

<script>
import { FormChart } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
export default {
  name: "sample-title-one",
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
          id: "sample-title-one",
          type: 'title',
        },
        size: 6,
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
    this.chartOptions['data'] = this.getDefaultData(this.propTypeContent)

  },
  watch: {
    propFinalSearchData: {
      handler(newData) {
        this.finalSearchData = newData
        this.isLoad = false;
        this.chartOptions['data'] = this.getDefaultData(this.propTypeContent)
      },
      immediate: true,
    },
  },
  methods: {
    getDefaultData() {
      return [
        {
          id: '1',
          cardClass: 'bg-warning',
          title: 'SAMPLE TAJUK A',
          titleClass: 'text-dark h4 ',
        },
        {
          id: '2',
          cardClass: 'bg-primary',
          title: 'SAMPLE TAJUK B',
          titleClass: 'text-light h4 ',
        },
      ]
    },
    notEmpty(obj) {
      return notEmpty(obj);
    },
    selectValue(data) {
      data
    },
    onPointClick(event) {
      event
    },
  }
};
</script>