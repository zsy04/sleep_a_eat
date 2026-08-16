/**
 * theme.js — 暗/亮主题切换
 * 在 <html data-theme="light|dark"> 上切换，localStorage 记忆
 * 页面加载时由 head 中的内联脚本先行应用（避免闪烁），本文件负责按钮交互
 */
(function () {
  "use strict";

  const KEY = "sy-theme";

  function current() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
    // 同步所有切换按钮的图标状态
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("data-active", theme);
    });
    // 广播主题变更（粒子系统等监听）
    document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  }

  function toggle() {
    apply(current() === "dark" ? "light" : "dark");
  }

  // 绑定按钮
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", toggle);
  });

  // 初始化按钮状态
  apply(current());
})();
