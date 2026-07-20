(() => {
  "use strict";

  // ---------- Canvas setup ----------
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const LOGICAL_W = canvas.width;
  const LOGICAL_H = canvas.height;

  function fitCanvasToDPR() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = LOGICAL_W * dpr;
    canvas.height = LOGICAL_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  fitCanvasToDPR();

  // ---------- Court layout ----------
  // Classic hopscotch pattern, bottom (start) to top (home).
  const ROWS_DEF = [[1], [2], [3, 4], [5], [6, 7], [8], [9, 10]];
  const COURT_W = 260;
  const COURT_X = (LOGICAL_W - COURT_W) / 2;
  const COURT_TOP = 60;
  const COURT_H = 560;
  const ROW_H = COURT_H / ROWS_DEF.length;
  const START_ZONE_Y = COURT_TOP + COURT_H + 70;

  const squares = {}; // num -> {x,y,w,h,cx,cy,isPair}
  squares[0] = {
    x: COURT_X,
    y: START_ZONE_Y - 40,
    w: COURT_W,
    h: 80,
    cx: COURT_X + COURT_W / 2,
    cy: START_ZONE_Y,
    isPair: true,
    isStart: true,
  };

  ROWS_DEF.forEach((cells, i) => {
    const topY = COURT_TOP + COURT_H - (i + 1) * ROW_H;
    if (cells.length === 1) {
      const num = cells[0];
      squares[num] = {
        x: COURT_X,
        y: topY,
        w: COURT_W,
        h: ROW_H,
        cx: COURT_X + COURT_W / 2,
        cy: topY + ROW_H / 2,
        isPair: false,
      };
    } else {
      cells.forEach((num, idx) => {
        const w = COURT_W / 2;
        const x = COURT_X + idx * w;
        squares[num] = {
          x,
          y: topY,
          w,
          h: ROW_H,
          cx: x + w / 2,
          cy: topY + ROW_H / 2,
          isPair: true,
        };
      });
    }
  });

  const EASTERN_DIGITS = "٠١٢٣٤٥٦٧٨٩";
  function toEasternDigits(n) {
    return String(n).replace(/[0-9]/g, (d) => EASTERN_DIGITS[+d]);
  }

  // ---------- Audio (tiny beeps, no external assets) ----------
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        audioCtx = null;
      }
    }
  }
  function playTone(freq, duration, type = "sine", gain = 0.08) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }
  const sfx = {
    success: () => playTone(880, 0.15, "sine"),
    fail: () => playTone(140, 0.35, "sawtooth", 0.12),
    roundComplete: () => {
      playTone(660, 0.12);
      setTimeout(() => playTone(880, 0.18), 100);
    },
  };

  // ---------- Game state ----------
  const state = {
    phase: "start", // start | ready | oscillating | jumping | fail | roundComplete | gameover
    round: 1,
    score: 0,
    lives: 3,
    stoneNum: null,
    sequence: [], // list of target square numbers for this round
    seqIndex: 0,
    currentPos: 0, // current square number player stands on (0 = start zone)
    osc: { t: 0, dir: 1, value: 0.5 },
    jumpAnim: null, // {from, to, t, duration}
    failTimer: 0,
    successTimer: 0,
    roundCompleteTimer: 0,
    shake: 0,
  };

  function buildRoundSequence() {
    const candidates = [2, 3, 4, 5, 6, 7, 8, 9];
    state.stoneNum = candidates[Math.floor(Math.random() * candidates.length)];
    const forward = [];
    for (let n = 1; n <= 10; n++) if (n !== state.stoneNum) forward.push(n);
    const backward = forward.slice(0, -1).reverse();
    state.sequence = forward.concat(backward).concat([0]);
    state.seqIndex = 0;
    state.currentPos = 0;
  }

  function startNewGame() {
    state.round = 1;
    state.score = 0;
    state.lives = 3;
    state.phase = "ready";
    buildRoundSequence();
    updateHud();
  }

  function difficultyForRound(round) {
    return {
      speed: 1.2 + round * 0.18, // oscillation speed
      zoneHalf: Math.max(0.1, 0.32 - round * 0.02),
    };
  }

  function currentTarget() {
    return state.sequence[state.seqIndex];
  }

  function beginOscillation() {
    state.phase = "oscillating";
    state.osc.t = Math.random() * Math.PI * 2;
    state.osc.dir = Math.random() < 0.5 ? -1 : 1;
  }

  function attemptJump() {
    ensureAudio();
    if (state.phase === "start") {
      return; // handled by button
    }
    if (state.phase === "ready") {
      beginOscillation();
      return;
    }
    if (state.phase !== "oscillating") return;

    const targetNum = currentTarget();
    const targetSquare = squares[targetNum];
    const diff = difficultyForRound(state.round);
    let zoneHalf = diff.zoneHalf;
    if (targetSquare.isPair) zoneHalf = Math.min(0.48, zoneHalf + 0.14);
    if (targetSquare.isStart) zoneHalf = 0.45;

    const value = state.osc.value; // 0..1, 0.5 = perfect center
    const distFromCenter = Math.abs(value - 0.5);
    const success = distFromCenter <= zoneHalf;

    const fromSquare = squares[state.currentPos];
    state.jumpAnim = {
      from: { x: fromSquare.cx, y: fromSquare.cy },
      to: { x: targetSquare.cx, y: targetSquare.cy },
      t: 0,
      duration: 0.32,
      success,
      landedTargetNum: targetNum,
    };
    state.phase = "jumping";
  }

  function onJumpAnimDone() {
    const anim = state.jumpAnim;
    if (anim.success) {
      sfx.success();
      state.currentPos = anim.landedTargetNum;
      state.seqIndex++;
      state.score += 10 * state.round;
      updateHud();
      if (state.seqIndex >= state.sequence.length) {
        state.phase = "roundComplete";
        state.roundCompleteTimer = 1.1;
        sfx.roundComplete();
        state.score += 50 * state.round;
        updateHud();
      } else {
        state.phase = "ready";
      }
    } else {
      sfx.fail();
      state.lives--;
      state.shake = 0.4;
      updateHud();
      if (state.lives <= 0) {
        state.phase = "gameover";
        showGameOver();
      } else {
        state.phase = "fail";
        state.failTimer = 0.6;
      }
    }
    state.jumpAnim = null;
  }

  // ---------- HUD ----------
  const roundValueEl = document.getElementById("roundValue");
  const scoreValueEl = document.getElementById("scoreValue");
  const livesValueEl = document.getElementById("livesValue");
  const hintText = document.getElementById("hintText");
  const startScreen = document.getElementById("startScreen");
  const gameOverScreen = document.getElementById("gameOverScreen");
  const finalScoreEl = document.getElementById("finalScore");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");

  function updateHud() {
    roundValueEl.textContent = toEasternDigits(state.round);
    scoreValueEl.textContent = toEasternDigits(state.score);
    livesValueEl.textContent = "❤️".repeat(Math.max(0, state.lives)) || "💔";
  }

  function showGameOver() {
    finalScoreEl.textContent = toEasternDigits(state.score);
    gameOverScreen.classList.remove("hidden");
  }

  startBtn.addEventListener("click", () => {
    ensureAudio();
    startScreen.classList.add("hidden");
    startNewGame();
  });
  restartBtn.addEventListener("click", () => {
    gameOverScreen.classList.add("hidden");
    startNewGame();
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      if (state.phase !== "start" && state.phase !== "gameover") attemptJump();
    }
  });
  canvas.addEventListener("pointerdown", () => {
    if (state.phase !== "start" && state.phase !== "gameover") attemptJump();
  });

  // ---------- Drawing ----------
  function drawSquare(num) {
    const sq = squares[num];
    ctx.save();
    let fill = "#fffaf3";
    if (num === state.stoneNum) fill = "#ffd9c2";
    if (num === state.currentPos) fill = "#e4f7e0";
    if (sq.isStart) fill = "#eae6ff";
    ctx.fillStyle = fill;
    ctx.fillRect(sq.x, sq.y, sq.w, sq.h);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#3a2e4a";
    ctx.strokeRect(sq.x, sq.y, sq.w, sq.h);
    ctx.restore();

    if (!sq.isStart) {
      ctx.fillStyle = "#6b5b73";
      ctx.font = "bold 26px Segoe UI";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(toEasternDigits(num), sq.cx, sq.cy - (sq.isPair ? 14 : 0));
    } else {
      ctx.fillStyle = "#6b5b73";
      ctx.font = "bold 16px Segoe UI";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("البداية", sq.cx, sq.cy);
    }

    if (num === state.stoneNum) {
      drawStone(sq.cx, sq.cy + (sq.isPair ? 14 : 20));
    }
  }

  function drawStone(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.fillStyle = "#7a6a58";
    ctx.moveTo(-10, 4);
    ctx.quadraticCurveTo(-12, -8, 0, -9);
    ctx.quadraticCurveTo(12, -8, 10, 4);
    ctx.quadraticCurveTo(6, 10, 0, 9);
    ctx.quadraticCurveTo(-6, 10, -10, 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#a89279";
    ctx.beginPath();
    ctx.ellipse(-3, -2, 3, 2, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPlayer(x, y) {
    ctx.save();
    ctx.translate(x, y - 18);
    ctx.beginPath();
    ctx.fillStyle = "#ff6f91";
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3a2e4a";
    ctx.beginPath();
    ctx.arc(-5, -3, 2.2, 0, Math.PI * 2);
    ctx.arc(5, -3, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = "#3a2e4a";
    ctx.lineWidth = 2;
    ctx.arc(0, 3, 6, 0, Math.PI, false);
    ctx.stroke();
    ctx.restore();
  }

  function drawOscillationBar() {
    const barW = 260;
    const barH = 26;
    const x = (LOGICAL_W - barW) / 2;
    const y = LOGICAL_H - 46;

    const diff = difficultyForRound(state.round);
    const targetSquare = squares[currentTarget()];
    let zoneHalf = diff.zoneHalf;
    if (targetSquare.isPair) zoneHalf = Math.min(0.48, zoneHalf + 0.14);
    if (targetSquare.isStart) zoneHalf = 0.45;

    ctx.save();
    ctx.fillStyle = "#f0e9f7";
    ctx.fillRect(x, y, barW, barH);
    ctx.strokeStyle = "#3a2e4a";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barW, barH);

    const zoneX = x + (0.5 - zoneHalf) * barW;
    const zoneW = zoneHalf * 2 * barW;
    ctx.fillStyle = "rgba(122, 214, 133, 0.55)";
    ctx.fillRect(zoneX, y, zoneW, barH);

    if (state.phase === "oscillating") {
      const markerX = x + state.osc.value * barW;
      ctx.fillStyle = "#ff6f91";
      ctx.beginPath();
      ctx.arc(markerX, y + barH / 2, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawScene() {
    ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);

    ctx.save();
    if (state.shake > 0) {
      const s = state.shake;
      ctx.translate((Math.random() - 0.5) * 10 * s, (Math.random() - 0.5) * 10 * s);
    }

    drawSquare(0);
    for (let n = 1; n <= 10; n++) drawSquare(n);

    // player position / jump animation
    if (state.jumpAnim) {
      const a = state.jumpAnim;
      const t = Math.min(1, a.t / a.duration);
      const x = a.from.x + (a.to.x - a.from.x) * t;
      const yLinear = a.from.y + (a.to.y - a.from.y) * t;
      const dist = Math.hypot(a.to.x - a.from.x, a.to.y - a.from.y);
      const arc = Math.sin(Math.PI * t) * Math.max(30, dist * 0.35);
      drawPlayer(x, yLinear - arc);
    } else {
      const p = squares[state.currentPos];
      drawPlayer(p.cx, p.cy);
    }

    ctx.restore();

    if (state.phase === "oscillating" || state.phase === "ready") {
      drawOscillationBar();
    }

    if (state.phase === "fail") {
      ctx.save();
      ctx.fillStyle = "rgba(200, 40, 60, 0.18)";
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
      ctx.fillStyle = "#b0203c";
      ctx.font = "bold 30px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText("لمستي الخط! ❌", LOGICAL_W / 2, LOGICAL_H / 2);
      ctx.restore();
    }

    if (state.phase === "roundComplete") {
      ctx.save();
      ctx.fillStyle = "rgba(60, 180, 100, 0.2)";
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
      ctx.fillStyle = "#237a45";
      ctx.font = "bold 28px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText("جولة كاملة! 🎉", LOGICAL_W / 2, LOGICAL_H / 2);
      ctx.restore();
    }
  }

  function updateHint() {
    if (state.phase === "ready") hintText.textContent = "دوسي/اضغطي مسافة عشان تجهزي للنطة";
    else if (state.phase === "oscillating") hintText.textContent = "دوسي وقت ما تكوني في المنطقة الخضرا!";
    else if (state.phase === "fail") hintText.textContent = "معلش! هاتها تاني";
    else if (state.phase === "roundComplete") hintText.textContent = "برافو! جولة جديدة جاية...";
    else hintText.textContent = "اضغطي مسافة أو دوسي على الشاشة للنط";
  }

  // ---------- Main loop ----------
  let lastTime = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    if (state.phase === "oscillating") {
      const diff = difficultyForRound(state.round);
      state.osc.t += dt * diff.speed * Math.PI;
      state.osc.value = 0.5 + 0.48 * Math.sin(state.osc.t);
      if (state.osc.value < 0) state.osc.value = 0;
      if (state.osc.value > 1) state.osc.value = 1;
    }

    if (state.phase === "jumping" && state.jumpAnim) {
      state.jumpAnim.t += dt;
      if (state.jumpAnim.t >= state.jumpAnim.duration) {
        onJumpAnimDone();
      }
    }

    if (state.phase === "fail") {
      state.failTimer -= dt;
      if (state.failTimer <= 0) state.phase = "ready";
    }

    if (state.phase === "roundComplete") {
      state.roundCompleteTimer -= dt;
      if (state.roundCompleteTimer <= 0) {
        state.round++;
        buildRoundSequence();
        state.phase = "ready";
        updateHud();
      }
    }

    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 2);

    updateHint();
    drawScene();
    requestAnimationFrame(loop);
  }

  updateHud();
  drawScene();
  requestAnimationFrame(loop);
})();
