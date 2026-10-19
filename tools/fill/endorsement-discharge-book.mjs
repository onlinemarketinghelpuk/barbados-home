// Endorsement & Discharge Book page: key facts, the four steps and the PPS01-F01 download, from src/data/endorsement-discharge-book.json. Fills {{edb-…}} placeholders only.
export default function fillEndorsement(html, { read, esc, fileType, revOf }) {
  if (!html.includes('{{edb-')) return html;
  const D = JSON.parse(read('src/data/endorsement-discharge-book.json')), f = D.form;
  const dl = cls => `<a class="${cls}" href="${esc(f.file)}" download aria-label="Download ${esc(f.code)} ${esc(f.title)} (${fileType(f.file)})"><svg aria-hidden="true"><use href="#dl"/></svg>${esc(f.code)} · ${fileType(f.file)}</a>`;
  const facts = D.facts.map(x => `        <li><p class="tag">${esc(x.k)}</p><b class="hull">${esc(x.v)}</b><p>${esc(x.d)}</p></li>`).join('\n');
  const steps = D.steps.map((s, i) => `        <li><span class="n">0${i + 1}</span><div><h3 class="hull">${esc(s.t)}</h3><p>${esc(s.d)}</p>${s.form ? dl('edb-dl') : ''}</div></li>`).join('\n');
  return html.replace('{{edb-facts}}', facts).replace('{{edb-steps}}', steps)
    .replaceAll('{{edb-form-file}}', esc(f.file)).replaceAll('{{edb-form-code}}', esc(f.code)).replaceAll('{{edb-form-title}}', esc(f.title))
    .replaceAll('{{edb-form-type}}', fileType(f.file)).replaceAll('{{edb-form-rev}}', revOf(f.file) || '').replaceAll('{{edb-portal}}', esc(D.portal));
}
