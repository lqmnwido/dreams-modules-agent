<template>
  <div class="container py-3">
    <div class="card shadow-sm border-0 ">
      <div class="card-header border-0 d-flex flex-wrap align-items-center justify-content-between gap-2 ">
        <div class="d-flex align-items-center gap-2">
          <span class="badge rounded-pill text-dark border">🧩</span>
          <div class="fw-bold">Memory Match (Istilah ↔ Maksud)</div>
          <span class="text-white-50 small">Klik 2 kad untuk padan</span>
        </div>

        <div class="d-flex flex-wrap gap-2 align-items-center">
          <div class="btn-group btn-group-sm" role="group" aria-label="Difficulty">
            <button class="btn " :class="diff==='easy' ? 'btn-dark' : 'btn-outline-light text-dark'" @click="setDifficulty('easy')">
              Easy
            </button>
            <button class="btn " :class="diff==='medium' ? 'btn-dark' : 'btn-outline-light text-dark'" @click="setDifficulty('medium')">
              Medium
            </button>
            <button class="btn " :class="diff==='hard' ? 'btn-dark' : 'btn-outline-light text-dark'" @click="setDifficulty('hard')">
              Hard
            </button>
          </div>

          <button class="btn btn-primary btn-sm" type="button" @click="useHint" :disabled="hintDisabled">
            💡 Hint <span class="badge  ms-1">{{ hintLeft }}</span>
          </button>

          <button class="btn btn-light btn-sm" type="button" @click="resetGame(true)">
            🔀 Shuffle
          </button>

          <button class="btn btn-dark btn-sm" type="button" @click="resetGame(false)">
            Reset
          </button>
        </div>
      </div>

      <div class="card-body position-relative">
        <!-- Confetti canvas -->
        <canvas ref="confetti" class="confetti"></canvas>

        <!-- scoreboard -->
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="badge text-dark border ">
            Betul: <b>{{ matchedCount }}</b>/<b>{{ activePairs.length }}</b>
          </span>
          <span class="badge text-dark border ">
            Cubaan: <b>{{ moves }}</b>
          </span>
          <span class="badge text-dark border ">
            Masa: <b>{{ timeLabel }}</b>
          </span>
          <span class="badge text-dark border ">
            Hint tinggal: <b>{{ hintLeft }}</b>
          </span>
        </div>

        <!-- grid -->
        <div class="grid" :class="gridClass">
          <button
            v-for="card in cards"
            :key="card.uid"
            class="flip-card"
            type="button"
            :disabled="lock || card.matched"
            @click="onCardClick(card.uid)"
            :title="card.matched ? 'Dah padan ✅' : 'Klik untuk flip'"
          >
            <div
              class="flip-inner"
              :class="{
                flipped: isFaceUp(card.uid) || card.matched || card.tempReveal,
                matched: card.matched,
                wrong: showWrongPulse && (card.uid === firstPickUid || card.uid === secondPickUid) && !lastWasMatch
              }"
            >
              <!-- back -->
              <div :class="['flip-face ',  card.type === 'second' ? 'back' : 'back-second']">
                <div class="back-chip">
                  {{ card.type === 'second' ? 'MAKSUD' : 'ISTILAH' }}
                </div>
                <div class="back-icon">🎴</div>
              </div>

              <!-- front -->
              <div class="flip-face front" :class="card.type">
                <div class="front-top">
                  <span class="badge rounded-pill" :class="card.type === 'second' ? 'text-bg-warning' : 'text-bg-info'">
                    {{ card.type === 'second' ? 'Maksud' : 'Istilah' }}
                  </span>
                </div>

                <div class="front-text" :dir="card.type === 'second' ? 'rtl' : 'ltr'">
                  {{ card.label }}
                </div>

                <div v-if="card.matched" class="matched-stamp">
                  ✅
                </div>
              </div>
            </div>
          </button>
        </div>

        <div class="mt-3">
          <div v-if="won" class="alert alert-success mb-0">
            🎉 Tahniah! Semua padanan berjaya.
            Cubaan: <b>{{ moves }}</b>, Masa: <b>{{ timeLabel }}</b>
          </div>
          <div v-else class="text-body-secondary small">
            Tip: Kalau tak padan, kad akan flip balik. Gunakan Hint bila tersekat 😉
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Input prop `pairs` boleh banyak; difficulty akan ambil sebahagian (easy/medium/hard)
export default {
  name: "CardFlipMatchingFun",
  props: {
    // [{ id:'p1', second:'...', first:'...' }, ...]
    pairs: { type: Array, required: true },

    flipBackDelay: { type: Number, default: 650 },
    hintRevealMs: { type: Number, default: 900 },

    difficultyMap: {
      type: Object,
      default: () => ({
        easy: { take: 6, cols: 4, hints: 3 },
        medium: { take: 8, cols: 4, hints: 2 },
        hard: { take: 10, cols: 5, hints: 1 },
      }),
    },
  },
  data() {
    return {
      diff: "medium",
      activePairs: [],

      cards: [],
      firstPickUid: null,
      secondPickUid: null,
      lock: false,

      moves: 0,
      matchedCount: 0,

      seconds: 0,
      timerId: null,

      hintLeft: 0,
      hintCooldown: false,

      won: false,

      // audio ctx
      audioCtx: null,

      // confetti
      confettiId: null,

      // interaction visuals
      lastWasMatch: true,
      showWrongPulse: false,
    };
  },
  computed: {
    timeLabel() {
      const mm = String(Math.floor(this.seconds / 60)).padStart(2, "0");
      const ss = String(this.seconds % 60).padStart(2, "0");
      return `${mm}:${ss}`;
    },
    gridClass() {
      const cols = this.difficultyMap?.[this.diff]?.cols ?? 4;
      return `cols-${cols}`;
    },
    hintDisabled() {
      return this.hintLeft <= 0 || this.hintCooldown || this.lock || this.won;
    },
  },
  watch: {
    pairs: {
      immediate: true,
      deep: true,
      handler() {
        this.setDifficulty(this.diff);
      },
    },
  },
  mounted() {
    this.resizeConfettiCanvas();
    window.addEventListener("resize", this.resizeConfettiCanvas, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeConfettiCanvas);
    this.stopTimer();
    this.stopConfetti();
  },
  methods: {
    // -------------------------
    // Difficulty / Setup
    // -------------------------
    setDifficulty(d) {
      this.diff = d;
      this.resetGame(true);
    },

    resetGame(shuffle = true) {
      this.stopTimer();
      this.stopConfetti();

      this.seconds = 0;
      this.moves = 0;
      this.matchedCount = 0;
      this.won = false;

      this.firstPickUid = null;
      this.secondPickUid = null;
      this.lock = false;

      this.lastWasMatch = true;
      this.showWrongPulse = false;

      const conf = this.difficultyMap?.[this.diff] || { take: 8, cols: 4, hints: 2 };

      const pool = [...this.pairs];
      const picked = shuffle ? this.shuffleArray(pool).slice(0, conf.take) : pool.slice(0, conf.take);
      this.activePairs = picked;

      this.hintLeft = conf.hints;
      this.hintCooldown = false;

      const built = [];
      for (const p of picked) {
        built.push({ uid: `ar_${p.id}`, pairId: p.id, type: "second", label: p.second, matched: false, tempReveal: false });
        built.push({ uid: `bm_${p.id}`, pairId: p.id, type: "first", label: p.first, matched: false, tempReveal: false });
      }

      this.cards = shuffle ? this.shuffleArray(built) : built;
    },

    shuffleArray(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },

    // -------------------------
    // Timer
    // -------------------------
    startTimerIfNeeded() {
      if (this.timerId) return;
      this.timerId = setInterval(() => (this.seconds += 1), 1000);
    },
    stopTimer() {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    },

    // -------------------------
    // Card Helpers
    // -------------------------
    isFaceUp(uid) {
      return uid === this.firstPickUid || uid === this.secondPickUid;
    },
    getCard(uid) {
      return this.cards.find((c) => c.uid === uid);
    },

    // -------------------------
    // Sound (WebAudio) - improved (check, correct, wrong, win)
    // -------------------------
    ensureAudio() {
      if (this.audioCtx) return this.audioCtx;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      this.audioCtx = new Ctx();
      return this.audioCtx;
    },
    beep(freq = 440, duration = 0.09, type = "triangle", volume = 0.18) {
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
    soundFlip() {
      // soft click
      this.beep(420, 0.045, "triangle", 0.09);
    },
    soundCorrect() {
      // happy double
      this.beep(740, 0.085, "triangle", 0.18);
      setTimeout(() => this.beep(980, 0.085, "triangle", 0.20), 90);
    },
    soundWrong() {
      // short low
      this.beep(220, 0.11, "sawtooth", 0.16);
    },
    soundWin() {
      // win chord-ish sequence
      this.beep(660, 0.08, "triangle", 0.22);
      setTimeout(() => this.beep(880, 0.08, "triangle", 0.24), 90);
      setTimeout(() => this.beep(1175, 0.10, "triangle", 0.26), 180);
      setTimeout(() => this.beep(1568, 0.12, "triangle", 0.22), 280);
    },

    // -------------------------
    // Click Logic
    // -------------------------
    onCardClick(uid) {
      const card = this.getCard(uid);
      if (!card || card.matched) return;
      if (this.lock) return;

      this.startTimerIfNeeded();

      if (uid === this.firstPickUid) return;

      this.soundFlip();

      if (!this.firstPickUid) {
        this.firstPickUid = uid;
        return;
      }

      this.secondPickUid = uid;
      this.moves += 1;
      this.lock = true;

      const first = this.getCard(this.firstPickUid);
      const second = this.getCard(this.secondPickUid);

      const isMatch =
        first &&
        second &&
        first.pairId === second.pairId &&
        first.type !== second.type;

      this.lastWasMatch = !!isMatch;

      if (isMatch) {
        first.matched = true;
        second.matched = true;

        this.matchedCount += 1;
        this.soundCorrect();

        this.firstPickUid = null;
        this.secondPickUid = null;
        this.lock = false;

        if (this.matchedCount === this.activePairs.length) {
          this.won = true;
          this.stopTimer();
          this.soundWin();
          this.launchConfetti();
        }
      } else {
        this.soundWrong();
        this.showWrongPulse = true;

        setTimeout(() => {
          this.firstPickUid = null;
          this.secondPickUid = null;
          this.lock = false;
          this.showWrongPulse = false;
        }, this.flipBackDelay);
      }
    },

    // -------------------------
    // Hint
    // -------------------------
    useHint() {
      if (this.hintDisabled) return;

      const unmatchedPairIds = new Set(this.activePairs.map(p => p.id));
      for (const c of this.cards) if (c.matched) unmatchedPairIds.delete(c.pairId);

      const list = Array.from(unmatchedPairIds);
      if (list.length === 0) return;

      const pairId = list[Math.floor(Math.random() * list.length)];
      const c1 = this.cards.find(c => c.pairId === pairId && c.type === "second");
      const c2 = this.cards.find(c => c.pairId === pairId && c.type === "first");
      if (!c1 || !c2) return;

      this.hintLeft -= 1;
      this.hintCooldown = true;

      // reveal sekejap tanpa ganggu pick user
      c1.tempReveal = true;
      c2.tempReveal = true;

      // hint sound (sparkle)
      this.beep(880, 0.06, "triangle", 0.12);
      setTimeout(() => this.beep(1175, 0.06, "triangle", 0.12), 70);

      setTimeout(() => {
        c1.tempReveal = false;
        c2.tempReveal = false;
        this.hintCooldown = false;
      }, this.hintRevealMs);
    },

    // -------------------------
    // Confetti (simple canvas)
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

      const pieces = Array.from({ length: 140 }).map(() => ({
        x: Math.random() * W,
        y: -10 - Math.random() * H * 0.2,
        r: 3 + Math.random() * 5,
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

          if (p.x < -20) p.x = W + 20;
          if (p.x > W + 20) p.x = -20;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);

          const hue = (tick * 3 + p.x) % 360;
          ctx.fillStyle = `hsl(${hue}, 90%, 55%)`;
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);

          ctx.restore();
        }

        const alive = pieces.some(p => p.life > 0 && p.y < H + 30);
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
   ========================= */
:root{
  --fun-text: #111827;
  --fun-muted: rgba(17,24,39,.75);
  --fun-surface: #ffffff;
  --fun-surface-2: #f8fafc;
  --fun-border: rgba(0,0,0,0.10);
  --fun-shadow: 0 10px 22px rgba(0,0,0,0.10);

  --fun-front-bg: #ffffff;
  --fun-front-border: rgba(0,0,0,0.06);

  --fun-back-text: #111827;
  --fun-back-chip-border: rgba(0,0,0,0.18);
  --fun-back-chip-bg: rgba(255,255,255,0.60);

  --fun-confetti-z: 5;
}

/* Bootstrap 5.3 dark mode support */
:global([data-bs-theme="dark"]) :root,
:global([data-bs-theme="dark"]) {
  --fun-text: rgba(255,255,255,.92);
  --fun-muted: rgba(255,255,255,.70);
  --fun-surface: #0b1220;
  --fun-surface-2: #0f172a;
  --fun-border: rgba(255,255,255,0.10);
  --fun-shadow: 0 14px 26px rgba(0,0,0,0.45);

  --fun-front-bg: #0f172a;
  --fun-front-border: rgba(255,255,255,0.10);

  --fun-back-text: rgba(255,255,255,.92);
  --fun-back-chip-border: rgba(255,255,255,0.22);
  --fun-back-chip-bg: rgba(15,23,42,0.70);
}

/* Auto dark mode (browser preference) */
@media (prefers-color-scheme: dark){
  :root{
    --fun-text: rgba(255,255,255,.92);
    --fun-muted: rgba(255,255,255,.70);
    --fun-surface: #0b1220;
    --fun-surface-2: #0f172a;
    --fun-border: rgba(255,255,255,0.10);
    --fun-shadow: 0 14px 26px rgba(0,0,0,0.45);

    --fun-front-bg: #0f172a;
    --fun-front-border: rgba(255,255,255,0.10);

    --fun-back-text: rgba(255,255,255,.92);
    --fun-back-chip-border: rgba(255,255,255,0.22);
    --fun-back-chip-bg: rgba(15,23,42,0.70);
  }
}

/* =========================
   Card look
   ========================= */
.fun-card{
  border-radius: 18px;
  overflow: hidden;
  background: var(--fun-surface);
  color: var(--fun-text);
}

/* header gradient ok for both */
.fun-header{
  background: linear-gradient(90deg, #7c3aed, #06b6d4);
  color: #fff;
}

/* confetti overlay */
.confetti{
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: var(--fun-confetti-z);
}

/* score badges look ok in dark */
.soft-badge{
  background: rgba(248,250,252,0.92) !important;
}
:global([data-bs-theme="dark"]) .soft-badge{
  background: rgba(15,23,42,0.75) !important;
  color: var(--fun-text) !important;
  border-color: var(--fun-border) !important;
}
@media (prefers-color-scheme: dark){
  .soft-badge{
    background: rgba(15,23,42,0.75) !important;
    color: var(--fun-text) !important;
    border-color: var(--fun-border) !important;
  }
}

/* Grid responsive */
.grid{
  display: grid;
  gap: 12px;
}
.grid.cols-4{ grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid.cols-5{ grid-template-columns: repeat(5, minmax(0, 1fr)); }

@media (max-width: 992px){
  .grid.cols-5{ grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
@media (max-width: 576px){
  .grid.cols-4, .grid.cols-5{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* Flip card */
.flip-card{
  border: none;
  background: transparent;
  padding: 0;
  perspective: 900px;
  height: 120px;
}
@media (max-width: 576px){
  .flip-card{ height: 110px; }
}

.flip-inner{
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 240ms ease, filter 180ms ease;
  transform-style: preserve-3d;
}
.flip-inner.flipped{
  transform: rotateY(180deg);
}

/* matched glow */
.flip-inner.matched .front{
  box-shadow: 0 0 0 6px rgba(25,135,84,0.16), var(--fun-shadow);
  transform: rotateY(180deg) scale(1.01);
}

/* wrong pulse */
.flip-inner.wrong .front{
  animation: wrongPulse 280ms ease-in-out;
}

@keyframes wrongPulse{
  0%{ transform: rotateY(180deg) scale(1); }
  50%{ transform: rotateY(180deg) scale(1.03); box-shadow: 0 0 0 6px rgba(220,53,69,0.18), var(--fun-shadow); }
  100%{ transform: rotateY(180deg) scale(1); }
}

.flip-face{
  position: absolute;
  inset: 0;
  border-radius: 16px;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px;
  box-shadow: var(--fun-shadow);
}

/* Back */
.back{
  background: linear-gradient(135deg, #fb7185, #f59e0b);
  color: var(--fun-back-text);
  align-items: center;
  gap: 10px;
}
.back-second{
  background: linear-gradient(135deg, #47428e, #841f86);
  color: var(--fun-back-text);
  align-items: center;
  gap: 10px;
}
.back-chip{
  font-weight: 900;
  letter-spacing: 1px;
  border: 1px solid var(--fun-back-chip-border);
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: var(--fun-back-chip-bg);
}
.back-icon{
  font-size: 26px;
}

/* Front */
.front{
  transform: rotateY(180deg);
  background: var(--fun-front-bg);
  color: var(--fun-text);
  border: 2px solid var(--fun-front-border);
}

/* accent border */
.front.second{ border-color: rgba(245,158,11,0.45); }
.front.first{ border-color: rgba(6,182,212,0.45); }

.front-top{
  position: absolute;
  top: 10px;
  right: 10px;
}

.front-text{
  font-weight: 900;
  font-size: 18px;
  text-align: center;
  line-height: 1.2;
  padding-top: 8px;
}

/* matched stamp */
.matched-stamp{
  position: absolute;
  left: 10px;
  top: 10px;
  font-size: 18px;
  opacity: 0.9;
}

/* disable */
.flip-card:disabled{
  opacity: 0.70;
  cursor: not-allowed;
}
</style>