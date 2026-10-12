<template>
  <div class="container">
    <div class="card shadow-sm">
      <div class="card-header d-flex align-items-center justify-content-between ">
        <div class="fw-semibold d-flex align-items-center gap-2">
          <span class="badge rounded-pill text-bg-primary">🎯</span>
          Padankan (Klik Kiri → Klik Kanan)
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-warning btn-sm" type="button" @click="resetAll">
            Reset
          </button>
          <button class="btn btn-success btn-sm" type="button" @click="checkAnswers">
            Semak Keputusan
          </button>
        </div>
      </div>

      <!-- board wrapper untuk SVG + confetti overlay -->
      <div class="card-body position-relative" ref="board">
        <!-- confetti canvas overlay -->
        <canvas ref="confetti" class="confetti-canvas"></canvas>

        <!-- SVG LINES OVERLAY -->
        <svg class="lines-layer" :width="boardSize.w" :height="boardSize.h">
          <line
            v-for="ln in computedLines"
            :key="ln.key"
            :x1="ln.x1"
            :y1="ln.y1"
            :x2="ln.x2"
            :y2="ln.y2"
            :stroke-width="4"
            :stroke="ln.color"
            stroke-linecap="round"
            opacity="0.92"
          />
        </svg>

        <div class="row g-3">
          <!-- LEFT -->
          <div class="col-12 col-md-6">
            <div class="fw-semibold mb-2 text-body-secondary">Kiri</div>

            <div class="d-flex flex-column gap-2 me-3">
              <button
                v-for="l in leftItems"
                :key="l.id"
                class="btn text-start d-flex align-items-center justify-content-between rounded-3 btn-tile"
                :class="leftBtnClass(l.id)"
                type="button"
                :ref="setLeftRef(l.id)"
                @click="selectLeft(l.id)"
              >
                <span class="fw-semibold">{{ l.label }}</span>

                <span class="d-flex align-items-center gap-2">
                  <span v-if="pairs[l.id]" class="badge text-dark border ">
                    → {{ getRightLabel(pairs[l.id]) }}
                  </span>

                  <span
                    v-if="checked"
                    class="badge"
                    :class="isCorrect(l.id) ? 'text-bg-success pop' : 'text-bg-danger shake'"
                  >
                    {{ isCorrect(l.id) ? 'Betul' : 'Salah' }}
                  </span>

                  <span class="dot" :class="dotClass(l.id)"></span>
                </span>
              </button>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="col-12 col-md-6">
            <div class="ms-3 fw-semibold mb-2 text-body-secondary">Kanan</div>

            <div class="ms-3 d-flex flex-column gap-2">
              <button
                v-for="(r, idx) in rightItems"
                :key="r.id"
                class="btn text-start d-flex align-items-center justify-content-between rounded-3 btn-tile"
                :class="rightBtnClass(r.id)"
                type="button"
                :ref="setRightRef(r.id)"
                @click="selectRight(r.id)"
              >
                <span class="d-flex align-items-center gap-2">
                  <span class="badge rounded-pill text-bg-info">{{ idx + 1 }}</span>
                  <span class="fw-semibold">{{ r.label }}</span>
                </span>

                <span class="d-flex align-items-center gap-2">
                  <span v-if="rightUsedBy(r.id)" class="badge text-bg-light border soft-badge">
                    ← {{ getLeftLabel(rightUsedBy(r.id)) }}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- footer info -->
        <div class="mt-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div class="text-body-secondary small">
            Tip: Klik item kiri, kemudian klik item kanan untuk padankan. Klik kiri semula untuk tukar.
          </div>

          <div v-if="checked" class="alert alert-light border mb-0 py-2 px-3">
            <span class="fw-semibold">Skor:</span>
            <span class="fw-semibold ms-1">{{ scoreCorrect }}/{{ leftItems.length }}</span>
            <span class="text-muted ms-2">({{ percent }}%)</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MatchingLines",
  props: {
    leftItems: { type: Array, required: true },   // [{ id, label, correctRightId }]
    rightItems: { type: Array, required: true },  // [{ id, label }]
    modelValue: { type: Object, default: () => ({}) },
  },
  emits: ["update:modelValue", "checked"],
  data() {
    return {
      pairs: {},
      selectedLeftId: null,

      leftRefs: {},
      rightRefs: {},

      boardSize: { w: 0, h: 0 },
      checked: false,

      // audio + confetti
      audioCtx: null,
      confettiId: null,
    };
  },
  computed: {
    scoreCorrect() {
      if (!this.checked) return 0;
      return this.leftItems.reduce((acc, l) => acc + (this.isCorrect(l.id) ? 1 : 0), 0);
    },
    percent() {
      if (!this.checked || this.leftItems.length === 0) return 0;
      return Math.round((this.scoreCorrect / this.leftItems.length) * 100);
    },
    computedLines() {
      const lines = [];
      for (const leftId of Object.keys(this.pairs)) {
        const rightId = this.pairs[leftId];
        const L = this.leftRefs[leftId];
        const R = this.rightRefs[rightId];
        const board = this.$refs.board;

        if (!L || !R || !board) continue;

        const bRect = board.getBoundingClientRect();
        const lRect = L.getBoundingClientRect();
        const rRect = R.getBoundingClientRect();

        const x1 = (lRect.right - bRect.left);
        const y1 = (lRect.top + lRect.height / 2 - bRect.top);

        const x2 = (rRect.left - bRect.left);
        const y2 = (rRect.top + rRect.height / 2 - bRect.top);

        let color = "var(--ml-line, #6c757d)";
        if (this.checked) {
          color = this.isCorrect(leftId) ? "var(--ml-success, #198754)" : "var(--ml-danger, #dc3545)";
        } else if (this.selectedLeftId === leftId) {
          color = "var(--ml-primary, #0d6efd)";
        }

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
        const next = {};
        for (const l of this.leftItems) {
          const rid = v?.[l.id] ?? null;
          if (rid) next[l.id] = rid;
        }
        this.pairs = next;
        this.checked = false;
        this.stopConfetti();
        this.$nextTick(this.recalcBoard);
      },
    },
    leftItems: {
      deep: true,
      handler() {
        const next = {};
        for (const l of this.leftItems) {
          const rid = this.pairs?.[l.id] ?? null;
          if (rid) next[l.id] = rid;
        }
        this.pairs = next;
        this.emitModel();
        this.checked = false;
        this.stopConfetti();
        this.$nextTick(this.recalcBoard);
      },
    },
    rightItems: {
      deep: true,
      handler() {
        const rightSet = new Set(this.rightItems.map(r => r.id));
        const next = {};
        for (const [lid, rid] of Object.entries(this.pairs)) {
          if (rightSet.has(rid)) next[lid] = rid;
        }
        this.pairs = next;
        this.emitModel();
        this.checked = false;
        this.stopConfetti();
        this.$nextTick(this.recalcBoard);
      },
    },
  },
  mounted() {
    this.recalcBoard();
    this.resizeConfettiCanvas();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
    this.stopConfetti();
  },
  methods: {
    onResize() {
      this.recalcBoard();
      this.resizeConfettiCanvas();
    },

    // ===== refs setter =====
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

    // ===== labels =====
    getRightLabel(rightId) {
      const r = this.rightItems.find(x => x.id === rightId);
      return r ? r.label : "";
    },
    getLeftLabel(leftId) {
      const l = this.leftItems.find(x => x.id === leftId);
      return l ? l.label : "";
    },

    // ===== pairing logic =====
    emitModel() {
      const out = {};
      for (const l of this.leftItems) out[l.id] = this.pairs[l.id] ?? null;
      this.$emit("update:modelValue", out);
    },

    selectLeft(leftId) {
      this.selectedLeftId = (this.selectedLeftId === leftId) ? null : leftId;
      this.checked = false;
      this.stopConfetti();
      this.$nextTick(this.recalcBoard);
    },

    rightUsedBy(rightId) {
      for (const [lid, rid] of Object.entries(this.pairs)) {
        if (rid === rightId) return lid;
      }
      return null;
    },

    selectRight(rightId) {
      if (!this.selectedLeftId) return;

      const usedBy = this.rightUsedBy(rightId);
      if (usedBy && usedBy !== this.selectedLeftId) delete this.pairs[usedBy];

      this.pairs[this.selectedLeftId] = rightId;
      this.checked = false;
      this.stopConfetti();
      this.emitModel();

      this.selectedLeftId = null;
      this.$nextTick(this.recalcBoard);
    },

    resetAll() {
      this.pairs = {};
      this.selectedLeftId = null;
      this.checked = false;
      this.stopConfetti();
      this.emitModel();
      this.$nextTick(this.recalcBoard);
    },

    // ===== semak =====
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
        percent: this.leftItems.length ? Math.round((this.scoreCorrect / this.leftItems.length) * 100) : 0,
        details: this.leftItems.map(l => ({
          leftId: l.id,
          selectedRightId: this.pairs[l.id] || null,
          correctRightId: l.correctRightId || null,
          isCorrect: this.isCorrect(l.id),
        })),
      };
      this.$emit("checked", payload);

      // kalau betul semua -> bunyi + confetti
      if (this.leftItems.length > 0 && this.scoreCorrect === this.leftItems.length) {
        this.playWinSound();
        this.launchConfetti();
      } else {
        this.stopConfetti();
        this.playCheckSound(); // bunyi semak biasa
      }

      this.$nextTick(this.recalcBoard);
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
    beep(freq, duration = 0.09, type = "sine", volume = 0.18) {
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
      // bunyi "tada kecil" untuk semak biasa
      this.beep(520, 0.07, "triangle", 0.14);
      setTimeout(() => this.beep(740, 0.08, "triangle", 0.14), 90);
    },
    playWinSound() {
      // bunyi menang: naik 3 nota (happy)
      this.beep(660, 0.08, "triangle", 0.20);
      setTimeout(() => this.beep(880, 0.08, "triangle", 0.22), 100);
      setTimeout(() => this.beep(1175, 0.10, "triangle", 0.24), 200);
    },

    // =========================
    // CONFETTI (canvas overlay)
    // =========================
    resizeConfettiCanvas() {
      const canvas = this.$refs.confetti;
      const board = this.$refs.board;
      if (!canvas || !board) return;

      const rect = board.getBoundingClientRect();
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

    // ===== UI helper =====
    dotClass(leftId) {
      if (this.checked) return this.isCorrect(leftId) ? "dot-success" : "dot-danger";
      if (this.selectedLeftId === leftId) return "dot-primary";
      return this.pairs[leftId] ? "dot-muted" : "dot-faint";
    },

    // ===== UI classes =====
    leftBtnClass(leftId) {
      const selected = this.selectedLeftId === leftId;
      const paired = !!this.pairs[leftId];

      return [
        "btn-outline-secondary",
        selected ? "is-selected" : "",
        paired && !selected ? "is-paired" : "",
      ];
    },
    rightBtnClass(rightId) {
      const used = !!this.rightUsedBy(rightId);
      const selectable = !!this.selectedLeftId && !used;

      return [
        "btn-outline-secondary",
        used ? "is-paired" : "",
        selectable ? "is-selectable" : "",
      ];
    },
  },
};
</script>

<style scoped>
/* =========================================
   Theme (Bootstrap 5 light/dark friendly)
   - auto detect prefers-color-scheme
   - also support Bootstrap 5.3: data-bs-theme="dark"
   ========================================= */
:root{
  --ml-primary: #0d6efd;
  --ml-success: #198754;
  --ml-danger: #dc3545;
  --ml-line: #6c757d;

  --ml-surface: #ffffff;
  --ml-surface-2: #f8fafc;
  --ml-border: rgba(0,0,0,.10);
  --ml-shadow: 0 10px 22px rgba(0,0,0,.08);
  --ml-text: #111827;
  --ml-muted: rgba(17,24,39,.68);
}

/* Bootstrap 5.3 dark mode */
:global([data-bs-theme="dark"]) :root,
:global([data-bs-theme="dark"]) {
  --ml-surface: #0b1220;
  --ml-surface-2: #0f172a;
  --ml-border: rgba(255,255,255,.12);
  --ml-shadow: 0 14px 26px rgba(0,0,0,.45);
  --ml-text: rgba(255,255,255,.92);
  --ml-muted: rgba(255,255,255,.70);
}

/* Auto dark if user prefers */
@media (prefers-color-scheme: dark){
  :root{
    --ml-surface: #0b1220;
    --ml-surface-2: #0f172a;
    --ml-border: rgba(255,255,255,.12);
    --ml-shadow: 0 14px 26px rgba(0,0,0,.45);
    --ml-text: rgba(255,255,255,.92);
    --ml-muted: rgba(255,255,255,.70);
  }
}

/* overlays */
.lines-layer{
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.confetti-canvas{
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* tiles */
.btn-tile{
  border-width: 2px;
  transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease, border-color 120ms ease;
  background: var(--ml-surface);
  box-shadow: 0 0 0 rgba(0,0,0,0);
}

.btn-tile:hover{
  transform: translateY(-1px);
  box-shadow: var(--ml-shadow);
}

.is-selected{
  border-color: var(--ml-primary) !important;
  background: rgba(13,110,253,0.10) !important;
  animation: pulse 0.9s ease-in-out infinite;
}

.is-selectable:hover{
  box-shadow: 0 0 0 6px rgba(13,110,253,0.14);
}

.is-paired{
  background: var(--ml-surface-2) !important;
}

/* subtle badge in dark mode */
.soft-badge{
  background: rgba(248,250,252,0.92) !important;
}
:global([data-bs-theme="dark"]) .soft-badge{
  background: rgba(15,23,42,0.75) !important;
  color: var(--ml-text) !important;
  border-color: var(--ml-border) !important;
}
@media (prefers-color-scheme: dark){
  .soft-badge{
    background: rgba(15,23,42,0.75) !important;
    color: var(--ml-text) !important;
    border-color: var(--ml-border) !important;
  }
}

/* dot indicator */
.dot{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
  border: 1px solid var(--ml-border);
  background: rgba(0,0,0,.12);
}
.dot-faint{ background: rgba(0,0,0,.10); }
.dot-muted{ background: rgba(108,117,125,.45); }
.dot-primary{ background: rgba(13,110,253,.85); border-color: rgba(13,110,253,.35); }
.dot-success{ background: rgba(25,135,84,.90); border-color: rgba(25,135,84,.35); }
.dot-danger{ background: rgba(220,53,69,.90); border-color: rgba(220,53,69,.35); }

/* animations */
.pop{ animation: pop 180ms ease-out; }
@keyframes pop{ 0%{ transform: scale(.85);} 100%{ transform: scale(1);} }

.shake{ animation: shake 260ms ease-in-out; }
@keyframes shake{
  0%,100%{ transform: translateX(0); }
  25%{ transform: translateX(-3px); }
  75%{ transform: translateX(3px); }
}

@keyframes pulse{
  0%{ box-shadow: 0 0 0 0 rgba(13,110,253,.22); }
  70%{ box-shadow: 0 0 0 12px rgba(13,110,253,0); }
  100%{ box-shadow: 0 0 0 0 rgba(13,110,253,0); }
}
.fun-header{
  background: linear-gradient(90deg, #7c3aed, #06b6d4);
  color: #fff;
}
</style>