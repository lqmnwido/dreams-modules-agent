<!--
  Laluan borang yang sudah DIPENUHI DATA untuk galeri `sample-input`.

  Fail ini hanya pembalut laluan. Ia memanggil perkhidmatan data dummy
  (`getSampleInputDetails`), lalu menghantar hasilnya sebagai `propData` ke
  hos tab yang dikongsi dengan `./details.vue`.

  Hos tab tidak dibina sehingga data tiba, kerana setiap tab komponen
  menggabungkan `propData` di atas nilai lalai skema dalam `created()`.
  Membina hos lebih awal akan membekalkan borang kosong.
-->
<template>
  <spinner v-if="isLoading" />
  <div v-else-if="errorMessage" class="module-view">
    <BAlert variant="danger" :show="true">{{ errorMessage }}</BAlert>
  </div>
  <SampleInputPage
    v-else
    :propId="propId"
    :viewMode="viewMode"
    :propViewsType="propViewsType"
    :propRoleType="propRoleType"
    :propData="formData"
    @backToList="$emit('backToList')"
  />
</template>

<script>
import { Spinner } from "@2enapps/ui";

import SampleInputPage from "./components/sample-input-page.vue";
import { getSampleInputDetails } from "@/services/training/crud";

export default {
  name: "details-dummy",

  components: {
    SampleInputPage,
    Spinner,
  },

  props: {
    propId: String,
    viewMode: String,
    propViewsType: String,
    propRoleType: String,
  },

  emits: ["backToList"],

  data() {
    return {
      isLoading: true,
      errorMessage: "",
      formData: {},
    };
  },

  async created() {
    try {
      const response = await getSampleInputDetails(this.propId || "");
      this.formData = response?.data || {};
    } catch (error) {
      this.errorMessage = "Data dummy tidak dapat dimuatkan.";
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
