<template>
  <div class="module-view">
    <PageHeader title="Sample Laporan" pageTitle="Sample Component" />
    <div id="senarai-jenis-laporan">
      <div v-if="idLaporan">
        <laporan-open-templete :propMenuLaporan="schemaDataReport" ref="laporan-open-templete" class="mt-2"
          @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType"
          v-if="idLaporan == 'laporanOpenTemplete'" />
        <laporan-open-custom-templete :propMenuLaporan="schemaDataReport" ref="laporan-open-custom-templete"
          class="mt-2" @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType"
          v-else-if="idLaporan == 'laporanOpenCustomTemplete'" />
        <laporan-with-carian :propMenuLaporan="schemaDataReport" ref="laporan-with-carian" class="mt-2"
          @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType"
          v-else-if="idLaporan == 'laporanWithCarian'" />
        <laporan-without-carian :propMenuLaporan="schemaDataReport" ref="laporan-without-carian" class="mt-2"
          @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType"
          v-else-if="idLaporan == 'laporanWitoutCarian'" />
        <laporan-statistik-with-hyperlink :propMenuLaporan="schemaDataReport" ref="laporan-statistik-with-hyperlink"
          class="mt-2" @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType"
          v-else-if="idLaporan == 'laporanWithHyperlink'" />
        <laporan-with-extra-custom-header :propMenuLaporan="schemaDataReport" ref="laporan-with-extra-custom-header"
          class="mt-2" @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType"
          v-else-if="idLaporan == 'laporanWithExtraHeader'" />
        <laporan-with-json-layer :propMenuLaporan="schemaDataReport" ref="laporan-with-json-layer" class="mt-2"
          @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType"
          v-else-if="idLaporan == 'laporanWithJsonLayer'" />
        <senarai-data-laporan v-else :propSchemaDataReport="schemaDataReport" ref="senaraiDataLaporan" class="mt-2"
          @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType" />
      </div>
      <div v-show="!idLaporan">
        <BCard class="mb-2">
          <BCardTitle>Carian</BCardTitle>
          <BCardBody>
            <generated-form-data v-if="Object.keys(schemaFormCarian).length" :propSchema="schemaFormCarian"
              :propData="formCarianData" ref="searchForm" @formActions="formActions"
              @customValidator="customValidator" />
            <div class="text-center">
              <button class="btn btn-primary me-1" @click="searchList">Carian</button>
              <button class="btn btn-warning me-1" @click="resetSearch">
                Set Semula
              </button>
            </div>
          </BCardBody>
        </BCard>
        <BCard class="mb-2">
          <BCardTitle>Senarai Jenis Laporan</BCardTitle>
          <BCardBody>
            <generated-form-list-data ref="lisRefData" :backendPaginated="backendPaginated" :setUsePagination="false"
              :listData="referenceTablesShow" :listSchema="schemaList" :totalRecord="totalRecord"
              @paginatedProps="paginatedProps" @listActions="listActions"
                :propListDataReport="listDataReport"
                @getListForReport="getListForReport"
              />
          </BCardBody>
        </BCard>
      </div>
    </div>
  </div>
</template>

<script>
import ListLaporan from "@/views/ui-element/laporan/list-laporan";
import { GeneratedFormListData } from "@2enapps/ui";
import { GeneratedFormData } from "@2enapps/ui";
/* import Layout from "@/layouts/main.vue"; */
import { PageHeader } from "@2enapps/ui";
import SenaraiDataLaporan from "@/views/ui-element/laporan/senarai-data-laporan.vue";
import LaporanOpenTemplete from "@/views/ui-element/laporan/laporan-open-templete.vue";
import LaporanWithCarian from "@/views/ui-element/laporan/laporan-with-carian.vue";
import LaporanWithoutCarian from "@/views/ui-element/laporan/laporan-without-carian.vue";
import LaporanStatistikWithHyperlink from "@/views/ui-element/laporan/laporan-statistik-with-hyperlink.vue";
import LaporanWithExtraCustomHeader from "@/views/ui-element/laporan/laporan-with-extra-custom-header.vue";
import LaporanWithJsonLayer from "@/views/ui-element/laporan/laporan-with-json-layer.vue";
import LaporanOpenCustomTemplete from "@/views/ui-element/laporan/laporan-open-custom-templete.vue";
import { useLayoutStore } from "@2enapps/ui";
const layoutStore = useLayoutStore();
import { notEmpty } from "@2enapps/ui";

export default {
  name: "senarai-pengurusan-kod",
  components: {
    GeneratedFormListData,
    GeneratedFormData,
    PageHeader,
    SenaraiDataLaporan,
    LaporanOpenTemplete,
    LaporanOpenCustomTemplete,
    LaporanWithCarian,
    LaporanWithoutCarian,
    LaporanStatistikWithHyperlink,
    LaporanWithExtraCustomHeader,
    LaporanWithJsonLayer
  },
  data() {
    return {
      isModalVisible: false,
      loadList: false,
      backendPaginated: false,
      formData: {},
      schemaFormCarian: {},
      paginationProps: {},
      schemaList: {},
      referenceTablesShow: [],
      referenceTables: [],
      selectedApi: "",
      idLaporan: "",
      totalRecord: 0,
      searchObject: {},
      schemaDataReport: {},

      listDataReport: {},
      listLaporanFinal: [],

      viewsType: "",
      roleType: "",

      isPrintSurat: false,
    };
  },
  async created() {
    this.viewsType = this.$route.params.viewsType;
    this.roleType = this.$route.params.roleType;
    this.listLaporanFinal = JSON.parse(JSON.stringify(ListLaporan));
    this.getSchemaFormCarian();
    await this.getSchemaList();
    if (!this.backendPaginated) {
      this.setupListData();
    }
  },

  mounted() { },
  computed: {
    //get priv
    priv() {
      return layoutStore.priv;
    },
  },
  methods: {
    notEmpty(obj) {
      return notEmpty(obj);
    },
    async setupListData() {
      if (!this.backendPaginated) {
        await this.getRefData(null);
      }
    },
    searchList() {
      this.$refs.searchForm.formSubmit();
      if (this.$refs.searchForm.formIsValid) {
        Object.assign(this.searchObject, this.$refs.searchForm.formData);
        this.refreshList();
      }
    },
    searchData() {
      let searchList = [];
      if (this.listLaporanFinal.data.length > 0) {
        this.listLaporanFinal.data.forEach((data) => {
          let check = true;
          Object.keys(this.searchObject).forEach((key) => {
            if (
              this.searchObject[key] &&
              data[key].toLowerCase().indexOf(this.searchObject[key].toLowerCase()) === -1
            ) {
              check = false;
            }
          });
          if (check) {
            searchList.push(data);
          }
        });
        this.$refs.lisRefData.paginationProps.dataList = [...searchList];
      }
    },
    refreshList() {
      if (this.backendPaginated) {
        this.$refs.listData.goToPage(1);
      } else {
        Object.assign(this.$refs.lisRefData.paginationProps, {
          search: { ...this.searchObject },
        });
        this.getRefData(this.$refs.lisRefData.paginationProps);
      }
    },
    resetSearch() {
      this.$refs.searchForm.formReset();
      this.searchObject = {};
      if (!this.backendPaginated) {
        this.setupListData();
      } else {
        this.refreshList();
      }
    },
    async paginatedProps(page) {
      Object.assign(page, {
        search: { ...this.searchObject },
      });
      if (this.backendPaginated) {
        if (page && page.startIndex > -1 && page.endIndex) {
          await this.getRefData(page);
        }
      }
    },

    getRefData(page) {
      if (!this.backendPaginated) {
        if (page && Object.keys(page.search).length > 0) {
          this.searchData();
          this.referenceTablesShow = [...this.$refs.lisRefData.paginationProps.dataList];
        } else {
          this.referenceTablesShow = [...this.listLaporanFinal.data];
        }
        this.referenceTablesShow = [
          ...this.referenceTablesShow.filter(function (obj) {
            return obj.inList;
          }),
        ];
      } else {
        let dataList = this.listLaporanFinal.data;
        this.totalRecord = dataList.length;
        dataList = [...dataList.slice(page.startIndex, page.endIndex)];
        this.referenceTablesShow = this.referenceTables = [...dataList];
      }
      this.tempSortIndex(page);
    },

    getListForReport(type) {
      this.listDataReport = {
        type,
        list: this.referenceTablesShow,
        listFooter: [],
        schemaDataReport: this.schemaList,
      };
    },

    listActions(actionList) {
      this.formDataViewMode = "";
      if (actionList.functionProps.functionName == "show") {
        this.selectedApi = actionList.data.apiName;

        this.idLaporan = actionList.data.id;
        this.schemaDataReport = {};
        if (this.idLaporan && this.listLaporanFinal) {
          var result = this.listLaporanFinal.data.find((obj) => {
            return obj.id === this.idLaporan;
          });
          this.schemaDataReport = result;
        }
      }
    },

    backToList() {
      this.selectedApi = "";
      this.idLaporan = "";
    },

    tempSortIndex(page) {
      if (page && page.sort) {
        const orderMultiplier = page.sort.sortOrder === "asc" ? 1 : -1;

        this.referenceTablesShow.sort(function (a, b) {
          var tA = a[page.sort.sortBy].toUpperCase();
          var tB = b[page.sort.sortBy].toUpperCase();
          if (tA < tB) {
            return -1 * orderMultiplier;
          }
          if (tA > tB) {
            return 1 * orderMultiplier;
          }
          return 0;
        });
      }
    },

    getSchemaFormCarian() {
      this.schemaFormCarian = {
        title: "",
        pkField: "id",
        fieldSets: [
          {
            legend: "",
            name: "maklumat",
            colGroups: [
              {
                colwidth: "12", //1-12
                fieldwidth: "6", //1-12
                fields: [
                  {
                    name: "title",
                    label: "Nama",
                    type: "text",
                  },
                ],
              },
            ],
          },
        ],
      };
    },

    getSchemaList() {
      this.schemaList = {
        title: "Senarai Jenis Laporan",
        key: "id",
        allowPrint: true,
        actionCols: [
          {
            name: "Tindakan",
            width: "150px",
            listFuntions: [
              {
                label: "Papar",
                type: "icon",
                icon: "fas fa-file-alt",
                cssClass: "text-primary font-size-16",
                functionName: "show",
              },
            ],
          },
        ],
        fields: [
          {
            name: "id",
            label: "ID",
            isHidden: true,
          },
          {
            name: "apiName",
            label: "apiName",
            isHidden: true,
          },
          {
            name: "title",
            label: "Nama",
            isSort: true,
          },
        ],
      };
    },
  },
};
</script>
