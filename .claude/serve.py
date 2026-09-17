"""Servidor local que imita a Vercel: aplica los rewrites de vercel.json y sirve 404.html.

Uso: python3 .claude/serve.py  (o desde el panel de navegador con la config "landing").
"""
import http.server, json, os, socketserver, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(ROOT, "vercel.json")) as fh:
    REWRITES = {r["source"]: r["destination"] for r in json.load(fh)["rewrites"]}

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def translate_path(self, path):
        clean = urllib.parse.urlparse(path).path.rstrip("/") or "/"
        return super().translate_path(REWRITES.get(clean, path))

    def send_error(self, code, message=None, explain=None):
        page = os.path.join(ROOT, "404.html")
        if code == 404 and os.path.exists(page):
            body = open(page, "rb").read()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def log_message(self, *a):  # silencio: el panel ya muestra las peticiones
        pass

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", 8900), Handler) as httpd:
    httpd.serve_forever()
