#!/usr/bin/env python3
"""Convert Markdown files under content/ into simple text-based PDFs."""
from __future__ import annotations

import textwrap
from pathlib import Path

SOURCE_ROOT = Path('content')
OUTPUT_ROOT = Path('pdf/en')
PAGE_WIDTH = 612  # 8.5in * 72pt
PAGE_HEIGHT = 792  # 11in * 72pt
MARGIN_X = 72
MARGIN_Y = 72
FONT_SIZE = 12
LINE_HEIGHT = 14
LINES_PER_PAGE = int((PAGE_HEIGHT - 2 * MARGIN_Y) / LINE_HEIGHT) or 1
WRAP_WIDTH = 90


def escape_pdf_text(text: str) -> str:
    """Escape parentheses/backslashes and constrain to ASCII."""
    safe_chars = []
    for ch in text:
        code = ord(ch)
        if ch == '\\':
            safe_chars.append('\\\\')
        elif ch == '(':
            safe_chars.append('\\(')
        elif ch == ')':
            safe_chars.append('\\)')
        elif 32 <= code <= 126:
            safe_chars.append(ch)
        else:
            safe_chars.append('?')
    return ''.join(safe_chars)


def wrap_lines(text: str) -> list[str]:
    raw_lines = text.splitlines()
    wrapped: list[str] = []
    for line in raw_lines:
        segments = textwrap.wrap(
            line,
            width=WRAP_WIDTH,
            replace_whitespace=False,
            drop_whitespace=False,
            break_long_words=True,
        )
        if not segments:
            wrapped.append('')
        else:
            wrapped.extend(seg.rstrip('\n') for seg in segments)
    return wrapped or ['']


def chunk_pages(lines: list[str]) -> list[list[str]]:
    pages: list[list[str]] = []
    current: list[str] = []
    for line in lines:
        current.append(line)
        if len(current) >= LINES_PER_PAGE:
            pages.append(current)
            current = []
    if current or not pages:
        pages.append(current)
    return pages


def build_content_stream(page_lines: list[str]) -> bytes:
    parts = [
        'BT',
        '/F1 {} Tf'.format(FONT_SIZE),
        f'{LINE_HEIGHT} TL',
        f'{MARGIN_X} {PAGE_HEIGHT - MARGIN_Y} Td',
    ]
    for line in page_lines:
        parts.append(f'({escape_pdf_text(line)}) Tj')
        parts.append('T*')
    parts.append('ET')
    body = '\n'.join(parts)
    return body.encode('latin-1', errors='ignore')


def build_pdf(lines: list[str]) -> bytes:
    pages = chunk_pages(lines)
    if not pages:
        pages = [[]]

    objects: dict[int, bytes] = {}

    def add_obj(obj_id: int, body: bytes | str) -> None:
        if isinstance(body, str):
            body = body.encode('latin-1')
        objects[obj_id] = body

    total_objs = 3 + len(pages) * 2  # catalog + pages + font + (content+page per page)
    content_ids = []
    page_ids = []
    next_id = 4
    for page_lines in pages:
        stream = build_content_stream(page_lines)
        content = f"<< /Length {len(stream)} >>\nstream\n".encode('latin-1') + stream + b"\nendstream"
        content_ids.append(next_id)
        add_obj(next_id, content)
        next_id += 1
        page_ids.append(next_id)
        next_id += 1

    font_obj = 3
    add_obj(font_obj, "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>")

    for idx, page_id in enumerate(page_ids):
        content_id = content_ids[idx]
        page_dict = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_WIDTH} {PAGE_HEIGHT}] "
            f"/Resources << /Font << /F1 {font_obj} 0 R >> >> /Contents {content_id} 0 R >>"
        )
        add_obj(page_id, page_dict)

    kids = ' '.join(f'{pid} 0 R' for pid in page_ids)
    add_obj(2, f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>")
    add_obj(1, "<< /Type /Catalog /Pages 2 0 R >>")

    parts = [b"%PDF-1.4\n%\xE2\xE3\xCF\xD3\n"]
    offsets: dict[int, int] = {}
    current_len = len(parts[0])
    for obj_id in range(1, total_objs + 1):
        body = objects[obj_id]
        obj_blob = f"{obj_id} 0 obj\n".encode('latin-1') + body + b"\nendobj\n"
        parts.append(obj_blob)
        offsets[obj_id] = current_len
        current_len += len(obj_blob)

    xref = [f"xref\n0 {total_objs + 1}", "0000000000 65535 f "]
    for obj_id in range(1, total_objs + 1):
        xref.append(f"{offsets[obj_id]:010} 00000 n ")
    xref_blob = '\n'.join(xref).encode('latin-1') + b"\n"
    trailer = (
        f"trailer\n<< /Size {total_objs + 1} /Root 1 0 R >>\nstartxref\n{current_len}\n%%EOF\n"
    ).encode('latin-1')

    return b''.join(parts) + xref_blob + trailer


def convert_file(md_path: Path) -> None:
    rel = md_path.relative_to(SOURCE_ROOT)
    output_path = OUTPUT_ROOT / rel.with_suffix('.pdf')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    text = md_path.read_text(encoding='utf-8')
    lines = wrap_lines(text)
    pdf_bytes = build_pdf(lines)
    output_path.write_bytes(pdf_bytes)
    print(f"Converted {md_path} -> {output_path}")


def main() -> None:
    if not SOURCE_ROOT.exists():
        raise SystemExit('content/ directory not found')
    md_files = sorted(SOURCE_ROOT.rglob('*.md'))
    for md_path in md_files:
        convert_file(md_path)


if __name__ == '__main__':
    main()
