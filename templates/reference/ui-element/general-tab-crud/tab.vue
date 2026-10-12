<template>
  <div id="tab">
    <BTabs v-model="activeIndex" justified nav-class="nav-tabs-custom" content-class="p-1 text-muted">
      <!-- TAB 1 -->
      <BTab
        @click="changeTab('tab-one')"
        :class="['nav-link', (selectedTab == 'tab-one' ? 'active' : '')]"
      >
        <template #title>
          <span class="d-inline-block d-sm-none">
            {{ $t("uiElement.generalTabCrud.tab.tabs.tabOne.title") }}
          </span>
          <span class="d-none d-sm-inline-block">
            {{ $t("uiElement.generalTabCrud.tab.tabs.tabOne.title") }}
          </span>
        </template>

        <details-one
          :propId="id"
          :viewMode="formDataViewMode"
          ref="detailsOne"
          v-if="selectedTab == 'tab-one'"
          @backToList="backToList"
          :propViewsType="viewsType"
          :propRoleType="roleType"
          @refreshList="refreshList"
          @setId="setId"
          @dataPengguna="getDataPengguna"
          :fromTab="true"
        />
      </BTab>

      <!-- TAB 2 -->
      <BTab
        v-if="id"
        @click="changeTab('tab-two')"
        :class="['nav-link', (selectedTab == 'tab-two' ? 'active' : '')]"
      >
        <template #title>
          <span class="d-inline-block d-sm-none"><i class="far fa-user"></i></span>
          <span class="d-inline-block d-sm-none">
            {{ $t("uiElement.generalTabCrud.tab.tabs.tabTwo.title") }}
          </span>
          <span class="d-none d-sm-inline-block">
            {{ $t("uiElement.generalTabCrud.tab.tabs.tabTwo.title") }}
          </span>
        </template>

        <details-two
          :propId="id"
          :viewMode="formDataViewMode"
          ref="detailsTwo"
          v-if="selectedTab == 'tab-two'"
          @backToList="backToList"
          :propViewsType="viewsType"
          :propRoleType="roleType"
          @refreshList="refreshList"
        />

        <list-two
          :propId="id"
          :viewMode="formDataViewMode"
          ref="listTwo"
          v-if="selectedTab == 'tab-two'"
          @backToList="backToList"
          :propViewsType="viewsType"
          :propRoleType="roleType"
          @refreshList="refreshList"
        />
      </BTab>

      <!-- TAB 3 -->
      <BTab
        v-if="id"
        @click="changeTab('tab-three')"
        :class="['nav-link', (selectedTab == 'tab-three' ? 'active' : '')]"
      >
        <template #title>
          <span class="d-inline-block d-sm-none"><i class="far fa-user"></i></span>
          <span class="d-inline-block d-sm-none">
            {{ $t("uiElement.generalTabCrud.tab.tabs.tabThree.title") }}
          </span>
          <span class="d-none d-sm-inline-block">
            {{ $t("uiElement.generalTabCrud.tab.tabs.tabThree.title") }}
          </span>
        </template>

        <list-three
          :propId="id"
          :viewMode="formDataViewMode"
          ref="listThree"
          v-if="selectedTab == 'tab-three'"
          @backToList="backToList"
          :propViewsType="viewsType"
          :propRoleType="roleType"
          @refreshList="refreshList"
        />
      </BTab>

      <!-- TAB 4 -->
      <BTab
        v-if="id"
        @click="changeTab('tab-four')"
        :class="['nav-link', (selectedTab == 'tab-four' ? 'active' : '')]"
      >
        <template #title>
          <span class="d-inline-block d-sm-none"><i class="far fa-user"></i></span>
          <span class="d-inline-block d-sm-none">
            {{ $t("uiElement.generalTabCrud.tab.tabs.tabFour.title") }}
          </span>
          <span class="d-none d-sm-inline-block">
            {{ $t("uiElement.generalTabCrud.tab.tabs.tabFour.title") }}
          </span>
        </template>

        <list-four
          :propId="id"
          :viewMode="formDataViewMode"
          ref="listFour"
          v-if="selectedTab == 'tab-four'"
          @backToList="backToList"
          :propViewsType="viewsType"
          :propRoleType="roleType"
          @refreshList="refreshList"
        />

        <list-five
          :propId="id"
          :viewMode="formDataViewMode"
          ref="listFive"
          v-if="selectedTab == 'tab-four'"
          @backToList="backToList"
          :propViewsType="viewsType"
          :propRoleType="roleType"
          @refreshList="refreshList"
        />
      </BTab>
    </BTabs>
  </div>
</template>

<script>
import DetailsOne from "@/views/ui-element/general-tab-crud/details-one.vue";
import DetailsTwo from "@/views/ui-element/general-tab-crud/details-two.vue";
import ListThree from "@/views/ui-element/general-tab-crud/list-three.vue";
import ListTwo from "@/views/ui-element/general-tab-crud/list-two.vue";
import ListFour from "@/views/ui-element/general-tab-crud/list-four.vue";
import ListFive from "@/views/ui-element/general-tab-crud/list-five.vue";

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
    DetailsOne,
    DetailsTwo,
    ListThree,
    ListTwo,
    ListFour,
    ListFive,
  },
  data() {
    return {
      id: "",
      formDataViewMode: "",
      viewsType: "",
      roleType: "",
      dataPengguna: {},
      activeIndex: 0,
      selectedTab: "tab-one",
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
      const list = ["tab-one"];
      if (this.id) {
        list.push("tab-two");
        list.push("tab-three");
        list.push("tab-four");
      }
      return list;
    },
  },
  watch: {
    tabList(newList, oldList) {
      oldList;
      const idx = newList.indexOf(this.selectedTab);
      if (idx !== -1) {
        this.activeIndex = idx;
      } else {
        this.activeIndex = 0;
        this.selectedTab = newList[0] || "tab-one";
      }
    },
    activeIndex(newIdx) {
      const name = this.tabList[newIdx];
      if (name) this.selectedTab = name;
    },
    selectedTab() {
      this.syncFromName();
    },
    propId(newVal) {
      this.id = newVal;
    },
  },
  methods: {
    changeTab(tab) {
      this.selectedTab = tab;
    },
    syncFromName() {
      const idx = this.tabList.indexOf(this.selectedTab);
      this.activeIndex = idx === -1 ? 0 : idx;
    },
    getDataPengguna(data) {
      this.dataPengguna = data;
    },
    refreshList() {
      this.$emit("refreshList");
    },
    backToList() {
      this.$emit("backToList");
    },
    setId(id) {
      this.id = id;
    },
  },
};
</script>