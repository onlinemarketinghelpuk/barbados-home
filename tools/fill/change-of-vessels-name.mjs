// Change of Vessel's Name: the live text, a tick list of what's needed, and the downloads; from src/data/change-of-vessels-name.json
// Placeholders: {{cvn-intro}} {{cvn-needs}} {{cvn-count}} {{cvn-files}} {{cvn-file}} {{cvn-portal}} {{cvn-portal-label}} {{cvn-note}}
export default function fillChangeOfVesselsName(html, { read, esc, fileType, revOf }) {
  if (!html.includes('{{cvn-')) return html;
  const D = JSON.parse(read('src/data/change-of-vessels-name.json'));
  const intro = D.intro.map(p => `      <p>${esc(p)}</p>`).join('\n');
  const needs = D.needs.map(n => `          <li><label><input type="checkbox" id="cvn-${n.id}"><span class="t">${esc(n.text)}</span></label></li>`).join('\n');
  const files = D.files.map(f => `          <li><span class="t">${esc(f.title)}<small>${esc(f.code)}${revOf(f.file) ? ' · Rev ' + revOf(f.file) : ''} · ${fileType(f.file)}</small></span>`
    + `<a class="rs-dl" href="${esc(f.file)}" download aria-label="Download ${esc(f.code)} ${esc(f.title)} (${fileType(f.file)})"><svg aria-hidden="true"><use href="#dl"/></svg>${fileType(f.file)}</a></li>`).join('\n');
  return html.replace('{{cvn-intro}}', intro).replace('{{cvn-needs}}', needs).replace('{{cvn-files}}', files)
    .replaceAll('{{cvn-count}}', D.needs.length).replaceAll('{{cvn-file}}', esc(D.files[0].file))
    .replaceAll('{{cvn-portal}}', esc(D.portal.href)).replaceAll('{{cvn-portal-label}}', esc(D.portal.label)).replaceAll('{{cvn-note}}', esc(D.note));
}
