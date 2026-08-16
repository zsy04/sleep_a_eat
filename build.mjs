/**
 * build.mjs
 * 扫描 content/ 下的 Markdown 笔记与随笔，生成 dist/site-data.js
 * 用法: node build.mjs
 *
 * 内容组织方式:
 *   content/notes/<分类>/<文章>.md     → 学习笔记
 *   content/essays/<分类>/<随笔>.md    → 随笔
 *   Markdown frontmatter 支持: title, date, tags, summary, minutes
 *
 * 图片支持:
 *   随笔/笔记中的 Markdown 图片 `![alt](images/xxx.png)`
 *   相对路径以当前 md 文件所在目录为基准，
 *   构建时自动复制到 assets/images/<文章id>-<文件名> 并改写路径。
 */

import {
  readdirSync,
  readFileSync,
  mkdirSync,
  writeFileSync,
  copyFileSync,
  existsSync,
  statSync,
} from "node:fs";
import { join, basename, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = join(__dirname, "content");
const DIST_DIR = join(__dirname, "dist");
const OUT_FILE = join(DIST_DIR, "site-data.js");
const IMG_OUT_DIR = join(__dirname, "assets", "images");

// 支持的类型目录: 目录名 → 类型
const TYPE_MAP = { notes: "note", essays: "essay" };

// ---------- Markdown 渲染配置 ----------
marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  })
);
marked.setOptions({ gfm: true, breaks: true });

// ---------- frontmatter 解析 ----------
function parseFrontmatter(raw) {
  const fm = { title: "", date: "", tags: [], summary: "", minutes: 0 };
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { fm, content: raw };

  const lines = match[1].split("\n");
  for (const line of lines) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let val = kv[2].trim();
    if (key === "tags") {
      fm.tags = val
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((t) => t.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
    } else if (key === "date" || key === "minutes") {
      fm[key] = key === "minutes" ? parseInt(val, 10) || 0 : val.replace(/^"|"$/g, "");
    } else if (key === "title" || key === "summary") {
      fm[key] = val.replace(/^"|"$/g, "");
    }
  }
  return { fm, content: raw.slice(match[0].length) };
}

// ---------- 图片处理：复制本地图片并改写 Markdown/HTML 中的路径 ----------
function processImages(mdContent, html, mdDir, postId) {
  // 收集 markdown 中的图片引用 ![alt](path)（路径可能含空格，允许匹配到右括号为止）
  const imgRefs = [];
  const re = /!\[([^\]]*)\]\(([^)\n]+)\)/g;
  let m;
  while ((m = re.exec(mdContent)) !== null) {
    imgRefs.push({ alt: m[1], src: m[2] });
  }

  mkdirSync(IMG_OUT_DIR, { recursive: true });
  const mapping = {}; // 原相对路径 → 新绝对路径

  for (const img of imgRefs) {
    // 只允许 SVG 图片，其他格式（png/jpg/webp/gif 等）一律忽略（用户要求）
    if (!img.src.toLowerCase().endsWith(".svg")) continue;
    // 跳过外部链接（http/https/data:）
    if (/^(https?:|data:|\.\.\/)/.test(img.src)) continue;
    const srcPath = join(mdDir, img.src);
    if (!existsSync(srcPath)) continue;

    const newName = `${postId}-${basename(img.src)}`;
    const newRel = `assets/images/${newName}`;
    const dest = join(IMG_OUT_DIR, newName);
    if (!existsSync(dest)) copyFileSync(srcPath, dest);
    mapping[img.src] = newRel;
  }

  // 在渲染后的 HTML 中替换图片 src
  // 注意：marked 会将中文文件名 URL 编码（如 分层架构 → %E5%88%86%E5%B1%82），需同时替换原始与编码形式
  let outHtml = html;
  for (const [orig, neu] of Object.entries(mapping)) {
    outHtml = outHtml.split(`src="${orig}"`).join(`src="${neu}"`);
    const encoded = encodeURI(orig);
    if (encoded !== orig) {
      outHtml = outHtml.split(`src="${encoded}"`).join(`src="${neu}"`);
    }
  }
  return outHtml;
}

// ---------- 递归扫描分类目录 ----------
function scanDir(dir, type, category) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const posts = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      posts.push(...scanDir(full, type, entry.name));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const raw = readFileSync(full, "utf-8");
      const { fm, content } = parseFrontmatter(raw);
      let html = marked.parse(content);
      const id = basename(entry.name, ".md");
      // 处理本地图片
      html = processImages(content, html, dir, id);

      // 日期缺省时取文件修改时间（上传当天）
      const fallbackDate = new Date();
      const fileDate = (() => {
        try {
          const st = statSync(full);
          if (st.mtime) return st.mtime;
        } catch (e) {}
        return fallbackDate;
      })();
      const pad = (n) => String(n).padStart(2, "0");
      const autoDate = `${fileDate.getFullYear()}-${pad(fileDate.getMonth() + 1)}-${pad(fileDate.getDate())}`;

      // 从内容里提取纯文本摘要（如果没有显式 summary）
      let summary = fm.summary;
      if (!summary) {
        const text = content
          .replace(/```[\s\S]*?```/g, " ")
          .replace(/!\[[^\]]*\]\([^)]*\)/g, " [图片] ")
          .replace(/[#>*`\-\[\]()!]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        summary = text.slice(0, 120) + (text.length > 120 ? "…" : "");
      }
      posts.push({
        id,
        title: fm.title || id,
        date: fm.date || autoDate,
        mtime: fileDate.getTime(),
        tags: fm.tags,
        summary,
        minutes: fm.minutes,
        type,
        category: category || "未分类",
        html,
      });
    }
  }
  return posts;
}

// ---------- 构建 ----------
let posts = [];
mkdirSync(IMG_OUT_DIR, { recursive: true });
for (const [typeDir, type] of Object.entries(TYPE_MAP)) {
  const dir = join(CONTENT_ROOT, typeDir);
  if (existsSync(dir)) posts.push(...scanDir(dir, type, ""));
}

// 按日期倒序（近→远）；同日期时按文件修改时间倒序（最近导入的在前）
posts.sort((a, b) => {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  return (b.mtime || 0) - (a.mtime || 0);
});

// 统计标签
const tagCounts = {};
for (const p of posts) {
  for (const t of p.tags) tagCounts[t] = (tagCounts[t] || 0) + 1;
}

const data = {
  posts,
  tagCounts,
  totalPosts: posts.length,
  notes: posts.filter((p) => p.type === "note").length,
  essays: posts.filter((p) => p.type === "essay").length,
  builtAt: new Date().toISOString(),
};

mkdirSync(DIST_DIR, { recursive: true });
writeFileSync(OUT_FILE, `window.SITE_DATA = ${JSON.stringify(data, null, 2)};\n`, "utf-8");
console.log(
  `[build] OK — ${data.notes} notes + ${data.essays} essays = ${posts.length} posts, ${Object.keys(tagCounts).length} tags → dist/site-data.js`
);
