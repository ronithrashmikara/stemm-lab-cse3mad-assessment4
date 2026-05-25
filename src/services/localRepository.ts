import * as SQLite from 'expo-sqlite';

import type { AttemptRecord, TeamProfile } from '../types';

type AttemptRow = {
  id: string;
  teamId: string;
  activityId: string;
  activityTitle: string;
  memberName: string;
  payload: string;
  syncStatus: AttemptRecord['syncStatus'];
  createdAt: string;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('stemm_lab.db');
  }

  return databasePromise;
}

export async function initDatabase() {
  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS team_profile (
      id TEXT PRIMARY KEY NOT NULL,
      payload TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY NOT NULL,
      teamId TEXT NOT NULL,
      activityId TEXT NOT NULL,
      activityTitle TEXT NOT NULL,
      memberName TEXT NOT NULL,
      payload TEXT NOT NULL,
      syncStatus TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_attempts_team_created ON attempts(teamId, createdAt);
    CREATE INDEX IF NOT EXISTS idx_attempts_activity ON attempts(activityId);
  `);
}

export async function saveTeam(team: TeamProfile) {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO team_profile (id, payload, updatedAt) VALUES (?, ?, ?)',
    team.id,
    JSON.stringify(team),
    new Date().toISOString(),
  );
}

export async function getTeam(): Promise<TeamProfile | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ payload: string }>('SELECT payload FROM team_profile ORDER BY updatedAt DESC LIMIT 1');
  return row ? (JSON.parse(row.payload) as TeamProfile) : null;
}

export async function saveAttempt(attempt: AttemptRecord) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO attempts
      (id, teamId, activityId, activityTitle, memberName, payload, syncStatus, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    attempt.id,
    attempt.teamId,
    attempt.activityId,
    attempt.activityTitle,
    attempt.memberName,
    JSON.stringify(attempt),
    attempt.syncStatus,
    attempt.createdAt,
  );
}

export async function listAttempts(): Promise<AttemptRecord[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<AttemptRow>('SELECT * FROM attempts ORDER BY createdAt DESC');
  return rows.map((row) => JSON.parse(row.payload) as AttemptRecord);
}

export async function markAttemptSynced(attemptId: string, syncStatus: AttemptRecord['syncStatus']) {
  const db = await getDatabase();
  const row = await db.getFirstAsync<AttemptRow>('SELECT * FROM attempts WHERE id = ?', attemptId);
  if (!row) {
    return;
  }

  const attempt = JSON.parse(row.payload) as AttemptRecord;
  const nextAttempt = { ...attempt, syncStatus, localStatus: syncStatus === 'synced' ? 'synced' : attempt.localStatus };
  await saveAttempt(nextAttempt);
}

export async function exportAttemptsJson(): Promise<string> {
  const attempts = await listAttempts();
  return JSON.stringify({ exportedAt: new Date().toISOString(), attempts }, null, 2);
}
