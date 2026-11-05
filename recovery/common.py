import posixpath
import re
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote

ROOT = Path(__file__).resolve().parent
SITE = ROOT / 'site'
SOURCE = 'https://aprendizadoilimitado.site/sobremesas-de-travessa/'
HOST = urlsplit(SOURCE).netloc
EXT = r'(?:js|mjs|css|woff2?|ttf|otf|png|jpe?g|webp|avif|svg|gif|json|mp4|webm|ico|pdf|mp3)'
QUOTED = re.compile(r'''["'`]([^"'`\s<>]+?\.'''+EXT+r'''(?:\?[^"'`\s<>]*)?)["'`]''', re.I)
CSS_URL = re.compile(r'url\(\s*[\"\x27]?([^\s\)\"\x27]+)', re.I)

def references(text, base):
    refs = [*QUOTED.findall(text), *CSS_URL.findall(text)]
    # This recovered React bundle generates lightbox image URLs at runtime.
    if urlsplit(base).path.endswith('.js') and 'widths:[1063]' in text:
        # Only the final active previews table feeds the lightbox. The bundle
        # also retains an unused older table and cover-fan page metadata.
        table = text.rsplit('previews:[', 1)[-1].split(']},He=', 1)[0]
        pages = set(re.findall(r'page:\s*(\d+)', table))
        refs.extend('/sobremesas-de-travessa/assets/pagina-'+page+'-1063.webp' for page in pages)
    if base.endswith('.html') or urlsplit(base).path.endswith('/'):
        from html.parser import HTMLParser
        class Links(HTMLParser):
            def handle_starttag(self, tag, attrs):
                for key, value in attrs:
                    if not value: continue
                    if key in ('src', 'href', 'poster') and re.search(r'\.'+EXT+r'(?:[?#]|$)', value, re.I): refs.append(value)
                    if key == 'srcset': refs.extend(part.strip().split()[0] for part in value.split(',') if part.strip())
        Links().feed(text)
    result = set()
    for ref in refs:
        ref = ref.replace('&amp;', '&').replace('\\/', '/')
        if ref.startswith(('data:', 'blob:', '#')) or any(c in ref for c in ('${', '{', '}')): continue
        # Vite stores dynamic chunk names relative to its own assets directory.
        if ref.startswith('assets/') and '/assets/' in urlsplit(base).path:
            target = urljoin(SOURCE, ref)
        elif ref.startswith('img/') and base.endswith(('.js', '.mjs')):
            target = urljoin(SOURCE, ref)
        else: target = urljoin(base, ref)
        if urlsplit(target).scheme in ('http', 'https'): result.add(target.split('#')[0])
    return result

def local_path(url):
    parsed = urlsplit(url)
    path = unquote(parsed.path)
    if not path or path.endswith('/'): path += 'index.html'
    relative = posixpath.normpath(path).lstrip('/')
    target = (SITE / relative).resolve()
    if not target.is_relative_to(SITE.resolve()): raise ValueError('Unsafe asset path')
    return target
