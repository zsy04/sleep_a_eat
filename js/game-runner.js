/**
 * game-runner.js — 赛博跑酷（Chrome 恐龙风）
 * 空格/↑/点击跳跃，躲避障碍
 */
(function () {
  "use strict";

  const canvas = document.getElementById("runnerCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const GROUND_Y = H - 40;

  const scoreEl = document.getElementById("score");
  const speedEl = document.getElementById("speed");
  const gameOverEl = document.getElementById("gameOver");
  const finalScoreEl = document.getElementById("finalScore");
  const btnRestart = document.getElementById("btnRestart");
  const btnBack = document.getElementById("btnBack");

  let running, raf, score, speed, distance, obstacles, player, spawnTimer, lastTime;
  let best = parseInt(localStorage.getItem("runner-best") || "0", 10);

  function reset() {
    running = true;
    score = 0;
    speed = 6;
    distance = 0;
    obstacles = [];
    spawnTimer = 0;
    lastTime = performance.now();
    player = { x: 70, y: GROUND_Y - 40, w: 26, h: 40, vy: 0, hSpeed: 0, grounded: true, pressTime: 0, charging: false };
    scoreEl.textContent = 0;
    speedEl.textContent = "6x";
    gameOverEl.classList.remove("show");
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    if (running) update(dt);
    draw();
    if (running) raf = requestAnimationFrame(loop);
  }

  function update(dt) {
    distance += speed * dt * 60;
    score = Math.floor(distance / 10);
    scoreEl.textContent = score;

    // 加速：每 300 分提速一次，越来越快（上限 15x）
    const newSpeed = Math.min(15, 6 + Math.floor(score / 300));
    if (newSpeed !== speed) {
      speed = newSpeed;
      speedEl.textContent = speed + "x";
    }

    // 跳跃物理（含水平位移：按住越久跳得越远）
    if (!player.grounded) {
      player.vy += 0.9;
      player.y += player.vy;
      player.x += player.hSpeed * dt;
      player.hSpeed *= 0.96; // 水平速度缓慢衰减
      if (player.y >= GROUND_Y - player.h) {
        player.y = GROUND_Y - player.h;
        player.vy = 0;
        player.hSpeed = 0;
        player.grounded = true;
      }
    }

    // 生成障碍：宽→矮、细→高（反比），速度越快间隔越短
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      const interval = Math.max(0.65, 1.5 - (speed - 6) * 0.07) + Math.random() * 0.7;
      spawnTimer = interval;
      const w = 16 + Math.random() * 26; // 宽 16~42
      const h = Math.min(58, Math.max(16, 62 - w * 1.1 + (speed - 6) * 0.8));
      obstacles.push({ x: W + 10, w: w, h: h });
      // 速度较快时可能出现"双障碍"（连续两个，需要连跳）
      if (speed >= 9 && Math.random() < 0.3) {
        const w2 = 14 + Math.random() * 18;
        const h2 = Math.min(54, Math.max(15, 58 - w2 * 1.1 + (speed - 6) * 0.7));
        obstacles.push({ x: W + 10 + 46, w: w2, h: h2 });
      }
    }

    // 移动障碍
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.x -= speed * dt * 60;
      if (o.x + o.w < 0) {
        obstacles.splice(i, 1);
        continue;
      }
      // 碰撞检测
      const py = player.y + 6; // 碰撞盒略小
      const ph = player.h - 6;
      if (
        player.x + player.w > o.x &&
        player.x < o.x + o.w &&
        py + ph > GROUND_Y - o.h &&
        py < GROUND_Y
      ) {
        return gameOver();
      }
    }
  }

  // 蓄力跳跃：按住时间越长 → 水平速度越大（跳得远），垂直速度越小（跳不高）
  //             按住时间越短 → 垂直速度越大（跳得高），水平位移少
  function startCharge() {
    if (!running) return;
    if (!player.grounded || player.charging) return;
    player.charging = true;
    player.pressTime = performance.now();
  }

  function releaseJump() {
    if (!running || !player.charging) return;
    player.charging = false;
    if (!player.grounded) return;

    const hold = Math.min(0.9, (performance.now() - player.pressTime) / 1000); // 0~0.9s
    const t = Math.min(1, hold / 0.45); // 归一化 0~1（0.45s 满蓄力）

    // 按住越久 → 水平速度越大（跳得远），垂直越小（低跳跨宽障碍）
    player.vy = -(17 - t * 9); // t=0 → -17（很高），t=1 → -8（较矮）
    player.hSpeed = t * 260;   // t=0 → 0（原地高跳），t=1 → 260（远跳）
    player.grounded = false;
  }

  function tapJump() {
    // 点击/触摸：中等蓄力（约 0.22s）
    if (!running) return;
    if (!player.grounded || player.charging) return;
    const t = 0.5;
    player.vy = -(17 - t * 9);
    player.hSpeed = t * 260;
    player.grounded = false;
  }

  function gameOver() {
    running = false;
    cancelAnimationFrame(raf);
    if (score > best) {
      best = score;
      localStorage.setItem("runner-best", String(best));
    }
    finalScoreEl.textContent = score;
    setTimeout(() => gameOverEl.classList.add("show"), 350);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 背景网格
    ctx.strokeStyle = "rgba(34,211,238,0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // 地面
    ctx.strokeStyle = "rgba(255,45,85,0.7)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ff2d55";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(W, GROUND_Y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 地面扫描线
    ctx.strokeStyle = "rgba(255,45,85,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 8);
    ctx.lineTo(W, GROUND_Y + 8);
    ctx.stroke();

    // 角色（霓虹小人）
    const px = player.x, py = player.y;
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(px, py, player.w, player.h);
    ctx.shadowBlur = 0;
    // 眼睛
    ctx.fillStyle = "#06141c";
    ctx.fillRect(px + player.w - 8, py + 7, 4, 4);
    // 腿
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(px + 2, py + player.h - 6, 7, 6);
    ctx.fillRect(px + player.w - 9, py + player.h - 6, 7, 6);

    // 障碍物（霓虹红块）
    obstacles.forEach((o) => {
      ctx.shadowColor = "#ff2d55";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#ff2d55";
      ctx.fillRect(o.x, GROUND_Y - o.h, o.w, o.h);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillRect(o.x + o.w * 0.25, GROUND_Y - o.h + 4, o.w * 0.15, o.h - 8);
    });
  }

  // 输入：按住蓄力，松开跳跃
  document.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "ArrowUp") {
      e.preventDefault();
      startCharge();
    }
  });
  document.addEventListener("keyup", (e) => {
    if (e.key === " " || e.key === "ArrowUp") {
      e.preventDefault();
      releaseJump();
    }
  });
  window.addEventListener("blur", () => { player.charging = false; });
  canvas.addEventListener("click", tapJump);
  btnRestart.addEventListener("click", reset);
  btnBack.addEventListener("click", () => (window.location.href = "games.html"));

  reset();
})();
