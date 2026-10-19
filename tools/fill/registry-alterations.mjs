// Registry Alterations: the four changes as cards, then one section each; from src/data/registry-alterations.json
// Placeholders: {{ra-intro}} {{ra-count}} {{ra-cards}} {{ra-sections}} {{ra-nav}}
// the live sub-page of each section; the build points these at their own review pages
const PAGE = {"change-of-ownership":"https://barbadosmaritime.com/registration/registry-alterations/change-of-ownership/","change-of-vessels-name":"https://barbadosmaritime.com/registration/registry-alterations/change-of-vessels-name/","change-of-owners-name":"https://barbadosmaritime.com/registration/registry-alterations/change-of-owners-name-and-or-address/","deletion":"https://barbadosmaritime.com/registration/registry-alterations/deletion/"};
export default function fillRegistryAlterations(html, { read, esc, fileType, revOf }) {
  if (!html.includes('{{ra-')) return html;
  const RA = JSON.parse(read('src/data/registry-alterations.json'));
  const n = i => String(i + 1).padStart(2, '0');
  const cards = RA.sections.map((s, i) => `        <li><a class="ra-card" href="${esc(PAGE[s.id] || "#" + s.id)}"><figure><img src="${esc(s.img)}" alt="" loading="lazy"></figure>`
    + `<span class="b"><span class="n">${n(i)}</span><b class="hull">${esc(s.title)}</b><span class="s">${esc(s.summary)}</span>`
    + `<span class="go">What's needed <svg class="ar"><use href="#ar"/></svg></span></span></a></li>`).join('\n');
  const sections = RA.sections.map((s, i) => {
    // each change has its own page now: the overview keeps the first paragraph and what you'll receive, then links on
    const body = `<p>${esc(s.body[0])}</p>`;
    const needs = s.needs ? `<p class="ni">${esc(s.needs.intro)}</p><ol class="needs">${s.needs.items.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '';
    const note = s.note ? `<p class="warn" role="note"><b>Please note</b>${esc(s.note)}</p>` : '';
    const files = (s.files || []).map(f => `<a class="dl" href="${esc(f.file)}" download aria-label="Download ${esc(f.code)} ${esc(f.title)} (${fileType(f.file)})"><svg aria-hidden="true"><use href="#dl"/></svg><span>${esc(f.code)} ${esc(f.title)}<small>${fileType(f.file)}${revOf(f.file) ? ' · Rev ' + revOf(f.file) : ''}</small></span></a>`).join('');
    const links = (s.links || []).map(l => `<a class="btn btn-line" href="${esc(l.href)}"${l.ext ? ' target="_blank" rel="noopener"' : ''}>${esc(l.label)}${l.ext ? '<span class="sr"> (opens in a new tab)</span>' : ''} <svg class="ar"><use href="#ar"/></svg></a>`).join('');
    const outcome = s.outcome ? `<p class="out"><span class="tag">You'll receive</span>${esc(s.outcome)}</p>` : '';
    const more = `<a class="btn btn-gold" href="${esc(PAGE[s.id])}" aria-label="${esc(s.title)}: what you'll need">What you'll need <svg class="ar"><use href="#ar"/></svg></a>`;
    const acts = `\n          <div class="acts">${outcome}${more}</div>`;
    return `      <section class="ras" id="${s.id}" aria-labelledby="${s.id}-h">
        <div class="ras-h"><span class="num">${n(i)}</span><div><p class="tag t">${esc(s.title)}</p><h2 class="hull" id="${s.id}-h">${esc(s.heading)}</h2></div></div>
        <div class="ras-b">${body}${acts}
        </div>
      </section>`;
  }).join('\n');
  const nav = RA.sections.map((s, i) => `          <li><a href="${esc(PAGE[s.id])}"><span class="n">${n(i)}</span>${esc(s.title)}</a></li>`).join('\n');
  return html.replace('{{ra-cards}}', cards).replace('{{ra-sections}}', sections).replace('{{ra-nav}}', nav)
    .replaceAll('{{ra-intro}}', esc(RA.intro)).replaceAll('{{ra-count}}', RA.sections.length);
}
