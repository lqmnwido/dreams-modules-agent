<template>
  <div class="container py-3">
    <div class="card shadow-sm">
      <div class="card-header d-flex align-items-center justify-content-between">
        <div class="fw-semibold">Tap-to-Match</div>

        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm" type="button" @click="resetAll">
            Reset
          </button>
          <button class="btn btn-dark btn-sm" type="button" @click="checkAnswers">
            Semak Keputusan
          </button>
        </div>
      </div>

      <div class="card-body position-relative" ref="board">
        <!-- SVG overlay untuk garis -->
        <svg class="lines-layer" :width="boardSize.w" :height="boardSize.h">
          <line
            v-for="ln in computedLines"
            :key="ln.key"
            :x1="ln.x1"
            :y1="ln.y1"
            :x2="ln.x2"
            :y2="ln.y2"
            :stroke="ln.color"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>

        <div class="row g-3">
          <!-- LEFT -->
          <div class="col-12 col-md-6">
            <div class="text-muted fw-semibold mb-2">Kiri</div>

            <div class="d-flex flex-column gap-2">
              <button
                v-for="l in leftItems"
                :key="l.id"
                class="btn text-start rounded-3 d-flex align-items-center justify-content-between"
                :class="leftBtnClass(l.id)"
                type="button"
                :ref="setLeftRef(l.id)"
                @click="tapLeft(l.id)"
              >
                <span class="fw-semibold">{{ l.label }}</span>

                <div class="d-flex align-items-center gap-2">
                  <span v-if="pairs[l.id]" class="badge text-bg-light border">
                    → {{ getRightLabel(pairs[l.id]) }}
                  </span>

                  <button
                    v-if="pairs[l.id]"
                    type="button"
                    class="btn btn-sm btn-link text-danger p-0"
                    title="Buang padanan"
                    @click.stop="unpairLeft(l.id)"
                  >
                    ×
                  </button>

                  <span v-if="checked" class="badge" :class="isCorrect(l.id) ? 'text-bg-success' : 'text-bg-danger'">
                    {{ isCorrect(l.id) ? 'Betul' : 'Salah' }}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="col-12 col-md-6">
            <div class="text-muted fw-semibold mb-2">Kanan</div>

            <div class="d-flex flex-column gap-2">
              <button
                v-for="(r, idx) in rightItems"
                :key="r.id"
                class="btn text-start rounded-3 d-flex align-items-center justify-content-between"
                :class="rightBtnClass(r.id)"
                type="button"
                :ref="setRightRef(r.id)"
                @click="tapRight(r.id)"
              >
                <span class="d-flex align-items-center gap-2">
                  <span class="badge rounded-pill text-bg-info">{{ idx + 1 }}</span>
                  <span class="fw-semibold">{{ r.label }}</span>
                </span>

                <span v-if="rightUsedBy(r.id)" class="badge text-bg-light border">
                  ← {{ getLeftLabel(rightUsedBy(r.id)) }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div class="small text-muted">
            Cara: Tap item kiri → tap item kanan untuk padankan. Tap kiri lain untuk tukar target.
          </div>

          <div v-if="checked" class="alert alert-light border mb-0 py-2 px-3">
            <span class="fw-semibold">Skor:</span>
            <span class="fw-semibold ms-1">{{ scoreCorrect }}/{{ leftItems.length }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TapToMatch",
  props: {
    // leftItems: [{ id, label, correctRightId }]
    leftItems: { type: Array, required: true },
    // rightItems: [{ id, label }]
    rightItems: { type: Array, required: true },
    // initial pairs (optional): { [leftId]: rightId }
    modelValue: { type: Object, default: () => ({}) },
    // optional: enforce 1-to-1 matching (default true)
    oneToOne: { type: Boolean, default: true },
  },
  emits: ["update:modelValue", "checked"],
  data() {
    return {
      pairs: {}, // leftId -> rightId
      selectedLeftId: null,

      leftRefs: {},
      rightRefs: {},
      boardSize: { w: 0, h: 0 },

      checked: false,
    };
  },
  computed: {
    scoreCorrect() {
      if (!this.checked) return 0;
      return this.leftItems.reduce((acc, l) => acc + (this.isCorrect(l.id) ? 1 : 0), 0);
    },

    computedLines() {
      const lines = [];
      const board = this.$refs.board;
      if (!board) return lines;

      const bRect = board.getBoundingClientRect();

      for (const [leftId, rightId] of Object.entries(this.pairs)) {
        const L = this.leftRefs[leftId];
        const R = this.rightRefs[rightId];
        if (!L || !R) continue;

        const lRect = L.getBoundingClientRect();
        const rRect = R.getBoundingClientRect();

        const x1 = lRect.right - bRect.left; // right edge of left item
        const y1 = lRect.top + lRect.height / 2 - bRect.top;

        const x2 = rRect.left - bRect.left; // left edge of right item
        const y2 = rRect.top + rRect.height / 2 - bRect.top;

        let color = "#6c757d"; // gray
        if (this.checked) color = this.isCorrect(leftId) ? "#198754" : "#dc3545"; // success/danger

        lines.push({ key: `${leftId}->${rightId}`, x1, y1, x2, y2, color });
      }
      return lines;
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      deep: true,
      handler(v) {
        // normalize: only accept keys that exist in leftItems
        const leftSet = new Set(this.leftItems.map(l => l.id));
        const rightSet = new Set(this.rightItems.map(r => r.id));

        const next = {};
        for (const [lid, rid] of Object.entries(v || {})) {
          if (leftSet.has(lid) && rightSet.has(rid)) next[lid] = rid;
        }
        this.pairs = next;
        this.checked = false;
        this.selectedLeftId = null;
        this.$nextTick(this.recalcBoard);
      },
    },
    leftItems: { deep: true, handler() { this.$nextTick(this.recalcBoard); } },
    rightItems: { deep: true, handler() { this.$nextTick(this.recalcBoard); } },
  },
  mounted() {
    this.recalcBoard();
    window.addEventListener("resize", this.recalcBoard, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.recalcBoard);
  },
  methods: {
    // refs
    setLeftRef(id) {
      return (el) => { if (el) this.leftRefs[id] = el; };
    },
    setRightRef(id) {
      return (el) => { if (el) this.rightRefs[id] = el; };
    },
    recalcBoard() {
      const board = this.$refs.board;
      if (!board) return;
      const rect = board.getBoundingClientRect();
      this.boardSize = { w: Math.round(rect.width), h: Math.round(rect.height) };
    },

    // labels
    getRightLabel(id) {
      const r = this.rightItems.find(x => x.id === id);
      return r ? r.label : "";
    },
    getLeftLabel(id) {
      const l = this.leftItems.find(x => x.id === id);
      return l ? l.label : "";
    },

    // util
    emitModel() {
      // emit lengkap (include null) supaya parent senang simpan
      const out = {};
      for (const l of this.leftItems) out[l.id] = this.pairs[l.id] ?? null;
      this.$emit("update:modelValue", out);
    },
    rightUsedBy(rightId) {
      for (const [lid, rid] of Object.entries(this.pairs)) {
        if (rid === rightId) return lid;
      }
      return null;
    },

    // tap actions
    tapLeft(leftId) {
      // toggle selection
      this.selectedLeftId = this.selectedLeftId === leftId ? null : leftId;
    },

    tapRight(rightId) {
      if (!this.selectedLeftId) return;

      // optional one-to-one: satu right hanya untuk satu left
      if (this.oneToOne) {
        const usedBy = this.rightUsedBy(rightId);
        if (usedBy && usedBy !== this.selectedLeftId) {
          delete this.pairs[usedBy];
        }
      }

      this.pairs[this.selectedLeftId] = rightId;
      this.checked = false;
      this.selectedLeftId = null;

      this.emitModel();
      this.$nextTick(this.recalcBoard);
    },

    unpairLeft(leftId) {
      delete this.pairs[leftId];
      this.checked = false;
      if (this.selectedLeftId === leftId) this.selectedLeftId = null;
      this.emitModel();
      this.$nextTick(this.recalcBoard);
    },

    resetAll() {
      this.pairs = {};
      this.selectedLeftId = null;
      this.checked = false;
      this.emitModel();
      this.$nextTick(this.recalcBoard);
    },

    // semak
    isCorrect(leftId) {
      const l = this.leftItems.find(x => x.id === leftId);
      if (!l) return false;
      return (this.pairs[leftId] || null) === (l.correctRightId || null);
    },

    checkAnswers() {
      this.checked = true;

      const payload = {
        scoreCorrect: this.scoreCorrect,
        total: this.leftItems.length,
        percent: this.leftItems.length
          ? Math.round((this.scoreCorrect / this.leftItems.length) * 100)
          : 0,
        details: this.leftItems.map(l => ({
          leftId: l.id,
          selectedRightId: this.pairs[l.id] || null,
          correctRightId: l.correctRightId || null,
          isCorrect: this.isCorrect(l.id),
        })),
      };

      this.$emit("checked", payload);
    },

    // UI classes
    leftBtnClass(leftId) {
      const selected = this.selectedLeftId === leftId;
      const paired = !!this.pairs[leftId];

      return [
        "btn-outline-secondary",
        selected ? "border-primary bg-primary-subtle pulse" : "",
        paired && !selected ? "bg-light" : "",
      ];
    },

    rightBtnClass(rightId) {
      const used = !!this.rightUsedBy(rightId);
      const isActiveTarget = this.selectedLeftId && !used; // boleh pilih
      return [
        "btn-outline-secondary",
        used ? "bg-light" : "",
        isActiveTarget ? "hover-glow" : "",
      ];
    },
  },
};
</script>

<style scoped>
.lines-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

/* kecil je bagi rasa interactive */
.pulse {
  animation: pulse 0.9s ease-in-out infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(13,110,253,0.25); }
  70% { box-shadow: 0 0 0 10px rgba(13,110,253,0); }
  100% { box-shadow: 0 0 0 0 rgba(13,110,253,0); }
}

/* hover glow untuk kanan (optional) */
.hover-glow:hover {
  box-shadow: 0 0 0 4px rgba(13,110,253,0.12);
}
</style>