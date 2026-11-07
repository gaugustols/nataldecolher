"""Import the three private bonus PDFs as native reader content, never PDF downloads.

Run with the bundled Python (pdfplumber). --verify compares every extracted block
with the current sources. Character coverage checks prevent silent omissions.
"""
import argparse
from collections import Counter
from hashlib import sha256
import json
from pathlib import Path
import re

import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'public/planopro/bonus-data.js'
TITLES = {
    'precos': 'Guia de Preços de Natal 2026',
    'whatsapp': 'Kit de WhatsApp para Encomendas de Natal',
    'sobras': 'Guia de aproveitamento: Sobras que viram lucro',
}


def text(chars):
    if not chars:
        return ''
    return pdfplumber.utils.extract_text(chars, x_tolerance=2, y_tolerance=3).strip()


def clean(value):
    return re.sub(r'\s+', ' ', value).strip()


def chars_inside(chars, box):
    x0, y0, x1, y1 = box
    return [c for c in chars if x0 <= (c['x0'] + c['x1']) / 2 < x1
            and y0 <= (c['top'] + c['bottom']) / 2 < y1]


def coverage(value):
    return Counter(c for c in value if not c.isspace())


def block_text(block):
    if block['type'] == 'table':
        return ''.join(''.join(row) for row in block['rows'])
    if block['type'] == 'flow':
        return ''.join(block['items'])
    return block.get('label', '') + block.get('text', '')


def extract_section(page, number, bonus_id):
    chars = [c for c in page.chars if 75 < c['top'] < 640]
    title_chars = [c for c in chars if c['size'] > 20]
    title = clean(text(title_chars))
    assert title, (bonus_id, number, 'Missing section heading')
    used = {id(c) for c in title_chars}
    nodes = []

    # Native tables: the source uses a green header and horizontal row rules.
    for header in [r for r in page.rects if 75 < r['top'] < 640 and r['width'] > 300]:
        top, bottom = header['top'], header['bottom']
        head_chars = chars_inside(chars, (29, top, 453, bottom))
        words = pdfplumber.utils.extract_words(head_chars)
        groups = []
        for word in sorted(words, key=lambda w: (round(w['top'] / 3), w['x0'])):
            if not groups or word['x0'] - groups[-1][-1]['x1'] > 12:
                groups.append([word])
            else:
                groups[-1].append(word)
        starts = sorted({round(g[0]['x0'] - 8, 1) for g in groups})
        assert 2 <= len(starts) <= 4, (bonus_id, number, starts)
        columns = starts + [453]
        boundaries = [top, bottom]
        for y in sorted({round(l['top'], 4) for l in page.lines
                         if l['x1'] - l['x0'] > 400 and bottom + .5 < l['top'] < 635}):
            if y - boundaries[-1] > 52:
                break
            row_chars = chars_inside(chars, (29, boundaries[-1], 453, y))
            # Worksheet fields following the table begin flush left, not inset.
            if not row_chars or min(c['x0'] for c in row_chars if c['text'].strip()) < 35:
                break
            boundaries.append(y)
        rows = []
        for y0, y1 in zip(boundaries, boundaries[1:]):
            row = []
            for x0, x1 in zip(columns, columns[1:]):
                cell = chars_inside(chars, (x0, y0, x1, y1))
                used.update(id(c) for c in cell)
                row.append(clean(text(cell)))
            rows.append(row)
        nodes.append((top, {'type': 'table', 'rows': rows}))

    # Flow diagrams and callouts become accessible text rather than page images.
    flows = []
    for box in page.curves:
        if box['width'] < 50 or not (75 < box['top'] < 630):
            continue
        content = chars_inside(chars, (box['x0'], box['top'], box['x1'], box['bottom']))
        content = [c for c in content if id(c) not in used]
        if not content:
            continue
        used.update(id(c) for c in content)
        value = text(content)
        if box['width'] < 180:
            flows.append((box['top'], box['x0'], clean(value)))
            continue
        color = box.get('non_stroking_color') or ()
        is_message = bonus_id == 'whatsapp' and (len(color) == 3 and abs(color[0] - .909804) < .001)
        label = ''
        if value.startswith('MENSAGEM PARA COPIAR\n'):
            label, value = value.split('\n', 1)
        elif value.startswith('Resumo para copiar\n'):
            label, value = value.split('\n', 1)
            is_message = True
        nodes.append((box['top'], {'type': 'copy' if is_message else 'note',
                                  'label': label, 'text': clean(value) if is_message else value}))
    for top in sorted({round(f[0], 1) for f in flows}):
        items = [f[2] for f in sorted(flows, key=lambda f: f[1]) if abs(f[0] - top) < .2]
        nodes.append((top, {'type': 'flow', 'items': items}))

    remaining = [c for c in chars if id(c) not in used]
    # Preserve paragraphs, subheadings and worksheet prompts with their reading order.
    line_groups = []
    for c in sorted(remaining, key=lambda c: (round(c['top'], 1), c['x0'])):
        if not c['text'].strip():
            continue
        found = next((g for g in reversed(line_groups[-3:]) if abs(g[0]['top'] - c['top']) < 2), None)
        if found is None:
            line_groups.append([c])
        else:
            found.append(c)
    paragraph = None
    last_bottom = 0
    for group in line_groups:
        y = min(c['top'] for c in group)
        value = clean(text(group))
        size = max(c['size'] for c in group)
        bold = all('Bold' in c['fontname'] for c in group)
        kind = 'heading' if size >= 13 or (bold and len(value) < 100) else 'paragraph'
        if paragraph is not None and kind == paragraph['type'] and y - last_bottom < 7:
            paragraph['text'] += ' ' + value
        else:
            paragraph = {'type': kind, 'text': value}
            nodes.append((y, paragraph))
        last_bottom = max(c['bottom'] for c in group)
    blocks = [n[1] for n in sorted(nodes, key=lambda n: n[0])]
    original = coverage(''.join(c['text'] for c in chars))
    imported = coverage(title + ''.join(block_text(b) for b in blocks))
    assert original == imported, (bonus_id, number, 'Character coverage mismatch', original - imported, imported - original)
    return {'id': f'{bonus_id}-{number:02}', 'title': title, 'sourcePage': number, 'blocks': blocks}


def build(source_dir):
    sources = sorted(source_dir.glob('*.pdf'))
    assert len(sources) == 3, 'Expected exactly the three bonus PDFs'
    result = {}
    for bonus_id, source in zip(TITLES, sources):
        with pdfplumber.open(source) as pdf:
            sections = [extract_section(page, n, bonus_id) for n, page in enumerate(pdf.pages, 1) if n > 1]
            result[bonus_id] = {'title': TITLES[bonus_id], 'sourcePages': len(pdf.pages),
                                'sourceSha256': sha256(source.read_bytes()).hexdigest(), 'sections': sections}
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-dir', type=Path, default=ROOT / 'Conteúdos')
    parser.add_argument('--verify', action='store_true')
    args = parser.parse_args()
    data = build(args.source_dir)
    rendered = '/* Native bonus content imported from the private sources. No PDF is published. */\nwindow.BONUS_CONTENT = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n'
    if args.verify:
        assert OUTPUT.read_text(encoding='utf8') == rendered, 'Published bonus data differs from the source import'
    else:
        OUTPUT.write_text(rendered, encoding='utf8', newline='\n')
    print(json.dumps({k: {'sections': len(v['sections']), 'tables': sum(b['type'] == 'table' for s in v['sections'] for b in s['blocks']),
                          'copyTexts': sum(b['type'] == 'copy' for s in v['sections'] for b in s['blocks'])} for k, v in data.items()}, ensure_ascii=False))


if __name__ == '__main__':
    main()
