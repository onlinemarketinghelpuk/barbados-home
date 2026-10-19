// News post: one page per post in src/data/news.json, its text from src/data/news-posts.json.
// The template marks its post with <!-- {{np-post:<slug>}} --> (the slug comes from the page's vars); placeholders: {{np-…}}
const SITE = 'https://barbadosmaritime.com/';
export default function fillNewsPost(html, { read, esc, fileType }) {
  if (!html.includes('{{np-')) return html;
  const slug = (/<!-- \{\{np-post:([\w-]+)\}\} -->\n?/.exec(html) || [])[1];
  if (!slug) return html;
  html = html.replace(/<!-- \{\{np-post:[\w-]+\}\} -->\n?/, '');
  const NW = JSON.parse(read('src/data/news.json')), NP = JSON.parse(read('src/data/news-posts.json')).posts;
  const slugOf = p => p.href.replace(SITE, '').replace(/\/$/, '');
  const i = NW.posts.findIndex(p => slugOf(p) === slug);
  if (i < 0) throw new Error(`news post not in news.json: ${slug}`);
  const card = NW.posts[i], post = NP[slug] || { body: '', words: 0 };
  const topic = Object.fromEntries(NW.topics.map(t => [t.id, t.name]));
  const day = d => new Date(d + 'T12:00:00Z');
  const long = d => day(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const live = card.href;

  // the body: figures in place of {{fig:n}}, outside links in a new tab, tables in a scrolling box
  const fig = n => {
    const f = (post.images || [])[n]; if (!f) return '';
    const tall = f.h > f.w * 1.1, small = f.w && f.w < 300;
    const cap = f.alt && !/\.(png|jpe?g|webp)$|^\d+$|^image/i.test(f.alt) ? `<figcaption>${esc(f.alt)}</figcaption>` : '';
    return `<figure class="np-fig${tall ? ' tall' : ''}${small ? ' small' : ''}"><img src="${esc(f.src)}" alt="${esc(f.alt || '')}"${f.w ? ` width="${f.w}" height="${f.h}"` : ''} loading="lazy">${cap}</figure>`;
  };
  let body = (post.body || '').replace(/\{\{fig:(\d+)\}\}/g, (all, n) => fig(+n))
    .replace(/<a href="(https?:\/\/(?!barbadosmaritime\.com)[^"]+)">/g, '<a href="$1" target="_blank" rel="noopener">')
    .replace(/<table>/g, '<div class="np-tw"><table>').replace(/<\/table>/g, '</table></div>');
  if (!body.replace(/<[^>]+>/g, '').trim() && !/<img/.test(body)) body = `<p class="np-empty">${post.files ? 'The full text of this post is in the download below.' : 'This post has no further text.'}</p>`;
  const files = post.files ? `<div class="np-files"><h2 class="hull">Downloads</h2><ul>${post.files.map(f => `<li><a href="${esc(f.file)}" target="_blank" rel="noopener">${esc(f.title)}<span><svg aria-hidden="true"><use href="#dl"/></svg>${fileType(f.file)}</span></a></li>`).join('')}</ul></div>` : '';
  const tags = post.tags ? `<ul class="np-tags" aria-label="Tags">${post.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '';

  // older / newer (news.json is newest first)
  const older = NW.posts[i + 1], newer = NW.posts[i - 1];
  const pg = (p, cls, k) => p ? `  <a class="${cls}" href="${esc(p.href)}"><span class="k">${k}</span><b>${esc(p.title)}</b></a>` : '';
  const pager = [pg(older, 'prev', '← Older post'), pg(newer, 'next', 'Newer post →')].filter(Boolean).join('\n');

  // more in the topic (or the latest news if the topic has no other posts), as News cards
  let rel = NW.posts.filter((p, j) => j !== i && p.topic === card.topic).slice(0, 3), inTopic = rel.length > 0;
  if (!inTopic) rel = NW.posts.filter((p, j) => j !== i).slice(0, 3);
  const related = rel.map(p => {
    const d = day(p.date), my = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    return `      <li class="nw"><a href="${esc(p.href)}"><figure><img src="${esc(p.img)}" alt="${esc(p.alt || '')}" loading="lazy"></figure>`
      + `<div class="b"><p class="meta"><span class="chip">${esc(topic[p.topic])}</span><time datetime="${p.date}"><span class="dd">${d.getUTCDate()}</span> <span class="my">${my}</span></time></p>`
      + `<h3 class="hull">${esc(p.title)}</h3><p class="x">${esc(p.excerpt)}</p><span class="go">Read more <svg class="ar"><use href="#ar"/></svg></span></div></a></li>`;
  }).join('\n');

  const topicHref = `../news-${card.topic}/index.html`;
  const enc = s => encodeURIComponent(s).replace(/'/g, '%27');
  return html.replace('{{np-body}}', body).replace('{{np-files}}', files).replace('{{np-tags}}', tags).replace('{{np-pager}}', pager).replace('{{np-related}}', related)
    .replaceAll('{{np-title}}', esc(card.title)).replaceAll('{{np-title-enc}}', esc(enc(card.title))).replaceAll('{{np-img}}', esc(card.img))
    .replaceAll('{{np-date}}', long(card.date)).replaceAll('{{np-date-iso}}', card.date).replaceAll('{{np-read}}', Math.max(1, Math.round((post.words || 0) / 200)))
    .replaceAll('{{np-topic}}', esc(topic[card.topic])).replaceAll('{{np-topic-href}}', topicHref)
    .replaceAll('{{np-live}}', esc(live)).replaceAll('{{np-live-enc}}', esc(enc(live)))
    .replaceAll('{{np-more-tag}}', inTopic ? esc(topic[card.topic]) : 'News').replaceAll('{{np-more-title}}', inTopic ? `More in <span>${esc(topic[card.topic])}</span>` : 'Latest <span>news</span>')
    .replaceAll('{{np-more-href}}', inTopic ? topicHref : `${SITE}category/news/`).replaceAll('{{np-more-all}}', inTopic ? `All ${esc(topic[card.topic])}` : 'All news');
}
