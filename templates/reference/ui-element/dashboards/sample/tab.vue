<template>
  <div class="module-view">
    <PageHeader title="Sample Dashboard" pageTitle="Sample Dashboard" />

    <div id="tab">
      <BTabs v-model="activeIndex" justified nav-class="nav-tabs-custom" content-class="p-1 text-muted">
        <BTab>
          <template #title>
            <span class="d-inline-block d-sm-none">Simple Chart</span>
            <span class="d-none d-sm-inline-block">Simple Chart</span>
          </template>
          <filter-simple :propId="id" :viewMode="formDataViewMode" ref="detailsOne" v-if="isActive('tab-one')"
            @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType" @refreshList="refreshList" />
        </BTab>
        <BTab>
          <template v-slot:title>
            <span class="d-inline-block d-sm-none">
              <i class="far fa-user"></i>
            </span>
            <span class="d-inline-block d-sm-none">Multiple Series</span>
            <span class="d-none d-sm-inline-block">Multiple Series</span>
          </template>
          <filter-multiple-series :propId="id" :viewMode="formDataViewMode" ref="detailsTwo" v-if="isActive('tab-two')"
            @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType" @refreshList="refreshList" />
        </BTab>
        <BTab>
          <template v-slot:title>
            <span class="d-inline-block d-sm-none">
              <i class="far fa-user"></i>
            </span>
            <span class="d-inline-block d-sm-none">Drilldown Chart</span>
            <span class="d-none d-sm-inline-block">Drilldown Chart</span>
          </template>
          <filter-drilldown :propId="id" :viewMode="formDataViewMode" ref="detailsThree" v-if="isActive('tab-three')"
            @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType" @refreshList="refreshList" />
        </BTab>
        <BTab>
          <template v-slot:title>
            <span class="d-inline-block d-sm-none">
              <i class="far fa-user"></i>
            </span>
            <span class="d-inline-block d-sm-none">Drilldown Multiple Series</span>
            <span class="d-none d-sm-inline-block">Drilldown Multiple Series</span>
          </template>
          <filter-drilldown-multiple-series :propId="id" :viewMode="formDataViewMode" ref="detailsFour" v-if="isActive('tab-four')"
            @backToList="backToList" :propViewsType="viewsType" :propRoleType="roleType" @refreshList="refreshList" />
        </BTab>




      </BTabs>
    </div>
  </div>
</template>

<script>


import FilterSimple from "@/views/ui-element/dashboards/sample/filter-simple.vue";
import FilterMultipleSeries from "@/views/ui-element/dashboards/sample/filter-multiple-series.vue";
import FilterDrilldown from "@/views/ui-element/dashboards/sample/filter-drilldown.vue";
import FilterDrilldownMultipleSeries from "@/views/ui-element/dashboards/sample/filter-drilldown-multiple-series.vue";
/* import Layout from "@/layouts/main.vue"; */
import { PageHeader } from "@2enapps/ui";


export default {
  name: "tab",
  props: {
    propId: {
      type: String,
      default: function () {
        return "";
      },
    },
    propFormDataViewMode: {
      type: String,
      default: function () {
        return "";
      },
    },
    propViewsType: String,
    propRoleType: String,
  },
  components: {
    PageHeader,
    FilterSimple,
    FilterMultipleSeries,
    FilterDrilldown,
    FilterDrilldownMultipleSeries
  },
  data() {
    return {
      formDataViewMode: "",
      viewsType: "",
      roleType: "",
      dataPengguna: {},
      activeIndex: 0,
      selectedTab: 'tab-one',
    };
  },
  created() {
    this.id = this.propId;
    this.formDataViewMode = this.propFormDataViewMode;
    this.viewsType = this.propViewsType;
    this.roleType = this.propRoleType;


    this.syncFromName();
  },
  computed: {
    tabList() {
      const list = ['tab-one'];
      list.push('tab-two');
      list.push('tab-three');
      list.push('tab-four');

      return list;
    },
  },
  watch: {
    tabList(newList, oldList) {
      oldList
      const idx = newList.indexOf(this.selectedTab);
      if (idx !== -1) {
        this.activeIndex = idx;
      } else {
        this.activeIndex = 0;
        this.selectedTab = newList[0] || 'tab-one';
      }
    },
    activeIndex(newIdx) {
      const name = this.tabList[newIdx];
      if (name) this.selectedTab = name;
    },
    selectedTab() {
      this.syncFromName();
    },
  },
  methods: {
    goTo(name) {
      const idx = this.tabList.indexOf(name);
      if (idx !== -1) this.activeIndex = idx;
    },
    isActive(name) {
      return this.tabList[this.activeIndex] === name;
    },

    syncFromName() {
      const idx = this.tabList.indexOf(this.selectedTab);
      this.activeIndex = idx === -1 ? 0 : idx;
    },

    // your existing methods
    getDataPengguna(data) {
      this.dataPengguna = data;
    },
    refreshList() { this.$emit('refreshList'); },
    backToList() { this.$emit('backToList'); },
    setId(id) { this.id = id; },
  },
};
</script>