// Yacht Registration: fills the {{yr-…}} placeholders from src/data/yacht-registration.json
export default function fillYacht(html, { read, esc, fileType, revOf }) {
  if (!html.includes('{{yr-')) return html;
  const Y = JSON.parse(read('src/data/yacht-registration.json'));
  const c = Y.checklist, rev = revOf(c.file);
  return html
    .replaceAll('{{yr-intro}}', esc(Y.intro))
    .replaceAll('{{yr-cl-code}}', esc(c.code)).replaceAll('{{yr-cl-title}}', esc(c.title)).replaceAll('{{yr-cl-about}}', esc(c.about))
    .replaceAll('{{yr-cl-file}}', esc(c.file)).replaceAll('{{yr-cl-type}}', fileType(c.file)).replaceAll('{{yr-cl-rev}}', rev ? `Rev ${rev}` : '')
    .replaceAll('{{yr-commercial}}', esc(Y.inspection.commercial)).replaceAll('{{yr-private}}', esc(Y.inspection.private))
    .replaceAll('{{yr-contact}}', esc(Y.contact));
}
