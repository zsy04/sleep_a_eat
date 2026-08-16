# 睡与吃 · 个人学习笔记库

中式赛博科技风（暗色 + 霓虹红 + 青色）纯静态知识库博客，零成本部署。包含**学习笔记**与**随笔**两个内容区域，支持 Markdown 内嵌本地图片。

## 快速开始

```bash
# 安装依赖（首次）
npm install

# 构建（新增/修改笔记后运行）
npm run build

# 本地预览
npm run serve        # http://localhost:8080
```

## 如何添加一篇新笔记 / 随笔

1. 学习笔记放 `content/notes/<分类>/`，随笔放 `content/essays/<分类>/`，放一个 `.md` 文件
2. 文件头部用 frontmatter 声明元信息：

```markdown
---
title: "标题"
date: "2026-08-16"
tags: ["Java", "随笔"]
minutes: 15
---

正文内容，支持标准 Markdown（代码高亮、表格、引用等）
```

3. 运行 `npm run build`，然后刷新页面即可

## 如何在文章里放图片

图片文件放到与 `.md` 同级的目录（如 `content/essays/xxx/images/`），正文用相对路径引用：

```markdown
![图片说明](images/photo.png)
```

构建时会自动把图片复制到 `assets/images/` 并改写路径（文件名会自动加文章前缀防冲突）。支持 png / jpg / webp / gif / svg。

## 部署（免费）

### 方式一：Vercel（推荐，自动构建）

1. 把项目推送到 GitHub 仓库
2. 到 [vercel.com](https://vercel.com) 用 GitHub 登录，Import 该仓库
3. 框架选 Other，构建命令 `npm run build`，输出目录 `.`
4. 点 Deploy 即上线，免费域名 `xxx.vercel.app`

以后每次 `git push` 自动重新部署，无需手动操作。

### 方式二：CloudStudio / 任意静态托管

把 `index.html`、`css/`、`js/`、`dist/` 四个文件上传到任意静态托管即可（构建产物已经是完整静态站）。

## 目录结构

```
blog/
├── index.html          # 首页：Hero + 板块入口卡片
├── notes.html          # 笔记库页：搜索 / 分类筛选 / 列表
├── essays.html         # 随笔页：随笔列表
├── about.html          # 关于页
├── note.html           # 文章阅读页（?id= 打开，笔记/随笔共用）
├── build.mjs           # 构建脚本：md → dist/site-data.js
├── serve.mjs           # 本地预览服务器
├── content/
│   ├── notes/          # 学习笔记源文件（按分类分子目录）
│   └── essays/         # 随笔源文件（按分类分子目录）
├── css/styles.css      # 赛博科技风样式
├── js/main.js          # 按 data-page 分支初始化各页面逻辑
├── js/note.js          # 文章页：渲染 / 进度条
└── dist/site-data.js   # 构建产物（勿手改）
```

页面路由：`<body data-page="home|notes|essays|about">` 决定 main.js 初始化哪个模块；文章详情统一走 `note.html?id=xx`（随笔类型自动显示"返回随笔"按钮）。

## 技术栈

- 纯 HTML / CSS / JS（无框架，零运行时依赖）
- marked + marked-highlight + highlight.js（构建时渲染，页面零 JS 依赖渲染）
- 特效：Canvas 粒子系统（鼠标交互）、故障风标题、扫描线、赛博网格背景、打字机、玻璃拟态导航
