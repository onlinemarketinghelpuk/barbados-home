// Change of Ownership: the live text, a tick list of what's needed, and links to the other registry alterations; from src/data/change-of-ownership.json
// Placeholders: {{coo-body}} {{coo-need}} {{coo-count}} {{coo-outcome}} {{coo-siblings}} {{coo-img}}
export default function fillChangeOfOwnership(html, { read, esc }) {
  if (!html.includes('{{coo-')) return html;
  const D = JSON.parse(read('src/data/change-of-ownership.json'));
  const body = D.body.map(p => `        <p>${esc(p)}</p>`).join('\n');
  const need = D.need.map((n, i) => `          <li><label><input type="checkbox" id="coo-${i + 1}"><span class="t">${esc(n.t)}${n.s ? `<small>${esc(n.s)}</small>` : ''}</span></label></li>`).join('\n');
  const sib = D.siblings.map(s => `          <li><a href="${esc(s.href)}">${esc(s.t)} <svg class="ar"><use href="#ar"/></svg></a></li>`).join('\n');
  return html.replace('{{coo-body}}', body).replace('{{coo-need}}', need).replace('{{coo-siblings}}', sib)
    .replaceAll('{{coo-count}}', D.need.length).replaceAll('{{coo-outcome}}', esc(D.outcome)).replaceAll('{{coo-img}}', esc(D.img));
}
