<template>
  <div class="module-view">
    <PageHeader title="MATCHING LINE QA" pageTitle="MATCHING LINE QA" />

    <matching-line
      :leftItems="shuffledLeftItems"
      :rightItems="shuffledRightItems"
      v-model="pairs"
      @checked="onChecked"
    />
  </div>
</template>

<script>
import MatchingLine from "./matching-line.vue";
/* import Layout from "@/layouts/main.vue"; */
import { PageHeader } from "@2enapps/ui";

export default {
  components: { MatchingLine, PageHeader },

  data() {
    return {
      rightItems: [
        { id: "r1", label: "Menyimpan rekod dan dokumen sejarah negara" },
        { id: "r2", label: "Mengurus pemeliharaan arkib kerajaan" },
        { id: "r3", label: "Memulihara dokumen lama dan rosak" },
        { id: "r4", label: "Pusat rujukan sejarah dan penyelidikan" },
        { id: "r5", label: "Menyediakan kemudahan akses kepada arkib awam" },
        { id: "r6", label: "Mendigitalkan dokumen sejarah negara" },
        { id: "r7", label: "Mengurus rekod rasmi jabatan kerajaan" },
        { id: "r8", label: "Menyimpan bahan audiovisual sejarah" },
        { id: "r9", label: "Melindungi warisan dokumentari negara" },
        { id: "r10", label: "Mengadakan pameran bahan arkib kepada orang ramai" },
      ],

      leftItems: [
        { id: "l1", label: "Fungsi utama Arkib Negara Malaysia", correctRightId: "r1" },
        { id: "l2", label: "Pengurusan arkib kerajaan", correctRightId: "r2" },
        { id: "l3", label: "Proses restorasi dokumen lama", correctRightId: "r3" },
        { id: "l4", label: "Peranan arkib dalam penyelidikan sejarah", correctRightId: "r4" },
        { id: "l5", label: "Akses kepada bahan arkib oleh orang awam", correctRightId: "r5" },
        { id: "l6", label: "Digitalisasi rekod sejarah", correctRightId: "r6" },
        { id: "l7", label: "Pengurusan rekod sektor awam", correctRightId: "r7" },
        { id: "l8", label: "Penyimpanan rakaman audio dan video sejarah", correctRightId: "r8" },
        { id: "l9", label: "Pemeliharaan warisan dokumentari negara", correctRightId: "r9" },
        { id: "l10", label: "Aktiviti pameran arkib kepada masyarakat", correctRightId: "r10" },
      ],

      pairs: {},
    };
  },

  computed: {
    shuffledLeftItems() {
      return this.shuffleArray([...this.leftItems]);
    },
    shuffledRightItems() {
      return this.shuffleArray([...this.rightItems]);
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