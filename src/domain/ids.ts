export function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${random}`;
}

export function createTeamDiscriminator(teamName: string, memberCount: number): string {
  const normalized = teamName.replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase() || 'TEAM';
  const suffix = (memberCount * 37 + teamName.length * 11).toString(36).toUpperCase().padStart(3, '0');
  return `${normalized}-${suffix}`;
}
