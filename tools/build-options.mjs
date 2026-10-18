// Builds the review options from the shared page: node tools/build-options.mjs
// src/home.html is the single source for everything; src/type-{a,b,c}.css hold each option's hero typography.
// Option D also swaps the blocks marked <!-- @d:name --> … <!-- /@d:name --> in src/home.html for src/option-d/name.html,
// adds src/option-d/d.css, and uses its own optimised images. For A–C the markers are simply removed.
// Output: option-{a,b,c,d}/index.html (committed, so Vercel serves them as plain static pages).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const json = p => existsSync(new URL(p, root)) ? JSON.parse(read(p)) : {};
export const options = [
  { id: 'a', name: 'Refined Hull', fonts: null },
  { id: 'b', name: 'Soft Modern', fonts: 'family=Nunito:wght@400..1000' },
  { id: 'c', name: 'Clean Authority', fonts: 'family=Plus+Jakarta+Sans:wght@200..800' },
  // D: Option A's headline with the improved sections (see docs/spec.md, "Option D")
  { id: 'd', name: 'Refined Plus', type: 'a', fonts: null, parts: 'src/option-d/',
    pageCss: { 'src/contact.html': 'src/option-d/contact.css', 'src/about.html': 'src/option-d/inner.css', 'src/team.html': 'src/option-d/inner.css', 'src/registrars.html': 'src/option-d/registrars.css', 'src/ros.html': 'src/option-d/ros-page.css', 'src/quality.html': 'src/option-d/quality.css', 'src/links.html': 'src/option-d/links.css', 'src/bmsr.html': 'src/option-d/bmsr.css', 'src/why.html': 'src/option-d/why.css', 'src/holidays.html': 'src/option-d/holidays.css', 'src/registration.html': 'src/option-d/registration.css', 'src/seafarers.html': 'src/option-d/seafarers.css', 'src/inspections.html': 'src/option-d/inspections.css', 'src/investigations.html': 'src/option-d/investigations.css', 'src/events.html': 'src/option-d/events.css', 'src/documents.html': 'src/option-d/documents.css', 'src/bulletins.html': 'src/option-d/bulletins.css', 'src/conventions.html': 'src/option-d/conventions.css', 'src/shipboard.html': 'src/option-d/shipboard.css' }, // extra styles for one page only
    assets: json('src/option-d/assets.json'), // image swaps (optimised copies in assets/img/d/)
    text: json('src/option-d/text.json') },   // copy swaps, e.g. the IACS count
];

// shared blocks (head, header, footer) live in src/partials/ and are stitched in wherever a page has <!-- @include name -->
const include = html => html.replace(/^<!-- @include ([\w-]+)[^>]*-->\n/gm, (all, name) => read(`src/partials/${name}.html`));
const base = include(read('src/home.html'));
const swap = (html, find, replace) => {
  if (!(typeof find === 'string' ? html.includes(find) : find.test(html))) throw new Error(`src/home.html is missing: ${find}`);
  return html.replace(find, replace);
};
const BLOCK = /^[ \t]*<!-- @d:(\w+)[^>]*-->\n([\s\S]*?)^[ \t]*<!-- \/@d:\1 -->\n/gm;

// Recognised Organisations tiles, rendered from the data file so adding one is a one-line change
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
function fillRos(html) {
  if (!html.includes('{{ro-')) return html;
  const ros = JSON.parse(read('src/option-d/ros.json')).sort((a, b) => a.name.localeCompare(b.name, 'en'));
  // a missing logo shows a text mark; a missing website makes the tile plain (not a link)
  const tiles = ros.map(r => `        <li data-group="${r.iacs ? 'iacs' : 'other'}" data-s="${esc(r.name.toLowerCase())}">`
    + (r.url ? `<a class="ro" href="${esc(r.url)}" rel="noopener" title="${esc(r.name)}">` : `<div class="ro" title="${esc(r.name)}">`)
    + (r.logo ? `<span class="lg"><img src="assets/img/ro/${r.logo}" alt="" width="${r.w}" height="${r.h}" loading="lazy" style="--r:${(r.w / r.h).toFixed(3)}"></span>`
      : `<span class="lg"><span class="mark" aria-hidden="true">${esc(r.mark || r.name)}</span></span>`)
    + `<span class="nm">${esc(r.name)}</span>${r.iacs ? '<span class="ia" title="IACS member"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>IACS<span class="sr"> member</span></span>' : ''}${r.url ? '</a>' : '</div>'}</li>`).join('\n');
  return html.replace('{{ro-tiles}}', tiles).replaceAll('{{ro-count}}', ros.length)
    .replaceAll('{{ro-iacs}}', ros.filter(r => r.iacs).length).replaceAll('{{ro-other}}', ros.filter(r => !r.iacs).length);
}

// team cards and sections, rendered from src/data/team.json so a change of person or role is a one-line edit
const T = JSON.parse(read('src/data/team.json'));
const card = p => `        <li class="rv"><figure class="tm"><div class="pic"><img src="assets/img/team/${p.photo}" alt="${esc(p.name)}" width="300" height="300" loading="lazy"></div>`
  + `<figcaption><span class="tag">${esc(p.role)}</span><b>${esc(p.name)}</b></figcaption></figure></li>`;
function fillTeam(html) {
  if (!html.includes('{{team-')) return html;
  const of = id => T.people.filter(p => p.team === id), lead = T.teams[0];
  const sections = T.teams.map(t => `<section class="tsec" id="${t.id}" data-team="${t.id}" aria-labelledby="${t.id}-h">\n  <div class="wrap">\n`
    + `    <div class="head rv"><div><p class="tag t">${esc(t.name)} team</p><h2 class="hull h2" id="${t.id}-h">${esc(t.name)} <span>team</span></h2><p class="lead">${esc(t.intro)}</p></div><span class="count">${of(t.id).length} ${of(t.id).length === 1 ? 'person' : 'people'}</span></div>\n`
    + `    <ul class="tgrid">\n${of(t.id).map(card).join('\n')}\n    </ul>\n  </div>\n</section>`).join('\n');
  const chips = [`    <button type="button" data-team="all" aria-pressed="true">All <i>${T.people.length}</i></button>`]
    .concat(T.teams.map(t => `    <button type="button" data-team="${t.id}" aria-pressed="false">${esc(t.name)} <i>${of(t.id).length}</i></button>`)).join('\n');
  html = html.replace(/\{\{team-of:(\w+)\}\}/g, (m, id) => of(id).map(card).join('\n')); // one team's cards anywhere
  return html.replace('{{team-leaders}}', of(lead.id).map(card).join('\n')).replace('{{team-sections}}', sections).replace('{{team-chips}}', chips)
    .replace('{{team-crew}}', T.crew.map(p => `        <p>${esc(p)}</p>`).join('\n'))
    .replaceAll('{{team-intro}}', esc(T.intro)).replaceAll('{{team-leadership-intro}}', esc(lead.intro))
    .replaceAll('{{team-count}}', T.people.length).replaceAll('{{team-teams}}', T.teams.length);
}

// regional registrars: country groups of cards, rendered from src/data/registrars.json
const RR = JSON.parse(read('src/data/registrars.json'));
// drops text labels like "(Office)" and the UK-style "(0)", keeps digits such as an area code "(246)"
const telHref = t => 'tel:' + t.replace(/\([^)]*[a-z][^)]*\)/gi, '').replace(/\(0\)/g, '').replace(/[^\d+]/g, '');
const ICON_PH = '<svg aria-hidden="true"><use href="#phone"/></svg>';
function fillRegistrars(html) {
  if (!html.includes('{{rr-')) return html;
  const rs = RR.registrars, byCountry = new Map();
  [...rs].sort((a, b) => a.country.replace(/^The /, '').localeCompare(b.country.replace(/^The /, ''), 'en')).forEach(r => { if (!byCountry.has(r.country)) byCountry.set(r.country, []); byCountry.get(r.country).push(r); });
  const slug = s => 'rr-' + s.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
  const card = r => {
    const search = [r.country, r.name, r.company, r.address, ...r.email].join(' ').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const tels = r.tel.map(t => { const m = t.match(/^(.*?)\s*\((.+)\)$/); const num = m ? m[1] : t;
      return `<a class="ph" href="${telHref(num)}">${ICON_PH}${esc(num)}${m ? ` <small>${esc(m[2])}</small>` : ''}</a>`; }).join('');
    const mails = r.email.map(e => `<span class="em"><a href="mailto:${esc(e)}">${esc(e)}</a><button class="copy" type="button" data-copy="${esc(e)}" aria-label="Copy ${esc(e)}"><svg aria-hidden="true"><use href="#i-copy"/></svg></button></span>`).join('');
    return `        <li class="rr-li" data-s="${esc(search)}"><article class="rr"><b class="nm">${esc(r.name)}</b><span class="co">${esc(r.company)}</span><address>${esc(r.address)}</address><div class="ct">${tels}${mails}</div></article></li>`;
  };
  const groups = [...byCountry].map(([c, list]) => `    <section class="rr-c" id="${slug(c)}" data-region="${list[0].region}" aria-labelledby="${slug(c)}-h">\n`
    + `      <h2 class="rr-h hull" id="${slug(c)}-h" tabindex="-1"><span class="cc" aria-hidden="true">${list[0].code}</span>${esc(c)}${list.length > 1 ? ` <i>${list.length} registrars</i>` : ''}</h2>\n`
    + `      <ul class="rr-grid">\n${list.map(card).join('\n')}\n      </ul>\n    </section>`).join('\n');
  const count = r => rs.filter(x => x.region === r).length;
  const chips = [`          <button type="button" data-region="all" aria-pressed="true">All <i>${rs.length}</i></button>`]
    .concat(RR.regions.map(g => `          <button type="button" data-region="${g.id}" aria-pressed="false">${esc(g.name)} <i>${count(g.id)}</i></button>`)).join('\n');
  const options = [...byCountry].map(([c]) => `          <option value="${slug(c)}">${esc(c)}</option>`).join('\n');
  return html.replace('{{rr-groups}}', groups).replace('{{rr-chips}}', chips).replace('{{rr-options}}', options)
    .replaceAll('{{rr-count}}', rs.length).replaceAll('{{rr-countries}}', byCountry.size);
}

// useful links: one card per organisation with a row per service, rendered from src/data/useful-links.json
const UL = JSON.parse(read('src/data/useful-links.json'));
function fillLinks(html) {
  if (!html.includes('{{ul-')) return html;
  const ico = { web: '#ext', email: '#i-mail', tel: '#phone' };
  const btn = l => l.type === 'tel' ? `<a class="lk" href="${l.tel ? 'tel:' + l.tel : telHref(l.label)}"><svg aria-hidden="true"><use href="#phone"/></svg>${esc(l.label)}</a>`
    : l.type === 'email' ? `<span class="lk-mail"><a class="lk" href="mailto:${esc(l.label)}"><svg aria-hidden="true"><use href="#i-mail"/></svg>${esc(l.label)}</a><button class="copy" type="button" data-copy="${esc(l.label)}" aria-label="Copy ${esc(l.label)}"><svg aria-hidden="true"><use href="#i-copy"/></svg></button></span>`
    : `<a class="lk" href="${esc(l.href)}" target="_blank" rel="noopener"${l.confirm ? ' data-confirm' : ''}><svg aria-hidden="true"><use href="${ico.web}"/></svg>${esc(l.label)}<span class="sr"> (opens in a new tab)</span></a>`;
  const groups = UL.groups.map(g => `    <section class="ul-g rv" id="ul-${g.id}" data-filter="${g.filter}" aria-labelledby="ul-${g.id}-h">\n`
    + `      <div class="ul-side"><span class="ul-logo">${g.logo ? `<img src="assets/img/links/${g.logo}" alt="" width="${g.w}" height="${g.h}" loading="lazy">` : `<svg viewBox="0 0 24000 16000" aria-hidden="true"><use href="#flag"/></svg>`}</span>`
    + `<h2 class="hull" id="ul-${g.id}-h">${esc(g.name)}</h2><p>${esc(g.desc)}</p></div>\n`
    + `      <ul class="ul-rows">\n${g.items.map(it => `        <li><div><b>${esc(it.name)}</b><p>${esc(it.desc)}</p></div><div class="lks">${it.links.map(btn).join('')}</div></li>`).join('\n')}\n      </ul>\n    </section>`).join('\n');
  const n = f => UL.groups.filter(g => g.filter === f).reduce((a, g) => a + g.items.length, 0), total = UL.groups.reduce((a, g) => a + g.items.length, 0);
  const chips = [`        <button type="button" data-f="all" aria-pressed="true">All <i>${total}</i></button>`,
    `        <button type="button" data-f="barbados" aria-pressed="false">Barbados <i>${n('barbados')}</i></button>`,
    `        <button type="button" data-f="maritime" aria-pressed="false">Maritime (IMO) <i>${n('maritime')}</i></button>`,
    `        <button type="button" data-f="labour" aria-pressed="false">Labour (ILO) <i>${n('labour')}</i></button>`].join('\n');
  return html.replace('{{ul-groups}}', groups).replace('{{ul-chips}}', chips).replaceAll('{{ul-count}}', total).replaceAll('{{ul-orgs}}', UL.groups.length);
}

// public holidays: one row per closure, rendered from src/data/holidays.json (weekday and date words computed, so they can't be wrong)
const HOL = JSON.parse(read('src/data/holidays.json'));
function fillHolidays(html) {
  if (!html.includes('{{hol-')) return html;
  const fmt = (iso, o) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { timeZone: 'UTC', ...o });
  const rows = HOL.days.map(h => {
    const day = fmt(h.date, { weekday: 'long' }), dm = fmt(h.date, { day: 'numeric', month: 'long' });
    return `          <li class="hrow" data-date="${h.date}" data-name="${esc(h.name)}" data-when="${day} ${dm}"><span class="cal" aria-hidden="true"><b class="hull">${fmt(h.date, { day: 'numeric' })}</b><small>${fmt(h.date, { month: 'short' })}</small></span>`
      + `<span><span class="nm">${esc(h.name)}</span><br><time class="day" datetime="${h.date}">${day} ${dm}</time></span><span class="closed">Closed</span></li>`;
  }).join('\n');
  const first = HOL.days[0];
  return html.replace('{{hol-rows}}', rows).replaceAll('{{hol-year}}', HOL.year).replaceAll('{{hol-office}}', esc(HOL.office)).replaceAll('{{hol-count}}', HOL.days.length)
    .replaceAll('{{hol-first-when}}', `${fmt(first.date, { weekday: 'long' })} ${fmt(first.date, { day: 'numeric', month: 'long' })}`).replaceAll('{{hol-first-name}}', esc(first.name));
}

// events: one card per event, rendered from src/data/events.json (newest first; the first is marked "Latest")
const EV = JSON.parse(read('src/data/events.json'));
function fillEvents(html) {
  if (!html.includes('{{ev-')) return html;
  const items = EV.events.map((e, i) => {
    const media = e.photos?.length
      ? `<figure class="media"><img src="assets/${e.photoDir || 'img/events'}/${e.photos[0]}" alt="BMSR at ${esc(e.title)}" loading="lazy"></figure>`
      : `<figure class="media none" aria-hidden="true"><span><b class="hull">${esc(e.place.split(',')[0])}</b><small>Photos coming soon</small></span></figure>`;
    const chips = [e.dateText && `<span class="chip when">${esc(e.dateText)}</span>`, `<span class="chip">${esc(e.place)}</span>`, `<span class="chip">${esc(e.kind)}</span>`].filter(Boolean).join('');
    return `    <article class="ev rv${i === 0 ? ' latest' : ''}" id="${e.id}" aria-labelledby="${e.id}-h">${media}<div class="b"><div class="meta">${chips}</div>`
      + `<h2 class="hull" id="${e.id}-h">${esc(e.title)}</h2>${e.body.map(p => `<p>${esc(p)}</p>`).join('')}`
      + (e.link ? `<a class="go" href="${esc(e.link)}">Read the story <svg class="ar"><use href="#ar"/></svg></a>` : '') + `</div></article>`;
  }).join('\n');
  return html.replace('{{ev-items}}', items);
}

// forms: one list per category, rendered from src/data/forms.json; an empty category says its list is on the way
const FM = JSON.parse(read('src/data/forms.json'));
function fillForms(html) {
  if (!html.includes('{{fm-')) return html;
  const LIVE_FORMS = 'https://barbadosmaritime.com/documents/forms/#live'; // the live page, until each form has its own "file" (the #live keeps the link rewrite from pointing it at this page)
  const total = FM.categories.reduce((a, c) => a + c.forms.length, 0);
  const list = FM.categories.map(c => `      <section class="fcat" id="cat-${c.id}" data-cat="${c.id}" aria-labelledby="cat-${c.id}-h">\n`
    + `        <h2 class="hull" id="cat-${c.id}-h">${esc(c.name)} <i>${c.forms.length ? c.forms.length + ' forms' : 'Coming soon'}</i></h2>\n`
    + (c.forms.length ? c.forms.map(f => `        <div class="frow" data-s="${esc((f.code + ' ' + f.code.replace(/^.*-/, '') + ' ' + f.title).toLowerCase())}"><span class="code">${esc(f.code)}</span><span class="t">${esc(f.title)}</span>`
      + `<a class="dl" href="${esc(f.file || LIVE_FORMS)}"${f.file ? ' download' : ''} aria-label="Download ${esc(f.code)} ${esc(f.title)}"><svg aria-hidden="true"><use href="#dl"/></svg>PDF</a></div>`).join('\n')
      : `        <p class="fsoon">This list is moving to the new site. Until then, find it on the <a href="${LIVE_FORMS}">current forms page</a>.</p>`)
    + `\n      </section>`).join('\n');
  const chips = [`          <button type="button" data-cat="all" aria-pressed="true">All <i>${total}</i></button>`]
    .concat(FM.categories.map(c => `          <button type="button" data-cat="${c.id}" aria-pressed="false">${esc(c.name.replace(/ forms$/i, ''))}${c.forms.length ? ` <i>${c.forms.length}</i>` : ''}</button>`)).join('\n');
  return html.replace('{{fm-list}}', list).replace('{{fm-chips}}', chips).replaceAll('{{fm-count}}', total).replaceAll('{{fm-cats}}', FM.categories.length);
}

// bulletins: one sortable list, rendered from src/data/bulletins.json; each row has a topic for the filter chips
const BL = JSON.parse(read('src/data/bulletins.json'));
function fillBulletins(html) {
  if (!html.includes('{{bl-')) return html;
  const LIVE_BL = 'https://barbadosmaritime.com/documents/bulletins/#live'; // the live page, until each bulletin has its own "file"
  const topic = Object.fromEntries(BL.topics.map(t => [t.id, t.name]));
  const rows = BL.bulletins.map(b => {
    const name = `Bulletin ${b.no} ${b.title}`, s = `${b.no} ${+b.no} ${b.title} ${topic[b.topic]}`;
    return `        <div class="frow" data-topic="${b.topic}" data-no="${b.no}" data-title="${esc(b.title.toLowerCase())}" data-s="${esc(s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())}">`
      + `<span class="code">No. ${b.no}</span><span class="t">${esc(b.title)}<small>${esc(topic[b.topic])}</small></span><span class="rev">Rev ${esc(b.rev)}</span>`
      + `<span class="acts"><a class="view" href="${esc(b.href || LIVE_BL)}" aria-label="Read ${esc(name)}">Read</a>`
      + `<a class="dl" href="${esc(b.file || LIVE_BL)}"${b.file ? ' download' : ''} aria-label="Download ${esc(name)}"><svg aria-hidden="true"><use href="#dl"/></svg>PDF</a></span></div>`;
  }).join('\n');
  const n = id => BL.bulletins.filter(b => b.topic === id).length;
  const chips = [`          <button type="button" data-cat="all" aria-pressed="true">All <i>${BL.bulletins.length}</i></button>`]
    .concat(BL.topics.map(t => `          <button type="button" data-cat="${t.id}" aria-pressed="false">${esc(t.name)} <i>${n(t.id)}</i></button>`)).join('\n');
  return html.replace('{{bl-rows}}', rows).replace('{{bl-chips}}', chips).replaceAll('{{bl-count}}', BL.bulletins.length).replaceAll('{{bl-topics}}', BL.topics.length);
}

// conventions: grouped rows, rendered from src/data/conventions.json
const CV = JSON.parse(read('src/data/conventions.json'));
function fillConventions(html) {
  if (!html.includes('{{cv-')) return html;
  const total = CV.groups.reduce((a, g) => a + g.items.length, 0);
  const groups = CV.groups.map(g => `      <section class="cvg" id="cv-${g.id}" aria-labelledby="cv-${g.id}-h">\n`
    + `        <h2 class="hull" id="cv-${g.id}-h">${esc(g.name)} <i>${g.items.length}</i></h2><p class="gd">${esc(g.d)}</p>\n        <ul>\n`
    + g.items.map(c => `          <li class="cv" data-s="${esc((c.ab + ' ' + c.title + ' ' + c.year).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())}"><span class="ab">${esc(c.ab)}</span><span class="tt">${esc(c.title)}</span><span class="yr">${esc(c.year)}</span></li>`).join('\n')
    + `\n        </ul>\n      </section>`).join('\n');
  const jump = CV.groups.map(g => `          <a href="#cv-${g.id}">${esc(g.name)} <i>${g.items.length}</i></a>`).join('\n');
  return html.replace('{{cv-groups-html}}', groups).replace('{{cv-jump}}', jump).replace('{{cv-intro}}', esc(CV.intro)).replaceAll('{{cv-count}}', total).replaceAll('{{cv-groups}}', CV.groups.length);
}

// shipboard documents: one card per record book, its spine coloured like the cover, from src/data/shipboard.json
const SB = JSON.parse(read('src/data/shipboard.json'));
function fillShipboard(html) {
  if (!html.includes('{{sb-')) return html;
  const books = SB.books.map(b => `        <li class="book" style="--c:${b.colour}"><span class="bk">BMSR edition</span><b class="hull">${esc(b.title)}</b><span class="s">${esc(b.sub)}</span></li>`).join('\n');
  return html.replace('{{sb-books}}', books).replaceAll('{{sb-count}}', SB.books.length).replaceAll('{{sb-online}}', esc(SB.orderOnline)).replaceAll('{{sb-offline}}', esc(SB.orderOffline));
}

// pages built for every option. `links` points the live-site addresses at the review pages, so the review flows between them.
// every review page, with the live-site address it replaces. Links to these addresses are pointed at the review copy.
const SITE = 'https://barbadosmaritime.com/';
const LIVE = { contact: 'contact-us/', about: 'about-us/', team: 'our-team/', registrars: 'regional-registrars/', ros: 'barbados-recognised-organisations/', quality: 'quality-assurance/', links: 'useful-links/', 'the-bmsr': 'the-bmsr/', 'why-barbados': 'why-register-in-barbados/', holidays: 'public-holidays/', registration: 'registration/', seafarers: 'seafarers-manning/', inspections: 'inspections/', investigations: 'investigations/', events: 'bmsr-events/', documents: 'documents/', forms: 'documents/forms/', bulletins: 'documents/bulletins/', conventions: 'documents/conventions/', shipboard: 'documents/shipboard-documents/' };
// live sub-pages we haven't built yet, and the main review page (and section) they open instead. Once a sub-page is in LIVE, its own review page wins.
// Any other address one level under a LIVE page (e.g. registration/anything/) falls back to that page too: see subLinks below.
const SUB = {
  'registration/ship-registration/': 'registration#types', 'registration/yacht-registration/': 'registration#types',
  'registration/mortgages/': 'registration#mortgages', 'registration/bareboat-charters-registration/': 'registration#bareboat',
  'registration/registration-fees/': 'registration#ac-h', 'registration/registry-alterations/': 'registration#ac-h',
  'seafarers-manning/endorsement-and-discharge-book/': 'seafarers#apply', 'seafarers-manning/document-validity-check/': 'seafarers#check',
  'list-of-appointed-nautical-inspectors/': 'inspections#ar-h',
  'inspections/inspection-templates/': 'inspections#rs-h', 'inspections/notices-to-nautical-inspectors/': 'inspections#rs-h',
  'investigations/marine-accident-reporting/': 'investigations#report',
  'investigations/marine-safety-investigation-reports/': 'investigations#sections', 'investigations/ongoing-msi/': 'investigations#sections',
  'documents/marine-circulars/': 'documents#directory', 'documents/guides/': 'documents#directory',
  'documents/barbados-legislation/': 'documents#directory', 'documents/barbados-publications/': 'documents#directory',
  'conventions/': 'conventions', // an older address of documents/conventions/, used on the home page
};
const toPage = (dir, target) => { const [d, hash] = target.split('#'); const h = hash ? '#' + hash : '';
  return d === dir ? (h || 'index.html') : `${dir ? '../' : ''}${d}/index.html${h}`; };
const linksFor = dir => {
  const m = { [SITE]: dir ? '../index.html' : 'index.html' };
  const built = new Set(Object.values(LIVE));
  for (const [u, target] of Object.entries(SUB)) if (!built.has(u)) m[SITE + u] = toPage(dir, target);
  for (const [d, u] of Object.entries(LIVE)) m[SITE + u] = d === dir ? (d === 'contact' ? '#message' : 'index.html') : `${dir ? '../' : ''}${d}/index.html`;
  return m;
};
// the fallback for sub-pages not listed in SUB: SITE + <a LIVE address> + <one more folder>/ opens that LIVE page (links ending #live stay live)
const subLinks = (html, dir) => html.replace(/href="https:\/\/barbadosmaritime\.com\/([a-z0-9-]+\/)[a-z0-9-]+\/"/g, (all, parent) => {
  const d = Object.keys(LIVE).find(k => LIVE[k] === parent);
  return d ? `href="${toPage(dir, d)}"` : all;
});
const pages = [
  { src: 'src/home.html', out: 'index.html', up: '../', strictText: true, links: linksFor('') },
  { src: 'src/contact.html', out: 'contact/index.html', up: '../../', links: linksFor('contact') },
  { src: 'src/about.html', out: 'about/index.html', up: '../../', links: linksFor('about') },
  { src: 'src/team.html', out: 'team/index.html', up: '../../', links: linksFor('team') },
  { src: 'src/registrars.html', out: 'registrars/index.html', up: '../../', links: linksFor('registrars') },
  { src: 'src/ros.html', out: 'ros/index.html', up: '../../', links: linksFor('ros') },
  { src: 'src/quality.html', out: 'quality/index.html', up: '../../', links: linksFor('quality') },
  { src: 'src/links.html', out: 'links/index.html', up: '../../', links: linksFor('links') },
  { src: 'src/bmsr.html', out: 'the-bmsr/index.html', up: '../../', links: linksFor('the-bmsr') },
  { src: 'src/why.html', out: 'why-barbados/index.html', up: '../../', links: linksFor('why-barbados') },
  { src: 'src/holidays.html', out: 'holidays/index.html', up: '../../', links: linksFor('holidays') },
  { src: 'src/registration.html', out: 'registration/index.html', up: '../../', links: linksFor('registration') },
  { src: 'src/seafarers.html', out: 'seafarers/index.html', up: '../../', links: linksFor('seafarers') },
  { src: 'src/inspections.html', out: 'inspections/index.html', up: '../../', links: linksFor('inspections') },
  { src: 'src/investigations.html', out: 'investigations/index.html', up: '../../', links: linksFor('investigations') },
  { src: 'src/events.html', out: 'events/index.html', up: '../../', links: linksFor('events') },
  { src: 'src/documents.html', out: 'documents/index.html', up: '../../', links: linksFor('documents') },
  { src: 'src/forms.html', out: 'forms/index.html', up: '../../', links: linksFor('forms') },
  { src: 'src/bulletins.html', out: 'bulletins/index.html', up: '../../', links: linksFor('bulletins') },
  { src: 'src/conventions.html', out: 'conventions/index.html', up: '../../', links: linksFor('conventions') },
  { src: 'src/shipboard.html', out: 'shipboard/index.html', up: '../../', links: linksFor('shipboard') },
];

for (const o of options) for (const pg of pages) {
  const type = o.type || o.id;
  const css = read(`src/type-${type}.css`) + (o.parts ? read(o.parts + 'd.css') : '') + (o.pageCss?.[pg.src] ? read(o.pageCss[pg.src]) : '');
  const head = (o.fonts ? `<link href="https://fonts.googleapis.com/css2?${o.fonts}&display=swap" rel="stylesheet">\n` : '') + `<style>\n${css}</style>`;
  const from = `${pg.src} + src/partials/ + src/type-${type}.css` + (o.parts ? ` + ${o.parts}` : '');
  let html = (pg.src === 'src/home.html' ? base : include(read(pg.src))).replace(BLOCK, (all, name, inner) => {
    const part = o.parts && new URL(`${o.parts}${name}.html`, root);
    return part && existsSync(part) ? fillRos(readFileSync(part, 'utf8')) : inner;
  });
  html = fillShipboard(fillConventions(fillBulletins(fillForms(fillEvents(fillHolidays(fillLinks(fillRos(fillRegistrars(fillTeam(html))))))))));
  for (const [from, to] of Object.entries(o.assets || {})) html = html.replaceAll(`"${from}"`, `"${to}"`);
  for (const [from, to] of Object.entries(o.text || {})) {
    if (!html.includes(from)) { if (pg.strictText) throw new Error(`option-${o.id}: text swap not found: ${from}`); continue; }
    html = html.replaceAll(from, to);
  }
  for (const [from, to] of Object.entries(pg.links)) html = html.replaceAll(`href="${from}"`, `href="${to}"`);
  html = subLinks(html, pg.out === 'index.html' ? '' : pg.out.split('/')[0]);
  html = swap(html, '<!doctype html>\n', `<!doctype html>\n<!-- GENERATED by tools/build-options.mjs from ${from}. Do not edit by hand. -->\n`);
  html = swap(html, /<!-- @option-head[^>]*-->/, () => head);
  html = swap(html, '<title>', `<title>Option ${o.id.toUpperCase()} · `);
  html = swap(html, '<html lang="en-GB">', `<html lang="en-GB" data-option="${o.id}">`);
  html = html.replace(/(["'(])assets\//g, `$1${pg.up}assets/`);
  if (/@d:|@include|\{\{(ro|team|rr|ul|hol|ev|fm|bl|cv|sb)-/.test(html)) throw new Error(`option-${o.id}/${pg.out}: unreplaced marker or placeholder`);
  const out = `option-${o.id}/${pg.out}`;
  mkdirSync(new URL(out.replace(/[^/]+$/, ''), root), { recursive: true });
  writeFileSync(new URL(out, root), html);
  console.log(`${out}  (${o.name})`);
}
