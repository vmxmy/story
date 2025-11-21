#!/usr/bin/env node

/**
 * 《高维俯瞰》单页阅读器生成脚本
 * 将所有 markdown 章节编译为单一 HTML 文件
 * 增强版 - 每章配备精美封面图
 */

const fs = require('fs');
const path = require('path');

// 章节清单（按阅读顺序）- 包含封面图片
const chapters = [
  {
    id: 'cover',
    title: '封面',
    file: null
  },
  {
    id: 'characters',
    title: '人物档案',
    file: 'content/character-profiles.md',
    coverImage: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Character Silhouettes'
  },
  {
    id: 'ch01',
    title: '第一章：地质一瞬',
    subtitle: 'Geological Blink',
    file: 'content/part-01-time-dilation/chapter-01-geological-blink.md',
    part: 'Part I: 时间膨胀',
    coverImage: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Rock Layers'
  },
  {
    id: 'ch02',
    title: '第二章：七十五次自转',
    subtitle: 'Seventy-Five Rotations',
    file: 'content/part-01-time-dilation/chapter-02-seventy-five-rotations.md',
    part: 'Part I: 时间膨胀',
    coverImage: 'https://images.unsplash.com/photo-1566926946110-5b5345878b4b?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Twilight Over Water'
  },
  {
    id: 'ch03',
    title: '第三章：清朝悖论',
    subtitle: 'The Qing Paradox',
    file: 'content/part-01-time-dilation/chapter-03-the-qing-paradox.md',
    part: 'Part I: 时间膨胀',
    coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Ancient Chinese Architecture'
  },
  {
    id: 'ch04',
    title: '第四章：五十年的幽灵',
    subtitle: 'Fifty Years of Ghosts',
    file: 'content/part-01-time-dilation/chapter-04-fifty-years-of-ghosts.md',
    part: 'Part I: 时间膨胀',
    coverImage: 'https://images.unsplash.com/photo-1552423314-bf59f6621667?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Old Street Taiwan'
  },
  {
    id: 'ch05',
    title: '第五章：病毒式时间',
    subtitle: 'Viral Time',
    file: 'content/part-01-time-dilation/chapter-05-viral-time.md',
    part: 'Part I: 时间膨胀',
    coverImage: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'San Francisco Fog'
  },
  {
    id: 'ch06',
    title: '第六章：中华之船',
    subtitle: 'The Ship of Zhonghua',
    file: 'content/part-02-identity-protocols/chapter-06-the-ship-of-zhonghua.md',
    part: 'Part II: 身份协议',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Ancient Ship at Sea'
  },
  {
    id: 'ch07',
    title: '第七章：分区子程序',
    subtitle: 'Partition Subroutines',
    file: 'content/part-02-identity-protocols/chapter-07-partition-subroutines.md',
    part: 'Part II: 身份协议',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Circuit Board Technology'
  },
  {
    id: 'ch08',
    title: '第八章：模因漂移',
    subtitle: 'Memetic Drift',
    file: 'content/part-02-identity-protocols/chapter-08-memetic-drift.md',
    part: 'Part II: 身份协议',
    coverImage: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'DNA Helix Evolution'
  },
  {
    id: 'ch09',
    title: '第九章：识别协议',
    subtitle: 'The Recognition Protocol',
    file: 'content/part-02-identity-protocols/chapter-09-the-recognition-protocol.md',
    part: 'Part II: 身份协议',
    coverImage: 'https://images.unsplash.com/photo-1483736762161-1d107f3c78e1?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Passport and Identity'
  },
  {
    id: 'ch10',
    title: '第十章：量子叠加',
    subtitle: 'Quantum Superposition',
    file: 'content/part-02-identity-protocols/chapter-10-quantum-superposition.md',
    part: 'Part II: 身份协议',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Quantum Light Waves'
  },
  {
    id: 'ch11',
    title: '第十一章：势能',
    subtitle: 'Potential Energy',
    file: 'content/part-03-energy-states/chapter-11-potential-energy.md',
    part: 'Part III: 能量态',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Mountain Peak Tension'
  },
  {
    id: 'ch12',
    title: '第十二章：引力井',
    subtitle: 'Gravity Wells',
    file: 'content/part-03-energy-states/chapter-12-gravity-wells.md',
    part: 'Part III: 能量态',
    coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Cosmic Gravity'
  },
  {
    id: 'ch13',
    title: '第十三章：活化能',
    subtitle: 'Activation Energy',
    file: 'content/part-03-energy-states/chapter-13-activation-energy.md',
    part: 'Part III: 能量态',
    coverImage: 'https://images.unsplash.com/photo-1530651788726-1dbf58eeef1f?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Chemical Reaction Fire'
  },
  {
    id: 'ch14',
    title: '第十四章：熵释放',
    subtitle: 'Entropy Release',
    file: 'content/part-03-energy-states/chapter-14-entropy-release.md',
    part: 'Part III: 能量态',
    coverImage: 'https://images.unsplash.com/photo-1533231040102-5ec8881a6991?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Destruction and Chaos'
  },
  {
    id: 'ch15',
    title: '第十五章：均衡寻求',
    subtitle: 'Equilibrium Seeking',
    file: 'content/part-03-energy-states/chapter-15-equilibrium-seeking.md',
    part: 'Part III: 能量态',
    coverImage: 'https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Balance and Ruins'
  },
  {
    id: 'ch16',
    title: '第十六章：热寂',
    subtitle: 'Heat Death',
    file: 'content/part-04-epilogue/chapter-16-heat-death.md',
    part: 'Part IV: 尾声',
    coverImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Deep Space Universe'
  },
  {
    id: 'ch17',
    title: '第十七章：人择反转',
    subtitle: 'The Anthropic Inversion',
    file: 'content/part-04-epilogue/chapter-17-the-anthropic-inversion.md',
    part: 'Part IV: 尾声',
    coverImage: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=1600&auto=format&fit=crop',
    coverAlt: 'Human Connection Hope'
  }
];

// 简单的 Markdown 到 HTML 转换 - 改进版,支持observer-block样式
function markdownToHtml(md) {
  let html = md;

  // 移除frontmatter
  html = html.replace(/^---[\s\S]*?---\n/m, '');

  // 分割为section并处理
  const sections = html.split(/^## /gm);
  let processedSections = [];
  let foundFirstPara = false;

  sections.forEach((section, idx) => {
    if (!section.trim()) return;

    const lines = section.split('\n');
    const heading = lines[0];
    const content = lines.slice(1).join('\n');

    // 检查是否为Observer Commentary
    if (heading && (heading.includes('Observer') || heading.includes('观察者'))) {
      // Observer Block样式
      let observerHtml = content;
      observerHtml = observerHtml.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      observerHtml = observerHtml.replace(/\*(.+?)\*/g, '<em>$1</em>');

      const paras = observerHtml.split('\n\n').map(para => {
        para = para.trim();
        if (!para) return '';
        if (para.startsWith('- ')) {
          const items = para.split('\n').filter(l => l.trim()).map(i => i.replace(/^- /, ''));
          return `<ul class="list-disc list-inside ml-4 mb-4 opacity-90 space-y-1 text-sm">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
        }
        if (para === '---') {
          return '<hr class="border-current opacity-20 my-4">';
        }
        return `<p class="mb-2">${para.replace(/\n/g, '<br>')}</p>`;
      }).join('\n');

      processedSections.push(`
        <div class="observer-block font-mono-custom">
          <h3 class="text-sm font-bold uppercase tracking-widest mb-4 opacity-70">/// ${heading.trim()} ///</h3>
          ${paras}
        </div>
      `);
    } else {
      // 人类叙事部分
      let narrativeHtml = content;
      narrativeHtml = narrativeHtml.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      narrativeHtml = narrativeHtml.replace(/\*(.+?)\*/g, '<em>$1</em>');

      const paras = narrativeHtml.split('\n\n').map((para, pIdx) => {
        para = para.trim();
        if (!para) return '';
        if (para === '---') {
          return '<div class="flex justify-center my-8"><span class="w-16 h-px bg-current opacity-30"></span></div>';
        }

        // 第一个段落添加drop-cap类
        const dropCapClass = (!foundFirstPara && pIdx === 0) ? ' drop-cap' : '';
        if (!foundFirstPara && pIdx === 0) foundFirstPara = true;

        return `<p class="mb-4${dropCapClass}">${para.replace(/\n/g, '<br>')}</p>`;
      }).join('\n');

      if (heading && heading.trim()) {
        processedSections.push(`
          <div class="flex justify-center items-center my-12 opacity-30">
            <span class="text-2xl">❖</span>
          </div>
          <div class="narrative-text">
            <h3 class="text-2xl font-bold mb-8 text-center">${heading.trim()}</h3>
            ${paras}
          </div>
        `);
      } else {
        processedSections.push(`<div class="narrative-text">${paras}</div>`);
      }
    }
  });

  return processedSections.join('\n');
}

function loadChapter(filepath) {
  if (!filepath) return '';
  const fullPath = path.join(__dirname, filepath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Warning: File not found: ${fullPath}`);
    return '<p>章节内容加载失败</p>';
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  return markdownToHtml(content);
}

function generateTOC() {
  let currentPart = '';
  let tocHTML = '';

  chapters.forEach(ch => {
    if (ch.id === 'cover') return;

    if (ch.part && ch.part !== currentPart) {
      currentPart = ch.part;
      tocHTML += `<div class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-6 mb-2 px-4 font-mono-custom">${currentPart}</div>`;
    }

    const chapterLabel = ch.id === 'characters' ? '' : ch.id.replace('ch', 'CH ').padStart(5, '0');
    tocHTML += `
      <button
        onclick="renderChapter('${ch.id}')"
        id="nav-${ch.id}"
        class="nav-item w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg group"
        data-chapter="${ch.id}">
        ${chapterLabel ? `<span class="block text-xs opacity-50 mb-1 font-mono-custom">${chapterLabel}</span>` : ''}
        <span class="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">${ch.title.replace(/第[一二三四五六七八九十]+章：/, '')}</span>
      </button>
    `;
  });

  return tocHTML;
}

function generateTemplates() {
  let templatesHTML = '';

  chapters.forEach(ch => {
    if (ch.id === 'cover') {
      templatesHTML += `
<template id="cover">
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <div class="text-center space-y-8 px-6 animate-fade-in">
      <div class="space-y-4">
        <div class="text-blue-400 font-mono-custom text-sm tracking-widest uppercase">Science Fiction • Philosophical Novel</div>
        <h1 class="text-6xl md:text-8xl font-bold text-white tracking-tight animate-glow">
          高维俯瞰
        </h1>
        <p class="text-3xl md:text-4xl text-blue-200 font-light italic">
          High-Dimensional Observer
        </p>
      </div>
      <div class="pt-8 space-y-4 text-gray-300 max-w-2xl mx-auto">
        <p class="text-lg leading-relaxed">一部关于身份、冲突与宇宙无意义的哲学科幻小说</p>
        <p class="text-sm opacity-75">17章 · 约85,000字 · 2025</p>
      </div>
      <button
        onclick="renderChapter('characters')"
        class="mt-12 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all transform hover:scale-105 font-semibold shadow-lg shadow-blue-500/50">
        开始阅读 →
      </button>
    </div>
  </div>
</template>
      `;
    } else {
      const content = loadChapter(ch.file);
      const coverHTML = ch.coverImage ? `
        <div class="mb-16 relative rounded-xl overflow-hidden shadow-2xl group aspect-[3/4] sm:aspect-[21/9]">
          <img src="${ch.coverImage}"
               class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
               alt="${ch.coverAlt}"
               loading="lazy">
          <div class="absolute inset-0 cover-gradient flex flex-col justify-end p-8 text-white">
            <div class="font-mono-custom text-xs text-blue-300 mb-2 tracking-[0.2em]">${ch.part || 'CHAPTER'}</div>
            <h1 class="text-4xl sm:text-6xl font-bold mb-4 tracking-tight">${ch.title.replace(/第[一二三四五六七八九十]+章：/, '')}</h1>
            ${ch.subtitle ? `<h2 class="text-xl sm:text-2xl opacity-90 font-light italic">${ch.subtitle}</h2>` : ''}
          </div>
        </div>
      ` : '';

      templatesHTML += `
<template id="${ch.id}">
  <article class="max-w-3xl mx-auto px-6 py-12 text-lg">
    ${coverHTML}
    ${content}
  </article>
</template>
      `;
    }
  });

  return templatesHTML;
}

function generateHTML() {
  const tocHTML = generateTOC();
  const templatesHTML = generateTemplates();

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>高维俯瞰 - High-Dimensional Observer</title>
    <meta name="description" content="一部关于身份、冲突与宇宙无意义的哲学科幻小说">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark ::-webkit-scrollbar-thumb { background: #475569; }

        /* Typography */
        body {
            font-family: 'Noto Serif SC', serif;
            transition: background-color 0.3s, color 0.3s;
        }
        .font-mono-custom { font-family: 'JetBrains Mono', monospace; }

        /* Themes */
        .theme-light { background-color: #f8fafc; color: #1e293b; --nav-bg: rgba(255,255,255,0.8); --sidebar-bg: #f1f5f9; --active-item: #e2e8f0; }
        .theme-sepia { background-color: #f4ecd8; color: #433422; --nav-bg: rgba(244, 236, 216, 0.9); --sidebar-bg: #eaddc5; --active-item: #dccca3; }
        .theme-dark { background-color: #0f172a; color: #cbd5e1; --nav-bg: rgba(15, 23, 42, 0.8); --sidebar-bg: #1e293b; --active-item: #334155; }

        /* Animations */
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
            0%, 100% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
            50% { text-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }

        /* Observer Block */
        .observer-block {
            border-left: 4px solid;
            padding: 1.5rem;
            margin: 2rem 0;
            font-size: 0.95em;
        }
        .theme-light .observer-block {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.05);
        }
        .theme-sepia .observer-block {
            border-color: #d97706;
            background: rgba(217, 119, 6, 0.05);
        }
        .theme-dark .observer-block {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.1);
        }

        /* Narrative Text */
        .narrative-text p {
            margin-bottom: 1.5em;
            line-height: 1.8;
            text-align: justify;
        }

        /* Drop Cap */
        .drop-cap::first-letter {
            font-size: 3.5em;
            float: left;
            line-height: 0.8;
            margin-right: 0.1em;
            font-weight: 700;
        }
        .theme-light .drop-cap::first-letter { color: #3b82f6; }
        .theme-sepia .drop-cap::first-letter { color: #d97706; }
        .theme-dark .drop-cap::first-letter { color: #60a5fa; }

        /* Cover Gradient */
        .cover-gradient {
            background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
        }

        /* Progress Bar */
        #progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            width: 0%;
            z-index: 1000;
            transition: width 0.1s ease;
        }
        .theme-sepia #progress-bar {
            background: linear-gradient(to right, #d97706, #f59e0b);
        }

        /* Sidebar */
        #sidebar {
            transition: transform 0.3s ease-in-out;
        }
        #sidebar.closed {
            transform: translateX(-100%);
        }
        @media (min-width: 1024px) {
            #sidebar.closed {
                transform: translateX(0);
            }
        }

        .nav-item.active {
            background-color: var(--active-item);
            border-left: 3px solid #3b82f6;
        }
        .theme-sepia .nav-item.active {
            border-left-color: #d97706;
        }
    </style>
</head>
<body class="theme-light h-screen flex overflow-hidden">

    <!-- Progress Bar -->
    <div id="progress-bar"></div>

    <!-- Sidebar -->
    <aside id="sidebar" class="fixed inset-y-0 left-0 z-50 w-80 lg:w-72 shadow-xl lg:shadow-none lg:static border-r border-current border-opacity-10 flex flex-col transform -translate-x-full lg:translate-x-0" style="background-color: var(--sidebar-bg);">
        <div class="p-6 border-b border-current border-opacity-10">
            <div class="font-bold font-mono-custom text-blue-600 tracking-widest text-xs uppercase mb-1">High-Dimensional Observer</div>
            <h1 class="font-bold text-2xl mb-1">高维俯瞰</h1>
            <p class="text-xs opacity-60">一部关于身份、冲突与宇宙无意义的哲学科幻小说</p>
        </div>

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
            ${tocHTML}
        </nav>

        <div class="p-4 border-t border-current border-opacity-10 text-xs opacity-50 text-center font-mono-custom">
            Authored by AI · 2025
        </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-full relative">

        <!-- Top Bar -->
        <header class="h-14 border-b border-current border-opacity-10 flex items-center justify-between px-6 backdrop-blur-md z-40" style="background-color: var(--nav-bg);">
            <div class="flex items-center gap-4">
                <button onclick="toggleSidebar()" class="lg:hidden p-2 hover:bg-black/5 rounded transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <span id="header-title" class="font-semibold text-sm truncate max-w-[200px]"></span>
            </div>

            <div class="flex items-center gap-2">
                <div class="hidden sm:flex border border-current border-opacity-20 rounded-lg overflow-hidden">
                    <button onclick="adjustFontSize(-1)" class="px-3 py-1.5 text-sm hover:bg-black/5 transition-colors" title="减小字号">A-</button>
                    <button onclick="adjustFontSize(1)" class="px-3 py-1.5 text-sm hover:bg-black/5 transition-colors" title="增大字号">A+</button>
                </div>
                <button onclick="setTheme('theme-light')" class="w-6 h-6 rounded-full bg-gray-100 border border-gray-300 shadow-sm hover:scale-110 transition-transform" title="明亮主题"></button>
                <button onclick="setTheme('theme-sepia')" class="w-6 h-6 rounded-full bg-[#f4ecd8] border border-[#dccca3] shadow-sm hover:scale-110 transition-transform" title="护眼主题"></button>
                <button onclick="setTheme('theme-dark')" class="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 shadow-sm hover:scale-110 transition-transform" title="暗黑主题"></button>
            </div>
        </header>

        <!-- Scrollable Reading Area -->
        <main id="content-area" class="flex-1 overflow-y-auto scroll-smooth relative">
            <div id="article-container" class="transition-opacity duration-300">
                <!-- Dynamic Content -->
            </div>

            <!-- Footer Navigation -->
            <div class="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center border-t border-current border-opacity-10">
                <button onclick="prevChapter()" id="nav-prev" class="px-4 py-2 rounded-lg hover:bg-black/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-sm">
                    ← 上一章
                </button>
                <button onclick="nextChapter()" id="nav-next" class="px-4 py-2 rounded-lg hover:bg-black/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-sm">
                    下一章 →
                </button>
            </div>
        </main>
    </div>

    <!-- Templates -->
    ${templatesHTML}

    <script>
        const CHAPTERS = ${JSON.stringify(chapters.map(ch => ({ id: ch.id, title: ch.title })))};
        let currentChapterIndex = 0;
        let currentFontSize = 18;

        function renderChapter(chapterId) {
            const chapterIndex = CHAPTERS.findIndex(ch => ch.id === chapterId);
            if (chapterIndex === -1) return;

            const template = document.getElementById(chapterId);
            const container = document.getElementById('article-container');

            if (!template) return;

            // Fade out
            container.style.opacity = '0';

            setTimeout(() => {
                // Swap content
                container.innerHTML = '';
                container.appendChild(template.content.cloneNode(true));

                // Update sidebar navigation
                document.querySelectorAll('.nav-item').forEach(btn => {
                    btn.classList.remove('active');
                });
                const activeBtn = document.getElementById('nav-' + chapterId);
                if (activeBtn) activeBtn.classList.add('active');

                // Update header title
                document.getElementById('header-title').textContent = CHAPTERS[chapterIndex].title;

                // Update nav buttons
                currentChapterIndex = chapterIndex;
                document.getElementById('nav-prev').disabled = chapterIndex <= 0;
                document.getElementById('nav-next').disabled = chapterIndex >= CHAPTERS.length - 1;

                // Reset scroll to top
                document.getElementById('content-area').scrollTop = 0;

                // Fade in
                setTimeout(() => { container.style.opacity = '1'; }, 50);

                // Close sidebar on mobile
                if (window.innerWidth < 1024) {
                    document.getElementById('sidebar').classList.add('closed');
                }

                // Save to localStorage
                localStorage.setItem('last_chapter', chapterId);
            }, 300);
        }

        function nextChapter() {
            if (currentChapterIndex < CHAPTERS.length - 1) {
                renderChapter(CHAPTERS[currentChapterIndex + 1].id);
            }
        }

        function prevChapter() {
            if (currentChapterIndex > 0) {
                renderChapter(CHAPTERS[currentChapterIndex - 1].id);
            }
        }

        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('closed');
        }

        function adjustFontSize(change) {
            currentFontSize += change * 2;
            if (currentFontSize < 14) currentFontSize = 14;
            if (currentFontSize > 24) currentFontSize = 24;
            document.getElementById('article-container').style.fontSize = currentFontSize + 'px';
            localStorage.setItem('reader_fontsize', currentFontSize);
        }

        function setTheme(themeName) {
            document.body.className = themeName + ' h-screen flex overflow-hidden';
            localStorage.setItem('reader_theme', themeName);
        }

        // Scroll Progress
        document.getElementById('content-area').addEventListener('scroll', function(e) {
            const height = e.target.scrollHeight - e.target.clientHeight;
            const scrolled = (e.target.scrollTop / height) * 100;
            document.getElementById("progress-bar").style.width = scrolled + "%";
        });

        // Initialize
        window.onload = function() {
            // Restore settings
            const savedTheme = localStorage.getItem('reader_theme') || 'theme-light';
            const savedFontSize = parseInt(localStorage.getItem('reader_fontsize')) || 18;
            const savedChapter = localStorage.getItem('last_chapter') || 'cover';

            setTheme(savedTheme);
            currentFontSize = savedFontSize;
            document.getElementById('article-container').style.fontSize = savedFontSize + 'px';
            renderChapter(savedChapter);

            // Ensure sidebar state on mobile
            if (window.innerWidth < 1024) {
                document.getElementById('sidebar').classList.add('closed');
            }
        };

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') prevChapter();
            if (e.key === 'ArrowRight') nextChapter();
        });
    </script>
</body>
</html>`;
}

// 执行生成
const html = generateHTML();
fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf-8');
console.log('✅ index.html 生成成功！');
console.log('📖 文件位置:', path.join(__dirname, 'index.html'));
console.log('🎨 已为所有17章添加精美封面图');
console.log('🚀 双击打开即可阅读');
