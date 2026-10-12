<template>
  <div id="multi-series-bar">
    <BCard>
      <form-chart :propChartOptions="chartOptions" :propShowLoading="!isLoad" />
    </BCard>
  </div>

</template>

<script>
import { FormChart } from "@2enapps/ui";
import { getDataMultipleSeriesChart } from "@/services/training/dashboard";
import { errorSwal } from "@2enapps/ui";
//import { calculatePercentage } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { getColorScheme, setColor } from "@2enapps/ui";
export default {
  name: "multi-series-bar",
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
      colorsSeriesOne: getColorScheme('red'),
      colorsSeriesTwo: getColorScheme('purple'),
      colorsSeriesThree: getColorScheme('green'),
      colorsSeriesFour: getColorScheme('blue'),
      chartOptions: {
        viewDataSetting: this.getViewDataSetup(),
        chart: {
          id: "multi-series-bar",
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
            text: ''
          },
          //crosshair: true,
          gridLineWidth: 1,
          lineWidth: 0,

        },
        yAxis: {
          allowDecimals: false,
          min: null,
          title: {
            text: '',
            align: 'high'
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
                return '<span style="">' +
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
        series: [
          {
            name: 'Series One',
            data: [
            ]
          },
          {
            name: 'Series Two',
            data: [
            ]
          },
          {
            name: 'Series Three',
            data: [
            ]
          },
          {
            name: 'Series Four',
            data: [
            ]
          },

        ],
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
    // setColor(color, obj, index) {
    //   if (color.itemColors) {
    //     let colorSet = color.itemColors[index % color.itemColors.length];
    //     obj["color"] = colorSet;
    //   }
    // },
    getList() {
      let params = "";
      if (this.finalSearchData && this.finalSearchData.tarikhMula && this.finalSearchData.tarikhTamat) {
        params = `?tarikhMula=${this.finalSearchData.tarikhMula}&tarikhTamat=${this.finalSearchData.tarikhTamat}`;
      }
      this.isLoad = false;
      getDataMultipleSeriesChart(params, this.finalSearchData, this.chartOptions.chart.id).then((finalRes) => {
        if (finalRes) {
          let listSeriesOne = [];
          let listSeriesTwo = [];
          let listSeriesThree = [];
          let listSeriesFour = [];

          this.chartOptions['title']['text'] = '<span class="fs-6" >' + (finalRes['titleProp'] ? finalRes['titleProp']['title'] : this.chartOptions['title']['text']) + '</span>'
          this.chartOptions['viewDataSetting']['title'] = (finalRes['titleProp'] ? finalRes['titleProp']['title'] : this.chartOptions['title']['text'])
          let self = this;

          finalRes.list = finalRes.list.map(function (obj, index) {
            index
            obj["name"] = obj["item"];
            obj["y"] = obj["jumlah"]

            let objSeriesOne = JSON.parse(JSON.stringify(obj));
            let objSeriesTwo = JSON.parse(JSON.stringify(obj));
            let objSeriesThree = JSON.parse(JSON.stringify(obj));
            let objSeriesFour = JSON.parse(JSON.stringify(obj));

            objSeriesOne["y"] = obj["seriesOne"]
            objSeriesTwo["y"] = obj["seriesTwo"]
            objSeriesThree["y"] = obj["seriesThree"]
            objSeriesFour["y"] = obj["seriesFour"]

            setColor(self.colorsSeriesOne, objSeriesOne, index)
            setColor(self.colorsSeriesTwo, objSeriesTwo, index)
            setColor(self.colorsSeriesThree, objSeriesThree, index)
            setColor(self.colorsSeriesFour, objSeriesFour, index)

            listSeriesOne.push(objSeriesOne)
            listSeriesTwo.push(objSeriesTwo)
            listSeriesThree.push(objSeriesThree)
            listSeriesFour.push(objSeriesFour)
            return obj;
          });

          this.chartOptions['series'][0]['data'] = listSeriesOne
          this.chartOptions['series'][1]['data'] = listSeriesTwo
          this.chartOptions['series'][2]['data'] = listSeriesThree
          this.chartOptions['series'][3]['data'] = listSeriesFour
          this.chartOptions['series'][0]['color'] = this.colorsSeriesOne?.mapColor ? this.colorsSeriesOne.mapColor.medium : ''
          this.chartOptions['series'][1]['color'] = this.colorsSeriesTwo?.mapColor ? this.colorsSeriesTwo.mapColor.medium : ''
          this.chartOptions['series'][2]['color'] = this.colorsSeriesThree?.mapColor ? this.colorsSeriesThree.mapColor.medium : ''
          this.chartOptions['series'][3]['color'] = this.colorsSeriesFour?.mapColor ? this.colorsSeriesFour.mapColor.medium : ''

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
        size: 'lg',
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
              label: "SERIES ONE",
              align: "center",
              isSort: true,
              columnSort: "seriesOne",
            },
            {
              label: "SERIES TWO",
              align: "center",
              isSort: true,
              columnSort: "seriesTwo",
            },
            {
              label: "SERIES THREE",
              align: "center",
              isSort: true,
              columnSort: "seriesThree",
            },
            {
              label: "SERIES FOUR",
              align: "center",
              isSort: true,
              columnSort: "seriesFour",
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
            name: "seriesOne",
            align: "center",
            width: "30",
          },
          {
            name: "seriesTwo",
            align: "center",
            width: "30",
          },
          {
            name: "seriesThree",
            align: "center",
            width: "30",
          },
          {
            name: "seriesFour",
            align: "center",
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
