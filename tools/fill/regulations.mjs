// Regulations page: the Merchant Shipping Regulations, 2025 (live PDFs), from src/data/regulations.json. Fills {{reg-…}} placeholders only.
export default function fillRegulations(html, { read, esc, fileType }) {
  if (!html.includes('{{reg-')) return html;
  const RG = JSON.parse(read('src/data/regulations.json'));
  const topic = Object.fromEntries(RG.topics.map(t => [t.id, t.name]));
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const rows = RG.regulations.map(r => `          <li class="lx-row" id="si-${r.no}" data-topic="${r.topic}" data-s="${esc(norm(`${r.si} no ${r.no} ${r.title} ${topic[r.topic]}`))}">`
    + `<span class="lx-no"><small>S.I. ${esc(r.year)}</small><b>No. ${r.no}</b></span>`
    + `<span class="lx-tt">${esc(r.title)}<small>${esc(topic[r.topic])}</small></span>`
    + `<a class="lx-dl" href="${esc(r.file)}" target="_blank" rel="noopener" aria-label="Open ${esc(r.si)} ${esc(r.title)} (${fileType(r.file)}, opens in a new tab)"><svg aria-hidden="true"><use href="#dl"/></svg>${fileType(r.file)}</a></li>`).join('\n');
  const n = id => RG.regulations.filter(r => r.topic === id).length;
  const chips = [`          <button type="button" data-topic="all" aria-pressed="true">All <i>${RG.regulations.length}</i></button>`]
    .concat(RG.topics.map(t => `          <button type="button" data-topic="${t.id}" aria-pressed="false">${esc(t.name)} <i>${n(t.id)}</i></button>`)).join('\n');
  const nos = RG.regulations.map(r => r.no);
  return html.replace('{{reg-rows}}', rows).replace('{{reg-chips}}', chips).replace('{{reg-intro}}', esc(RG.intro))
    .replaceAll('{{reg-count}}', RG.regulations.length).replaceAll('{{reg-topics}}', RG.topics.length)
    .replaceAll('{{reg-first}}', Math.min(...nos)).replaceAll('{{reg-last}}', Math.max(...nos))
    .replaceAll('{{reg-support-label}}', esc(RG.support.label)).replaceAll('{{reg-support-email}}', esc(RG.support.email)).replaceAll('{{reg-sub}}', esc(RG.subscription.live));
}
