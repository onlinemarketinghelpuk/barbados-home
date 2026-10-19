// Shipboard Documents: the books grouped (all vessels / tankers) with their price, the standard set, and the courier charges,
// from src/data/shipboard.json. Fills the {{sbx-…}} placeholders; the build's own {{sb-count}}, {{sb-online}}, {{sb-offline}} still apply.
export default function fillShipboardExtra(html, { read, esc }) {
  if (!html.includes('{{sbx-')) return html;
  const SB = JSON.parse(read('src/data/shipboard.json'));
  const money = n => `${SB.currency} ${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const groups = SB.groups.map(g => {
    const books = SB.books.filter(b => b.group === g.id);
    return `      <section class="bkg" aria-labelledby="bkg-${g.id}">\n`
      + `        <div class="cap"><h3 class="hull" id="bkg-${g.id}">${esc(g.name)} <span>${esc(g.sub)}</span></h3><span class="tag">${books.length} title${books.length === 1 ? '' : 's'}</span></div>\n`
      + `        <ul class="books">\n${books.map(b => `          <li class="book" style="--c:${b.colour}"><span class="bk">BMSR edition</span><b class="hull">${esc(b.title)}</b><span class="s">${esc(b.sub)}</span><span class="pr">${money(b.price)} <small>per copy</small></span></li>`).join('\n')}\n        </ul>\n`
      + `      </section>`;
  }).join('\n');
  const set = SB.set;
  const setHtml = `<div class="set"><div class="set-h"><p class="tag t">${esc(set.when)}</p><h2 class="hull" id="set-h">${esc(set.title)}</h2><p>${esc(set.text)}</p></div>`
    + `<dl class="set-fee"><div><dt>All vessels</dt><dd>${money(set.fee)}</dd></div><div><dt>Tankers</dt><dd>${money(set.feeTankers)}</dd></div></dl>`
    + `<div class="set-b"><p class="tag">Also in the set</p><ul>${set.bundle.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`;
  const courier = SB.courier.map(c => `<li><span>${esc(c.name)}</span><b>${money(c.fee)}</b></li>`).join('');
  return html.replace('{{sbx-groups}}', groups).replace('{{sbx-set}}', setHtml).replace('{{sbx-courier}}', courier)
    .replaceAll('{{sbx-offline-code}}', esc(SB.offlineCode)).replaceAll('{{sbx-offline-title}}', esc(SB.offlineTitle))
    .replaceAll('{{sbx-printout-price}}', money(Math.min(...SB.books.map(b => b.price))));
}
