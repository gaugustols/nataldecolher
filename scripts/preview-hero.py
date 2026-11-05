"""Serve the public directory locally without exposing it to the network."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

PUBLIC = Path(__file__).resolve().parent.parent / 'public'
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(PUBLIC),**kwargs)
    def log_message(self,*args):pass
    def do_GET(self):
        path=urlsplit(self.path).path
        if path.startswith('/sobremesas-de-travessa/') and '.' not in path.rsplit('/',1)[-1] and not Path(self.translate_path(self.path)).exists():self.path='/sobremesas-de-travessa/index.html'
        super().do_GET()
class Server(ThreadingHTTPServer):
    request_queue_size=128
    daemon_threads=True
if __name__=='__main__':
    print('Hero10 preview: http://127.0.0.1:8766/sobremesas-de-travessa/',flush=True)
    Server(('127.0.0.1',8766),Handler).serve_forever()
