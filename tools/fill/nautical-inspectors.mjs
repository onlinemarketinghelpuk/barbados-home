// Appointed Nautical Inspectors: country groups of city cards, rendered from src/data/nautical-inspectors.json
// Placeholders: {{ni-groups}} {{ni-chips}} {{ni-options}} {{ni-count}} {{ni-countries}} {{ni-cities}} {{ni-modified}}
export default function fillNauticalInspectors(html, { read, esc }) {
  if (!html.includes('{{ni-')) return html;
  const NI = JSON.parse(read('src/data/nautical-inspectors.json'));
  const slug = s => 'ni-' + s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
  const fold = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const countries = [...NI.countries].sort((a, b) => a.country.replace(/^The /, '').localeCompare(b.country.replace(/^The /, ''), 'en'));
  const people = c => c.cities.reduce((a, x) => a + x.inspectors.length, 0);
  const total = countries.reduce((a, c) => a + people(c), 0), cities = countries.reduce((a, c) => a + c.cities.length, 0);

  // one contact line: its label text, then tel / mailto / web links (emails get a copy button)
  const part = p => typeof p === 'string' ? `<span class="lb">${esc(p)}</span>`
    : p.k === 'tel' ? `<a class="tl" href="${esc(p.href)}"><svg aria-hidden="true"><use href="#phone"/></svg>${esc(p.text)}</a>`
    : p.k === 'mail' ? `<a class="ml" href="${esc(p.href)}">${esc(p.text)}</a><button class="copy" type="button" data-copy="${esc(p.href.slice(7))}" aria-label="Copy ${esc(p.href.slice(7))}"><svg aria-hidden="true"><use href="#i-copy"/></svg></button>`
    : `<a class="wb" href="${esc(p.href)}" target="_blank" rel="noopener">${esc(p.text)}<span class="sr"> (opens in a new tab)</span></a>`;
  const card = (c, city) => {
    const words = [c.country, city.city, ...city.inspectors.flatMap(i => [...i.names, i.company, ...i.address, ...i.contact.flat().map(p => typeof p === 'string' ? p : p.text)])].join(' ');
    const who = city.inspectors.map(i => `<div class="ni-who">${i.names.map(n => `<b class="nm">${esc(n)}</b>`).join('')}${i.company ? `<span class="co">${esc(i.company)}</span>` : ''}`
      + (i.address.length ? `<address>${i.address.map(esc).join('<br>')}</address>` : '')
      + (i.contact.length ? `<div class="ct">${i.contact.map(l => `<p>${l.map(part).join(' ')}</p>`).join('')}</div>` : '') + `</div>`).join('');
    return `        <li class="ni-li" data-s="${esc(fold(words))}"><article class="ni"><p class="pl"><svg aria-hidden="true"><use href="#i-pin"/></svg>${esc(city.city)}</p>${who}</article></li>`;
  };
  const groups = countries.map(c => `    <section class="ni-c" id="${slug(c.country)}" data-region="${c.region}" aria-labelledby="${slug(c.country)}-h">\n`
    + `      <h2 class="ni-h hull" id="${slug(c.country)}-h" tabindex="-1"><span class="cc" aria-hidden="true">${c.code}</span>${esc(c.country)}${c.cities.length > 1 ? ` <i>${c.cities.length} ports</i>` : ''}</h2>\n`
    + `      <ul class="ni-grid">\n${c.cities.map(city => card(c, city)).join('\n')}\n      </ul>\n    </section>`).join('\n');
  const inRegion = r => countries.filter(c => c.region === r).reduce((a, c) => a + people(c), 0);
  const chips = [`          <button type="button" data-region="all" aria-pressed="true">All <i>${total}</i></button>`]
    .concat(NI.regions.map(g => `          <button type="button" data-region="${g.id}" aria-pressed="false">${esc(g.name)} <i>${inRegion(g.id)}</i></button>`)).join('\n');
  const options = countries.map(c => `          <option value="${slug(c.country)}">${esc(c.country)}</option>`).join('\n');
  const modified = new Date(NI.modified + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return html.replace('{{ni-groups}}', groups).replace('{{ni-chips}}', chips).replace('{{ni-options}}', options)
    .replaceAll('{{ni-count}}', total).replaceAll('{{ni-countries}}', countries.length).replaceAll('{{ni-cities}}', cities).replaceAll('{{ni-modified}}', modified);
}
