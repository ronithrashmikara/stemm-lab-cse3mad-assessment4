import type { ActivityDefinition, AttemptRecord, ReadinessResult, SprintEvidence, TeamProfile } from '../types';

type ReadinessInput = {
  team: TeamProfile | null;
  attempts: AttemptRecord[];
  activities: ActivityDefinition[];
  sprints: SprintEvidence[];
};

export function calculateReadinessScore(input: ReadinessInput): ReadinessResult {
  const checks = [
    {
      label: 'Team profile created',
      passed: Boolean(input.team && input.team.memberNames.length > 0),
    },
    {
      label: 'All seven STEMM activities available',
      passed: input.activities.length >= 7,
    },
    {
      label: 'At least three sprint plans documented',
      passed: input.sprints.length >= 3,
    },
    {
      label: 'At least three activity attempts saved',
      passed: input.attempts.length >= 3,
    },
    {
      label: 'Sensor/device evidence captured',
      passed: input.attempts.some((attempt) => attempt.sensorSnapshot.sampleCount > 0),
    },
    {
      label: 'Location or battery context captured',
      passed: input.attempts.some((attempt) => attempt.deviceContext.latitude !== null || attempt.deviceContext.batteryLevel !== null),
    },
    {
      label: 'Firestore sync path demonstrated',
      passed: input.attempts.some((attempt) => attempt.syncStatus === 'synced' || attempt.syncStatus === 'demo-mode'),
    },
    {
      label: 'Evidence URI or video reference included',
      passed: input.attempts.some((attempt) => Boolean(attempt.evidenceUri)),
    },
  ];

  const passed = checks.filter((check) => check.passed).map((check) => check.label);
  const missing = checks.filter((check) => !check.passed).map((check) => check.label);
  const score = Math.round((passed.length / checks.length) * 100);

  return { score, passed, missing };
}
