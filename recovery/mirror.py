"""Download public same-origin assets recursively; never submit forms."""
import json
from collections import deque
from urllib.parse import urlsplit
import requests
from common import ROOT, SOURCE, HOST, references, local_path

def main():
    queue = deque([SOURCE])
    capture = ROOT / 'capture_live' / 'network.json'
    if capture.exists():
        queue.extend(item['url'] for item in json.loads(capture.read_text(encoding='utf-8')) if item.get('method') == 'GET' and item.get('type') not in ('xhr', 'fetch', 'ping'))
    visited = set(); manifest = []; external = set()
    session = requests.Session()
    while queue:
        url = queue.popleft()
        if url in visited: continue
        visited.add(url)
        if urlsplit(url).netloc != HOST:
            external.add(url); continue
        path = local_path(url)
        entry = {'url': url, 'path': str(path.relative_to(ROOT))}
        try:
            if path.exists():
                data = path.read_bytes(); entry['status'] = 'cached'
            else:
                response = session.get(url, timeout=45)
                entry['http'] = response.status_code
                response.raise_for_status()
                if urlsplit(response.url).netloc != HOST: raise ValueError('Redirect outside original host')
                data = response.content
                if path.suffix.lower() not in ('.html', '.htm') and 'text/html' in response.headers.get('Content-Type', ''): raise ValueError('HTML returned for asset')
                path.parent.mkdir(parents=True, exist_ok=True); path.write_bytes(data)
                entry['status'] = 'downloaded'
            entry['bytes'] = len(data)
            if path.suffix.lower() in ('.html', '.htm', '.js', '.mjs', '.css', '.json', '.svg'):
                queue.extend(sorted(references(data.decode('utf-8', 'replace'), url)))
            print(entry['status'], entry['path'], len(data), flush=True)
        except Exception as exc:
            entry['status'] = 'error'; entry['error'] = str(exc); print('ERROR', url, str(exc), flush=True)
        manifest.append(entry)
        (ROOT / 'mirror-manifest.json').write_text(json.dumps({'files': manifest, 'external': sorted(external)}, ensure_ascii=False, indent=2), encoding='utf-8')
    print('TOTAL',len(manifest),'ERRORS',sum(x['status']=='error' for x in manifest), 'EXTERNAL',len(external), flush=True)

if __name__ == '__main__': main()
