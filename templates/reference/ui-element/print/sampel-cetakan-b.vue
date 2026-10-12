<template>
  <spinner v-if="isLoading" />
  <Modal v-if="isModalVisible" :showModal="isModalVisible" @close="closeModal" size="xl" :title="suratName" :confirmCloseText="'Adakah anda pasti?'">
    <tab-print v-if="notEmpty(reportSchemaContent) && isReload" :PropSchemaContent="reportSchemaContent"
      :forcePrint="forcePrint" @closePrintModal="forceCloseModal" :PropCanEdit="PropCanEdit" :keyExtend="keyExtend"
      :propIdCetakanTemplateExtend="idCetakanTemplateExtend" :propId="idTemplateCetakan"
      @deleteExtend="deleteCetakanExtend" :PropWaterMarkContent="PropWaterMarkContent" />
  </Modal>
</template>
<script>
import { Spinner } from "@2enapps/ui";
import { GeneratedFormModal as Modal } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { TabPrint } from "@2enapps/ui";
import { getDataSampelCetakanB } from "@/services/training/print-ui-element";
import { setupTemplate, deleteTemplateExtend } from "@/services/training/template-cetakan";
export default {
  name: "sampel-cetakan-b",
  components: {
    TabPrint,
    Modal,
    Spinner
  },
  props: {
    forcePrint: Boolean,
    propId: String,
    cetakanName: String,
    PropCanEdit: {
      type: Boolean,
      required: false,
      default: true,
    },
    propViewsType: String,
    propRoleType: String,
    PropWaterMarkContent: String,
  },
  data() {
    return {
      isReload: false,
      suratName: "",
      isModalVisible: false,
      reportSchemaContent: {},
      isLoading: false,
      individualSave: false,
      keyExtend: "",
      idTemplateCetakan: "",
      idCetakanTemplateExtend: "",
      viewsType: "",
      roleType: "",
    };
  },
  async created() {
    this.isLoading = true;
    this.viewsType = this.propViewsType;
    this.roleType = this.propRoleType;
    this.keyExtend = this.propId;
    this.getReport(this.cetakanName)
  },
  computed: {
  },
  methods: {
    notEmpty(obj) {
      return notEmpty(obj);
    },
    async forceCloseModal() {
      this.isModalVisible = false;

    },
    async closeModal() {
      // if (await confirmSwal('', 'Adakah anda pasti?')) {
        this.isModalVisible = false;
      //}
    },
    async deleteCetakanExtend(id) {
      deleteTemplateExtend(id, this)
    },
    getReport(cetakanName) {
      this.reportSchemaContent = {}
      this.isLoading = true;
      getDataSampelCetakanB(this.propId).then((result) => {
        this.isLoading = false;
        setupTemplate(cetakanName, result['data'], this)
      }).catch((error) => {
        error
        this.isLoading = false;
        setupTemplate(cetakanName, null, this)
      });
    },
  }
};
</script>

<style scoped></style>
