// Local preview server (no dependencies): node .claude/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = +process.argv[2] || 5173;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.mp4': 'video/mp4' };

createServer(async (req, res) => {
  let p = normalize(join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!p.startsWith(root)) return res.writeHead(403).end();
  try {
    if ((await stat(p)).isDirectory()) p = join(p, 'index.html');
    const body = await readFile(p);
    res.writeHead(200, { 'Content-Type': types[extname(p).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, () => console.log(`http://localhost:${port}`));
