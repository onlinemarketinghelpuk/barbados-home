// Deletion (Registry Alterations sub-page): the live text, the Registrar's list as a tick list, the note, and the sibling pages
// Placeholders: {{del-body}} {{del-needs-intro}} {{del-needs}} {{del-count}} {{del-note}} {{del-siblings}}
export default function fillDeletion(html, { read, esc }) {
  if (!html.includes('{{del-')) return html;
  const D = JSON.parse(read('src/data/deletion.json'));
  const text = n => typeof n === 'string' ? n : n.text;
  const needs = D.needs.map((n, i) => `          <li><label><input type="checkbox" id="del-need-${i + 1}"><span class="t">${esc(text(n))}</span></label></li>`).join('\n');
  const sibs = D.siblings.map(s => `          <li><a href="${esc(s.href)}">${esc(s.title)} <svg class="ar"><use href="#ar"/></svg></a></li>`).join('\n');
  return html.replace('{{del-body}}', D.body.map(p => `      <p>${esc(p)}</p>`).join('\n')).replace('{{del-needs-intro}}', esc(D.needsIntro))
    .replace('{{del-needs}}', needs).replaceAll('{{del-count}}', D.needs.length).replace('{{del-note}}', esc(D.note)).replace('{{del-siblings}}', sibs);
}
