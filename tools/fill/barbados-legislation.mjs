// Barbados Legislation page: the Acts and the Regulations (live PDFs), from src/data/barbados-legislation.json. Fills {{lg-…}} placeholders only.
export default function fillLegislation(html, { read, esc, fileType }) {
  if (!html.includes('{{lg-')) return html;
  const LG = JSON.parse(read('src/data/barbados-legislation.json'));
  const topic = Object.fromEntries(LG.topics.map(t => [t.id, t.name]));
  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const row = ({ no, title, sub, topic: tp, file, label }) => `          <li class="lgr" data-topic="${tp}" data-s="${esc(norm(`${no} ${title} ${sub}`))}"><span class="no">${esc(no)}</span>`
    + `<span class="tt">${esc(title)}<small>${esc(sub)}</small></span>`
    + `<a class="dl" href="${esc(file)}" target="_blank" rel="noopener" aria-label="Open ${esc(label)} (${fileType(file)}, opens in a new tab)"><svg aria-hidden="true"><use href="#dl"/></svg>${fileType(file)}</a></li>`;
  const acts = LG.acts.map(a => row({ no: a.no ? `Act ${a.no}` : `Act, ${a.year}`, title: a.title, sub: `Act · ${a.year}`, topic: 'act', file: a.file, label: `${a.title}, ${a.no || a.year}` })).join('\n');
  const regs = LG.regulations.map(r => row({ no: r.si, title: r.title, sub: topic[r.topic], topic: r.topic, file: r.file, label: `${r.si} ${r.title}` })).join('\n');
  const section = (id, name, d, n, rows) => `      <section class="lgs" id="${id}" aria-labelledby="${id}-h">\n        <h2 class="hull" id="${id}-h">${name} <i>${n}</i></h2><p class="gd">${d}</p>\n        <ul class="lg-list">\n${rows}\n        </ul>\n      </section>`;
  const sections = section('acts', 'Acts', 'The Merchant Shipping Acts, 2024.', LG.acts.length, acts) + '\n'
    + section('regulations', 'Regulations', 'The Merchant Shipping Regulations, 2025 (Statutory Instruments), in number order.', LG.regulations.length, regs);
  const n = id => LG.regulations.filter(r => r.topic === id).length;
  const chips = [`          <button type="button" data-topic="all" aria-pressed="true">All <i>${LG.acts.length + LG.regulations.length}</i></button>`,
    `          <button type="button" data-topic="act" aria-pressed="false">Acts <i>${LG.acts.length}</i></button>`]
    .concat(LG.topics.map(t => `          <button type="button" data-topic="${t.id}" aria-pressed="false">${esc(t.name)} <i>${n(t.id)}</i></button>`)).join('\n');
  // the overview: the Acts listed by title, the Regulations by subject; each card links to its own page
  const subj = LG.topics.filter(t => t.id !== 'act').map(t => [t.name, LG.regulations.filter(r => r.topic === t.id).length]).filter(([, c]) => c);
  const overview = `      <div class="lg-cards">
      <article class="lg-card" aria-labelledby="ov-acts"><p class="tag t">Acts · ${LG.acts.length}</p><h2 class="hull" id="ov-acts"><a href="https://barbadosmaritime.com/documents/acts/">The Merchant Shipping <span>Acts, 2024</span></a></h2><p>The five Acts, each with its PDF.</p>
        <ul class="lg-list">${LG.acts.map(x => `<li><span class="no">${esc(x.no ? 'Act ' + x.no : 'Act, ' + x.year)}</span><span>${esc(x.title)}</span></li>`).join('')}</ul>
        <a class="btn btn-gold" href="https://barbadosmaritime.com/documents/acts/">All ${LG.acts.length} Acts <svg class="ar"><use href="#ar"/></svg></a></article>
      <article class="lg-card" aria-labelledby="ov-regs"><p class="tag t">Regulations · ${LG.regulations.length}</p><h2 class="hull" id="ov-regs"><a href="https://barbadosmaritime.com/documents/regulations/">Merchant Shipping <span>Regulations, 2025</span></a></h2><p>S.I. 2025 Nos. ${LG.regulations[0].si.replace(/\D+/g, ' ').trim().split(' ').pop()}–${LG.regulations[LG.regulations.length - 1].si.replace(/\D+/g, ' ').trim().split(' ').pop()}, searchable by title, number and subject.</p>
        <ul class="lg-list">${subj.map(([n, c]) => `<li><span>${esc(n)}</span><span class="c">${c}</span></li>`).join('')}</ul>
        <a class="btn btn-gold" href="https://barbadosmaritime.com/documents/regulations/">All ${LG.regulations.length} Regulations <svg class="ar"><use href="#ar"/></svg></a></article>
      </div>`;
  return html.replace('{{lg-overview}}', overview).replace('{{lg-sections}}', sections).replace('{{lg-chips}}', chips).replace('{{lg-intro}}', esc(LG.intro))
    .replaceAll('{{lg-acts}}', LG.acts.length).replaceAll('{{lg-regs}}', LG.regulations.length).replaceAll('{{lg-total}}', LG.acts.length + LG.regulations.length)
    .replaceAll('{{lg-support-label}}', esc(LG.support.label)).replaceAll('{{lg-support-email}}', esc(LG.support.email)).replaceAll('{{lg-sub}}', esc(LG.subscription.live));
}
