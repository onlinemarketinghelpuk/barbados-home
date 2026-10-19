// Inspection Templates: the two download cards, rendered from src/data/inspection-templates.json ({{it-…}} placeholders)
export default (html, { read, esc, revOf }) => {
  if (!html.includes('{{it-')) return html;
  const d = JSON.parse(read('src/data/inspection-templates.json'));
  const cards = d.templates.map((t, i) => {
    const code = t.code || 'Pack';
    const rev = revOf(t.file);
    const pack = t.contains ? `<div class="tp-in"><p class="tp-k">In the pack</p><ul>${t.contains.map(c => `<li><span class="tp-c">${esc(c.code)}</span><span>${esc(c.title)}</span><span class="tp-t">${esc(c.type)} · Rev ${esc(c.rev)}</span></li>`).join('')}</ul></div>` : '';
    return `      <li class="tp" id="${t.id}"><span class="tp-n" aria-hidden="true">0${i + 1}</span><div class="tp-b">`
      + `<p class="tp-k">${esc(code)}${rev ? ` · Rev ${rev}` : ''}</p><h2 class="hull">${esc(t.title)}</h2>${pack}`
      + `<a class="btn btn-gold" href="${esc(t.file)}" download aria-label="${esc(t.cta)} (${t.type}, ${t.size})">Download template <svg class="ar"><use href="#dl"/></svg></a>`
      + `<p class="tp-f">${esc(t.type)} · ${esc(t.size)}</p></div></li>`;
  }).join('\n');
  return html.replace('{{it-cards}}', cards).replaceAll('{{it-intro}}', esc(d.intro)).replaceAll('{{it-count}}', d.templates.length);
};
