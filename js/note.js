/**
 * note.js — 独立文章阅读页
 * 从 URL ?id= 读取文章，渲染正文；滚动进度条；粒子背景
 */

(function () {
  "use strict";

  const SITE = window.SITE_DATA || { posts: [] };

  /* ============================================================
     粒子系统（与首页一致，但更克制）
     ============================================================ */
  const canvas = document.getElementById("particle-canvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      const count = Math.min(70, Math.floor(window.innerWidth / 20));
      const light = document.documentElement.getAttribute("data-theme") === "light";
      const gold = light ? "rgba(183,121,31," : "rgba(245,185,66,";
      const red = light ? "rgba(217,38,74," : "rgba(255,45,85,";
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.5 + 0.4,
          color: Math.random() > 0.8 ? gold : red
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          p.x += (dx / dist) * 0.5;
          p.y += (dy / dist) * 0.5;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + 0.4 + ")";
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();
    window.addEventListener("resize", () => { resize(); init(); });
    document.addEventListener("themechange", () => { init(); });
    canvas.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
  }

  /* ============================================================
     获取文章
     ============================================================ */
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const post = SITE.posts.find((p) => p.id === id);

  const articleHeader = document.getElementById("articleHeader");
  const articleBody = document.getElementById("articleBody");
  const article = document.getElementById("article");

  function fmtDate(d) {
    if (!d) return "—";
    return d.replace(/-/g, ".");
  }

  if (!post) {
    // 未找到文章：显示错误提示
    document.title = "未找到笔记 · 睡与吃";
    articleHeader.innerHTML = "<h1>未找到这篇笔记</h1>";
    articleBody.innerHTML =
      '<p style="margin:24px 0">笔记不存在或已被移除。</p>' +
      '<p><a class="btn btn-primary" href="index.html">返回首页</a></p>';
  } else {
    document.title = post.title + " · 睡与吃";
    articleHeader.innerHTML =
      '<div class="article-breadcrumb"><a href="index.html">首页</a><span class="crumb-sep">/</span><span>' +
      (post.type === "essay" ? "随笔" : post.category) +
      "</span></div>" +
      "<h1 class=\"article-title\">" + post.title + "</h1>" +
      '<div class="article-meta">' +
      "<span>" + fmtDate(post.date) + "</span>" +
      "<span>" + (post.type === "essay" ? "随笔" : post.category) + "</span>" +
      "<span>" + (post.minutes || "—") + " min read</span>" +
      "</div>" +
      (post.tags.length
        ? '<div class="article-tags">' +
          post.tags.map((t) => '<span class="tag">#' + t + "</span>").join("") +
          "</div>"
        : "");

    articleBody.innerHTML = post.html;

    // 根据类型显示对应返回按钮
    const backEssays = document.getElementById("backEssays");
    if (post.type === "essay" && backEssays) {
      backEssays.style.display = "inline-flex";
    }

    // 生成目录（TOC）
    buildToc();
  }

  /* ============================================================
     文章目录（TOC）
     ============================================================ */
  function buildToc() {
    const toc = document.getElementById("toc");
    const tocList = document.getElementById("tocList");
    if (!toc || !tocList) return;

    // 收集 h2 / h3 标题
    const headings = articleBody.querySelectorAll("h2, h3");
    if (headings.length < 2) {
      toc.classList.add("empty");
      return;
    }

    // 给标题加锚点 id（去重）
    const used = {};
    headings.forEach((h, i) => {
      let id = "sec-" + (i + 1);
      const txt = (h.textContent || "").trim();
      if (txt) {
        const slug = txt.slice(0, 20).replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/^-+|-+$/g, "");
        if (slug) id = slug;
      }
      if (used[id]) id = id + "-" + i;
      used[id] = true;
      h.id = id;
    });

    // 渲染目录项
    tocList.innerHTML = "";
    headings.forEach((h) => {
      const li = document.createElement("li");
      li.className = "toc-item level-" + (h.tagName === "H3" ? 3 : 2);
      li.textContent = h.textContent.trim();
      li.dataset.target = h.id;
      li.addEventListener("click", () => {
        const target = document.getElementById(h.id);
        if (target) {
          const y = target.getBoundingClientRect().top + window.scrollY - 84;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
      tocList.appendChild(li);
    });

    toc.classList.add("show");

    // 滚动高亮当前章节
    const items = tocList.querySelectorAll(".toc-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((it) => {
              it.classList.toggle("active", it.dataset.target === entry.target.id);
            });
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
  }

  /* ============================================================
     滚动进度条
     ============================================================ */
  const progressBar = document.getElementById("progressBar");
  function updateProgress() {
    const doc = document.documentElement;
    const total = doc.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ============================================================
     导航
     ============================================================ */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    document.querySelectorAll(".nav-link").forEach((l) =>
      l.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  /* ============================================================
     显现动画
     ============================================================ */
  if (article) {
    article.style.opacity = "0";
    article.style.transform = "translateY(20px)";
    article.style.transition = "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)";
    requestAnimationFrame(() => {
      article.style.opacity = "1";
      article.style.transform = "translateY(0)";
    });
  }
})();
