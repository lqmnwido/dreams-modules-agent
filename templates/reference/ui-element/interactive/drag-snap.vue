<template>
  <div class="position-relative">
    <!-- optional confetti kalau nak -->
    <canvas ref="confetti" class="confetti-canvas"></canvas>

    <div class="row g-3">
      <!-- BANK -->
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header d-flex align-items-center justify-content-between">
            <div class="fw-semibold">Kotak Jawapan</div>
            <span class="badge text-bg-secondary">{{ availableAnswers.length }}</span>
          </div>

          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="a in availableAnswers"
                :key="a.id"
                class="badge rounded-pill text-bg-info px-3 py-2 user-select-none answer-chip"
                draggable="true"
                @dragstart="onDragStartAnswer(a.id)"
                @dragend="onDragEnd"
              >
                {{ a.label }}
              </span>
            </div>

            <div v-if="availableAnswers.length === 0" class="text-muted small mt-3">
              Semua jawapan telah digunakan.
            </div>

            <div class="mt-3 d-flex justify-content-end gap-2">
              <button class="btn btn-warning" type="button" @click="resetAll">Reset</button>
              <button class="btn btn-success" type="button" @click="checkAnswers">Semak Keputusan</button>
            </div>

            <div v-if="checked" class="mt-3">
              <div class="alert alert-light border mb-0 py-2">
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
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- QUESTIONS -->
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header fw-semibold">Senarai Soalan (Drag Snap)</div>

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

                <!-- SLOT / DROP ZONE -->
                <span
                  class="slot d-inline-flex align-items-center mx-2 px-2 py-1 rounded border border-2 bg-light"
                  :class="slotClass(q.id)"
                  style="min-width: 160px; min-height: 40px; vertical-align: middle;"
                  @dragenter.prevent="onSlotEnter(q.id)"
                  @dragover.prevent="onSlotOver($event, q.id)"
                  @dragleave="onSlotLeave(q.id)"
                  @drop.prevent="onSlotDrop(q.id)"
                >
                  <template v-if="assignments[q.id]">
                    <span
                      class="badge rounded-pill px-3 py-2 user-select-none"
                      :class="assignedBadgeClass(q.id)"
                      draggable="true"
                      @dragstart="onDragStartFromSlot(q.id)"
                      @dragend="onDragEnd"
                      title="Drag keluar untuk buang"
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
                    <span class="text-muted">______</span>
                  </template>
                </span>

                <span>{{ q.after }}</span>

                <!-- feedback -->
                <div v-if="checked" class="mt-2">
                  <span v-if="isCorrect(q.id)" class="badge text-bg-success">Betul</span>
                  <span v-else class="badge text-bg-danger">Salah</span>

                  <span class="text-muted small ms-2">
                    Jawapan: <span class="fw-semibold">{{ getAnswerLabel(q.correctAnswerId) }}</span>
                  </span>
                </div>

                <!-- tiny hint animation -->
                <div v-if="snapHintFor === q.id" class="small text-success mt-1">
                  ✨ Snap!
                </div>
              </div>
            </div>

            <div class="pt-3 d-flex justify-content-end gap-2">
              <button class="btn btn-warning" type="button" @click="resetAll">Reset</button>
              <button class="btn btn-success" type="button" @click="checkAnswers">Semak Keputusan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DragSnapQA",
  props: {
    // { id, before, after, correctAnswerId }
    questions: { type: Array, required: true },
    // { id, label }
    answers: { type: Array, required: true },
    modelValue: { type: Object, default: () => ({}) },

    // magnet sensitivity (px)
    snapThreshold: { type: Number, default: 28 },

    // kalau true: bila salah, auto buang & balik bank (requested)
    wrongReturnToBank: { type: Boolean, default: true },
  },
  emits: ["update:modelValue", "checked"],
  data() {
    return {
      assignments: {},

      dragging: {
        answerId: null,
        fromSlotQuestionId: null, // kalau drag dari slot
        pointer: { x: 0, y: 0 },
      },

      activeSlotId: null,   // slot yang tengah hover
      snapReadySlotId: null, // slot yang dah masuk magnet threshold
      snapHintFor: null,

      checked: false,
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
      },
    },
    questions: {
      deep: true,
      handler() {
        const next = {};
        for (const q of this.questions) next[q.id] = this.assignments?.[q.id] ?? null;
        this.assignments = next;
        this.emitModel();
      },
    },
  },
  methods: {
    // ===== helpers =====
    getAnswerLabel(answerId) {
      const a = this.answers.find((x) => x.id === answerId);
      return a ? a.label : "";
    },
    emitModel() {
      this.$emit("update:modelValue", { ...this.assignments });
    },

    isCorrect(questionId) {
      const q = this.questions.find((x) => x.id === questionId);
      if (!q) return false;
      return this.assignments[questionId] === q.correctAnswerId;
    },

    // ===== semak =====
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
    },

    resetAll() {
      const next = {};
      for (const q of this.questions) next[q.id] = null;
      this.assignments = next;
      this.checked = false;
      this.emitModel();
    },

    unassign(questionId) {
      this.assignments[questionId] = null;
      this.checked = false;
      this.emitModel();
    },

    // ===== drag start =====
    onDragStartAnswer(answerId) {
      this.dragging.answerId = answerId;
      this.dragging.fromSlotQuestionId = null;

      try {
        event.dataTransfer.setData("text/plain", answerId);
        event.dataTransfer.effectAllowed = "move";
      } catch (e) {e}
    },

    onDragStartFromSlot(questionId) {
      const ans = this.assignments[questionId];
      if (!ans) return;

      this.dragging.answerId = ans;
      this.dragging.fromSlotQuestionId = questionId;

      try {
        event.dataTransfer.setData("text/plain", ans);
        event.dataTransfer.effectAllowed = "move";
      } catch (e) {e}
    },

    onDragEnd() {
      this.dragging.answerId = null;
      this.dragging.fromSlotQuestionId = null;
      this.activeSlotId = null;
      this.snapReadySlotId = null;
    },

    // ===== slot hover & magnet =====
    onSlotEnter(slotId) {
      this.activeSlotId = slotId;
    },

    onSlotLeave(slotId) {
      if (this.activeSlotId === slotId) this.activeSlotId = null;
      if (this.snapReadySlotId === slotId) this.snapReadySlotId = null;
    },

    onSlotOver(e, slotId) {
      // Simulate magnet: bila pointer dekat center slot => snapReady
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= this.snapThreshold) this.snapReadySlotId = slotId;
      else if (this.snapReadySlotId === slotId) this.snapReadySlotId = null;
    },

    onSlotDrop(slotId) {
      const answerId = this.dragging.answerId;
      if (!answerId) return;

      // slot yang drop mesti "snap ready" untuk rasa magnet
      if (this.snapReadySlotId !== slotId) {
        // kalau nak strict magnet, return; kalau tak, boleh allow.
        // saya buat allow tetap drop, tapi tanpa hint.
      }

      const q = this.questions.find(x => x.id === slotId);
      if (!q) return;

      // kalau drag dari slot lain, kosongkan slot asal (move)
      const fromQ = this.dragging.fromSlotQuestionId;
      if (fromQ && fromQ !== slotId) this.assignments[fromQ] = null;

      // set dulu jawapan ke slot
      this.assignments[slotId] = answerId;
      this.checked = false;

      // magnet hint
      this.snapHintFor = slotId;
      setTimeout(() => (this.snapHintFor = null), 350);

      // logic: kalau salah, auto kembali ke bank (buang dari slot)
      if (this.wrongReturnToBank && q.correctAnswerId && answerId !== q.correctAnswerId) {
        // bagi user nampak “snap masuk”, lepas tu balik
        setTimeout(() => {
          // kalau user belum ubah lagi slot tu
          if (this.assignments[slotId] === answerId) {
            this.assignments[slotId] = null;
            this.emitModel();
          }
        }, 420);
      }

      this.emitModel();
      this.onDragEnd();
    },

    // ===== UI class =====
    slotClass(questionId) {
      const hasVal = !!this.assignments[questionId];
      const isActive = this.activeSlotId === questionId;
      const isSnap = this.snapReadySlotId === questionId;

      return {
        "border-dashed border-secondary": !hasVal,
        "border-primary bg-primary-subtle": isActive && !this.checked,
        "snap-ready": isSnap && !this.checked,
        "border-success": this.checked && this.isCorrect(questionId),
        "border-danger": this.checked && !this.isCorrect(questionId),
      };
    },

    assignedBadgeClass(questionId) {
      if (!this.checked) return "text-bg-primary";
      return this.isCorrect(questionId) ? "text-bg-success" : "text-bg-danger";
    },
  },
};
</script>

<style scoped>
.border-dashed {
  border-style: dashed !important;
}

.q-no {
  width: 28px;
  align-self: stretch;
}

/* nicer drag cursor */
.answer-chip {
  cursor: grab;
}

/* Slot glow + magnet feel */
.slot {
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}

.slot.snap-ready {
  border-color: #0ea5e9 !important;
  box-shadow: 0 0 0 6px rgba(14, 165, 233, 0.15);
  transform: scale(1.02);
}

/* optional confetti canvas */
.confetti-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}
</style>