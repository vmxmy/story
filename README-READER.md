# 《高维俯瞰》Web 阅读器使用说明

## 📦 交付物清单

✅ **index.html** (484 KB) - 单页 HTML 阅读器，包含完整小说内容

## 🚀 使用方法

### 方式一：本地双击打开（推荐）
直接双击 `index.html` 文件，将在默认浏览器中打开。

### 方式二：本地服务器
```bash
# 使用 Python 简易服务器
python3 -m http.server 8000

# 或使用 Node.js
npx serve .
```

然后访问 `http://localhost:8000`

## ✨ 功能特性

### 📖 阅读体验
- ✅ **17章完整内容** - 包含封面、人物档案及所有正文章节
- ✅ **双重字体**：
  - 正文：Noto Serif SC（优雅宋体）
  - 观察者评论：JetBrains Mono（等宽字体，营造科幻感）
- ✅ **首字下沉** - 每章开头首字放大
- ✅ **两端对齐** - 传统书籍排版风格

### 🎨 主题切换
- ☀️ **明亮模式** (Light) - 白底黑字，默认主题
- 📄 **护眼模式** (Sepia) - 羊皮纸色 (#F4ECD8)，减少蓝光
- 🌙 **暗黑模式** (Dark) - 深灰底浅灰字 (#0F172A)

### 🔧 阅读控制
- **字号调整**: A- / A+ 按钮（14px - 24px）
- **阅读进度条**: 页面顶部实时显示当前章节进度
- **自动记忆**: 关闭浏览器后再次打开，自动恢复：
  - 上次阅读的章节
  - 主题偏好
  - 字号设置

### 📱 响应式设计
- **桌面端**: 左侧固定目录导航 + 右侧阅读区
- **移动端**: 顶部工具栏 + 汉堡菜单滑出式目录

## 📊 技术规格

### 核心技术
- **HTML5** - 语义化标签
- **Tailwind CSS** (CDN) - 快速响应式布局
- **Vanilla JavaScript** - 零依赖，轻量级
- **LocalStorage API** - 本地数据持久化

### 文件结构
```
单一 HTML 文件结构：
├── <head> - 样式和字体引入
├── <body>
│   ├── 侧边栏导航
│   ├── 主内容区
│   │   ├── 工具栏
│   │   └── 章节容器
│   └── <template> 标签（隐藏的章节内容）
└── <script> - 交互逻辑
```

### 浏览器兼容性
- ✅ Chrome 90+
- ✅ Safari 14+ (macOS / iOS)
- ✅ Edge 90+
- ✅ Firefox 88+

## 📝 章节清单

**Part I: 时间膨胀**
1. 地质一瞬 (Geological Blink)
2. 七十五次自转 (Seventy-Five Rotations)
3. 清朝悖论 (The Qing Paradox)
4. 五十年的幽灵 (Fifty Years of Ghosts)
5. 病毒式时间 (Viral Time)

**Part II: 身份协议**
6. 中华之船 (The Ship of Zhonghua)
7. 分区子程序 (Partition Subroutines)
8. 模因漂移 (Memetic Drift)
9. 识别协议 (The Recognition Protocol)
10. 量子叠加 (Quantum Superposition)

**Part III: 能量态**
11. 势能 (Potential Energy)
12. 引力井 (Gravity Wells)
13. 活化能 (Activation Energy)
14. 熵释放 (Entropy Release)
15. 均衡寻求 (Equilibrium Seeking)

**Part IV: 尾声**
16. 热寂 (Heat Death)
17. 人择反转 (The Anthropic Inversion)

## 🔄 重新生成

如果需要修改小说内容后重新生成阅读器：

```bash
# 编辑章节内容（markdown 文件）
vim content/part-01-time-dilation/chapter-01-geological-blink.md

# 重新生成 HTML
node build-reader.js

# 新的 index.html 将覆盖旧文件
```

## 🌐 部署建议

### GitHub Pages
```bash
# 1. 创建 gh-pages 分支
git checkout -b gh-pages

# 2. 只保留 index.html
git add index.html
git commit -m "Deploy reader"

# 3. 推送到远程
git push origin gh-pages

# 4. 在 GitHub 仓库设置中启用 Pages
# Settings -> Pages -> Source: gh-pages branch
```

### Netlify / Vercel
将 `index.html` 拖放到控制台即可部署。

### 自托管
将 `index.html` 上传到任何静态文件服务器（Nginx, Apache, S3等）。

## 📐 文件优化建议

当前文件大小为 **484 KB**。如需进一步优化：

### 1. 内联 Tailwind CSS（推荐）
```bash
# 安装 Tailwind CLI
npm install -D tailwindcss

# 生成最小化 CSS（仅包含使用的类）
npx tailwindcss -o minified.css --minify

# 然后手动将生成的 CSS 替换 HTML 中的 CDN 链接
```

### 2. 压缩 HTML
使用工具如 `html-minifier`:
```bash
npx html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
```

### 3. 启用服务器 Gzip
在 Nginx 配置中添加：
```nginx
gzip on;
gzip_types text/html text/css application/javascript;
```

## ❓ 常见问题

**Q: 为什么封面不显示？**
A: 确保浏览器允许加载本地文件。如果是 Chrome，可能需要使用 `--allow-file-access-from-files` 标志启动。

**Q: 移动端菜单无法关闭？**
A: 点击阅读区域任意位置即可关闭侧边栏。

**Q: 主题切换有闪烁？**
A: 这是浏览器重绘导致，正常现象。已添加 CSS 过渡动画减轻闪烁。

**Q: 如何分享给他人？**
A: 直接发送 `index.html` 文件即可，对方双击打开即用。

## 📄 许可证

本阅读器为《高维俯瞰》小说的配套工具，遵循小说本身的版权协议。

---

**生成时间**: 2025-11-21
**版本**: v1.0
**总字数**: ~85,000 字
**章节数**: 17 章
