"""Independent pass over all downloaded text assets to find missing references."""
import json
from urllib.parse import urlsplit
from common import ROOT, SITE, HOST, references, local_path

def main():
    required = {}; external = set()
    for path in SITE.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in ('.html','.js','.mjs','.css','.json','.svg'): continue
        url = 'https://' + HOST + '/' + path.relative_to(SITE).as_posix()
        for ref in references(path.read_text(encoding='utf-8', errors='replace'), url):
            if urlsplit(ref).netloc == HOST: required.setdefault(ref, []).append(path.relative_to(SITE).as_posix())
            else: external.add(ref)
    manifest=json.loads((ROOT/'mirror-manifest.json').read_text(encoding='utf-8'))
    known_404={x['url'] for x in manifest['files'] if x.get('http')==404}
    excluded=[]
    for url in list(required):
        if '/public/assets/originais/fotos-vitrine/' in url and url in known_404:
            excluded.append({'url':url,'reason':'Unused original PNG metadata in He; renderer uses name/fit/position and generated WebP URLs. HTTP 404 confirmed on source.','referenced_by':required.pop(url)})
    missing = [{'url':url,'referenced_by':origins} for url,origins in required.items() if not local_path(url).exists()]
    result = {'referenced':len(required),'present':len(required)-len(missing),'missing':missing,'excluded_metadata':excluded,'external':sorted(external),'generated_local':['sobremesas-de-travessa/favicon.svg']}
    (ROOT/'audit-report.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False,indent=2))
    return bool(missing)

if __name__ == '__main__': raise SystemExit(main())
