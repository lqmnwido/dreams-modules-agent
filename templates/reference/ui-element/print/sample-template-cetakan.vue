<template>

    <spinner v-if="isLoading" />
    <Modal v-if="isModalVisible" :showModal="isModalVisible" @close="closeModal" size="xl" :title="suratName">
        <tab-print v-if="notEmpty(reportSchemaContent) && isReload" :PropSchemaContent="reportSchemaContent"
            :PropCanEdit="PropCanEdit" :keyExtend="keyExtend" :propIdCetakanTemplateExtend="idCetakanTemplateExtend"
            :forcePrint="true" :propId="idTemplateCetakan" @deleteExtend="deleteCetakanExtend"
            @closePrintModal="closePrintModal" :PropWaterMarkContent="PropWaterMarkContent" />
    </Modal>
</template>
<script>
import { printTemplate } from "@2enapps/ui";
import { GeneratedFormModal as Modal } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
import { TabPrint } from "@2enapps/ui";
import { getDataSampleTemplete } from "@/services/training/print-ui-element";
import { setupTemplate, deleteTemplateExtend } from "@/services/training/template-cetakan";
// /* import { // confirmSwal // } from "@/components/functions/sweetalert.js"; */
export default {
    name: "surat",
    components: {
        TabPrint,
        Modal
    },
    props: {
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
        async closeModal() {
            // if (this.PropCanEdit && await confirmSwal('', 'Adakah anda pasti?')) {
            //     this.isModalVisible = false;
            // } else {
            //     this.isModalVisible = false;
            // }
            this.isModalVisible = false;
        },
        async deleteCetakanExtend(id) {
            deleteTemplateExtend(id, this)
        },
        printDiv() {
            printTemplate(this)
        },
        closePrintModal() {
            console.log('closePrintMODAL 1')
            this.isModalVisible = false;
        },
        getReport(cetakanName) {
            cetakanName
            this.reportSchemaContent = {}
            this.suratName = "";
            this.isLoading = true;
            getDataSampleTemplete(this.propId).then((result) => {
                this.isLoading = false;

                setupTemplate(cetakanName, result, this)


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
