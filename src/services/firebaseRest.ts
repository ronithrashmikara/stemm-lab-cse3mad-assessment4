import type { AttemptRecord, TeamProfile } from '../types';

type FirebaseConfig = {
  apiKey?: string;
  projectId?: string;
};

const config: FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(config.apiKey && config.projectId);
}

export async function syncTeamToFirestore(team: TeamProfile): Promise<'synced' | 'demo-mode'> {
  if (!isFirebaseConfigured()) {
    return 'demo-mode';
  }

  await writeDocument(`teams/${team.id}`, team);
  return 'synced';
}

export async function syncAttemptToFirestore(attempt: AttemptRecord): Promise<'synced' | 'demo-mode'> {
  if (!isFirebaseConfigured()) {
    return 'demo-mode';
  }

  await writeDocument(`teams/${attempt.teamId}/attempts/${attempt.id}`, attempt);
  return 'synced';
}

async function writeDocument(path: string, data: Record<string, unknown>) {
  const endpoint = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${path}?key=${config.apiKey}`;
  const response = await fetch(endpoint, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Firestore sync failed: ${response.status} ${text}`);
  }
}

function toFirestoreFields(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((fields, [key, item]) => {
    fields[key] = toFirestoreValue(item);
    return fields;
  }, {});
}

function toFirestoreValue(value: unknown): Record<string, unknown> {
  if (typeof value === 'string') {
    return { stringValue: value };
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: value } : { doubleValue: value };
  }

  if (typeof value === 'boolean') {
    return { booleanValue: value };
  }

  if (value === null || value === undefined) {
    return { nullValue: null };
  }

  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }

  return { mapValue: { fields: toFirestoreFields(value) } };
}
