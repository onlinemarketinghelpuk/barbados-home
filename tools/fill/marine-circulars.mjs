// Marine Circulars: the register rows, topic chips and counts, from src/data/marine-circulars.json ({{mc-…}} placeholders)
export default function fillMarineCirculars(html, { read, esc }) {
  if (!html.includes('{{mc-')) return html;
  const MC = JSON.parse(read('src/data/marine-circulars.json'));
  const topic = Object.fromEntries(MC.topics.map(t => [t.id, t.name]));
  const day = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const newest = [...MC.circulars].sort((a, b) => b.date.localeCompare(a.date));
  const rows = newest.map((c, i) => {
    const order = c.no.slice(2) + c.no.slice(0, 2); // MC 052025 is circular 05 of 2025: sort by year, then number
    const s = `mc ${c.no} ${+c.no.slice(0, 2)} ${c.no.slice(2)} ${c.title} ${c.notice || ''} ${c.summary || ''} ${topic[c.topic]}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const name = `MC ${c.no} ${c.title}`;
    return `        <li class="mcr${i === 0 ? ' latest' : ''}" id="mc-${c.no}" data-topic="${c.topic}" data-date="${c.date}" data-order="${order}" data-s="${esc(s)}">`
      + `<p class="no">MC ${c.no}<small><time datetime="${c.date}">${day(c.date)}</time></small></p>`
      + `<div><h3 class="hull">${esc(c.title)}</h3><p class="meta"><span class="chip">${esc(topic[c.topic])}</span>${c.rev ? `<span class="chip">Rev ${esc(c.rev)}</span>` : ''}</p>`
      + (c.notice ? `<p class="to"><b>Notice to:</b> ${esc(c.notice)}</p>` : '') + (c.summary ? `<p class="x">${esc(c.summary)}</p>` : '') + `</div>`
      + `<p class="acts"><a class="read" href="${esc(c.post)}" aria-label="Read ${esc(name)}">Read</a>`
      + (c.file ? `<a href="${esc(c.file)}" aria-label="Download ${esc(name)} (PDF)"><svg aria-hidden="true"><use href="#dl"/></svg>PDF</a>` : '') + `</p></li>`;
  }).join('\n');
  const n = id => MC.circulars.filter(c => c.topic === id).length;
  const chips = [`          <button type="button" data-topic="all" aria-pressed="true">All <i>${MC.circulars.length}</i></button>`]
    .concat(MC.topics.filter(t => n(t.id)).map(t => `          <button type="button" data-topic="${t.id}" aria-pressed="false">${esc(t.name)} <i>${n(t.id)}</i></button>`)).join('\n');
  return html.replace('{{mc-rows}}', rows).replace('{{mc-chips}}', chips).replaceAll('{{mc-count}}', MC.circulars.length)
    .replaceAll('{{mc-latest}}', day(newest[0].date)).replaceAll('{{mc-all}}', esc(MC.all)).replaceAll('{{mc-list}}', esc(MC.list));
}
