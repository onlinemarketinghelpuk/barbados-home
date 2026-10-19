// Marine Accident Reporting (casualty-investigations): fills the {{ci-…}} placeholders from src/data/casualty-investigations.json
export default (html, { read, esc, fileType, revOf }) => {
  if (!html.includes('{{ci-')) return html;
  const D = JSON.parse(read('src/data/casualty-investigations.json'));
  const p = s => `<p>${esc(s)}</p>`;
  const principles = D.principles.map((x, i) => `        <li class="ci-pr"><span class="n">0${i + 1}</span><p class="tag t">${esc(x.tag)}</p><h3 class="hull">${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('\n');
  const must = D.investigate.must.map(m => `            <li>${esc(m)}</li>`).join('\n');
  return html
    .replace('{{ci-duty}}', D.duty.map(p).join('\n        '))
    .replace('{{ci-principles}}', principles)
    .replace('{{ci-investigate}}', D.investigate.text.map(p).join('\n        '))
    .replace('{{ci-must}}', must)
    .replaceAll('{{ci-deadline}}', esc(D.deadline.text))
    .replaceAll('{{ci-reports}}', esc(D.reports.href))
    .replaceAll('{{ci-form-file}}', esc(D.form.file))
    .replaceAll('{{ci-form-code}}', esc(D.form.code))
    .replaceAll('{{ci-form-title}}', esc(D.form.title))
    .replaceAll('{{ci-form-type}}', fileType(D.form.file))
    .replaceAll('{{ci-form-rev}}', revOf(D.form.file) ?? '0');
};
