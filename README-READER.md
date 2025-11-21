# 《高维俯瞰》多场景阅读器说明

本仓库现包含两套阅读体验：

1. `index.html`：单文件静态阅读器（原版离线体验，继续保留）。
2. `apps/reader`：全新的 **T3 Stack**（Next.js 14 + tRPC + React Query + Tailwind + Prisma/SQLite）应用，自动读取 `content/**/*.md` 生成现代化阅读站点。

下文主要介绍 T3 阅读器的使用与维护方式，同时保留静态版的运行提示。

---

## 🚀 快速开始（T3 Stack）

```bash
cd apps/reader
pnpm install                             # 安装依赖并生成 apps/reader/pnpm-lock.yaml
cp .env.example .env                     # 创建本地数据库配置，可调整 NOVEL_CONTENT_DIR 指向自定义路径
pnpm dev                                 # 启动 http://localhost:3000 开发服务器
```

> 下列脚本均需在 `apps/reader` 目录内执行。

- `pnpm lint`：运行 Next.js 内建 Lint（含 TypeScript 检查）。
- `pnpm build && pnpm start`：生产构建 + 启动。
- `pnpm prisma:generate`：当更新 `schema.prisma` 时重新生成 Prisma Client。
- `pnpm dlx shadcn@latest add <component>`：在 `src/components/ui` 中生成新的 shadcn 组件。

> **提示**：Prisma 目前仅用于满足 T3 依赖关系，默认使用 `file:./prisma/dev.db` 的 SQLite 文件，无需额外迁移或写入逻辑。

---

## 🧱 架构概览

| 层级 | 职责 | 关键文件 |
| ---- | ---- | -------- |
| 内容解析 | 扫描 `zh-translation/part-*/chapter-*.md`，解析 frontmatter、生成 HTML 与导航结构 | `apps/reader/src/server/content/loader.ts`、`types.ts` |
| API/tRPC | 暴露 `content.overview`、`content.chapter` 两个 endpoint，提供 React Query 数据源 | `src/server/api/routers/content.ts`、`src/app/api/trpc/[trpc]/route.ts` |
| 前端 UI | App Router + 客户端组件，复刻封面 / 目录 / 阅读器布局，支持主题切换 | `src/app/page.tsx`、`src/components/landing-view.tsx`、`src/components/reader-view.tsx` |
| 主题系统 | `next-themes` 驱动的 Light / Sepia / Dark 三主题，并持久化选择 | `src/components/theme/*`, `globals.css` |
| UI 组件库 | shadcn + Tailwind CSS v4 构建按钮、卡片、滚动容器与抽屉等模块 | `components.json`、`src/components/ui/*` |

### 内容加载流程

1. `loader.ts` 递归扫描 `zh-translation/part-*/` 目录，只处理 `.md` 章节文件（路径通过 `NOVEL_CONTENT_DIR` 环境变量指定，默认 `../../zh-translation`）。
2. `gray-matter` 解析 frontmatter，要求至少包含 `title`, `part`, `chapter`（缺失时直接抛错并终止 dev/build）。
3. `remark + rehype` 将 Markdown 转为 HTML，并在 `Observer Commentary` / `Human Narrative` 段落外自动包裹样式化 `<section>`。
4. 结果以 `ContentOverview`（按 part 分组的导航）与 `ChapterDetail`（单章 HTML + 上下文）缓存。缓存策略：
   - 内部使用文件 `mtime` 签名判定是否需要重新构建。
   - 同时借助 `next/cache` 的 `unstable_cache` + `revalidateTag`（tag=`novel-content`），便于后续在 API 或 Route Handler 中手动刷新。

### tRPC & React Query

- 所有前端读取均通过 `api.content.overview.useQuery` 与 `api.content.chapter.useQuery` 完成，页面初次渲染会注入服务器端预取的 `initialData`，满足 T3 “React Query + tRPC” 的推荐模式。
- `apps/reader/src/trpc/react.tsx` 暴露的 `TRPCReactProvider` 已在根布局中注册，无需额外配置。

---

## 🎨 UI 亮点（T3 版）

- **封面英雄区**：沿用 index.html 的视觉语言（宇宙渐变、主题标签、CTA），动态读取章节/字数统计。
- **三主题切换**：光亮 / 暗夜 / 复古按钮均采用 `next-themes` 控制，配合 CSS 变量驱动背景与 Observer Block 颜色。
- **目录体验**：桌面端使用固定侧栏，移动端提供快速跳转下拉框；当前章节高亮并展示章节号 + 标题。
- **阅读器细节**：
  - Markdown 转 HTML 后保留 `Observer Commentary` 左线、`Human Narrative` 正文等关键样式。
  - 顶部滚动进度条（ScrollProgress）实时反馈阅读进度。
  - 章节底部显示上一章/下一章导航。

---

## 🗂️ 内容维护与扩展

1. **新增章节**：在 `zh-translation/part-0x-some-title/` 内添加 `.md` 文件，并填充 frontmatter：
   ```yaml
   ---
   title: "章节标题"
   part: 2
   chapter: 6
   word_count_estimate: 4500  # 可选，缺省时自动统计
   ---
   ```
2. 重新运行 `pnpm dev`（若已运行则自动热重载）；必要时执行 `pnpm prisma:generate`（若 schema 变更）。
3. 若需要强制刷新 Next 缓存，可在任意服务器动作调用 `revalidateContentCache()`，或运行 `pnpm build` 重新生成静态输出。

> `loader.ts` 对 `Observer Commentary` / `Human Narrative` 标题有特殊处理，如需新增模版，可在 `remark-plugins.ts` 中扩展映射表。

---

## shadcn 组件管理

- 配置位于 `components.json`，默认选择 **New York** 风格与 `zinc` 基色。
- 常用命令：
  - `pnpm dlx shadcn@latest add button card` 引入新组件。
  - `pnpm dlx shadcn@latest add <name> --overwrite` 可更新现有组件（谨慎使用）。
- Tailwind CSS 升级至 v4.1，`postcss.config.mjs` 使用 `@tailwindcss/postcss`，所有 shadcn 组件可直接复用全局 CSS 变量。

---

## 🧪 验证流程

| 操作 | 命令（在 `apps/reader` 内执行） |
| ---- | ---- |
| 依赖安装 | `pnpm install` |
| Prisma Client 生成 | `pnpm prisma:generate`（或设置 `DATABASE_URL` 后运行 `pnpm prisma:generate`） |
| Lint + Type Check | `pnpm lint` |
| 生产构建 | `pnpm build` |
| 本地预览 | `pnpm start` |

开发完成后建议依次运行 `lint → build`，防止 CI 再次报错。

---

## 📄 静态版（index.html）沿用说明

原有单页阅读器仍可通过以下方式使用：

- 直接双击 `index.html`；或
- 在项目根目录执行 `python3 -m http.server 8000` 后访问 `http://localhost:8000/index.html`。

所有旧特性（主题切换、字号调节、LocalStorage 记忆等）保持不变，可作为离线备份或静态部署版本。

---

## 📝 版本信息

- 小说内容：17 章，约 85,000 字。
- T3 阅读器版本：2025-04（初始发布）。
- Node/Pnpm：Next.js 14.2.15、React 18.3、pnpm 单项目管理。

如需扩展搜索、注释或多语言等能力，推荐先通过 OpenSpec 新增变更提案，再按上述架构层逐步实现。
