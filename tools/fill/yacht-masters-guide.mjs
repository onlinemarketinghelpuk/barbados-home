// Yacht Master's Guide: the reader's details and the guide's own contents (links to pages), from src/data/yacht-masters-guide.json ({{ymg-…}} placeholders)
export default (html, { read, esc }) => {
  if (!html.includes('{{ymg-')) return html;
  const d = JSON.parse(read('src/data/yacht-masters-guide.json'));
  const contents = d.contents.map(c => `          <li><a href="#reader" data-page="${c.page}"><span class="ymg-n">${String(c.n).padStart(2, '0')}</span><span class="ymg-t">${esc(c.title)}</span><span class="ymg-p">p. ${c.page}</span></a></li>`).join('\n');
  const vals = { pdf: d.pdf, file: d.file, size: d.size, type: d.type, pages: d.pages, published: d.published, desc: d.desc, foreword: d.foreword, note: d.note.text, for: d.for,
    cover: d.cover, 'cover-w': d.w, 'cover-h': d.h, count: d.contents.length };
  let out = html.replace('{{ymg-contents}}', contents);
  for (const [k, v] of Object.entries(vals)) out = out.replaceAll(`{{ymg-${k}}}`, esc(String(v)));
  return out;
};
