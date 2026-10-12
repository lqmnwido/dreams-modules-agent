<template>
  <div id="simple-bar">
    <BCard>
      <form-chart :propChartOptions="chartOptions" :propShowLoading="!isLoad" />
    </BCard>
  </div>

</template>

<script>
import { FormChart } from "@2enapps/ui";
import { getDataSimpleChart } from "@/services/training/dashboard";
import { errorSwal } from "@2enapps/ui";
//import { calculatePercentage } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { getColorScheme, setColor } from "@2enapps/ui";
export default {
  name: "simple-bar",
  components: {
    FormChart
  },
  props: {
    propFinalSearchData: String,
  },
  data() {
    return {
      roleType: "",
      isLoad: true,
      finalSearchData: {},
      currentlySlicedPoint: null,
      // colors: null,
      colors: getColorScheme('combinecolor7'),
      chartOptions: {
        viewDataSetting: this.getViewDataSetup(),
        chart: {
          id: "simple-bar",
          type: 'bar',
          height: 0,
          options3d: {
            enabled: false,
          },
          events: {
            load: function () {
              this.chart = this;
            }
          }
        },
        title: {
          text: 'Chart Bar',
          useHTML: true,
          align: 'center',
          style: {
            fontSize: '15px'
          }
        },
        xAxis: {
          type: 'category',
          title: {
            text: '',
            align: 'middle'
          },
          //crosshair: true,
          gridLineWidth: 1,
          lineWidth: 0,

        },
        yAxis: {
          allowDecimals: false,
          min: null,
          title: {
            text: 'Jumlah',
            align: 'middle'
          },
        },
        subtitle: {
          text: 'Sub Title',
          align: 'center'
        },
        tooltip: {
          headerFormat: '<span style="color: {point.color}"><b>{point.key}</b></span><br>',
          pointFormat: '{point.y}'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
              enabled: true,
              formatter: function () {
                const point = this.point;
                return '<span >' +
                  point.name + '<br>(' + (point.percentage).toFixed(2) + '%' + ')</span>';
              }
            },
          },
          column: {
            stacking: '',
          },
          bar: {
            stacking: '',
          },
          
        },
        series: [{
          name: 'Jumlah',
          data: []
        }],
        drilldown: {
          series: []
        }
      }
    };
  },
  async created() {
    this.roleType = this.propRoleType;
    this.finalSearchData = this.propFinalSearchData
  },
  watch: {
    propFinalSearchData: {
      handler(newData) {
        this.finalSearchData = newData
        if (newData['tarikhMula'] && newData['tarikhTamat']) {
          this.getList()
        } else {
          this.isLoad = false;
        }
      },
      immediate: true,
      //deep: true,
    },
  },
  methods: {
    notEmpty(obj) {
      return notEmpty(obj);
    },
    getList() {
      let params = "";
      if (this.finalSearchData && this.finalSearchData.tarikhMula && this.finalSearchData.tarikhTamat) {
        params = `?tarikhMula=${this.finalSearchData.tarikhMula}&tarikhTamat=${this.finalSearchData.tarikhTamat}`;
      }
      this.isLoad = false;
      getDataSimpleChart(params, this.finalSearchData, this.chartOptions.chart.id).then((finalRes) => {
        if (finalRes) {
          this.chartOptions['title']['text'] = '<span class="fs-6" >' + (finalRes['titleProp'] ? finalRes['titleProp']['title'] : this.chartOptions['title']['text']) + '</span>'
          this.chartOptions['viewDataSetting']['title'] = (finalRes['titleProp'] ? finalRes['titleProp']['title'] : this.chartOptions['title']['text'])
          let self = this;
          finalRes.list = finalRes.list.map(function (obj, index) {
            index
            obj["name"] = obj["item"];
            obj["y"] = obj["jumlah"]
            setColor(self.colors, obj, index)
            return obj;
          });
          this.chartOptions['series'][0]['color'] = self.colors.itemColors[0]
          this.chartOptions['series'][0]['data'] = finalRes.list
          this.chartOptions['viewDataSetting']['data'] = finalRes.list
          this.chartOptions['viewDataSetting']['dataFooter'] = finalRes['data']['dataFooter']
        }
        this.isLoad = true;
      }).catch((error) => {
        this.isLoad = true;
        errorSwal('Ralat', error);
      });
    },
    drillSetting(mainList) {
      mainList
      return []
    },
    onPointClick(event) {
      event
    },

    getViewDataSetup() {
      return {
        size: 'md',
        pkField: "id",
        orientation: "p",
        fontSize: 7,
        title: "Laporan",
        headerMargin: 25,
        showPageFooter: true,
        autoDownload: false,
        autoPrint: false,
        fileName: "simple pie",
        hideBil: true,
        usePagination: false,
        customHeaders: [
          [
            {
              label: "ITEM",
              align: "left",
              isSort: true,
              columnSort: "item",
            },
            {
              label: "JUMLAH",
              align: "center",
              isSort: true,
              columnSort: "jumlah",
            },

          ],
        ],
        listColumns: [
          {
            name: "item",
            align: "left",
            width: "30",
          },
          {
            name: "jumlah",
            width: "30",
            align: "center",
          },
        ],
        data: [],
        dataFooter: []
      }
    }
  },



};
</script>
<style scoped>
.card {
  margin-bottom: 1rem;
}
</style>
