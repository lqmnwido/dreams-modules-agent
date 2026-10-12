<!--
  Laluan borang KOSONG untuk galeri `sample-input`.

  Fail ini hanya pembalut laluan. Seluruh kerja borang ada dalam
  `./components/sample-input-page.vue`, yang dikongsi dengan
  `./details-dummy.vue`. Kedua-duanya berbeza HANYA pada `propData`:
  laluan ini menghantar `{}`, jadi setiap medan bermula dengan nilai lalai
  skema masing-masing.
-->
<template>
  <SampleInputPage
    :propId="propId"
    :viewMode="viewMode"
    :propViewsType="propViewsType"
    :propRoleType="propRoleType"
    @backToList="$emit('backToList')"
  />
</template>

<script>
import SampleInputPage from "./components/sample-input-page.vue";

export default {
  name: "details",

  components: { SampleInputPage },

  props: {
    propId: String,
    viewMode: String,
    propViewsType: String,
    propRoleType: String,
  },

  emits: ["backToList"],
};
</script>
