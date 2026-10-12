<template>
  <div class="module-view">
    <PageHeader title="DRAG & DROP QA" pageTitle="DRAG & DROP QA" />

    <drag-drop :questions="shuffledQuestions" :answers="shuffledAnswers" v-model="map" @checked="onChecked" />
  </div>
</template>

<script>
import DragDrop from "./drag-drop.vue";
/* import Layout from "@/layouts/main.vue"; */
import { PageHeader } from "@2enapps/ui";
export default {
  components: { DragDrop, PageHeader },
  data() {
    return {
      answers: [
        { id: "a1", label: "Arkib Negara Malaysia (ANM)" },
        { id: "a2", label: "rekod rasmi kerajaan" },
        { id: "a3", label: "pemeliharaan dokumen" },
        { id: "a4", label: "digitalisasi arkib" },
        { id: "a5", label: "rujukan dan penyelidikan" },
        { id: "a6", label: "akses arkib awam" },
        { id: "a7", label: "bahan audiovisual" },
        { id: "a8", label: "pameran arkib" },
        { id: "a9", label: "pengurusan rekod" },
        { id: "a10", label: "warisan dokumentari negara" },
      ],

      questions: [
        {
          id: "q1",
          before: "Institusi yang bertanggungjawab menyimpan dokumen sejarah negara ialah",
          after: "yang berperanan memelihara rekod penting Malaysia.",
          correctAnswerId: "a1",
        },
        {
          id: "q2",
          before: "Arkib Negara Malaysia mengurus",
          after: "bagi memastikan maklumat pentadbiran kerajaan direkod dengan baik.",
          correctAnswerId: "a2",
        },
        {
          id: "q3",
          before: "Proses menjaga dan membaik pulih dokumen lama dikenali sebagai",
          after: "bagi memastikan bahan sejarah terus terpelihara.",
          correctAnswerId: "a3",
        },
        {
          id: "q4",
          before: "Penukaran dokumen fizikal kepada format digital dikenali sebagai",
          after: "bagi memudahkan penyimpanan dan capaian maklumat.",
          correctAnswerId: "a4",
        },
        {
          id: "q5",
          before: "Arkib Negara juga berfungsi sebagai pusat",
          after: "untuk para pelajar, penyelidik dan masyarakat.",
          correctAnswerId: "a5",
        },
        {
          id: "q6",
          before: "Kemudahan yang membolehkan orang ramai melihat dan menggunakan bahan arkib dipanggil",
          after: "yang disediakan oleh Arkib Negara Malaysia.",
          correctAnswerId: "a6",
        },
        {
          id: "q7",
          before: "Rakaman video, audio dan filem sejarah dikategorikan sebagai",
          after: "yang turut disimpan dalam koleksi arkib.",
          correctAnswerId: "a7",
        },
        {
          id: "q8",
          before: "Arkib Negara sering menganjurkan",
          after: "bagi memperkenalkan bahan sejarah kepada masyarakat.",
          correctAnswerId: "a8",
        },
        {
          id: "q9",
          before: "Proses mengurus penciptaan, penyimpanan dan pelupusan dokumen dikenali sebagai",
          after: "dalam sistem pentadbiran kerajaan.",
          correctAnswerId: "a9",
        },
        {
          id: "q10",
          before: "Dokumen penting yang merekodkan sejarah negara dikenali sebagai",
          after: "yang perlu dilindungi untuk generasi akan datang.",
          correctAnswerId: "a10",
        },
      ],

      map: {
        q1: null,
        q2: null,
        q3: null,
        q4: null,
        q5: null,
        q6: null,
        q7: null,
        q8: null,
        q9: null,
        q10: null,
      }
    };
  },

  computed: {
    shuffledQuestions() {
      return this.shuffleArray([...this.questions]);
    },
    shuffledAnswers() {
      return this.shuffleArray([...this.answers]);
    },
  },

  methods: {
    shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    onChecked(result) {
      console.log(result);
    },
  },
};
</script>