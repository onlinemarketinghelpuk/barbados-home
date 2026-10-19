// Notices to Nautical Inspectors: the active notices, newest first, from src/data/notices-to-nautical-inspectors.json
export default function fillNotices(html, { read, esc }) {
  if (!html.includes('{{nni-')) return html;
  const NN = JSON.parse(read('src/data/notices-to-nautical-inspectors.json'));
  const day = d => new Date(d + 'T12:00:00Z');
  const items = NN.notices.map((n, i) => {
    const d = day(n.date), dd = d.getUTCDate(), my = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    return `        <li class="nni" id="${n.id}"><article aria-labelledby="${n.id}-h">`
      + `<p class="nni-meta"><time datetime="${n.date}"><span class="dd">${dd}</span> <span class="my">${my}</span></time><span class="chip">${esc(n.kind)}</span>${i === 0 ? '<span class="chip new">Latest</span>' : ''}</p>`
      + `<div class="nni-b"><h3 class="hull" id="${n.id}-h">${esc(n.title)}</h3><p>${esc(n.text)}</p>`
      + `<p class="nni-acts"><a class="btn btn-line" href="${esc(n.href)}">Read the notice <svg class="ar"><use href="#ar"/></svg></a>`
      + (n.also ? `<a class="lnk" href="${esc(n.also.href)}">${esc(n.also.label)} <svg class="ar"><use href="#ar"/></svg></a>` : '') + `</p></div></article></li>`;
  }).join('\n');
  return html.replace('{{nni-items}}', items).replaceAll('{{nni-count}}', NN.notices.length).replaceAll('{{nni-intro}}', esc(NN.intro))
    .replaceAll('{{nni-latest}}', day(NN.notices[0].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }));
}
