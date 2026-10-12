<template>
  <div class="module-view">
    <PageHeader title="CARD FLIP MATCHING" pageTitle="CARD FLIP MATCHING" />

    <card-flip-matching :pairs="pairs" />
  </div>
</template>

<script>
import CardFlipMatching from "./card-flip-matching.vue";
/* import Layout from "@/layouts/main.vue"; */
import { PageHeader } from "@2enapps/ui";
export default {
  components: { CardFlipMatching, PageHeader },
  data() {
    return {
      pairs: [
        { id: "p1", first: "Arkib Negara Malaysia", second: "Institusi yang menyimpan rekod sejarah negara" },
        { id: "p2", first: "Rekod Kerajaan", second: "Dokumen rasmi yang dihasilkan oleh jabatan kerajaan" },
        { id: "p3", first: "Arkib", second: "Rekod yang mempunyai nilai sejarah dan disimpan secara kekal" },
        { id: "p4", first: "Rekod Aktif", second: "Rekod yang masih digunakan dalam urusan harian jabatan" },
        { id: "p5", first: "Rekod Separa Aktif", second: "Rekod yang jarang digunakan tetapi masih perlu disimpan" },
        { id: "p6", first: "Pemeliharaan Arkib", second: "Proses menjaga dan melindungi dokumen lama daripada rosak" },
        { id: "p7", first: "Digitalisasi Arkib", second: "Proses menukar dokumen fizikal kepada format digital" },
        { id: "p8", first: "Bahan Audiovisual", second: "Rakaman audio, video dan filem sejarah" },
        { id: "p9", first: "Pameran Arkib", second: "Aktiviti memperkenalkan bahan arkib kepada masyarakat" },
        { id: "p10", first: "Warisan Dokumentari", second: "Dokumen penting yang merekodkan sejarah negara" },
      ],
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