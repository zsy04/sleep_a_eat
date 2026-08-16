/**
 * game-snake.js — 贪吃蛇（赛博科技风）
 * 方向键/WASD 控制，空格暂停
 */
(function () {
  "use strict";

  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");
  const GRID = 20; // 每格 20px
  const COLS = canvas.width / GRID;
  const ROWS = canvas.height / GRID;

  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const gameOverEl = document.getElementById("gameOver");
  const finalScoreEl = document.getElementById("finalScore");
  const btnRestart = document.getElementById("btnRestart");
  const btnBack = document.getElementById("btnBack");

  let snake, dir, nextDir, food, score, best, running, paused, timer;

  best = parseInt(localStorage.getItem("snake-best") || "0", 10);
  bestEl.textContent = best;

  function reset() {
    snake = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 },
    ];
    dir = { x: 1, y: 0 };
    nextDir = dir;
    score = 0;
    scoreEl.textContent = score;
    running = true;
    paused = false;
    placeFood();
    gameOverEl.classList.remove("show");
    clearInterval(timer);
    timer = setInterval(step, 110);
  }

  function placeFood() {
    while (true) {
      const f = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
      if (!snake.some((s) => s.x === f.x && s.y === f.y)) {
        food = f;
        return;
      }
    }
  }

  function step() {
    if (!running || paused) return;
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // 撞墙
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) return gameOver();
    // 撞自己
    if (snake.some((s) => s.x === head.x && s.y === head.y)) return gameOver();

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      scoreEl.textContent = score;
      if (score > best) {
        best = score;
        bestEl.textContent = best;
        localStorage.setItem("snake-best", String(best));
      }
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function gameOver() {
    running = false;
    clearInterval(timer);
    finalScoreEl.textContent = score;
    setTimeout(() => gameOverEl.classList.add("show"), 350);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 网格
    ctx.strokeStyle = "rgba(34,211,238,0.08)";
    ctx.lineWidth = 1;
    for (let i = 1; i < COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID, 0);
      ctx.lineTo(i * GRID, canvas.height);
      ctx.stroke();
    }
    for (let i = 1; i < ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * GRID);
      ctx.lineTo(canvas.width, i * GRID);
      ctx.stroke();
    }

    // 食物（发光红点）
    ctx.shadowColor = "#ff2d55";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#ff2d55";
    ctx.beginPath();
    ctx.arc(food.x * GRID + GRID / 2, food.y * GRID + GRID / 2, GRID / 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 蛇身
    snake.forEach((seg, i) => {
      const alpha = 1 - (i / snake.length) * 0.55;
      ctx.fillStyle = i === 0 ? "#22d3ee" : `rgba(34,211,238,${alpha})`;
      ctx.shadowColor = i === 0 ? "#22d3ee" : "transparent";
      ctx.shadowBlur = i === 0 ? 12 : 0;
      const pad = 2;
      ctx.fillRect(seg.x * GRID + pad, seg.y * GRID + pad, GRID - pad * 2, GRID - pad * 2);
    });
    ctx.shadowBlur = 0;

    // 蛇眼
    const head = snake[0];
    ctx.fillStyle = "#06141c";
    const ex = head.x * GRID + GRID / 2;
    const ey = head.y * GRID + GRID / 2;
    const ox = dir.y !== 0 ? 0 : dir.x * 3;
    const oy = dir.x !== 0 ? 0 : dir.y * 3;
    ctx.beginPath();
    ctx.arc(ex + ox - 4, ey + oy - 4, 2.2, 0, Math.PI * 2);
    ctx.arc(ex + ox + 4, ey + oy - 4, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 键盘控制
  document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();
      paused = !paused;
      return;
    }
    const keyMap = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
      W: { x: 0, y: -1 },
      S: { x: 0, y: 1 },
      A: { x: -1, y: 0 },
      D: { x: 1, y: 0 },
    };
    const nd = keyMap[e.key];
    if (nd) {
      e.preventDefault();
      // 禁止原地掉头
      if (nd.x === -dir.x && nd.y === -dir.y) return;
      nextDir = nd;
    }
  });

  btnRestart.addEventListener("click", reset);
  btnBack.addEventListener("click", () => (window.location.href = "games.html"));

  reset();
  draw();
})();
