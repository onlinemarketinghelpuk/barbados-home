// Guides: one card per guide (cover, who it's for, file details, download) and the related links, from src/data/guides.json ({{gd-…}} placeholders)
export default (html, { read, esc }) => {
  if (!html.includes('{{gd-')) return html;
  const d = JSON.parse(read('src/data/guides.json'));
  const cards = d.guides.map((g, i) => `      <li class="gd" id="${g.id}" aria-labelledby="${g.id}-h">`
    + `<figure class="gd-cov"><img src="${esc(g.cover)}" alt="Cover of the ${esc(g.title)}" width="${g.w}" height="${g.h}" loading="lazy"></figure>`
    + `<div class="gd-b"><p class="gd-k"><span class="gd-n">0${i + 1}</span>${esc(g.for)}</p><h2 class="hull" id="${g.id}-h">${esc(g.title)}</h2><p class="gd-d">${esc(g.desc)}</p>`
    + `<dl class="gd-f"><div><dt>Format</dt><dd>${esc(g.type)} · ${esc(g.size)}</dd></div>${g.rev ? `<div><dt>Revision</dt><dd>Rev ${esc(g.rev)}</dd></div>` : ''}<div><dt>Published</dt><dd>${esc(g.year)}</dd></div></dl>`
    + `<div class="gd-a"><a class="btn btn-gold" href="${esc(g.file)}" download aria-label="Download the ${esc(g.title)} (${esc(g.type)}, ${esc(g.size)})">Download ${esc(g.type)} <svg class="ar"><use href="#dl"/></svg></a>`
    + (g.online ? `<a class="btn btn-line" href="${esc(g.online)}">Read online</a>` : '') + `</div></div></li>`).join('\n');
  const related = d.related.map(r => `          <li><a href="${esc(r.href)}"><b>${esc(r.title)}</b><span>${esc(r.text)}</span><svg class="ar" aria-hidden="true"><use href="#ar"/></svg></a></li>`).join('\n');
  return html.replace('{{gd-cards}}', cards).replace('{{gd-related}}', related).replaceAll('{{gd-intro}}', esc(d.intro)).replaceAll('{{gd-count}}', d.guides.length);
};
