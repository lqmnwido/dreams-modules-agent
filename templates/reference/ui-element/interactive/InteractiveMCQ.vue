<template>
  <div class="container py-3">
    <div class="card shadow-sm border-0 ">
      <!-- HEADER -->
      <div class="card-header border-0 d-flex flex-wrap align-items-center justify-content-between gap-2 ">
        <div class="d-flex align-items-center gap-2">
          <span class="badge rounded-pill text-bg-light border">📝</span>
          <div class="fw-bold">Kuiz (MCQ)</div>

          <span class="badge rounded-pill text-dark text-bg-light border">
            Soalan <b>{{ Math.min(currentIndex + 1, totalQuestions) }}</b>/<b>{{ totalQuestions }}</b>
          </span>

          <span v-if="statusLabel" class="badge rounded-pill" :class="statusBadgeClass">
            {{ statusLabel }}
          </span>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2">
          <span class="badge text-bg-light text-dark border ">
            Markah Soalan: <b>{{ marks }}</b>
          </span>

          <span class="badge text-bg-light text-dark border ">
            Markah Terkumpul: <b>{{ totalEarnedMarks }}</b>/<b>{{ totalMarks }}</b>
          </span>

          <span v-if="hasTimer && !quizFinished" class="badge text-bg-light text-dark border ">
            Masa: <b>{{ timeLabel }}</b>
          </span>

          <button class="btn btn-warning btn-sm" type="button" @click="resetQuiz" :disabled="isLocked && !quizFinished">
            Reset Kuiz
          </button>

          <button class="btn btn-success btn-sm" type="button" @click="submit" :disabled="submitDisabled">
            {{ isLastQuestion ? "Hantar & Tamat" : "Hantar Jawapan" }}
          </button>
        </div>
      </div>

      <!-- BODY -->
      <div class="card-body position-relative">
        <!-- confetti -->
        <canvas ref="confetti" class="confetti-canvas"></canvas>

        <!-- FINISH SCREEN -->
        <div v-if="quizFinished" class="p-3 rounded-4 qa-surface">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div class="fw-bold fs-4">✅ Kuiz Tamat</div>
            <span class="badge rounded-pill text-dark border ">
              Skor Akhir: <b>{{ totalEarnedMarks }}</b>/<b>{{ totalMarks }}</b> ({{ totalPercent }}%)
            </span>
          </div>

          <div class="mt-2 text-body-secondary">
            Betul: <b>{{ totalCorrect }}</b>/<b>{{ totalQuestions }}</b> · Salah: <b>{{ totalWrong }}</b>
          </div>

          <div v-if="isPerfectScore" class="mt-2 alert alert-success mb-0">
            🎉 Perfect Score! Semua soalan betul!
          </div>

          <hr />

          <div class="d-flex flex-wrap gap-2 justify-content-end">
            <!-- <button class="btn btn-outline-secondary" type="button" @click="$emit('close')">
              Tutup
            </button> -->
            <button class="btn btn-primary" type="button" @click="resetQuiz">
              Cuba Lagi
            </button>
          </div>

          <!-- optional: ringkas jawapan -->
          <div class="mt-3">
            <div class="fw-semibold mb-2">Ringkasan</div>
            <div class="list-group">
              <div v-for="(a, i) in answersLog" :key="a.questionId + '_' + i"
                class="list-group-item d-flex justify-content-between align-items-start">
                <div class="me-2">
                  <div class="fw-semibold">Soalan {{ i + 1 }}</div>
                  <div class="small text-body-secondary">{{ a.questionText }}</div>
                </div>
                <span class="badge rounded-pill" :class="a.isCorrect ? 'text-bg-success' : 'text-bg-danger'">
                  {{ a.isCorrect ? "Betul" : "Salah" }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- QUESTION SCREEN -->
        <template v-else>
          <!-- progress timer -->
          <div v-if="hasTimer" class="mb-3">
            <div class="d-flex justify-content-between small text-body-secondary mb-1">
              <span>Tempoh</span>
              <span>{{ timeLabel }}</span>
            </div>
            <div class="progress" style="height: 10px;">
              <div class="progress-bar" role="progressbar" :style="{ width: timerPercent + '%' }"
                :aria-valuenow="timerPercent" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div v-if="timeLeft <= 10 && !submitted" class="small mt-1 text-danger">
              ⏳ Cepat! Tinggal {{ timeLeft }} saat.
            </div>
          </div>

          <!-- question -->
          <div class="p-3 rounded-4 qa-surface mb-3">
            <div class="fw-semibold mb-2">Soalan</div>
            <div class="fs-5 lh-base">{{ questionText }}</div>
          </div>

          <!-- options -->
          <div class="fw-semibold mb-2">Pilihan Jawapan</div>
          <div class="row g-2">
            <div v-for="opt in optionList" :key="opt.id" class="col-12">
              <button type="button"
                class="btn w-100 text-start d-flex align-items-center justify-content-between option-btn"
                :class="optionBtnClass(opt)" :disabled="isLocked" @click="pick(opt.id)">
                <span class="d-flex align-items-center gap-2">
                  <span class="opt-pill">{{ opt.label }}</span>
                  <span class="fw-semibold">{{ opt.text }}</span>
                </span>

                <span class="d-flex align-items-center gap-2">
                  <span v-if="selectedId === opt.id && !submitted" class="badge text-bg-primary pop">
                    Dipilih
                  </span>

                  <template v-if="submitted">
                    <span v-if="opt.id === correctOptionId" class="badge text-bg-success pop">
                      Betul
                    </span>
                    <span v-else-if="selectedId === opt.id && opt.id !== correctOptionId"
                      class="badge text-bg-danger shake">
                      Salah
                    </span>
                    <span v-else class="badge text-bg-light border soft-badge">
                      &nbsp;
                    </span>
                  </template>
                </span>
              </button>
            </div>
          </div>

          <!-- feedback -->
          <div class="mt-3">
            <div v-if="submitted" class="alert mb-0" :class="isCorrect ? 'alert-success' : 'alert-danger'">
              <div class="d-flex flex-wrap justify-content-between gap-2 align-items-center">
                <div class="fw-semibold">
                  <span v-if="isCorrect">🎉 Tahniah! Jawapan anda betul.</span>
                  <span v-else>😅 Belum tepat.</span>
                </div>
                <div>
                  Skor Soalan: <b>{{ earnedMarks }}</b>/<b>{{ marks }}</b>
                </div>
              </div>

              <div class="mt-2 small">
                Jawapan betul: <b>{{ correctLabel }}</b>
                <span class="text-body-secondary">— {{ correctText }}</span>
              </div>

              <div class="mt-3 d-flex justify-content-end gap-2">
                <button class="btn btn-outline-secondary" type="button" @click="goNext(true)">
                  {{ isLastQuestion ? "Lihat Skor Akhir" : "Seterusnya" }}
                </button>
              </div>
            </div>

            <div v-else class="text-body-secondary small">
              Tip: Tekan keyboard <b>A/B/C/D</b> untuk pilih. Tekan <b>Enter</b> untuk hantar.
            </div>
          </div>
        </template>
      </div>

      <!-- FOOTER -->
      <div v-if="!quizFinished" class="card-footer bg-transparent border-0 d-flex justify-content-end gap-2">
        <button class="btn btn-primary" type="button" @click="submit" :disabled="submitDisabled">
          {{ isLastQuestion ? "Sahkan & Tamat" : "Sahkan Jawapan" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InteractiveMCQ",
  props: {
    questions: { type: Array, required: true },
    autoSubmitOnTimeUp: { type: Boolean, default: true },
    shuffleOptions: { type: Boolean, default: false },
    autoNextDelayMs: { type: Number, default: 800 },
  },
  emits: ["answered", "finished", "close", "resetQuiz"],
  data() {
    return {
      // quiz state
      currentIndex: 0,
      answersLog: [],

      // current question state
      selectedId: null,
      submitted: false,

      // timer
      timeLeft: 0,
      timerId: null,
      startedAtMs: null,

      // audio
      audioCtx: null,

      // confetti
      confettiId: null,
      autoNextId: null,
    };
  },
  computed: {
    totalQuestions() {
      return Array.isArray(this.questions) ? this.questions.length : 0;
    },
    isLastQuestion() {
      return this.currentIndex >= this.totalQuestions - 1;
    },
    quizFinished() {
      return this.totalQuestions > 0 && this.currentIndex >= this.totalQuestions;
    },
    isPerfectScore() {
      return this.totalQuestions > 0 && this.totalEarnedMarks === this.totalMarks;
    },

    // current question
    question() {
      return this.quizFinished ? null : this.questions?.[this.currentIndex] || null;
    },
    questionText() {
      return this.question?.text || "";
    },
    marks() {
      return Number(this.question?.marks ?? 1);
    },
    correctOptionId() {
      return this.question?.correctOptionId ?? null;
    },

    statusLabel() {
      const s = (this.question?.status || "").toLowerCase();
      if (!s) return "";
      if (s === "aktif" || s === "active") return "Aktif";
      if (s === "draft" || s === "draf") return "Draf";
      return this.question?.status || "";
    },
    statusBadgeClass() {
      const s = (this.question?.status || "").toLowerCase();
      if (s === "aktif" || s === "active") return "text-bg-success";
      if (s === "draft" || s === "draf") return "text-bg-secondary";
      return "text-bg-info";
    },
    statusIsActive() {
      const s = (this.question?.status || "aktif").toLowerCase();
      return s === "aktif" || s === "active" || s === "";
    },

    // timer
    hasTimer() {
      return Number(this.question?.durationSec ?? 0) > 0;
    },
    totalSeconds() {
      return Number(this.question?.durationSec ?? 0);
    },
    timeLabel() {
      const t = Math.max(0, this.timeLeft);
      const mm = String(Math.floor(t / 60)).padStart(2, "0");
      const ss = String(t % 60).padStart(2, "0");
      return `${mm}:${ss}`;
    },
    timerPercent() {
      if (!this.hasTimer) return 100;
      const total = this.totalSeconds || 1;
      return Math.round((this.timeLeft / total) * 100);
    },

    optionList() {
      const base = (this.question?.options || []).map((o) => ({
        id: o.id,
        label: o.label,
        text: o.text,
      }));

      if (!this.shuffleOptions) return base;

      const a = [...base];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },

    isLocked() {
      return this.submitted;
    },
    submitDisabled() {
      return this.quizFinished || this.submitted || !this.selectedId || !this.statusIsActive;
    },

    // correctness current
    isCorrect() {
      if (!this.submitted) return false;
      return this.selectedId === this.correctOptionId;
    },
    earnedMarks() {
      if (!this.submitted) return 0;
      return this.isCorrect ? this.marks : 0;
    },
    correctObj() {
      return this.optionList.find((o) => o.id === this.correctOptionId) || {};
    },
    correctLabel() {
      return this.correctObj.label || "-";
    },
    correctText() {
      return this.correctObj.text || "";
    },

    // totals
    totalMarks() {
      return (this.questions || []).reduce((acc, q) => acc + Number(q?.marks ?? 1), 0);
    },
    totalEarnedMarks() {
      return this.answersLog.reduce((acc, a) => acc + Number(a.earnedMarks ?? 0), 0);
    },
    totalCorrect() {
      return this.answersLog.reduce((acc, a) => acc + (a.isCorrect ? 1 : 0), 0);
    },
    totalWrong() {
      return this.answersLog.reduce((acc, a) => acc + (!a.isCorrect ? 1 : 0), 0);
    },
    totalPercent() {
      if (!this.totalMarks) return 0;
      return Math.round((this.totalEarnedMarks / this.totalMarks) * 100);
    },
  },

  watch: {
    questions: {
      immediate: true,
      deep: true,
      handler() {
        this.resetQuiz();
      },
    },
    currentIndex() {
      // bila pindah soalan, reset state + timer
      if (!this.quizFinished) {
        this.resetQuestionState();
        this.$nextTick(() => this.startTimerIfNeeded());
      }
    },
  },

  mounted() {
    this.resizeConfettiCanvas();
    window.addEventListener("resize", this.resizeConfettiCanvas, { passive: true });
    window.addEventListener("keydown", this.onKeydown);
    this.$nextTick(() => this.startTimerIfNeeded());
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeConfettiCanvas);
    window.removeEventListener("keydown", this.onKeydown);
    this.stopTimer();
    this.stopConfetti();
    if (this.autoNextId) clearTimeout(this.autoNextId);
  },

  methods: {
    // -------------------------
    // Quiz control
    // -------------------------
    resetQuiz() {
      this.stopTimer();
      this.stopConfetti();
      if (this.autoNextId) clearTimeout(this.autoNextId);

      this.currentIndex = 0;
      this.answersLog = [];

      this.resetQuestionState();
      this.$nextTick(() => this.startTimerIfNeeded());

      this.$emit("resetQuiz");
    },

    resetQuestionState() {
      this.selectedId = null;
      this.submitted = false;
      this.startedAtMs = null;
      this.stopTimer();

      // jangan stop confetti di sini kalau nak confetti kekal di finish screen
      // tapi masa pindah soalan, kita memang tak nak confetti lama "tersisa"
      this.stopConfetti();

      this.setupTimer();
    },

    // manual/auto next
    goNext(fromButton = false) {
      if (this.autoNextId) clearTimeout(this.autoNextId);

      // kalau belum submit, tak boleh next (kecuali dari button di dalam alert)
      if (!this.submitted && !fromButton) return;

      // last -> finish
      if (this.isLastQuestion) {
        this.currentIndex = this.totalQuestions; // mark finished
        this.stopTimer();

        // confetti + jingle kalau perfect score
        if (this.isPerfectScore) {
          this.playVictoryJingle();
          this.$nextTick(() => {
            this.launchConfetti();
          });


        } else {
          this.stopConfetti();
        }

        this.$emit("finished", {
          totalQuestions: this.totalQuestions,
          totalMarks: this.totalMarks,
          totalEarnedMarks: this.totalEarnedMarks,
          totalCorrect: this.totalCorrect,
          totalWrong: this.totalWrong,
          percent: this.totalPercent,
          answers: [...this.answersLog],
        });

        return;
      }

      this.currentIndex += 1;
    },

    // -------------------------
    // pick + submit
    // -------------------------
    pick(id) {
      if (this.quizFinished || !this.statusIsActive || this.submitted) return;
      this.selectedId = id;
      this.soundPick();
      this.startTimerIfNeeded();
    },

    submit() {
      if (this.quizFinished || this.submitted || !this.selectedId || !this.statusIsActive) return;

      this.submitted = true;
      this.stopTimer();

      const timeSpentSec = this.startedAtMs ? Math.round((Date.now() - this.startedAtMs) / 1000) : 0;

      const payload = {
        questionId: this.question?.id ?? null,
        questionText: this.question?.text ?? "",
        index: this.currentIndex,
        selectedOptionId: this.selectedId,
        correctOptionId: this.correctOptionId,
        isCorrect: this.selectedId === this.correctOptionId,
        marks: this.marks,
        earnedMarks: this.selectedId === this.correctOptionId ? this.marks : 0,
        timeSpentSec,
        timeLeftSec: this.timeLeft,
      };

      // simpan log
      this.answersLog.push(payload);

      // emit setiap soalan dijawab
      this.$emit("answered", payload);

      if (payload.isCorrect) this.soundCorrect();
      else this.soundWrong();

      // kalau soalan terakhir, dan jawapan ini buat jadi perfect score -> boleh celebrate awal
      if (this.isLastQuestion) {
        if (this.isPerfectScore) {
          // this.playVictoryJingle();
          // this.launchConfetti();
        } else {
          this.stopConfetti();
        }
      }

      // auto next lepas submit
      if (this.autoNextDelayMs > 0) {
        this.autoNextId = setTimeout(() => this.goNext(), this.autoNextDelayMs);
      }
    },

    // -------------------------
    // Timer
    // -------------------------
    setupTimer() {
      this.timeLeft = this.hasTimer ? this.totalSeconds : 0;
    },
    startTimerIfNeeded() {
      if (!this.hasTimer || this.timerId || this.submitted || this.quizFinished) return;

      this.startedAtMs = this.startedAtMs || Date.now();

      this.timerId = setInterval(() => {
        if (this.submitted || this.quizFinished) return;

        this.timeLeft -= 1;

        if (this.timeLeft <= 0) {
          this.timeLeft = 0;
          this.stopTimer();

          if (!this.autoSubmitOnTimeUp) return;

          // kalau user belum pilih jawapan, log sebagai salah & auto next
          if (!this.selectedId) {
            this.submitted = true;

            const payload = {
              questionId: this.question?.id ?? null,
              questionText: this.question?.text ?? "",
              index: this.currentIndex,
              selectedOptionId: null,
              correctOptionId: this.correctOptionId,
              isCorrect: false,
              marks: this.marks,
              earnedMarks: 0,
              timeSpentSec: this.startedAtMs ? Math.round((Date.now() - this.startedAtMs) / 1000) : 0,
              timeLeftSec: 0,
              timeUp: true,
            };

            this.answersLog.push(payload);
            this.$emit("answered", payload);
            this.soundWrong();

            if (this.autoNextDelayMs > 0) {
              this.autoNextId = setTimeout(() => this.goNext(), this.autoNextDelayMs);
            }
            return;
          }

          // kalau ada pilihan, submit biasa
          this.submit();
        }
      }, 1000);
    },
    stopTimer() {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    },

    // -------------------------
    // Keyboard shortcuts
    // -------------------------
    onKeydown(e) {
      if (this.quizFinished || !this.statusIsActive) return;

      const k = (e.key || "").toLowerCase();
      if (k === "enter") {
        e.preventDefault();
        this.submit();
        return;
      }

      const map = { a: "A", b: "B", c: "C", d: "D" };
      const wanted = map[k];
      if (!wanted) return;

      const opt = this.optionList.find((o) => String(o.label).toUpperCase() === wanted);
      if (opt) {
        e.preventDefault();
        this.pick(opt.id);
      }
    },

    // -------------------------
    // UI class
    // -------------------------
    optionBtnClass(opt) {
      const isSelected = this.selectedId === opt.id;
      const isCorrectOpt = this.submitted && opt.id === this.correctOptionId;
      const isWrongSelected = this.submitted && isSelected && opt.id !== this.correctOptionId;

      return [
        "btn-outline-secondary",
        isSelected && !this.submitted ? "is-selected" : "",
        isCorrectOpt ? "is-correct" : "",
        isWrongSelected ? "is-wrong" : "",
      ];
    },

    // -------------------------
    // Audio (WebAudio)
    // -------------------------
    ensureAudio() {
      if (this.audioCtx) return this.audioCtx;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      this.audioCtx = new Ctx();
      return this.audioCtx;
    },
    beep(freq, duration = 0.08, type = "triangle", volume = 0.16) {
      const ctx = this.ensureAudio();
      if (!ctx) return;

      try {
        const o = ctx.createOscillator();
        const g = ctx.createGain();

        o.type = type;
        o.frequency.value = freq;

        g.gain.value = 0.001;
        o.connect(g);
        g.connect(ctx.destination);

        const now = ctx.currentTime;
        g.gain.setValueAtTime(0.001, now);
        g.gain.exponentialRampToValueAtTime(volume, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + duration);

        o.start(now);
        o.stop(now + duration + 0.02);
      } catch (e) {
        // ignore
      }
    },
    soundPick() {
      this.beep(520, 0.05, "triangle", 0.10);
    },
    soundWrong() {
      this.beep(220, 0.12, "sawtooth", 0.14);
      setTimeout(() => this.beep(180, 0.10, "sawtooth", 0.10), 90);
    },
    soundCorrect() {
      this.beep(740, 0.07, "triangle", 0.18);
      setTimeout(() => this.beep(980, 0.07, "triangle", 0.18), 80);
    },

    // Victory Jingle (lebih “menarik” dari beep biasa)
    playVictoryJingle() {
      // arpeggio ringkas (C major-ish)
      const seq = [
        { f: 523.25, d: 0.08 }, // C5
        { f: 659.25, d: 0.08 }, // E5
        { f: 783.99, d: 0.10 }, // G5
        { f: 1046.5, d: 0.12 }, // C6
        { f: 987.77, d: 0.10 }, // B5
        { f: 1046.5, d: 0.16 }, // C6
      ];

      let t = 0;
      for (const n of seq) {
        setTimeout(() => this.beep(n.f, n.d, "triangle", 0.22), t);
        t += Math.round(n.d * 1000);
      }
    },

    // -------------------------
    // Confetti (perfect score)
    // -------------------------
    resizeConfettiCanvas() {
      const canvas = this.$refs.confetti;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);
    },

    launchConfetti() {
      this.stopConfetti();
      this.resizeConfettiCanvas();

      const canvas = this.$refs.confetti;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;

      // lebih "power"
      const pieces = Array.from({ length: 240 }).map(() => {
        const side = Math.random();
        const startX = side < 0.33 ? W * 0.2 : side < 0.66 ? W * 0.5 : W * 0.8; // 3 burst lanes
        return {
          x: startX + (-40 + Math.random() * 80),
          y: -20 - Math.random() * 60,
          size: 4 + Math.random() * 7,
          vy: 2.2 + Math.random() * 4.6,
          vx: -2.2 + Math.random() * 4.4,
          rot: Math.random() * Math.PI,
          vr: -0.18 + Math.random() * 0.36,
          life: 220 + Math.random() * 160,
        };
      });

      let tick = 0;
      const draw = () => {
        tick += 1;
        ctx.clearRect(0, 0, W, H);

        for (const p of pieces) {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          p.life -= 1;

          // wrap x
          if (p.x < -30) p.x = W + 30;
          if (p.x > W + 30) p.x = -30;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);

          const hue = (tick * 3 + p.x * 0.6) % 360;
          ctx.fillStyle = `hsl(${hue}, 92%, 56%)`;

          // rectangle confetti
          ctx.fillRect(-p.size, -p.size, p.size * 2.2, p.size * 1.4);

          ctx.restore();
        }

        const alive = pieces.some((p) => p.life > 0 && p.y < H + 80);
        if (alive) this.confettiId = requestAnimationFrame(draw);
        else this.stopConfetti();
      };

      draw();
    },

    stopConfetti() {
      if (this.confettiId) {
        cancelAnimationFrame(this.confettiId);
        this.confettiId = null;
      }
      const canvas = this.$refs.confetti;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
  },
};
</script>

<style scoped>
/* =========================
   Theme tokens (light default)
   ========================= */
:root {
  --mcq-surface: #ffffff;
  --mcq-surface-2: #f8fafc;
  --mcq-border: rgba(0, 0, 0, .10);
  --mcq-shadow: 0 10px 22px rgba(0, 0, 0, .08);
  --mcq-text: #111827;
}

/* Bootstrap 5.3 dark mode */
:global([data-bs-theme="dark"]) :root,
:global([data-bs-theme="dark"]) {
  --mcq-surface: #0b1220;
  --mcq-surface-2: #0f172a;
  --mcq-border: rgba(255, 255, 255, .12);
  --mcq-shadow: 0 14px 26px rgba(0, 0, 0, .45);
  --mcq-text: rgba(255, 255, 255, .92);
}

/* Auto dark */
@media (prefers-color-scheme: dark) {
  :root {
    --mcq-surface: #0b1220;
    --mcq-surface-2: #0f172a;
    --mcq-border: rgba(255, 255, 255, .12);
    --mcq-shadow: 0 14px 26px rgba(0, 0, 0, .45);
    --mcq-text: rgba(255, 255, 255, .92);
  }
}

/* Card look */
.qa-card {
  background: var(--mcq-surface);
  color: var(--mcq-text);
  border: 1px solid var(--mcq-border);
  border-radius: 16px;
  overflow: hidden;
}

/* header gradient */
.qa-header {
  background: linear-gradient(90deg, #7c3aed, #06b6d4);
  color: #fff;
}

.qa-surface {
  background: var(--mcq-surface-2);
  border: 1px solid var(--mcq-border);
}

/* option button */
.option-btn {
  border-width: 2px;
  border-radius: 14px;
  /*background: var(--mcq-surface);*/
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}

.option-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--mcq-shadow);
}

.option-btn.is-selected {
  border-color: rgba(13, 110, 253, .85) !important;
  box-shadow: 0 0 0 6px rgba(13, 110, 253, .14);
}

.option-btn.is-correct {
  border-color: rgba(25, 135, 84, .9) !important;
  box-shadow: 0 0 0 6px rgba(25, 135, 84, .14);
}

.option-btn.is-wrong {
  border-color: rgba(220, 53, 69, .9) !important;
  box-shadow: 0 0 0 6px rgba(220, 53, 69, .14);
}

.opt-pill {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-weight: 800;
  border: 1px solid var(--mcq-border);
  background: var(--mcq-surface-2);
}

/* confetti overlay */
.confetti-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* badges */
.soft-badge {
  background: rgba(248, 250, 252, 0.92) !important;
}

:global([data-bs-theme="dark"]) .soft-badge {
  background: rgba(15, 23, 42, 0.75) !important;
  color: var(--mcq-text) !important;
  border-color: var(--mcq-border) !important;
}

@media (prefers-color-scheme: dark) {
  .soft-badge {
    background: rgba(15, 23, 42, 0.75) !important;
    color: var(--mcq-text) !important;
    border-color: var(--mcq-border) !important;
  }
}

/* tiny animations */
.pop {
  animation: pop 180ms ease-out;
}

@keyframes pop {
  0% {
    transform: scale(.9);
  }

  100% {
    transform: scale(1);
  }
}

.shake {
  animation: shake 260ms ease-in-out;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-3px);
  }

  75% {
    transform: translateX(3px);
  }
}
</style>