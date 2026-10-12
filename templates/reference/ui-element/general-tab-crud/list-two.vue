<template>
  <div id="list-two">
    <div v-if="isModalVisible">
      <Modal
        :showModal="isModalVisible"
        @close="backToList"
        size="md"
        :title="$t('uiElement.generalTabCrud.listTwo.modal.title')"
      >
        <details-four
          :propId="id"
          :propIdParent="propIdParent"
          :viewMode="formDataViewMode"
          ref="detailsThree"
          @backToList="backToList"
          :propViewsType="viewsType"
          :propRoleType="roleType"
          @refreshList="refreshList"
        />
      </Modal>
    </div>

    <BCard class="mb-2">
      <AccordionList
        :title="$t('uiElement.generalTabCrud.listTwo.accordion.title')"
        :defaultHide="true"
        :offCard="false"
      >
        <global-search
          ref="globalSearch"
          @search="globalSearch"
          @reset="resetGlobalSearch"
          :propButtons="[
            {
              label: 'uiElement.generalTabCrud.listTwo.globalSearch.buttons.add',
              class: 'btn-success',
              emitFunction: 'add'
            }
          ]"
          @buttonTrigger="onAddClick"
        />

        <generated-form-list-data
          v-if="hasListSchema"
          ref="listData"
          :backendPaginated="true"
          :listData="list"
          :listSchema="schemaList"
          :totalRecord="totalRecord"
          :propListDataReport="listDataReport"
          @paginatedProps="paginatedProps"
          @listActions="listActions"
          :customDisplayField="true"
          @updateDisplayListField="updateDisplayListField"
          @listMultipleSelectActions="listMultipleSelectActions"
          @getListForReport="getListForReport"
        />
      </AccordionList>
    </BCard>
  </div>
</template>

<script>
import { GeneratedFormAccordionList as AccordionList } from "@2enapps/ui";
import { GeneratedFormListData } from "@2enapps/ui";
import { GeneratedFormModal as Modal } from "@2enapps/ui";
import DetailsFour from "@/views/ui-element/general-tab-crud/details-four.vue";
import { confirmSwal, errorSwal, privSwal } from "@2enapps/ui";
import { assignSchemaToListData } from "@2enapps/ui";
import { getParams } from "@2enapps/ui";
import { standardValidation } from "@2enapps/ui";
import { GeneratedFormGlobalSearch as GlobalSearch } from "@2enapps/ui";
import { getListTwo, deleteRecord } from "@/services/training/crud";
import { useLayoutStore, useNotificationStore } from "@2enapps/ui";

const layoutStore = useLayoutStore();
const notificationStore = useNotificationStore();

export default {
  name: "list-two",
  components: {
    GeneratedFormListData,
    DetailsFour,
    GlobalSearch,
    Modal,
    AccordionList,
  },
  props: {
    propIdParent: String,
    viewMode: String,
    propViewsType: String,
    propRoleType: String,
  },
  data() {
    return {
      id: "",
      isModalVisible: false,
      formDataViewMode: "",
      searchObject: {},
      schemaList: {},
      schemaFormCarian: {},
      list: [],
      totalRecord: 0,
      formCarianData: {},
      listDataReport: {},
      viewsType: "",
      roleType: "",
      qSearch: "",
    };
  },
  async created() {
    this.viewsType = this.$route.params.viewsType || "";
    this.roleType = this.$route.params.roleType || "";
    this.getSchemaList();
    this.getSchemaFormCarian();
  },
  computed: {
    priv() {
      return layoutStore.priv;
    },
    notificationProp: {
      get() {
        return notificationStore.notificationProp;
      },
      set(value) {
        notificationStore.changeNotificationProp(value);
      },
    },
    hasSearchSchema() {
      return Object.keys(this.schemaFormCarian).length > 0;
    },
    hasListSchema() {
      return Object.keys(this.schemaList).length > 0;
    },
  },
  methods: {
    async paginatedProps(page) {
      if (!page || page.startIndex < 0 || !page.endIndex) return;
      Object.assign(page, {
        search: { ...this.searchObject, qSearch: this.qSearch || "" },
      });
      await this.getList(page);
    },

    async getList(page) {
      try {
        let params = "";
        params = getParams(params, page, this);

        const finalRes = await getListTwo(params, this.viewsType, this.roleType);

        this.totalRecord = finalRes.total || 0;
        this.list = finalRes.list || [];
        this.listCondition(this.list);
      } catch (error) {
        errorSwal("Ralat", error);
      }
    },

    updateDisplayListField(payload) {
      this.schemaList = payload;
      this.listCondition(this.list);
    },

    listCondition(data) {
      data.forEach((element) => {
        assignSchemaToListData(element, this.schemaList);
      });
    },

    refreshList() {
      this.$refs.listData?.goToPage(1);
    },

    resetGlobalSearch() {
      this.qSearch = "";
      this.refreshList();
    },

    globalSearch(qSearch) {
      this.qSearch = qSearch;
      this.refreshList();
    },

    onSearchClick() {
      if (!this.$refs.searchForm) return;
      this.$refs.searchForm.formSubmit();

      if (this.$refs.searchForm.formIsValid) {
        this.searchObject = { ...this.$refs.searchForm.formData };
        this.refreshList();
      }
    },

    onResetSearchClick() {
      if (!this.$refs.searchForm) return;

      this.$refs.searchForm.formReset();
      this.searchObject = {};
      this.refreshList();
    },

    customValidator(field, self) {
      const errorMsg = standardValidation(field, self);
      if (errorMsg) {
        self.formErrors[field.name] = errorMsg;
      }
    },

    formActions(data) {
      void data;
    },

    listActions(actionList) {
      const { functionName } = actionList.functionProps || {};
      const { data } = actionList;
      this.formDataViewMode = "";

      if (functionName === "show") {
        this.openDetails(data.id, "view");
      } else if (functionName === "edit") {
        if (this.priv && !this.priv.flagKemaskini) {
          privSwal("U");
        } else {
          this.openDetails(data.id, "");
        }
      } else if (functionName === "delete") {
        if (this.priv && !this.priv.flagHapus) {
          privSwal("D");
        } else {
          this.deleteData(data.id);
        }
      }
    },

    async deleteData(id) {
      const isConfirm = await confirmSwal(
        "Hapus Data",
        "Adakah anda pasti? Data yang dipadam tidak akan dikembalikan."
      );
      if (!isConfirm) return;

      try {
        await deleteRecord(id);
        this.refreshList();
      } catch (error) {
        errorSwal("Ralat", error);
      }
    },

    onAddClick() {
      if (this.priv && !this.priv.flagDaftar) {
        privSwal("I");
        return;
      }
      this.openDetails("", "");
    },

    openDetails(id = "", viewMode = "") {
      this.id = id;
      this.formDataViewMode = viewMode;
      this.isModalVisible = true;
    },

    backToList() {
      this.id = "";
      this.isModalVisible = false;
    },

    async getListForReport(type) {
      try {
        let params = "";
        params = getParams(params, this.$refs.listData.paginationProps, this, true);
        const finalRes = await getListTwo(params, this.viewsType, this.roleType);
        this.listDataReport = {
          type,
          list: finalRes.data?.data || [],
          listFooter: [],
          schemaDataReport: this.schemaList,
        };
      } catch (error) {
        errorSwal("Ralat", error);
      }
    },

    listMultipleSelectActions(payload) {
      payload;
    },

    getSchemaFormCarian() {
      this.schemaFormCarian = {
        title: "uiElement.generalTabCrud.listTwo.search.title",
        pkField: "id",
        fieldSets: [
          {
            legend: "uiElement.generalTabCrud.listTwo.search.fieldsets.maklumat.legend",
            name: "maklumat",
            colGroups: [
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "name",
                    label: "uiElement.generalTabCrud.listTwo.search.fields.name",
                    type: "text",
                  },
                ],
              },
              {
                colwidth: "6",
                fieldwidth: "12",
                fields: [
                  {
                    name: "date",
                    label: "uiElement.generalTabCrud.listTwo.search.fields.date",
                    type: "date",
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
        id: "listTwo",
        title: "uiElement.generalTabCrud.listTwo.list.title",
        key: "id",
        allowPrint: true,
        actionCols: [
          {
            name: "uiElement.generalTabCrud.listTwo.list.actionColName",
            width: "150px",
            listFuntions: [
              {
                label: "uiElement.generalTabCrud.listMain.list.actions.show",
                type: "icon",
                icon: "fas fa-file-alt",
                cssClass: "text-primary font-size-16",
                functionName: "show",
              },
              {
                label: "uiElement.generalTabCrud.listMain.list.actions.edit",
                type: "icon",
                icon: "fas fa-edit",
                cssClass: "text-success font-size-16",
                functionName: "edit",
              },
              {
                label: "uiElement.generalTabCrud.listMain.list.actions.delete",
                type: "icon",
                icon: "fas fa-trash-alt",
                cssClass: "text-danger font-size-16",
                functionName: "delete",
              },
            ],
          },
        ],
        fields: [
          {
            name: "id",
            label: "uiElement.generalTabCrud.listTwo.list.fields.id",
            isHidden: true,
          },
          {
            name: "noKadPengenalan",
            label: "uiElement.generalTabCrud.listTwo.list.fields.noKadPengenalan",
            isSort: true,
          },
          {
            name: "nama",
            label: "uiElement.generalTabCrud.listTwo.list.fields.nama",
            isSort: true,
          },
          {
            name: "jantina",
            label: "uiElement.generalTabCrud.listTwo.list.fields.jantina",
            isSort: true,
            locales: ["en"],
          },
        ],
      };
    },
  },
};
</script>