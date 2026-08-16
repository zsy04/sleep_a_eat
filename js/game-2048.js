/**
 * game-2048.js — 2048（赛博科技风）
 * 方向键/WASD 移动，相同数字合并
 */
(function () {
  "use strict";

  const SIZE = 4;
  const boardEl = document.getElementById("board2048");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const gameOverEl = document.getElementById("gameOver");
  const finalScoreEl = document.getElementById("finalScore");
  const btnNew = document.getElementById("btnNew");
  const btnRestart = document.getElementById("btnRestart");
  const btnBack = document.getElementById("btnBack");

  let grid, score, over;
  let best = parseInt(localStorage.getItem("g2048-best") || "0", 10);
  bestEl.textContent = best;

  function emptyGrid() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  }

  function newGame() {
    grid = emptyGrid();
    score = 0;
    over = false;
    scoreEl.textContent = 0;
    gameOverEl.classList.remove("show");
    addRandom();
    addRandom();
    render();
  }

  function addRandom() {
    const cells = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) cells.push([r, c]);
      }
    }
    if (!cells.length) return;
    const [r, c] = cells[Math.floor(Math.random() * cells.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function slide(row) {
    // 去掉 0，向前压缩
    const arr = row.filter((v) => v !== 0);
    const out = [];
    let i = 0;
    while (i < arr.length) {
      if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
        out.push(arr[i] * 2);
        score += arr[i] * 2;
        i += 2;
      } else {
        out.push(arr[i]);
        i++;
      }
    }
    while (out.length < SIZE) out.push(0);
    return out;
  }

  function move(dir) {
    // dir: 0=左 1=右 2=上 3=下
    const before = JSON.stringify(grid);
    const rotated = [];
    for (let r = 0; r < SIZE; r++) {
      let row = grid[r].slice();
      if (dir === 1) row = row.reverse();
      row = slide(row);
      if (dir === 1) row = row.reverse();
      rotated.push(row);
    }
    if (dir === 2 || dir === 3) {
      // 转置处理上/下
      const trans = Array.from({ length: SIZE }, (_, c) => rotated.map((row) => row[c]));
      for (let c = 0; c < SIZE; c++) {
        let col = trans[c].slice();
        if (dir === 3) col = col.reverse();
        col = slide(col);
        if (dir === 3) col = col.reverse();
        trans[c] = col;
      }
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) grid[r][c] = trans[c][r];
      }
    } else {
      grid = rotated;
    }

    scoreEl.textContent = score;
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      localStorage.setItem("g2048-best", String(best));
    }

    if (JSON.stringify(grid) !== before) {
      addRandom();
      render();
      checkGameOver();
    }
  }

  function checkGameOver() {
    // 有空格 → 继续
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) return;
      }
    }
    // 无相邻相同 → 结束
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const v = grid[r][c];
        if (r + 1 < SIZE && grid[r + 1][c] === v) return;
        if (c + 1 < SIZE && grid[r][c + 1] === v) return;
      }
    }
    over = true;
    finalScoreEl.textContent = score;
    setTimeout(() => gameOverEl.classList.add("show"), 350);
  }

  function render() {
    boardEl.innerHTML = "";
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        const v = grid[r][c];
        if (v !== 0) {
          tile.textContent = v;
          tile.setAttribute("data-v", String(v));
        } else {
          tile.setAttribute("data-v", "0");
        }
        boardEl.appendChild(tile);
      }
    }
  }

  // 键盘
  document.addEventListener("keydown", (e) => {
    if (over) return;
    const map = {
      ArrowLeft: 0, a: 0, A: 0,
      ArrowRight: 1, d: 1, D: 1,
      ArrowUp: 2, w: 2, W: 2,
      ArrowDown: 3, s: 3, S: 3,
    };
    if (e.key in map) {
      e.preventDefault();
      move(map[e.key]);
    }
  });

  // 触摸滑动
  let touchStart = null;
  boardEl.addEventListener("touchstart", (e) => {
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  boardEl.addEventListener("touchend", (e) => {
    if (!touchStart || over) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 0);
    else move(dy > 0 ? 3 : 2);
  }, { passive: true });

  btnNew.addEventListener("click", newGame);
  btnRestart.addEventListener("click", newGame);
  btnBack.addEventListener("click", () => (window.location.href = "games.html"));

  newGame();
})();
