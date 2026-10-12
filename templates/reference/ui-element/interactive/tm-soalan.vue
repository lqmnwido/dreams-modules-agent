<template>
  <div class="module-view">
    <PageHeader title="MATCHING LINE QA" pageTitle="MATCHING LINE QA" />

    <TapToMatch
    :leftItems="leftItems"
    :rightItems="rightItems"
    v-model="pairs"
    @checked="onChecked"
  />
  </div>
</template>

<script>
import TapToMatch from "./tap-to-match.vue";
/* import Layout from "@/layouts/main.vue"; */
import { PageHeader } from "@2enapps/ui";
export default {
  components: { TapToMatch, PageHeader },
  data() {
    return {
      rightItems: [
        { id: "r1", label: "Baju Mujar" },
        { id: "r2", label: "Hati batu" },
        { id: "r3", label: "Peti surat" },
        { id: "r4", label: "Setiausaha" },
      ],
      leftItems: [
        { id: "l1", label: "ثوب مجر", correctRightId: "r1" },
        { id: "l2", label: "قلب حجر", correctRightId: "r2" },
        { id: "l3", label: "صندوق البريد", correctRightId: "r3" },
        { id: "l4", label: "سكرتير", correctRightId: "r4" },
      ],
      pairs: {}, // { l1: 'r3', ... }
    };
  },
  methods: {
    onChecked(result) {
      console.log(result);
    },
  },
};
</script>