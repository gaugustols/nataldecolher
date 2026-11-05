"""Loopback-only server preserving source paths with scoped SPA fallback."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlsplit
from common import SITE

class Handler(SimpleHTTPRequestHandler):
    def log_message(self,format,*args): pass
    def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(SITE),**kwargs)
    def end_headers(self):
        self.send_header('X-Recovery-Server','nataldecolher-recovery-v1')
        super().end_headers()
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/': self.path = '/sobremesas-de-travessa/'
        elif path.startswith('/sobremesas-de-travessa/') and not self.translate_path(self.path).endswith('/'):
            from pathlib import Path
            if not Path(self.translate_path(self.path)).exists() and '.' not in path.rsplit('/',1)[-1]: self.path='/sobremesas-de-travessa/index.html'
        super().do_GET()

class Server(ThreadingHTTPServer):
    request_queue_size=128
    daemon_threads=True

if __name__ == '__main__':
    print('Recovery server http://127.0.0.1:8765/sobremesas-de-travessa/',flush=True)
    Server(('127.0.0.1',8765),Handler).serve_forever()
