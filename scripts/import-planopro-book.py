"""Import the supplied, five-page-per-recipe book without inventing recipe content."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
import json
from pathlib import Path
import re
import shutil
import subprocess
import unicodedata

import pdfplumber
from PIL import Image
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / 'public/planopro'
CACHE = ROOT / '.cache/book-import'
ASSETS = APP / 'assets'
IDS = [
    'pave-chocolate', 'bombom-uva', 'mousse-maracuja', 'torta-limao',
    'manjar-coco', 'pave-pessego', 'delicia-abacaxi', 'creme-coco',
    'pave-doce-leite-ameixa', 'pudim-leite', 'mousse-chocolate', 'gelatina-mosaico',
    'arroz-doce', 'banana-caramelada', 'cocada-forno', 'abobora-coco',
    'sagu-uva', 'pave-pacoca', 'romeu-julieta', 'tapioca-manga',
    'maca-canela', 'pave-cafe', 'pave-panetone', 'pave-nozes',
    'cheesecake', 'banoffee', 'brownie-cafe', 'merengue',
    'baunilha-damasco', 'torta-holandesa',
]


def clean(text):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', text)).strip()


def without_footer(text, name, physical_page):
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    assert lines[-1] == f'{physical_page - 1} / 157', (physical_page, lines[-1])
    assert clean(lines[-2]) == clean(name), (physical_page, lines[-2], name)
    return '\n'.join(lines[:-2])


def between(text, start, end):
    return text.split(start, 1)[1].split(end, 1)[0].strip()


def care_rows(page):
    words = page.extract_words()
    top = next(w['top'] for w in words if w['text'] == 'acontecer...')
    bottom = next(w['top'] for w in words if w['text'] == 'Tempos')
    borders = sorted({round(e['top'], 2) for e in page.edges
                      if abs(e['top'] - e['bottom']) < 0.5
                      and abs(e['x0'] - 29) < 0.5
                      and e['x1'] > 450 and top < e['top'] < bottom})
    assert len(borders) == 4, borders
    rows = []
    for a, b in zip(borders, borders[1:]):
        issue = clean(page.crop((29, a, 175, b)).extract_text() or '')
        fix = clean(page.crop((175, a, 453, b)).extract_text() or '')
        assert issue and fix, (issue, fix)
        rows.append([issue, fix])
    return rows


def numbered_guide(text, footer, page_number, section_id, label):
    body = without_footer(text, footer, page_number)
    markers = list(re.finditer(r'(?m)^(\d+)\n', body))
    prefix = body[:markers[0].start()].splitlines()
    section = {'id': section_id, 'label': label, 'title': clean(' '.join(prefix[2:-1])),
               'intro': clean(prefix[-1]), 'steps': []}
    for i, marker in enumerate(markers):
        chunk = body[marker.end():markers[i + 1].start() if i + 1 < len(markers) else len(body)].strip()
        if '\nUm exemplo de cinco sabores:' in chunk:
            chunk, note = chunk.split('\nUm exemplo de cinco sabores:', 1)
            section['note'] = 'Um exemplo de cinco sabores: ' + clean(note)
        title, paragraph = clean(chunk).split('. ', 1)
        section['steps'].append([title + '.', paragraph])
    return section


def build_guide(texts, source):
    sections = [
        numbered_guide(texts[1], 'Como usar', 2, 'cardapio', 'Cardápio'),
        numbered_guide(texts[3], 'Antes de produzir', 4, 'ingredientes', 'Ingredientes'),
        numbered_guide(texts[4], 'Fluxo de produção', 5, 'resfriamento', 'Resfriamento'),
    ]
    with pdfplumber.open(source) as pdf:
        page = pdf.pages[155]
        words = page.extract_words()
        top = next(w['top'] for w in words if w['text'] == 'Família')
        bottom = next(w['top'] for w in words if w['text'] == 'Ao')
        borders = sorted({round(e['top'], 2) for e in page.edges
                          if abs(e['top'] - e['bottom']) < .5 and abs(e['x0'] - 29) < .5
                          and e['x1'] > 450 and top < e['top'] < bottom})
        assert len(borders) == 7
        rows = [[clean(page.crop((29, a, 175, b)).extract_text()),
                 clean(page.crop((175, a, 453, b)).extract_text())]
                for a, b in zip(borders, borders[1:])]
    production = without_footer(texts[155], 'Consulta de produção', 156)
    sections.append({'id': 'producao', 'label': 'Produção', 'title': 'Organize as etapas',
                     'intro': clean(between(production, 'Organize as etapas', 'Família de trabalho')),
                     'rows': rows, 'note': 'Ao aumentar a produção: ' + clean(production.split('Ao aumentar a produção:', 1)[1])})
    sections.append(numbered_guide(texts[156], 'Consulta de expedição', 157, 'entrega', 'Entrega'))
    general = without_footer(texts[157], 'Informações gerais', 158)
    references_text = between(general, 'Fontes culinárias por número de receita', 'Base técnica:')
    markers = list(re.finditer(r'(?m)^(\d{2}) · ', references_text))
    references = [[int(m[1]), clean(references_text[m.end():markers[i + 1].start() if i + 1 < len(markers) else len(references_text)])]
                  for i, m in enumerate(markers)]
    assert [r[0] for r in references] == list(range(1, 31))
    sections.append({'id': 'notas', 'label': 'Notas', 'title': 'Notas e referências',
                     'text': clean(between(general, 'Referências de pesquisa e informações gerais desta edição.', 'Fontes culinárias por número de receita')),
                     'references': references, 'note': 'Base técnica: ' + clean(general.split('Base técnica:', 1)[1])})
    return sections


def render_diagram(job):
    number, physical_page, source, poppler = job
    destination = ASSETS / f'montagem-receita-{number:02}.webp'
    prefix = CACHE / f'montagem-{number:02}'
    subprocess.run([poppler, '-f', str(physical_page), '-l', str(physical_page),
                    '-singlefile', '-scale-to', '1500', '-png', str(source), str(prefix)],
                   check=True, capture_output=True)
    with Image.open(prefix.with_suffix('.png')) as image:
        image.convert('RGB').save(destination, 'WEBP', quality=88, method=6)
    return destination.name


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path)
    parser.add_argument('--poppler', default=shutil.which('pdftoppm'))
    parser.add_argument('--verify', action='store_true', help='Compare the imported content with the source without rewriting files.')
    args = parser.parse_args()
    source = args.source or next(p for p in (ROOT / 'conteúdo').glob('*.pdf') if '[Principal]' in p.name)
    assert args.poppler, 'pdftoppm is required to preserve the original assembly diagrams.'
    CACHE.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(source)
    assert len(reader.pages) == 158
    texts = [page.extract_text() or '' for page in reader.pages]
    names = {int(n): clean(name) for n, name in
             re.findall(r'(?m)^(\d{2})  (.+)$', texts[2])}
    assert set(names) == set(range(1, 31)), names
    old = subprocess.run(['node', '-e',
        'const fs=require("fs"),vm=require("vm");const c={window:{}};'
        'vm.runInNewContext(fs.readFileSync(process.argv[1],"utf8"),c);'
        'process.stdout.write(JSON.stringify(c.window.PRODUCT));', str(APP / 'data.js')],
        check=True, capture_output=True, encoding='utf-8')
    product = json.loads(old.stdout)
    recipes, details, report = [], {}, []
    with pdfplumber.open(source) as layout:
        for number, recipe_id in enumerate(IDS, 1):
            physical = 6 + (number - 1) * 5
            name = names[number]
            opening, ingredients, preparation, assembly, care = [
                without_footer(texts[i - 1], name, i) for i in range(physical, physical + 5)]
            category = 'classicos' if number <= 12 else 'economicas' if number <= 22 else 'especiais'
            title_description = clean('\n'.join(opening.splitlines()[2:]).split('Prepare por etapas', 1)[0])
            assert title_description.startswith(name), (number, title_description, name)
            description = title_description[len(name):].strip()
            yield_text = clean(opening.split('RENDIMENTO APROXIMADO', 1)[1])
            amount, portions = [x.strip() for x in yield_text.split('·', 1)]
            headers = between(ingredients, 'Pese os ingredientes de cada preparo separadamente.', '\nParte\n')
            groups = {m[0]: {'name': f'{m[0]} · {clean(m[1])}', 'items': []}
                      for m in re.findall(r'([A-Z]) · ([^|\n]+)', headers)}
            table = between(ingredients, '\nQuantidade\n', '\nUtensílios:')
            source_rows = []
            for row in re.split(r'\n(?=[A-Z]\n)', table):
                cells = row.splitlines()
                group, item, quantity = cells[0], clean(' '.join(cells[1:-1])), clean(cells[-1])
                assert group in groups and item and re.fullmatch(r'\d+(?:[.,]\d+)? (?:g|mL)', quantity), (number, cells)
                groups[group]['items'].append([item, quantity])
                source_rows.append(f'{group} {item} {quantity}')
            assert clean(' '.join(source_rows)) == clean(table), ('Ingredient text mismatch', number)
            assert all(g['items'] for g in groups.values())
            tool_text = ingredients.split('Utensílios:', 1)[1]
            tool_parts = re.split(r'\n(?=Separe )', tool_text, maxsplit=1)
            tools = clean(tool_parts[0])
            ingredient_notes = clean(tool_parts[1]) if len(tool_parts) > 1 else ''
            prep_body = between(preparation, 'Faça uma etapa por vez. Observe textura, cor e temperatura.', 'COMO RECONHECER O PONTO:')
            numbered = list(re.finditer(r'(?m)^(\d+)\n', prep_body))
            assert [int(m[1]) for m in numbered] == list(range(1, len(numbered) + 1))
            steps = []
            for i, marker in enumerate(numbered):
                chunk = prep_body[marker.end():numbered[i + 1].start() if i + 1 < len(numbered) else len(prep_body)].strip()
                title, body = clean(chunk).split('. ', 1)
                steps.append([title + '.', body])
            assert len(steps) >= 3
            assert clean(' '.join(f'{title} {body}' for title, body in steps)) == clean(re.sub(r'(?m)^\d+\n', '', prep_body)), ('Preparation text mismatch', number)
            point = clean(preparation.split('COMO RECONHECER O PONTO:', 1)[1])
            assembly_body = between(assembly, 'Siga a sequência dos desenhos e as quantidades indicadas.', 'FECHAMENTO:')
            numbered_assembly = list(re.finditer(r'(?m)^(\d+) · (.+)\n', assembly_body))
            assert [int(m[1]) for m in numbered_assembly] == [1, 2, 3]
            assembly_steps = []
            for i, marker in enumerate(numbered_assembly):
                body = assembly_body[marker.end():numbered_assembly[i + 1].start() if i < 2 else len(assembly_body)]
                assembly_steps.append([clean(marker[2]), clean(body)])
            intro = 'Siga a sequência dos desenhos e as quantidades indicadas.'
            extra_intro = clean(assembly_body[:numbered_assembly[0].start()])
            if extra_intro:
                intro += ' ' + extra_intro
            closing = clean(assembly.split('FECHAMENTO:', 1)[1])
            timing = between(care, 'Tempos aproximados', 'Conservação e transporte')
            prep_time = clean(between(timing, 'Preparo:', 'Montagem:'))
            assembly_time = clean(between(timing, 'Montagem:', 'Refrigeração:'))
            chill = clean(timing.split('Refrigeração:', 1)[1])
            photo = f'foto-receita-{number:02}-640.webp'
            if not (ASSETS / photo).exists():
                assert not args.verify, ('Missing photo', photo)
                images = list(reader.pages[physical - 1].images)
                assert images, number
                image = max(images, key=lambda im: im.image.width * im.image.height).image.convert('RGB')
                image.thumbnail((640, 640))
                image.save(ASSETS / photo, 'WEBP', quality=86, method=6)
            recipes.append({'id': recipe_id, 'number': number, 'name': name,
                            'category': category, 'photo': photo, 'description': description,
                            'pdfPage': physical, 'featured': number in (2, 25)})
            details[recipe_id] = {
                'yield': amount, 'portions': portions,
                'time': f'Preparo: {prep_time} Montagem: {assembly_time}', 'chill': chill,
                'tools': tools, 'ingredientNotes': ingredient_notes,
                'groups': list(groups.values()), 'steps': steps, 'point': point,
                'assemblyIntro': intro, 'assembly': assembly_steps, 'closing': closing,
                'diagram': f'montagem-receita-{number:02}.webp',
                'issues': care_rows(layout.pages[physical + 3]),
                'care': clean(between(care, 'Conservação e transporte', 'Alergênicos e substituições')),
                'allergens': clean(care.split('Alergênicos e substituições', 1)[1]),
                'pdfPages': list(range(physical, physical + 5)),
            }
            report.append({'number': number, 'id': recipe_id, 'name': name, 'pdfPages': details[recipe_id]['pdfPages'],
                           'ingredients': sum(len(g['items']) for g in groups.values()), 'steps': len(steps)})
    guide = build_guide(texts, source)
    if args.verify:
        assert product['recipes'] == recipes, 'Catalog differs from the supplied PDF.'
        assert product['details'] == details, 'Recipe contents differ from the supplied PDF.'
        assert all((ASSETS / s['diagram']).is_file() for s in details.values())
        assert product['guide'] == guide, 'Production guide differs from the supplied material.'
        assert sha256(source.read_bytes()).hexdigest() == product['book']['sha256']
        assert 'url' not in product['book']
        print('PASS: 30 recipes and 6 production guide sections match the source; no PDF download is published.')
        return
    jobs = [(n, 9 + (n - 1) * 5, source, args.poppler) for n in range(1, 31)]
    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(render_diagram, jobs))
    digest = sha256(source.read_bytes()).hexdigest()
    product['recipes'], product['details'] = recipes, details
    product.pop('samples', None)
    product['missing'] = 'Este conteúdo ainda não está disponível na biblioteca.'
    product['book'] = {
        'pages': 158, 'sha256': digest,
        'notes': clean(between(texts[157], 'Referências de pesquisa e informações gerais desta edição.', 'Fontes culinárias por número de receita')),
    }
    product['guide'] = guide
    product.pop('materials', None)
    for bonus in product['bonuses']:
        bonus.pop('materials', None)
    header = '/* Conteúdo integral importado do PDF fornecido. Regenerar com scripts/import-planopro-book.py. */\n'
    (APP / 'data.js').write_text(header + 'window.PRODUCT = ' + json.dumps(product, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    (CACHE / 'report.json').write_text(json.dumps({'sourceSha256': digest, 'pages': 158, 'recipes': report}, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'recipes': len(recipes), 'completeDetails': len(details), 'ingredients': sum(r['ingredients'] for r in report),
                      'steps': sum(r['steps'] for r in report), 'diagrams': 30, 'guideSections': len(guide)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
