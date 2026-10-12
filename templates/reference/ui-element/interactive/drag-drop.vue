<template>
  <!-- wrapper overlay confetti (container + relative) -->
  <div class="position-relative container py-2 ">
    <!-- confetti canvas overlay -->
    <canvas ref="confetti" class="confetti-canvas"></canvas>

    <div class="row">
      <!-- BANK JAWAPAN -->
      <div class="col-12">
        <div class="card ">
          <div class="card-header d-flex align-items-center justify-content-between ">
            <div class="fw-semibold d-flex align-items-center gap-2">
              <span class="badge rounded-pill text-bg-primary">🎯</span>
              Kotak Jawapan
            </div>
            <span class="badge text-bg-secondary">{{ availableAnswers.length }}</span>
          </div>

          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="a in availableAnswers"
                :key="a.id"
                class="badge rounded-pill text-bg-info px-3 py-2 user-select-none answer-chip"
                draggable="true"
                @dragstart="onDragStartAnswer(a.id, 'bank')"
                @dragend="onDragEnd"
                title="Drag jawapan"
              >
                {{ a.label }}
              </span>
            </div>

            <div v-if="availableAnswers.length === 0" class="text-body-secondary small mt-3">
              Semua jawapan telah digunakan.
            </div>

            <div v-if="checked" class="mt-3">
              <div class="alert alert-light border mb-0 py-2 qa-alert">
                <div class="d-flex justify-content-between">
                  <span class="fw-semibold">Skor</span>
                  <span class="fw-semibold">{{ scoreCorrect }}/{{ questions.length }}</span>
                </div>
                <div class="progress mt-2" style="height: 8px;">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="{ width: scorePercent + '%' }"
                    :aria-valuenow="scorePercent"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div class="text-body-secondary small mt-2">
                  {{ scorePercent }}%
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- SOALAN -->
      <div class="col-12 ">
        <div class="card shadow-sm ">
          <div class="card-header fw-semibold ">Senarai Soalan</div>

          <div class="card-body">
            <div
              v-for="(q, idx) in questions"
              :key="q.id"
              class="d-flex gap-2 py-2 border-bottom"
            >
              <div class="q-no fw-semibold d-flex align-items-center justify-content-end">
                {{ idx + 1 }}.
              </div>

              <div class="flex-grow-1">
                <span>{{ q.before }}</span>

                <!-- DROP ZONE -->
                <span
                  class="d-inline-flex align-items-center mx-2 px-2 py-1 rounded border border-2 border-dashed slot"
                  :class="dropZoneClass(q.id)"
                  style="min-width: 140px; min-height: 38px; vertical-align: middle;"
                  @dragover.prevent="onDragOverQuestion(q.id)"
                  @dragleave="onDragLeaveQuestion(q.id)"
                  @drop.prevent="onDropToQuestion(q.id)"
                >
                  <template v-if="assignments[q.id]">
                    <span
                      class="badge rounded-pill px-3 py-2 user-select-none answer-chip"
                      :class="assignedBadgeClass(q.id)"
                      draggable="true"
                      @dragstart="onDragStartAnswer(assignments[q.id], 'question', q.id)"
                      @dragend="onDragEnd"
                      title="Drag untuk pindah / tarik keluar"
                    >
                      {{ getAnswerLabel(assignments[q.id]) }}
                    </span>

                    <button
                      class="btn btn-sm btn-link text-danger ms-2 p-0"
                      type="button"
                      @click.stop="unassign(q.id)"
                      title="Buang jawapan"
                    >
                      ×
                    </button>
                  </template>

                  <template v-else>
                    <span class="text-body-secondary">______</span>
                  </template>
                </span>

                <span>{{ q.after }}</span>

                <!-- Feedback (betul/salah) -->
                <div v-if="checked" class="mt-2">
                  <span v-if="isCorrect(q.id)" class="badge text-bg-success pop">
                    Betul
                  </span>
                  <span v-else class="badge text-bg-danger shake">
                    Salah
                  </span>

                  <span class="text-body-secondary small ms-2">
                    Jawapan: <span class="fw-semibold">{{ getAnswerLabel(q.correctAnswerId) }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="pt-3 d-flex justify-content-center gap-2">
              <button class="btn btn-warning btn-sm" type="button" @click="resetAll">
                Reset
              </button>
              <button class="btn btn-success btn-sm " type="button" @click="checkAnswers">
                Semak Keputusan
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DragDropQA_Bootstrap",
  props: {
    questions: { type: Array, required: true },
    answers: { type: Array, required: true },
    modelValue: { type: Object, default: () => ({}) },
  },
  emits: ["update:modelValue", "checked"],
  data() {
    return {
      assignments: {},

      dragging: {
        answerId: null,
        from: null,
        fromQuestionId: null,
      },

      dragOverQuestionId: null,
      checked: false,

      // confetti state
      confettiId: null,

      // audio
      audioCtx: null,
    };
  },
  computed: {
    usedAnswerIds() {
      return new Set(Object.values(this.assignments).filter(Boolean));
    },
    availableAnswers() {
      return this.answers.filter((a) => !this.usedAnswerIds.has(a.id));
    },
    scoreCorrect() {
      if (!this.checked) return 0;
      return this.questions.reduce((acc, q) => acc + (this.isCorrect(q.id) ? 1 : 0), 0);
    },
    scorePercent() {
      if (!this.checked || this.questions.length === 0) return 0;
      return Math.round((this.scoreCorrect / this.questions.length) * 100);
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      deep: true,
      handler(v) {
        const next = {};
        for (const q of this.questions) next[q.id] = v?.[q.id] ?? null;
        this.assignments = next;
        this.checked = false;
        this.stopConfetti();
      },
    },
    questions: {
      deep: true,
      handler() {
        const next = {};
        for (const q of this.questions) next[q.id] = this.assignments?.[q.id] ?? null;
        this.assignments = next;
        this.emitModel();
        this.checked = false;
        this.stopConfetti();
      },
    },
  },

  mounted() {
    this.resizeConfettiCanvas();
    window.addEventListener("resize", this.resizeConfettiCanvas, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeConfettiCanvas);
    this.stopConfetti();
  },

  methods: {
    // ===== Helpers =====
    getAnswerLabel(answerId) {
      const a = this.answers.find((x) => x.id === answerId);
      return a ? a.label : "";
    },
    emitModel() {
      this.$emit("update:modelValue", { ...this.assignments });
    },

    // ===== Semak =====
    isCorrect(questionId) {
      const q = this.questions.find((x) => x.id === questionId);
      if (!q) return false;
      return this.assignments[questionId] === q.correctAnswerId;
    },

    checkAnswers() {
      this.checked = true;

      const payload = {
        scoreCorrect: this.scoreCorrect,
        total: this.questions.length,
        percent: this.scorePercent,
        details: this.questions.map((q) => ({
          questionId: q.id,
          selectedAnswerId: this.assignments[q.id] || null,
          correctAnswerId: q.correctAnswerId,
          isCorrect: this.isCorrect(q.id),
        })),
      };
      this.$emit("checked", payload);

      // sound + confetti
      if (this.questions.length > 0 && this.scoreCorrect === this.questions.length) {
        this.playWinSound();
        this.launchConfetti();
      } else {
        this.playCheckSound();
        this.stopConfetti();
      }
    },

    // ===== Reset / Unassign =====
    resetAll() {
      const next = {};
      for (const q of this.questions) next[q.id] = null;
      this.assignments = next;
      this.checked = false;
      this.stopConfetti();
      this.emitModel();
    },
    unassign(questionId) {
      this.assignments[questionId] = null;
      this.checked = false;
      this.stopConfetti();
      this.emitModel();
    },

    // ===== Drag & Drop =====
    onDragStartAnswer(answerId, from, fromQuestionId = null) {
      this.dragging.answerId = answerId;
      this.dragging.from = from;
      this.dragging.fromQuestionId = fromQuestionId;

      try {
        event.dataTransfer.setData("text/plain", answerId);
        event.dataTransfer.effectAllowed = "move";
      } catch (e) {e}
    },
    onDragEnd() {
      this.dragging.answerId = null;
      this.dragging.from = null;
      this.dragging.fromQuestionId = null;
      this.dragOverQuestionId = null;
    },
    onDragOverQuestion(questionId) {
      this.dragOverQuestionId = questionId;
    },
    onDragLeaveQuestion(questionId) {
      if (this.dragOverQuestionId === questionId) this.dragOverQuestionId = null;
    },
    onDropToQuestion(targetQuestionId) {
      const draggedAnswerId = this.dragging.answerId;
      if (!draggedAnswerId) return;

      const targetOld = this.assignments[targetQuestionId];
      const fromQ = this.dragging.fromQuestionId;

      if (fromQ && fromQ !== targetQuestionId) {
        this.assignments[targetQuestionId] = draggedAnswerId;
        this.assignments[fromQ] = targetOld || null;
      } else if (fromQ && fromQ === targetQuestionId) {
        return;
      } else {
        if (this.usedAnswerIds.has(draggedAnswerId)) return;
        this.assignments[targetQuestionId] = draggedAnswerId;
      }

      this.checked = false;
      this.stopConfetti();
      this.emitModel();
      this.onDragEnd();
    },

    // ===== UI Class =====
    dropZoneClass(questionId) {
      const isOver = this.dragOverQuestionId === questionId;
      const hasVal = !!this.assignments[questionId];

      return {
        "border-primary bg-primary-subtle": isOver,
        "border-secondary": !isOver && !hasVal && !this.checked,
        "border-success": this.checked && this.isCorrect(questionId),
        "border-danger": this.checked && !this.isCorrect(questionId),
        "slot-over": isOver && !this.checked,
      };
    },
    assignedBadgeClass(questionId) {
      if (!this.checked) return "text-bg-primary";
      return this.isCorrect(questionId) ? "text-bg-success" : "text-bg-danger";
    },

    // =========================
    // AUDIO (WebAudio, no mp3)
    // =========================
    ensureAudio() {
      if (this.audioCtx) return this.audioCtx;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      this.audioCtx = new Ctx();
      return this.audioCtx;
    },
    beep(freq, duration = 0.09, type = "triangle", volume = 0.18) {
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
      } catch (e) {e}
    },
    playCheckSound() {
      // bunyi semak biasa
      this.beep(520, 0.07, "triangle", 0.14);
      setTimeout(() => this.beep(740, 0.08, "triangle", 0.14), 90);
    },
    playWinSound() {
      // bunyi menang
      this.beep(660, 0.08, "triangle", 0.20);
      setTimeout(() => this.beep(880, 0.08, "triangle", 0.22), 100);
      setTimeout(() => this.beep(1175, 0.10, "triangle", 0.24), 200);
    },

    // =========================
    // CONFETTI (canvas overlay)
    // =========================
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

      const pieces = Array.from({ length: 140 }).map(() => ({
        x: Math.random() * W,
        y: -20 - Math.random() * H * 0.2,
        size: 4 + Math.random() * 6,
        vy: 2 + Math.random() * 4,
        vx: -1.6 + Math.random() * 3.2,
        rot: Math.random() * Math.PI,
        vr: -0.15 + Math.random() * 0.3,
        life: 140 + Math.random() * 80,
      }));

      let tick = 0;
      const draw = () => {
        tick += 1;
        ctx.clearRect(0, 0, W, H);

        for (const p of pieces) {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          p.life -= 1;

          if (p.x < -30) p.x = W + 30;
          if (p.x > W + 30) p.x = -30;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);

          const hue = (tick * 3 + p.x) % 360;
          ctx.fillStyle = `hsl(${hue}, 90%, 55%)`;
          ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);

          ctx.restore();
        }

        const alive = pieces.some((p) => p.life > 0 && p.y < H + 40);
        if (alive) {
          this.confettiId = requestAnimationFrame(draw);
        } else {
          ctx.clearRect(0, 0, W, H);
          this.confettiId = null;
        }
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
   + support Bootstrap 5.3 data-bs-theme="dark"
   + support prefers-color-scheme
   ========================= */
:root{
  --qa-surface: #ffffff;
  --qa-surface-2: #f8fafc;
  --qa-border: rgba(0,0,0,.10);
  --qa-shadow: 0 10px 22px rgba(0,0,0,.08);
  --qa-text: #111827;
  --qa-muted: rgba(17,24,39,.68);
}

:global([data-bs-theme="dark"]) :root,
:global([data-bs-theme="dark"]) {
  --qa-surface: #0b1220;
  --qa-surface-2: #0f172a;
  --qa-border: rgba(255,255,255,.12);
  --qa-shadow: 0 14px 26px rgba(0,0,0,.45);
  --qa-text: rgba(255,255,255,.92);
  --qa-muted: rgba(255,255,255,.70);
}

@media (prefers-color-scheme: dark){
  :root{
    --qa-surface: #0b1220;
    --qa-surface-2: #0f172a;
    --qa-border: rgba(255,255,255,.12);
    --qa-shadow: 0 14px 26px rgba(0,0,0,.45);
    --qa-text: rgba(255,255,255,.92);
    --qa-muted: rgba(255,255,255,.70);
  }
}

/* Bootstrap dashed helper */
.border-dashed { border-style: dashed !important; }

/* confetti overlay */
.confetti-canvas{
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* card look better in dark/light */
.qa-card{
  background: var(--qa-surface);
  border-color: var(--qa-border);
}
.qa-header{
  background: var(--qa-surface);
  border-bottom-color: var(--qa-border);
}
.qa-alert{
  background: var(--qa-surface-2);
  border-color: var(--qa-border);
  color: var(--qa-text);
}

/* answer chip */
.answer-chip{
  cursor: grab;
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.answer-chip:hover{
  transform: translateY(-1px);
  box-shadow: var(--qa-shadow);
}

/* drop slot */
.slot{
  background: var(--qa-surface-2);
  border-color: var(--qa-border);
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}
.slot-over{
  transform: scale(1.02);
  box-shadow: 0 0 0 6px rgba(13,110,253,0.14);
}

/* nombor soalan */
.q-no{
  width: 28px;
  align-self: stretch;
}

/* tiny animations */
.pop{ animation: pop 180ms ease-out; }
@keyframes pop{ 0%{ transform: scale(.85);} 100%{ transform: scale(1);} }

.shake{ animation: shake 260ms ease-in-out; }
@keyframes shake{
  0%,100%{ transform: translateX(0); }
  25%{ transform: translateX(-3px); }
  75%{ transform: translateX(3px); }
}
.fun-header{
  background: linear-gradient(90deg, #7c3aed, #06b6d4);
  color: #fff;
}
</style>