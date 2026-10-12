<template>
  <div class="module-view">
    <PageHeader title="DRAG & SNAP QA" pageTitle="DRAG & SNAP QA" />

  <DrapSnap
    :questions="questions"
    :answers="answers"
    v-model="map"
    @checked="onChecked"
  />
  </div>
</template>

<script>
import DrapSnap from "./drag-snap.vue";
/* import Layout from "@/layouts/main.vue"; */
import { PageHeader } from "@2enapps/ui";
export default {
  components: { DrapSnap, PageHeader },
  data() {
    return {
      answers: [
        { id: "a1", label: "sekolah" },
        { id: "a2", label: "nasi" },
        { id: "a3", label: "buku" },
      ],
      questions: [
        { id: "q1", before: "Ali pergi ke", after: "pagi tadi.", correctAnswerId: "a1" },
        { id: "q2", before: "Saya makan", after: "di rumah.", correctAnswerId: "a2" },
        { id: "q3", before: "Dia membaca", after: "di perpustakaan.", correctAnswerId: "a3" },
      ],
      map: { q1: null, q2: null, q3: null },
    };
  },
  methods: {
    onChecked(result) {
      console.log("RESULT:", result);
      // result.percent, result.scoreCorrect, result.details[]
    },
  },
};
</script>