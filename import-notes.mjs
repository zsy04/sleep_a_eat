/**
 * import-notes.mjs — 一次性导入用户桌面笔记到博客 content/notes/java/
 * 用法: node import-notes.mjs
 * 图片处理：
 *   - 相对路径 images/xxx 保留（io流.md 已手动复制）
 *   - 绝对路径 C:\... 的图片：源文件存在则复制到 images/ 并改相对路径，否则移除引用
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = "C:/Users/22808/Desktop/笔记文稿/博客";
const DST_DIR = join(__dirname, "content", "notes", "java");
const IMG_DIR = join(DST_DIR, "images");
mkdirSync(IMG_DIR, { recursive: true });

const NOTES = [
  {
    src: "JAVA.md",
    dst: "java-basics.md",
    title: "Java 基础语法全笔记",
    tags: ["Java", "基础语法"],
    minutes: 40,
  },
  {
    src: "io流.md",
    dst: "java-io.md",
    title: "Java IO 流详解：字节流、字符流、对象流",
    tags: ["Java", "IO", "流"],
    minutes: 35,
  },
  {
    src: "常用类.md",
    dst: "java-object.md",
    title: "Object 类：所有类的超类",
    tags: ["Java", "常用类", "Object"],
    minutes: 20,
  },
  {
    src: "集合.md",
    dst: "java-collections.md",
    title: "Java 集合框架：List、Set、Map",
    tags: ["Java", "集合"],
    minutes: 25,
  },
  {
    src: "集合练习.md",
    dst: "collections-practice.md",
    title: "集合练习：Collection 的基本操作",
    tags: ["Java", "集合", "练习"],
    minutes: 15,
  },
  {
    src: "厨师与顾客.md",
    dst: "producer-consumer.md",
    title: "多线程练习：厨师与顾客（生产者-消费者）",
    tags: ["Java", "多线程", "练习"],
    minutes: 15,
  },
  {
    src: "第一天.md",
    dst: "markdown-learning.md",
    title: "第一天：Markdown 学习笔记",
    tags: ["Markdown", "学习笔记"],
    minutes: 10,
  },
  {
    src: "图书管理系统.md",
    dst: "library-system-v1.md",
    title: "图书管理系统 1.0：控制台增删改查",
    tags: ["Java", "项目实战", "图书管理系统"],
    minutes: 20,
  },
  {
    src: "图书管理系统2.0.md",
    dst: "library-system-v2.md",
    title: "图书管理系统 2.0：MyBatis 版本",
    tags: ["Java", "MyBatis", "项目实战"],
    minutes: 20,
  },
];

// 处理 Markdown 中的本地图片：
// 1. 相对路径 images/xxx → 保留（已就位）
// 2. 绝对路径 C:\... → 若文件存在复制到 images/ 并改为相对路径；不存在则删除该图片行
function fixImages(content, dstId) {
  const re = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let m;
  const replacements = [];
  while ((m = re.exec(content)) !== null) {
    const alt = m[1];
    let src = m[2].trim();
    if (src.startsWith("images/")) continue; // 已就位，跳过

    // 尝试解析为本地绝对路径
    let localPath = null;
    if (/^[A-Za-z]:[\\/]/.test(src)) {
      localPath = src.replace(/\\/g, "/");
    }
    let newSrc = src;
    if (localPath && existsSync(localPath)) {
      const ext = extname(localPath);
      const newName = `${dstId}-img-${Math.random().toString(36).slice(2, 6)}${ext}`;
      copyFileSync(localPath, join(IMG_DIR, newName));
      newSrc = `images/${newName}`;
      console.log(`  [img→ok] ${basename(localPath)} → images/${newName}`);
    } else {
      // 文件不存在：整行删除
      replacements.push({ from: m[0], to: "" });
      console.log(`  [img→removed] 未找到图片源: ${src.slice(0, 50)}`);
      continue;
    }
    replacements.push({ from: m[0], to: `![${alt}](${newSrc})` });
  }
  for (const r of replacements) content = content.split(r.from).join(r.to);
  return content;
}

for (const n of NOTES) {
  const srcPath = join(SRC_DIR, n.src);
  const dstPath = join(DST_DIR, n.dst);
  if (!existsSync(srcPath)) {
    console.log(`[skip] ${n.src} 不存在`);
    continue;
  }
  let body = readFileSync(srcPath, "utf-8");
  console.log(`--- ${n.src}`);
  body = fixImages(body, basename(n.dst, ".md"));

  const fm =
    `---\n` +
    `title: "${n.title}"\n` +
    `date: "2026-08-16"\n` +
    `tags: [${n.tags.map((t) => `"${t}"`).join(", ")}]\n` +
    `minutes: ${n.minutes}\n` +
    `---\n\n`;

  writeFileSync(dstPath, fm + body, "utf-8");
  console.log(`[ok] ${n.src} → ${n.dst}`);
}

console.log("\n全部完成");
