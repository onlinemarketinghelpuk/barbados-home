// Bareboat Charter page: fills the {{bb-…}} placeholders in src/bareboat-charter.html from src/data/bareboat-charter.json
export default function fillBareboat(html, { read, esc, fileType, revOf }) {
  if (!html.includes('{{bb-')) return html;
  const BB = JSON.parse(read('src/data/bareboat-charter.json'));
  const ck = BB.checklist;
  const dirs = BB.directions.map((d, i) => `        <li class="bbd" id="charter-${d.id}"><p class="tag t">0${i + 1} · ${esc(d.label)}</p><h3 class="hull">${esc(d.title)}</h3><p>${esc(d.body)}</p>`
    + `<ul class="pts">${d.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul></li>`).join('\n');
  const items = BB.agreement.items.map((it, i) => `          <li><span class="n">0${i + 1}</span><span class="t"><b>${esc(it.t)}</b>${it.d ? `<small>${esc(it.d)}</small>` : ''}</span></li>`).join('\n');
  const notes = BB.agreement.notes.map(n => `          <li><b>${esc(n.t)}</b><span>${esc(n.d)}</span></li>`).join('\n');
  const photo = i => `<img src="${esc(BB.photos[i].src)}" alt="${esc(BB.photos[i].alt)}" loading="lazy" width="1024" height="${i ? 748 : 768}">`;
  return html.replace('{{bb-directions}}', dirs).replace('{{bb-items}}', items).replace('{{bb-notes}}', notes)
    .replace('{{bb-photo-1}}', photo(0)).replace('{{bb-photo-2}}', photo(1))
    .replaceAll('{{bb-intro}}', esc(BB.intro)).replaceAll('{{bb-lead}}', esc(BB.agreement.lead))
    .replaceAll('{{bb-ck-file}}', esc(ck.file)).replaceAll('{{bb-ck-code}}', esc(ck.code)).replaceAll('{{bb-ck-title}}', esc(ck.title))
    .replaceAll('{{bb-ck-type}}', fileType(ck.file)).replaceAll('{{bb-ck-rev}}', revOf(ck.file) || '');
}
