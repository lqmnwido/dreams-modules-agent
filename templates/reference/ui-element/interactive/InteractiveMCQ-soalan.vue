<template>
  <div class="module-view">
    <PageHeader title="MCQ QA" pageTitle="MCQ QA" />

    <InteractiveMCQ :key="quizKey" :questions="questions" :shuffleOptions="true" :autoSubmitOnTimeUp="true"
      :autoNextDelayMs="800" @answered="onAnswered" @finished="onFinished" @resetQuiz="resetQuiz" />

    <!-- Optional: Summary kat parent (kalau nak juga) -->
    <div v-if="finalSummary" class="container pb-3">
      <div class="alert alert-info border mb-0">
        <div class="d-flex flex-wrap justify-content-between gap-2">
          <div class="fw-semibold">Ringkasan Kuiz (Parent)</div>
          <div>
            Skor: <b>{{ finalSummary.totalEarnedMarks }}</b>/<b>{{ finalSummary.totalMarks }}</b>
            ({{ finalSummary.percent }}%)
          </div>
        </div>
        <div class="small text-body-secondary mt-1">
          Betul: <b>{{ finalSummary.totalCorrect }}</b> · Salah: <b>{{ finalSummary.totalWrong }}</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InteractiveMCQ from "./InteractiveMCQ.vue";
/* import Layout from "@/layouts/main.vue"; */
import { PageHeader } from "@2enapps/ui";

export default {
  components: { InteractiveMCQ, PageHeader },
  data() {
    return {
      quizKey: 1,

      // Optional: simpan log setiap jawapan
      answeredLog: [],

      // Optional: simpan result akhir
      finalSummary: null,

      questions: [
        {
          id: "q1",
          text: "Apakah fungsi utama Arkib Negara Malaysia?",
          durationSec: 30,
          marks: 5,
          status: "Aktif",
          options: [
            { id: "q1oA", label: "A", text: "Mengurus dan memelihara rekod arkib negara" },
            { id: "q1oB", label: "B", text: "Mengurus kutipan cukai negara" },
            { id: "q1oC", label: "C", text: "Mengawal keselamatan siber negara" },
            { id: "q1oD", label: "D", text: "Menyimpan data bank negara" },
          ],
          correctOptionId: "q1oA",
        },
        {
          id: "q2",
          text: "Apakah maksud rekod dalam konteks pengurusan arkib?",
          durationSec: 30,
          marks: 5,
          status: "Aktif",
          options: [
            { id: "q2oA", label: "A", text: "Dokumen yang dihasilkan dan disimpan sebagai bukti aktiviti organisasi" },
            { id: "q2oB", label: "B", text: "Semua fail komputer peribadi" },
            { id: "q2oC", label: "C", text: "Semua dokumen yang tidak penting" },
            { id: "q2oD", label: "D", text: "Nota peribadi pegawai" },
          ],
          correctOptionId: "q2oA",
        },
        {
          id: "q3",
          text: "Apakah yang dimaksudkan dengan rekod digital?",
          durationSec: 30,
          marks: 5,
          status: "Aktif",
          options: [
            { id: "q3oA", label: "A", text: "Rekod yang disimpan dalam bentuk elektronik atau digital" },
            { id: "q3oB", label: "B", text: "Rekod yang dicetak sahaja" },
            { id: "q3oC", label: "C", text: "Rekod yang ditulis tangan sahaja" },
            { id: "q3oD", label: "D", text: "Rekod yang tidak boleh disimpan" },
          ],
          correctOptionId: "q3oA",
        },
        {
          id: "q4",
          text: "Apakah tujuan jadual pelupusan rekod?",
          durationSec: 30,
          marks: 5,
          status: "Aktif",
          options: [
            { id: "q4oA", label: "A", text: "Menentukan tempoh penyimpanan rekod sebelum dilupuskan atau dipindahkan ke arkib" },
            { id: "q4oB", label: "B", text: "Menghapuskan semua rekod dengan segera" },
            { id: "q4oC", label: "C", text: "Menggantikan rekod lama dengan rekod baru" },
            { id: "q4oD", label: "D", text: "Menyimpan semua rekod tanpa had masa" },
          ],
          correctOptionId: "q4oA",
        },
        {
          id: "q5",
          text: "Apakah peranan sistem pengurusan rekod elektronik (ERMS)?",
          durationSec: 30,
          marks: 5,
          status: "Aktif",
          options: [
            { id: "q5oA", label: "A", text: "Mengurus penciptaan, penyimpanan dan capaian rekod digital secara sistematik" },
            { id: "q5oB", label: "B", text: "Menghapuskan semua rekod lama" },
            { id: "q5oC", label: "C", text: "Menggantikan semua pekerja arkib" },
            { id: "q5oD", label: "D", text: "Mengurus kewangan organisasi" },
          ],
          correctOptionId: "q5oA",
        },
        {
          id: "q6",
          text: "Apakah yang dimaksudkan dengan rekod arkib?",
          durationSec: 30,
          marks: 5,
          status: "Aktif",
          options: [
            { id: "q6oA", label: "A", text: "Rekod yang mempunyai nilai kekal dan dipelihara untuk rujukan masa depan" },
            { id: "q6oB", label: "B", text: "Rekod sementara sahaja" },
            { id: "q6oC", label: "C", text: "Rekod yang tidak penting" },
            { id: "q6oD", label: "D", text: "Rekod yang boleh dibuang bila-bila masa" },
          ],
          correctOptionId: "q6oA",
        },
        {
          id: "q7",
          text: "Mengapakah pengurusan rekod yang baik penting dalam organisasi?",
          durationSec: 30,
          marks: 5,
          status: "Aktif",
          options: [
            { id: "q7oA", label: "A", text: "Untuk memastikan rekod mudah dicapai dan menjadi bukti aktiviti organisasi" },
            { id: "q7oB", label: "B", text: "Untuk menambah bilangan dokumen organisasi" },
            { id: "q7oC", label: "C", text: "Untuk menyukarkan pencarian maklumat" },
            { id: "q7oD", label: "D", text: "Untuk mengurangkan penggunaan komputer" },
          ],
          correctOptionId: "q7oA",
        },
        {
          id: "q8",
          text: "Apakah yang dimaksudkan dengan pemindahan rekod ke Arkib Negara?",
          durationSec: 30,
          marks: 5,
          status: "Aktif",
          options: [
            { id: "q8oA", label: "A", text: "Proses menyerahkan rekod bernilai kekal kepada Arkib Negara untuk pemeliharaan" },
            { id: "q8oB", label: "B", text: "Memusnahkan rekod lama" },
            { id: "q8oC", label: "C", text: "Menghantar rekod ke pejabat lain" },
            { id: "q8oD", label: "D", text: "Menyalin rekod kepada komputer" },
          ],
          correctOptionId: "q8oA",
        },
        {
          id: "q9",
          text: "Apakah yang dimaksudkan dengan metadata rekod?",
          durationSec: 30,
          marks: 5,
          status: "Aktif",
          options: [
            { id: "q9oA", label: "A", text: "Maklumat yang menerangkan ciri-ciri dan konteks sesuatu rekod" },
            { id: "q9oB", label: "B", text: "Kandungan utama rekod sahaja" },
            { id: "q9oC", label: "C", text: "Salinan rekod asal" },
            { id: "q9oD", label: "D", text: "Rekod yang telah dipadam" },
          ],
          correctOptionId: "q9oA",
        },
        {
          id: "q10",
          text: "Apakah tujuan pemeliharaan rekod arkib?",
          durationSec: 30,
          marks: 5,
          status: "Aktif",
          options: [
            { id: "q10oA", label: "A", text: "Memastikan rekod sejarah negara kekal terpelihara untuk generasi akan datang" },
            { id: "q10oB", label: "B", text: "Mengurangkan bilangan dokumen organisasi" },
            { id: "q10oC", label: "C", text: "Menghapuskan rekod lama" },
            { id: "q10oD", label: "D", text: "Menyimpan rekod secara sementara sahaja" },
          ],
          correctOptionId: "q10oA",
        },
      ],
    };
  },
  methods: {
    onAnswered(payload) {
      // payload contoh:
      // { questionId, index, selectedOptionId, isCorrect, marks, earnedMarks, timeSpentSec, timeLeftSec, ... }
      this.answeredLog.push(payload);

      // kalau nak terus send API setiap jawab:
      // this.saveAnswer(payload)
    },

    resetQuiz() {
      this.finalSummary = null
    },

    onFinished(summary) {
      // summary contoh:
      // { totalQuestions, totalMarks, totalEarnedMarks, totalCorrect, totalWrong, percent, answers: [...] }
      this.finalSummary = summary;

      // kalau nak post final result:
      // this.saveResult(summary)
    },

    // optional: reset dari parent
    resetFromParent() {
      this.answeredLog = [];
      this.finalSummary = null;
      this.quizKey += 1; // force rerender InteractiveMCQ
    },

    // contoh stub API
    // async saveAnswer(payload) {
    //   await api.post("/quiz/answer", payload)
    // },
    // async saveResult(summary) {
    //   await api.post("/quiz/result", summary)
    // },
  },
};
</script>