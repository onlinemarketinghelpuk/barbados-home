// Acts: the Merchant Shipping Acts as a register, each with its photo and PDF; from src/data/acts.json
// Placeholders: {{act-intro}} {{act-count}} {{act-list}} {{act-support-label}} {{act-support-email}} {{act-regs}}
export default function fillActs(html, { read, esc }) {
  if (!html.includes('{{act-')) return html;
  const A = JSON.parse(read('src/data/acts.json'));
  const regs = JSON.parse(read('src/data/barbados-legislation.json')).regulations.length; // the sibling page's count, for the side box
  const list = A.acts.map((a, i) => {
    const no = a.no ? `Act ${a.no}` : `Act ${a.year}`, id = 'act-' + (a.no || a.year);
    return `        <li class="lx-act rv" id="${id}">`
      + `<figure class="lx-ph"><img src="assets/img/acts/${esc(a.img)}" alt="" width="720" height="720" loading="${i < 3 ? 'eager' : 'lazy'}"></figure>`
      + `<div class="lx-b"><span class="lx-no">${esc(no)}</span><h3 class="hull" id="${id}-h">${esc(a.title)}, ${esc(a.year)}</h3>`
      + `<a class="lx-dl" href="${esc(a.file)}" target="_blank" rel="noopener" aria-describedby="${id}-h"><svg aria-hidden="true"><use href="#dl"/></svg>Read the Act <i>PDF</i><span class="sr"> (opens in a new tab)</span></a></div></li>`;
  }).join('\n');
  return html.replace('{{act-list}}', list).replaceAll('{{act-intro}}', esc(A.intro)).replaceAll('{{act-count}}', A.acts.length)
    .replaceAll('{{act-support-label}}', esc(A.support.label)).replaceAll('{{act-support-email}}', esc(A.support.email)).replaceAll('{{act-regs}}', regs);
}
