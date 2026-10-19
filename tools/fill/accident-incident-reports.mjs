// Marine Safety Investigation Reports: ongoing investigations, then the completed reports (newest first), from src/data/accident-incident-reports.json
export default function fillReports(html, { read, esc, fileType }) {
  if (!html.includes('{{air-')) return html;
  const AR = JSON.parse(read('src/data/accident-incident-reports.json'));
  const when = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const reports = [...AR.reports].sort((a, b) => b.date.localeCompare(a.date));
  const row = r => {
    const files = r.files.map(f => `<a class="air-dl" href="${esc(f.file)}" aria-label="Open the ${esc(r.vessel)} ${esc(f.label.toLowerCase())} (${fileType(f.file)})"><svg aria-hidden="true"><use href="#dl"/></svg>${esc(f.label)} <i>${fileType(f.file)}</i></a>`).join('');
    return `          <li class="air-r" id="${r.id}" data-s="${esc(`${r.vessel} ${r.imo} ${when(r.date)}`.toLowerCase())}">`
      + `<div class="air-v"><h3 class="hull">${esc(r.vessel)}</h3><p class="air-imo">IMO ${esc(r.imo)}</p></div>`
      + `<p class="air-when"><span class="lb">Date of occurrence</span><time datetime="${r.date}">${when(r.date)}</time></p>`
      + `<div class="air-f">${files}</div></li>`;
  };
  const ongoing = AR.ongoing.length ? `        <ol class="air-list">\n${AR.ongoing.map(row).join('\n')}\n        </ol>`
    : `        <p class="air-none">No ongoing investigations are published at the moment.</p>`;
  const years = reports.map(r => r.date.slice(0, 4));
  return html.replace('{{air-ongoing}}', ongoing).replace('{{air-reports}}', reports.map(row).join('\n'))
    .replaceAll('{{air-count}}', reports.length).replaceAll('{{air-files}}', reports.reduce((a, r) => a + r.files.length, 0))
    .replaceAll('{{air-span}}', `${years[years.length - 1]}–${years[0]}`).replaceAll('{{air-accidents}}', esc(AR.contact.accidents));
}
