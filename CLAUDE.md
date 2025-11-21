# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Science fiction novel reader generator. The project compiles markdown chapter files into a single-page HTML reader with theming, font controls, and progress tracking. Built with vanilla JavaScript, Tailwind CSS (CDN), and zero dependencies.

## Build and Development

### Generate Reader
```bash
node build-reader.js
```
Outputs: `index.html` (single-page reader)

### View Reader Locally
```bash
# Double-click index.html or use:
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Architecture

### Build System (build-reader.js)

**Chapter Configuration** (build-reader.js:13-179)
- Array defining chapter order, titles, markdown file paths
- Each chapter has optional `coverImage` (Unsplash CDN) and `part` grouping
- Special chapters: 'cover' (generated), 'characters' (markdown-based)

**Markdown Processing** (build-reader.js:182-209)
- `markdownToHtml()`: Converts markdown to HTML with custom styling
- Strips frontmatter, converts headings/emphasis/paragraphs
- Special class `.observer-section` for h2 elements (sci-fi commentary styling)

**HTML Generation** (build-reader.js:297-587)
- Inline Tailwind CSS via CDN (no build step)
- Embedded fonts: Noto Serif SC (body), JetBrains Mono (technical sections)
- Templates stored in `<template>` tags, loaded via JavaScript
- Single-file output: all chapters embedded in one HTML

### Content Structure

```
content/
├── character-profiles.md           # Cast of characters
├── observer-voice-guide.md         # Writing guide (not in reader)
├── temporal-scales.md              # Reference doc (not in reader)
├── part-01-time-dilation/          # Chapters 1-5
├── part-02-identity-protocols/     # Chapters 6-10
├── part-03-energy-states/          # Chapters 11-15
└── part-04-epilogue/               # Chapters 16-17
```

**Markdown Format**
Each chapter markdown file includes:
- Frontmatter: `title`, `part`, `chapter`, `word_count_estimate`
- `## Observer Commentary` section (styled with mono font)
- `## Human Narrative` section (styled with serif font)

### Reader Features (index.html)

**State Management**
- LocalStorage keys: `last_chapter`, `reader_theme`, `reader_fontsize`
- Theme options: `theme-light`, `theme-sepia`, `theme-dark`
- Font size range: 14-24px (adjustable in 2px increments)

**Navigation**
- Desktop: Fixed sidebar (280px) + main content area
- Mobile: Collapsible hamburger menu
- Progress bar: Top-fixed, tracks scroll position
- Keyboard shortcuts: Arrow keys for prev/next chapter

**Chapter Rendering**
- Template cloning (build-reader.js:477-523)
- Fade-out/swap/fade-in animation (300ms)
- Auto-scroll to top on chapter change
- Active chapter highlighting in sidebar

## OpenSpec Integration

This project uses OpenSpec for spec-driven development. See `openspec/AGENTS.md` for full workflow.

**Key Commands**
```bash
openspec list                      # List active change proposals
openspec list --specs              # List existing specifications
openspec validate [change] --strict # Validate proposal format
openspec archive <change-id> --yes # Archive deployed change
```

**When to Create Proposals**
- New features (e.g., add PDF export)
- Breaking changes (e.g., change chapter data structure)
- Architecture changes (e.g., switch from vanilla JS to React)

**Skip Proposals For**
- Typo fixes in markdown chapters
- Adding new chapters (follow existing format)
- Minor style adjustments

## Common Tasks

### Add New Chapter
1. Create markdown file in appropriate `content/part-XX/` directory
2. Add entry to `chapters` array in build-reader.js (lines 13-179)
3. Specify `coverImage` URL (use Unsplash with `?q=80&w=1600`)
4. Run `node build-reader.js`

### Modify Reader Styling
1. Edit inline CSS in build-reader.js (lines 313-402)
2. Tailwind classes embedded in HTML template (lines 302-469)
3. Regenerate: `node build-reader.js`

### Change Fonts
Fonts loaded via Google Fonts CDN (build-reader.js:311). Modify:
- Serif (body): `font-family: 'Noto Serif SC', serif`
- Mono (observer): `font-family: 'JetBrains Mono', monospace`

### Debug Chapter Not Showing
- Check `loadChapter()` path resolution (build-reader.js:200-209)
- Verify markdown file exists at path specified in `chapters` array
- Check browser console for template loading errors

## File Management

Move files to archive instead of deleting:
```bash
# Create archive directory if it doesn't exist
mkdir -p archive

# Move instead of rm
mv old-file.js archive/
```

## Conventions

- Chapter IDs: `ch01`, `ch02` (zero-padded)
- Change IDs: kebab-case, verb-led (`add-`, `update-`, `remove-`)
- Image URLs: Unsplash CDN with `?q=80&w=1600&auto=format&fit=crop`
- Comments: Minimal, code should be self-documenting
- No abbreviations in variable names (e.g., `currentChapterIndex` not `currChIdx`)
