<template>
  <div id="drilldown-area">
    <BCard>
      <form-chart :propChartOptions="chartOptions" :propShowLoading="!isLoad" />
    </BCard>
  </div>

</template>

<script>
import { FormChart } from "@2enapps/ui";
import { getDataDrilldownChart } from "@/services/training/dashboard";
import { errorSwal } from "@2enapps/ui";
//import { calculatePercentage } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { getColorScheme, setColor } from "@2enapps/ui";
export default {
  name: "drilldown-area",
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
      colors: getColorScheme('dark'),
      chartOptions: {
        viewDataSetting: this.getViewDataSetup(),
        chart: {
          id: "drilldown-area",
          type: 'area',
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
          text: 'Chart column',
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
      getDataDrilldownChart(params, this.finalSearchData, this.chartOptions.chart.id).then((finalRes) => {
        if (finalRes) {
          this.chartOptions['title']['text'] = '<span class="fs-6" >' + (finalRes['titleProp'] ? finalRes['titleProp']['title'] : this.chartOptions['title']['text']) + '</span>'
          this.chartOptions['viewDataSetting']['title'] = (finalRes['titleProp'] ? finalRes['titleProp']['title'] : this.chartOptions['title']['text'])
          let self = this;
          finalRes.list = finalRes.list.map(function (obj, index) {
            index
            obj["name"] = obj["item"];
            obj["y"] = obj["jumlah"]
            obj["drilldown"] = obj["id"];
            setColor(self.colors, obj, index)
            return obj;
          });
          this.chartOptions['drilldown']['series'] = this.drillSetting(finalRes.list)
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
      let drilldownList = []
      let self = this;
      mainList.map(function (obj, index) {
        index
        let drillObj = {}
        drillObj['name'] = obj['name']
        drillObj['id'] = obj['id']
        drillObj['data'] = []
        drillObj['data'].push({
          name: 'SUBITEM ONE',
          y: obj['subitemOne']
        })
        drillObj['data'].push({
          name: 'SUBITEM TWO',
          y: obj['subitemTwo']
        })
        drillObj['data'].push({
          name: 'SUBITEM THREE',
          y: obj['subitemThree']
        })
        drillObj['data'].push({
          name: 'SUBITEM FOUR',
          y: obj['subitemFour']
        })
        drillObj['data'] = drillObj['data'].map(function (objDrillList, indexDrillList) {
          if (self.colors.itemColors) {
            objDrillList["color"] = self.colors.itemColors[indexDrillList % self.colors.itemColors.length];
          }
          return objDrillList;
        });
        drilldownList.push(drillObj)
      })
      return drilldownList
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
              label: "SUBITEM ONE",
              align: "center",
              isSort: true,
              columnSort: "subitemOne",
            },
            {
              label: "SUBITEM TWO",
              align: "center",
              isSort: true,
              columnSort: "subitemTwo",
            },
            {
              label: "SUBITEM THREE",
              align: "center",
              isSort: true,
              columnSort: "subitemThree",
            },
            {
              label: "SUBITEM FOUR",
              align: "center",
              isSort: true,
              columnSort: "subitemFour",
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
          },
          {
            name: "subitemOne",
            align: "center",
          },
          {
            name: "subitemTwo",
            align: "center",
          },
          {
            name: "subitemThree",
            align: "center",
          },
          {
            name: "subitemFour",
            align: "center",
          },
          {
            name: "jumlah",
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
