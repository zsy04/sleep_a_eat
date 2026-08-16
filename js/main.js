/**
 * main.js — 睡与吃 · 赛博科技风交互
 * 多页面路由：根据 <body data-page="..."> 初始化对应页面逻辑
 *   home   → 粒子 / 打字机 / 统计 / 入口卡片
 *   notes  → 粒子 / 笔记列表 / 搜索筛选
 *   essays → 粒子 / 随笔列表
 *   games  → 粒子（游戏页列表）
 *   about  → 粒子
 *   note   → 独立文章页（由 note.js 处理）
 */

(function () {
  "use strict";

  const SITE = window.SITE_DATA || { posts: [], tagCounts: {}, totalPosts: 0 };
  const PAGE = document.body.dataset.page || "home";
  const NOTES = SITE.posts.filter((p) => p.type === "note");
  const ESSAYS = SITE.posts.filter((p) => p.type === "essay");

  /* ============================================================
     粒子系统（Canvas，鼠标交互）
     ============================================================ */
  const canvas = document.getElementById("particle-canvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let mouse = { x: -9999, y: -9999 };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initParticles() {
      const count = Math.min(120, Math.floor(window.innerWidth / 14));
      const light = document.documentElement.getAttribute("data-theme") === "light";
      // 亮色主题用深色粒子，暗色主题用霓虹粒子
      const gold = light ? "rgba(183,121,31," : "rgba(245,185,66,";
      const red = light ? "rgba(217,38,74," : "rgba(255,45,85,";
      const cyan = light ? "rgba(10,125,150," : "rgba(34,211,238,";
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: Math.random() * 1.6 + 0.4,
          color: Math.random() > 0.82 ? gold : Math.random() > 0.5 ? red : cyan
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          p.x += (dx / dist) * 0.6;
          p.y += (dy / dist) * 0.6;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (0.35 + (Math.sin(Date.now() / 900 + p.x) + 1) * 0.3) + ")";
        ctx.fill();
      }

      // 连线
      const light = document.documentElement.getAttribute("data-theme") === "light";
      const lineColor = light ? "217,38,74" : "255,45,85";
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "rgba(" + lineColor + "," + (1 - d / 110) * 0.14 + ")";
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    initParticles();
    drawParticles();

    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
    });

    document.addEventListener("themechange", () => {
      initParticles();
    });

    canvas.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
  }

  /* ============================================================
     导航：高亮当前页
     ============================================================ */
  document.querySelectorAll(".nav-link[data-nav]").forEach((link) => {
    if (link.dataset.nav === PAGE) link.classList.add("active");
  });

  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    document.querySelectorAll(".nav-link").forEach((l) =>
      l.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  /* ============================================================
     工具函数
     ============================================================ */
  function fmtDate(d) {
    if (!d) return "—";
    return d.replace(/-/g, ".");
  }

  function cardHtml(p, badgeLabel) {
    const tags = p.tags
      .map((t) => '<span class="tag" data-tag="' + t + '">#' + t + "</span>")
      .join("");
    return (
      '<article class="note-card" data-id="' + p.id + '">' +
      '<div class="note-top">' +
      '<span class="note-date">' + fmtDate(p.date) + "</span>" +
      '<span class="note-category' + (badgeLabel === "随笔" ? " essay-badge" : "") + '">' +
      (badgeLabel || p.category) +
      "</span>" +
      "</div>" +
      '<h3 class="note-title">' + p.title + "</h3>" +
      '<p class="note-summary">' + p.summary + "</p>" +
      '<div class="note-foot">' +
      '<div class="note-tags">' + tags + "</div>" +
      '<span class="note-minutes">' + (p.minutes || "—") + " min read</span>" +
      "</div>" +
      '<span class="note-open">阅读全文 →</span>' +
      "</article>"
    );
  }

  function bindCards(container) {
    container.querySelectorAll(".note-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("tag")) return;
        window.location.href = "note.html?id=" + encodeURIComponent(card.dataset.id);
      });
    });
    container.querySelectorAll(".tag").forEach((t) => {
      t.addEventListener("click", (e) => {
        e.stopPropagation();
        // 跳转到笔记库并按标签搜索
        sessionStorage.setItem("tagQuery", t.dataset.tag);
        window.location.href = "notes.html";
      });
    });
  }

  /* ============================================================
     home 页面
     ============================================================ */
  if (PAGE === "home") {
    // 打字机效果
    const TYPED_LINES = [
      "> 学而时习之，不亦说乎。",
      "> 不积跬步，无以至千里。",
      "> 博学之，审问之，慎思之，明辨之，笃行之。",
      "> 知识不是力量，分享知识才是力量。",
    ];

    const typedEl = document.getElementById("typed-line");
    if (typedEl) {
      let lineIdx = 0, charIdx = 0, deleting = false;
      const cursor = document.createElement("span");
      cursor.className = "typed-cursor";
      cursor.textContent = "▍";

      function tick() {
        const line = TYPED_LINES[lineIdx];
        if (!deleting) {
          typedEl.textContent = line.slice(0, charIdx);
          charIdx++;
          if (charIdx > line.length) {
            deleting = true;
            setTimeout(tick, 1800);
            return;
          }
          setTimeout(tick, 65);
        } else {
          typedEl.textContent = line.slice(0, charIdx);
          charIdx--;
          if (charIdx < 0) {
            deleting = false;
            lineIdx = (lineIdx + 1) % TYPED_LINES.length;
            setTimeout(tick, 500);
            return;
          }
          setTimeout(tick, 28);
        }
      }
      typedEl.appendChild(cursor);
      tick();
    }

    // 站点统计
    const statsEl = document.getElementById("heroStats");
    if (statsEl && SITE.posts.length) {
      statsEl.innerHTML =
        '<div class="stat"><span class="stat-value">' + SITE.totalPosts + "</span><span class=\"stat-label\">篇文章</span></div>" +
        '<div class="stat"><span class="stat-value">' + (SITE.essays || 0) + "</span><span class=\"stat-label\">篇随笔</span></div>";
    }

    // 入口卡片
    const entranceGrid = document.getElementById("entranceGrid");
    if (entranceGrid) {
      entranceGrid.innerHTML =
        '<a class="entrance-card e-notes" href="notes.html">' +
        '<span class="entrance-num">01</span>' +
        '<span class="entrance-name">笔记库</span>' +
        '<span class="entrance-desc">' + SITE.notes + " 篇学习笔记，记录每一次进步</span>" +
        '<span class="entrance-arrow">→</span>' +
        "</a>" +
        '<a class="entrance-card e-essays" href="essays.html">' +
        '<span class="entrance-num">02</span>' +
        '<span class="entrance-name">随笔</span>' +
        '<span class="entrance-desc">' + SITE.essays + " 篇生活思考与随想</span>" +
        '<span class="entrance-arrow">→</span>' +
        "</a>" +
        '<a class="entrance-card e-games" href="games.html">' +
        '<span class="entrance-num">03</span>' +
        '<span class="entrance-name">小游戏</span>' +
        '<span class="entrance-desc">学习累了，来玩一局贪吃蛇 / 跑酷 / 2048</span>' +
        '<span class="entrance-arrow">→</span>' +
        "</a>" +
        '<a class="entrance-card e-about" href="about.html">' +
        '<span class="entrance-num">04</span>' +
        '<span class="entrance-name">关于</span>' +
        '<span class="entrance-desc">关于这个小站</span>' +
        '<span class="entrance-arrow">→</span>' +
        "</a>";
    }
  }

  /* ============================================================
     notes 页面：列表 + 搜索 + 筛选
     ============================================================ */
  if (PAGE === "notes") {
    const notesList = document.getElementById("notesList");
    const emptyState = document.getElementById("emptyState");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    let currentQuery = "";

    // 填充分类下拉
    const categories = [...new Set(NOTES.map((p) => p.category))].sort();
    categories.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      categoryFilter.appendChild(opt);
    });

    function renderNotes() {
      const q = currentQuery.trim().toLowerCase();
      const cat = categoryFilter.value;
      const list = NOTES.filter((p) => {
        const matchCat = cat === "all" || p.category === cat;
        const matchQ =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        return matchCat && matchQ;
      });

      emptyState.hidden = list.length > 0;
      notesList.innerHTML = list.map((p) => cardHtml(p)).join("");
      bindCards(notesList);
    }

    searchInput.addEventListener("input", (e) => {
      currentQuery = e.target.value;
      renderNotes();
    });
    categoryFilter.addEventListener("change", () => renderNotes());

    // 支持从文章卡片标签点击跳转并带搜索词
    const tagQuery = sessionStorage.getItem("tagQuery");
    if (tagQuery) {
      sessionStorage.removeItem("tagQuery");
      searchInput.value = tagQuery;
      currentQuery = tagQuery;
    }

    renderNotes();
  }

  /* ============================================================
     essays 页面：随笔列表
     ============================================================ */
  if (PAGE === "essays") {
    const essaysList = document.getElementById("essaysList");
    const emptyEssays = document.getElementById("emptyEssays");
    if (essaysList) {
      emptyEssays.hidden = ESSAYS.length > 0;
      essaysList.innerHTML = ESSAYS.map((p) => cardHtml(p, "随笔")).join("");
      bindCards(essaysList);
    }
  }

  /* ============================================================
     滚动显现动画（非 note 页）
     ============================================================ */
  const revealEls = document.querySelectorAll(".section");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    revealEls.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)";
      io.observe(el);
    });
  }
})();
