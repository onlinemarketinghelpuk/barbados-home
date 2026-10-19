// Change of Owner's Name and/or Address: text, tick list, downloads, sibling links; from src/data/change-of-owners-name.json
// Placeholders: {{con-body}} {{con-needs}} {{con-count}} {{con-files}} {{con-file1}} {{con-siblings}} {{con-useful}} {{con-outcome}} {{con-lead}}
export default function fillChangeOfOwnersName(html, { read, esc, fileType, revOf }) {
  if (!html.includes('{{con-')) return html;
  const D = JSON.parse(read('src/data/change-of-owners-name.json'));
  const ar = '<svg class="ar"><use href="#ar"/></svg>';
  const body = D.body.map(p => `        <p>${esc(p)}</p>`).join('\n');
  const needs = D.needs.map((n, i) => `          <li><label><input type="checkbox" id="con-${i + 1}"><span class="t">${esc(n)}</span></label></li>`).join('\n');
  const files = D.files.map(f => `          <li><span class="t">${esc(f.title)}<small>${esc(f.code)}${revOf(f.file) !== undefined ? ' · Rev ' + revOf(f.file) : ''}</small></span>`
    + `<a class="dl" href="${esc(f.file)}" download aria-label="Download ${esc(f.code)} ${esc(f.title)} (${fileType(f.file)})"><svg aria-hidden="true"><use href="#dl"/></svg>${fileType(f.file)}</a></li>`).join('\n');
  const links = l => l.map(x => `          <li><a href="${esc(x.href)}">${esc(x.title)} ${ar}</a></li>`).join('\n');
  return html.replace('{{con-body}}', body).replace('{{con-needs}}', needs).replace('{{con-files}}', files)
    .replace('{{con-siblings}}', links(D.siblings)).replace('{{con-useful}}', links(D.useful))
    .replaceAll('{{con-count}}', D.needs.length).replaceAll('{{con-outcome}}', esc(D.outcome)).replaceAll('{{con-lead}}', esc(D.lead))
    .replaceAll('{{con-file1}}', esc(D.files[0].file));
}
