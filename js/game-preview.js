/**
 * game-preview.js — 游戏列表页的真实预览画面
 * 用 Canvas 绘制三个迷你游戏场景（静态"截图"感）
 */
(function () {
  "use strict";

  function drawSnakePreview(canvas) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const GRID = Math.floor(w / 12);

    // 背景
    ctx.fillStyle = "#0a1418";
    ctx.fillRect(0, 0, w, h);
    // 网格
    ctx.strokeStyle = "rgba(34,211,238,0.15)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += GRID) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += GRID) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    // 蛇身（S 形）
    const segs = [
      [4, 4], [5, 4], [6, 4], [7, 4], [7, 5], [7, 6], [6, 6], [5, 6], [4, 6], [3, 6],
    ];
    segs.forEach(([cx, cy], i) => {
      ctx.fillStyle = i === 0 ? "#22d3ee" : `rgba(34,211,238,${Math.max(0.35, 1 - i * 0.07)})`;
      ctx.shadowColor = i === 0 ? "#22d3ee" : "transparent";
      ctx.shadowBlur = i === 0 ? 8 : 0;
      ctx.fillRect(cx * GRID + 2, cy * GRID + 2, GRID - 4, GRID - 4);
    });
    ctx.shadowBlur = 0;
    // 蛇眼
    ctx.fillStyle = "#06141c";
    ctx.fillRect(4 * GRID + GRID - 9, 4 * GRID + 5, 4, 4);
    ctx.fillRect(4 * GRID + GRID - 9, 4 * GRID + GRID - 9, 4, 4);
    // 食物
    ctx.shadowColor = "#ff2d55";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ff2d55";
    ctx.beginPath();
    ctx.arc(9 * GRID + GRID / 2, 8 * GRID + GRID / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawRunnerPreview(canvas) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const groundY = h - 26;

    ctx.fillStyle = "#140a0e";
    ctx.fillRect(0, 0, w, h);

    // 地面霓虹线
    ctx.strokeStyle = "rgba(255,45,85,0.8)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ff2d55";
    ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(w, groundY); ctx.stroke();
    ctx.shadowBlur = 0;

    // 地面刻度
    ctx.strokeStyle = "rgba(255,45,85,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, groundY + 7); ctx.lineTo(w, groundY + 7); ctx.stroke();

    // 玩家（霓虹小人）
    const px = w * 0.22, py = groundY - 34, pw = 20, ph = 34;
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(px, py, pw, ph);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#06141c";
    ctx.fillRect(px + pw - 7, py + 6, 4, 4);
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(px + 2, py + ph - 5, 6, 5);
    ctx.fillRect(px + pw - 8, py + ph - 5, 6, 5);

    // 障碍物（两个不同高度，模拟连续障碍）
    const obs = [
      { x: w * 0.55, w: 16, h: 26 },
      { x: w * 0.78, w: 14, h: 38 },
    ];
    obs.forEach((o) => {
      ctx.shadowColor = "#ff2d55";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#ff2d55";
      ctx.fillRect(o.x, groundY - o.h, o.w, o.h);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillRect(o.x + o.w * 0.25, groundY - o.h + 3, o.w * 0.15, o.h - 6);
    });

    // 速度标签
    ctx.fillStyle = "#f5b942";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText("SPEED 9x", 8, 16);
  }

  function draw2048Preview(canvas) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const pad = 6, gap = 4;
    const cell = (w - pad * 2 - gap * 3) / 4;

    ctx.fillStyle = "#141108";
    ctx.fillRect(0, 0, w, h);

    const tiles = [
      [0, 0, 2], [1, 0, 0], [2, 0, 4], [3, 0, 0],
      [0, 1, 8], [1, 1, 2], [2, 1, 0], [3, 1, 16],
      [0, 2, 0], [1, 2, 32], [2, 2, 2], [3, 2, 0],
      [0, 3, 4], [1, 3, 0], [2, 3, 8], [3, 3, 64],
    ];
    const colors = {
      0: "#171410",
      2: "#232019", 4: "#2c281d",
      8: "rgba(255,45,85,0.4)", 16: "rgba(255,45,85,0.6)",
      32: "#ff2d55", 64: "#a3123a",
      128: "rgba(245,185,66,0.6)",
    };
    const textColors = {
      2: "#a7adb9", 4: "#a7adb9",
      8: "#fff", 16: "#fff", 32: "#fff", 64: "#fff",
      128: "#141108",
    };

    tiles.forEach(([cx, cy, v]) => {
      const x = pad + cx * (cell + gap);
      const y = pad + cy * (cell + gap);
      ctx.fillStyle = colors[v] || colors[0];
      if (v >= 8) {
        ctx.shadowColor = v >= 32 ? "rgba(255,45,85,0.6)" : "transparent";
        ctx.shadowBlur = v >= 32 ? 8 : 0;
      }
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, cell, cell, 4) : ctx.rect(x, y, cell, cell);
      ctx.fill();
      ctx.shadowBlur = 0;
      if (v !== 0) {
        ctx.fillStyle = textColors[v] || "#fff";
        ctx.font = "bold " + Math.max(10, Math.floor(cell * 0.5)) + "px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(v), x + cell / 2, y + cell / 2 + 1);
      }
    });
  }

  function init() {
    const snake = document.getElementById("preview-snake");
    const runner = document.getElementById("preview-runner");
    const g2048 = document.getElementById("preview-2048");
    if (snake) drawSnakePreview(snake);
    if (runner) drawRunnerPreview(runner);
    if (g2048) draw2048Preview(g2048);
  }

  // 等 DOM 与 CSS 就绪后绘制（preview 需要确定尺寸）
  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      const snake = document.getElementById("preview-snake");
      const runner = document.getElementById("preview-runner");
      const g2048 = document.getElementById("preview-2048");
      if (snake) {
        snake.width = snake.clientWidth || 260;
        snake.height = snake.clientHeight || 130;
      }
      if (runner) {
        runner.width = runner.clientWidth || 260;
        runner.height = runner.clientHeight || 130;
      }
      if (g2048) {
        g2048.width = g2048.clientWidth || 260;
        g2048.height = g2048.clientHeight || 130;
      }
      init();
    });
  });

  // 窗口尺寸变化时重绘
  window.addEventListener("resize", () => {
    requestAnimationFrame(() => {
      const snake = document.getElementById("preview-snake");
      const runner = document.getElementById("preview-runner");
      const g2048 = document.getElementById("preview-2048");
      if (snake) { snake.width = snake.clientWidth; snake.height = snake.clientHeight; }
      if (runner) { runner.width = runner.clientWidth; runner.height = runner.clientHeight; }
      if (g2048) { g2048.width = g2048.clientWidth; g2048.height = g2048.clientHeight; }
      init();
    });
  });
})();
