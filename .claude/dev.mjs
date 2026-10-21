// Dev server (no dependencies): node .claude/dev.mjs [--port 5173] [--no-build]
// Serves the site, rebuilds the option pages when src/ or tools/ change, and reloads the browser.
// A failed build shows a red bar on the page; the last good pages stay up. Changes to assets/,
// review/ or the hand-written index.html just reload. The reload script is added to pages as they're
// sent, never written to the files, so the committed output is unchanged.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const port = args.includes('--port') ? +args[args.indexOf('--port') + 1] : 5173;
const autoBuild = !args.includes('--no-build');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };
const time = () => new Date().toLocaleTimeString('en-GB');

// ---------- browser side: reload on "reload", show/clear the error bar, keep the scroll position ----------
const CLIENT = `<script data-dev>(() => {
  const key = 'dev-scroll:' + location.pathname + location.search;
  try { const y = sessionStorage.getItem(key); if (y !== null) { sessionStorage.removeItem(key); history.scrollRestoration = 'manual'; addEventListener('load', () => scrollTo(0, +y)); } } catch {}
  let bar;
  const show = msg => {
    if (!msg) { bar && bar.remove(); bar = null; return; }
    if (!bar) { bar = document.createElement('pre'); bar.setAttribute('role', 'alert');
      bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;max-height:45vh;overflow:auto;margin:0;padding:14px 18px;background:#B3261E;color:#fff;font:13px/1.5 ui-monospace,Consolas,monospace;white-space:pre-wrap;box-shadow:0 -6px 24px rgba(0,0,0,.35)';
      document.body.append(bar); }
    bar.textContent = 'Build failed (the page shows the last good build)\\n\\n' + msg;
  };
  const es = new EventSource('/__dev/events');
  es.addEventListener('reload', () => { try { sessionStorage.setItem(key, scrollY); } catch {} location.reload(); });
  es.addEventListener('failed', e => show(JSON.parse(e.data)));
  es.addEventListener('ok', () => show(null));
})();</script>`;

// ---------- live connections ----------
const clients = new Set();
let lastError = null;
const send = (event, data = '') => { for (const res of clients) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`); };

// ---------- the build: runs tools/build-options.mjs as is; a change during a build queues one more ----------
let building = false, again = false;
function build(reason) {
  if (building) { again = true; return; }
  building = true; again = false;
  const t0 = Date.now(); let out = '', err = '';
  const p = spawn(process.execPath, ['tools/build-options.mjs'], { cwd: root });
  p.stdout.on('data', d => out += d); p.stderr.on('data', d => err += d);
  p.on('close', code => {
    building = false;
    const secs = ((Date.now() - t0) / 1000).toFixed(1);
    if (code === 0) {
      const pages = (out.match(/index\.html {2}\(/g) || []).length;
      console.log(`${time()}  ${reason} → rebuilt ${pages} pages in ${secs}s`);
      lastError = null; send('ok'); send('reload');
    } else {
      lastError = (err || out).trim().split(/\r?\n/).map(l => l.trimEnd()).filter(l => !/^\s+at .*node:internal/.test(l)).slice(0, 25).join('\n');
      console.log(`${time()}  ${reason} → BUILD FAILED (${secs}s)\n${lastError.replace(/^/gm, '    ')}`);
      send('failed', lastError);
    }
    if (again) build('more changes');
  });
}

// ---------- watching: src/ and tools/ rebuild; assets/, review/ and index.html just reload ----------
const ignore = f => !f || /(^|[\\/])(\.|~)|~$|\.(swp|tmp|crdownload)$|\.tmp\.[\w.]+$/i.test(f); // editors' temp files, e.g. news.css.tmp.123.abc
let timer, pending = new Set(), needsBuild = false;
const changed = (file, rebuild) => {
  pending.add(file); needsBuild ||= rebuild;
  clearTimeout(timer);
  timer = setTimeout(() => {
    const files = [...pending]; pending = new Set();
    const reason = files.length > 1 ? `${files[0]} +${files.length - 1}` : files[0];
    if (needsBuild && autoBuild) build(reason);
    else { console.log(`${time()}  ${reason} → reload`); send('reload'); }
    needsBuild = false;
  }, 200);
};
// Windows also reports a "change" when a file is only read (e.g. an image being served), so a change
// only counts when the file's modified time or size moved, or it was added or deleted since we started.
const started = Date.now(), seen = new Map();
const really = async rel => {
  const s = await stat(join(root, rel)).catch(() => null);
  const sig = s ? `${s.mtimeMs}:${s.size}` : 'gone', before = seen.get(rel);
  seen.set(rel, sig);
  if (s?.isDirectory()) return false;
  return before === undefined ? !s || s.mtimeMs >= started : before !== sig;
};
for (const [dir, rebuild] of [['src', true], ['tools', true], ['assets', false], ['review', false]])
  watch(join(root, dir), { recursive: true }, async (_, f) => { if (ignore(f)) return; const rel = `${dir}/${f.replace(/\\/g, '/')}`; if (await really(rel)) changed(rel, rebuild); });
watch(root, async (_, f) => { if (f === 'index.html' && await really('index.html')) changed('index.html', false); });

// ---------- serving ----------
createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path === '/__dev/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
    res.write(`retry: 1000\n\n`);
    if (lastError) res.write(`event: failed\ndata: ${JSON.stringify(lastError)}\n\n`);
    clients.add(res); req.on('close', () => clients.delete(res));
    return;
  }
  let p = normalize(join(root, path));
  if (!p.startsWith(root)) return res.writeHead(403).end();
  try {
    if ((await stat(p)).isDirectory()) {
      // /option-b has to become /option-b/, or the browser resolves the page's relative links one level too high
      const u = new URL(req.url, 'http://x');
      if (!u.pathname.endsWith('/')) return res.writeHead(301, { Location: u.pathname + '/' + u.search }).end();
      p = join(p, 'index.html');
    }
    const ext = extname(p).toLowerCase();
    let body = await readFile(p);
    if (ext === '.html') { const s = body.toString('utf8'); const i = s.lastIndexOf('</body>'); body = i < 0 ? s + CLIENT : s.slice(0, i) + CLIENT + s.slice(i); }
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(body);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found'); }
}).listen(port, () => {
  console.log(`Dev server: http://localhost:${port}  (${autoBuild ? 'rebuilds on changes to src/ and tools/' : 'reload only, no builds'}; Ctrl+C to stop)`);
  if (autoBuild) build('start');
});
