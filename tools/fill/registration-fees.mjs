// Registration Fees: the fee tables and the estimator's bands, rendered from src/data/registration-fees.json ({{rf-…}} placeholders)
export default function fillRegistrationFees(html, { read, esc }) {
  if (!html.includes('{{rf-')) return html;
  const F = JSON.parse(read('src/data/registration-fees.json'));
  const money = n => n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const rule = r => r.fixed !== undefined ? money(r.fixed) : `${r.rate} × NRT + ${money(r.plus)}`;
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const amount = (fee, unit) => `<span class="amt">${money(fee)}</span>${unit ? ` <span class="unit">${esc(unit)}</span>` : ''}`;

  const vessel = F.vessel.bands.map(b => `          <tr data-s="${esc(norm(`vessel ship ${b.label} initial registration annual fee nrt`))}"><th scope="row">${esc(b.label)}</th>`
    + `<td data-l="Initial registration"><span class="amt">${rule(b.initial)}</span></td><td data-l="Annual fee"><span class="amt">${rule(b.annual)}</span></td></tr>`).join('\n');
  const yacht = F.yacht.map(y => `          <tr data-s="${esc(norm(`yacht ${y.label} initial registration annual fee`))}"><th scope="row">${esc(y.label)}</th>`
    + `<td data-l="Initial registration">${amount(y.initial)}</td><td data-l="Annual fee">${amount(y.annual)}</td></tr>`).join('\n');
  const groups = F.groups.map(g => {
    let head = '';
    const rows = g.rows.map(r => {
      if (r.head) { head = r.head; return `          <tr class="sub"><th colspan="2" scope="colgroup">${esc(r.head)}</th></tr>`; }
      return `          <tr data-s="${esc(norm(`${g.name} ${head} ${r.item} ${r.note || ''}`))}"><th scope="row">${esc(r.item)}${r.note ? `<small>${esc(r.note)}</small>` : ''}</th><td data-l="Fee (USD)">${amount(r.fee, r.unit)}</td></tr>`;
    }).join('\n');
    const n = g.rows.filter(r => !r.head).length;
    return `      <section class="fees" id="${g.id}" aria-labelledby="${g.id}-h">\n        <div class="fh"><h2 class="hull" id="${g.id}-h">${esc(g.name)}</h2><span class="tag">${n} fees</span></div>\n`
      + (g.intro ? `        <p class="fi">${esc(g.intro)}</p>\n` : '')
      + `        <table class="ft two"><caption class="sr">${esc(g.name)}, in US dollars</caption><thead><tr><th scope="col">Item</th><th scope="col">Fee (USD)</th></tr></thead><tbody>\n${rows}\n        </tbody></table>\n      </section>`;
  }).join('\n');
  const count = 2 * F.vessel.bands.length + 2 * F.yacht.length + F.groups.reduce((a, g) => a + g.rows.filter(r => !r.head).length, 0);
  const nav = [['vessels', 'Ships (by NRT)'], ['yachts', 'Yachts'], ...F.groups.map(g => [g.id, g.name])]
    .map(([id, name], i) => `          <li><a href="#${id}"><span class="n">0${i + 1}</span>${esc(name)}</a></li>`).join('\n');
  const bands = JSON.stringify(F.vessel.bands.map(({ upTo, initial, annual }) => ({ upTo, initial, annual }))).replace(/</g, '\\u003c');
  return html.replace('{{rf-vessel}}', vessel).replace('{{rf-yacht}}', yacht).replace('{{rf-groups}}', groups).replace('{{rf-nav}}', nav).replace('{{rf-bands}}', bands)
    .replaceAll('{{rf-file}}', esc(F.source.file)).replaceAll('{{rf-code}}', esc(F.source.code)).replaceAll('{{rf-rev}}', esc(F.source.rev)).replaceAll('{{rf-count}}', count);
}
