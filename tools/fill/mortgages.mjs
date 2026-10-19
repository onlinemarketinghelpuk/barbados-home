// Mortgages page: the mortgage forms (live Word files), from src/data/mortgages.json. Fills {{mg-…}} placeholders only.
export default function fillMortgages(html, { read, esc, fileType, revOf }) {
  if (!html.includes('{{mg-')) return html;
  const MG = JSON.parse(read('src/data/mortgages.json'));
  const forms = MG.forms.map(f => `          <li><span class="t">${esc(f.title)}<small>${esc(f.code)}${revOf(f.file) ? ' · Rev ' + revOf(f.file) : ''}</small></span>`
    + `<a class="dl" href="${esc(f.file)}" download aria-label="Download ${esc(f.code)} ${esc(f.title)} (${fileType(f.file)})"><svg aria-hidden="true"><use href="#dl"/></svg>${fileType(f.file)}</a></li>`).join('\n');
  return html.replace('{{mg-forms}}', forms).replaceAll('{{mg-count}}', MG.forms.length);
}
