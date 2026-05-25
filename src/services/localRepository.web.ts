import type { AttemptRecord, TeamProfile } from '../types';

const TEAM_KEY = 'stemm-lab-team';
const ATTEMPTS_KEY = 'stemm-lab-attempts';

export async function initDatabase() {
  if (!globalThis.localStorage.getItem(ATTEMPTS_KEY)) {
    globalThis.localStorage.setItem(ATTEMPTS_KEY, '[]');
  }
}

export async function saveTeam(team: TeamProfile) {
  globalThis.localStorage.setItem(TEAM_KEY, JSON.stringify(team));
}

export async function getTeam(): Promise<TeamProfile | null> {
  const raw = globalThis.localStorage.getItem(TEAM_KEY);
  return raw ? (JSON.parse(raw) as TeamProfile) : null;
}

export async function saveAttempt(attempt: AttemptRecord) {
  const attempts = await listAttempts();
  const withoutExisting = attempts.filter((item) => item.id !== attempt.id);
  globalThis.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify([attempt, ...withoutExisting]));
}

export async function listAttempts(): Promise<AttemptRecord[]> {
  const raw = globalThis.localStorage.getItem(ATTEMPTS_KEY);
  return raw ? (JSON.parse(raw) as AttemptRecord[]) : [];
}

export async function markAttemptSynced(attemptId: string, syncStatus: AttemptRecord['syncStatus']) {
  const attempts = await listAttempts();
  const nextAttempts = attempts.map((attempt) =>
    attempt.id === attemptId
      ? { ...attempt, syncStatus, localStatus: syncStatus === 'synced' ? 'synced' : attempt.localStatus }
      : attempt,
  );
  globalThis.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(nextAttempts));
}

export async function exportAttemptsJson(): Promise<string> {
  const attempts = await listAttempts();
  return JSON.stringify({ exportedAt: new Date().toISOString(), attempts }, null, 2);
}
