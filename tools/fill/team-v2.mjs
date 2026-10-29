// Team page, departments layout (src/team-v2.html): each department panel shows its team's intro and head count from src/data/team.json
// Placeholders: {{team-intro-of:<team id>}} {{team-size-of:<team id>}} (the cards themselves use the build's {{team-of:<team id>}})
export default function fillTeamV2(html, { read, esc }) {
  if (!html.includes('{{team-intro-of:') && !html.includes('{{team-size-of:')) return html;
  const T = JSON.parse(read('src/data/team.json'));
  const team = id => {
    const t = T.teams.find(x => x.id === id);
    if (!t) throw new Error(`src/data/team.json has no team "${id}"`);
    return t;
  };
  return html.replace(/\{\{team-intro-of:(\w+)\}\}/g, (m, id) => esc(team(id).intro))
    .replace(/\{\{team-size-of:(\w+)\}\}/g, (m, id) => T.people.filter(p => p.team === team(id).id).length);
}
