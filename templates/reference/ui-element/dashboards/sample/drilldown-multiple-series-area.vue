<template>
  <div id="drilldown-multiple-series-area">
    <BCard>
      <form-chart :propChartOptions="chartOptions" :propShowLoading="!isLoad" />
    </BCard>
  </div>
</template>

<script>
import { FormChart } from "@2enapps/ui";
import { getDataDrilldownMultipleSeriesChart } from "@/services/training/dashboard";
import { errorSwal } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { getColorScheme, setColor } from "@2enapps/ui";
export default {
  name: "drilldown-multiple-series-area",
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
      colorsSeriesOne: getColorScheme('dark'),
      colorsSeriesTwo: getColorScheme('pink'),
      colorsSeriesThree: getColorScheme('green'),
      colorsSeriesFour: getColorScheme('blue'),
      chartOptions: {
        viewDataSetting: this.getViewDataSetup(),
        chart: {
          id: "drilldown-multiple-series-area",
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
          name: 'Sub Sub Item 1',
          data: [
          ]
        },
        {
          name: 'Sub Sub Item 2',
          data: [
          ]
        },
        {
          name: 'Sub Sub Item 3',
          data: [
          ]
        },
        {
          name: 'Sub Sub Item 4',
          data: [
          ]
        },],
        drilldown: {
          series: [
            {
              name: 'Sub Sub Item 1',
              data: [
              ]
            },
            {
              name: 'Sub Sub Item 2',
              data: [
              ]
            },
            {
              name: 'Sub Sub Item 3',
              data: [
              ]
            },
            {
              name: 'Sub Sub Item 4',
              data: [
              ]
            },
          ]
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
      getDataDrilldownMultipleSeriesChart(params, this.finalSearchData, this.chartOptions.chart.id).then((finalRes) => {
        if (finalRes) {
          let listSeriesOne = [];
          let listSeriesTwo = [];
          let listSeriesThree = [];
          let listSeriesFour = [];
          this.chartOptions['title']['text'] = '<span class="fs-6" >' + (finalRes['titleProp'] ? finalRes['titleProp']['title'] : this.chartOptions['title']['text']) + '</span>'
          this.chartOptions['viewDataSetting']['title'] = (finalRes['titleProp'] ? finalRes['titleProp']['title'] : this.chartOptions['title']['text'])
          let self = this;
          if (finalRes.firstLayerData) {

            finalRes.firstLayerData = finalRes.firstLayerData.map(function (obj, index) {
              obj["name"] = obj["item"];
              obj["y"] = obj["jumlah"]

              let objSeriesOne = JSON.parse(JSON.stringify(obj));
              let objSeriesTwo = JSON.parse(JSON.stringify(obj));
              let objSeriesThree = JSON.parse(JSON.stringify(obj));
              let objSeriesFour = JSON.parse(JSON.stringify(obj));

              objSeriesOne["y"] = obj["subSubItemOne"]
              objSeriesTwo["y"] = obj["subSubItemTwo"]
              objSeriesThree["y"] = obj["subSubItemThree"]
              objSeriesFour["y"] = obj["subSubItemFour"]


              objSeriesOne["drilldown"] = obj["name"] + 'subSubItemOne';
              objSeriesTwo["drilldown"] = obj["name"] + 'subSubItemTwo';
              objSeriesThree["drilldown"] = obj["name"] + 'subSubItemThree';
              objSeriesFour["drilldown"] = obj["name"] + 'subSubItemFour';


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

          }
          this.chartOptions['series'][0]['data'] = listSeriesOne
          this.chartOptions['series'][1]['data'] = listSeriesTwo
          this.chartOptions['series'][2]['data'] = listSeriesThree
          this.chartOptions['series'][3]['data'] = listSeriesFour
          this.chartOptions['series'][0]['color'] = this.colorsSeriesOne?.mapColor ? this.colorsSeriesOne.mapColor.medium : ''
          this.chartOptions['series'][1]['color'] = this.colorsSeriesTwo?.mapColor ? this.colorsSeriesTwo.mapColor.medium : ''
          this.chartOptions['series'][2]['color'] = this.colorsSeriesThree?.mapColor ? this.colorsSeriesThree.mapColor.medium : ''
          this.chartOptions['series'][3]['color'] = this.colorsSeriesFour?.mapColor ? this.colorsSeriesFour.mapColor.medium : ''

          this.chartOptions['drilldown']['series'] =
            [...this.drillSetting(finalRes.firstLayerData, this.colorsSeriesOne, finalRes.list, 'subSubItemOne')
              , ...this.drillSetting(finalRes.firstLayerData, this.colorsSeriesTwo, finalRes.list, 'subSubItemTwo')
              , ...this.drillSetting(finalRes.firstLayerData, this.colorsSeriesThree, finalRes.list, 'subSubItemThree')
              , ...this.drillSetting(finalRes.firstLayerData, this.colorsSeriesFour, finalRes.list, 'subSubItemFour')];

          this.chartOptions['viewDataSetting']['data'] = finalRes['data']['listLayer']
          this.chartOptions['viewDataSetting']['dataFooter'] = finalRes['data']['dataFooter']
        }
        this.isLoad = true;
      })
        .catch((error) => {
          this.isLoad = true;
          errorSwal('Ralat', error);
        });
    },
    drillSetting(mainList, colorsSeries = null, allList = [], seriesName = '') {
      let drilldownList = []
      mainList.map(function (obj, index) {
        index
        let drillObj = {}
        drillObj['name'] = obj['name'] + seriesName
        if (seriesName == "subSubItemOne") {
          drillObj['name'] = "Sub Sub Itewm 1"
        } else if (seriesName == "subSubItemTwo") {
          drillObj['name'] = "Sub Sub Itewm 2"
        } else if (seriesName == "subSubItemThree") {
          drillObj['name'] = "Sub Sub Itewm 3"
        } else if (seriesName == "subSubItemFour") {
          drillObj['name'] = "Sub Sub Itewm 4"
        }
        drillObj['id'] = obj['name'] + seriesName
        drillObj['data'] = []
        allList.map(function (objAllList, indexAllList) {
          indexAllList
          if (objAllList['item'] + seriesName == obj['name'] + seriesName) {
            let setObj = {
              name: objAllList['subItem'],
              y: objAllList[seriesName],
            }
            setColor(colorsSeries, setObj, indexAllList)
            drillObj['data'].push(setObj)
          }
        })
        drilldownList.push(drillObj)
      })
      return drilldownList
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
              label: "SUB ITEM",
              align: "left",
              isSort: true,
              columnSort: "subItem",
            },
            {
              label: "SUB SUB ITEM ONE",
              align: "center",
              isSort: true,
              columnSort: "subSubItemOne",
            },
            {
              label: "SUB SUB ITEM TWO",
              align: "center",
              isSort: true,
              columnSort: "subSubItemTwo",
            },
            {
              label: "SUB SUb ITEM THREE",
              align: "center",
              isSort: true,
              columnSort: "subSubItemThree",
            },
            {
              label: "SUB SUB ITEM FOUR",
              align: "center",
              isSort: true,
              columnSort: "subSubItemFour",
            },
            {
              label: "JUMLAH",
              align: "center",
              isSort: true,
              columnSort: "jumlah",
            },

          ],
        ],
        customFooters:
          [[
            { label: "JUMLAH", name: "item", align: "left", colSpan: 2 },
            { label: "", name: "subSubItemOne", align: "center" },
            { label: "", name: "subSubItemTwo", align: "center" },
            { label: "", name: "subSubItemThree", align: "center" },
            { label: "", name: "subSubItemFour", align: "center" },
            { label: "", name: "jumlah", align: "center" },
          ]],
        listColumns: [
          {
            name: "item",
            align: "left",
          },
          {
            name: "subItem",
            align: "left",
          },
          {
            name: "subSubItemOne",
            align: "center",
          },
          {
            name: "subSubItemTwo",
            align: "center",
          },
          {
            name: "subSubItemThree",
            align: "center",
          },
          {
            name: "subSubItemFour",
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
