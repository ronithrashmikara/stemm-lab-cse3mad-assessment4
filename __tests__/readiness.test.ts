import { ACTIVITY_CATALOGUE } from '../src/data/activities';
import { SPRINTS } from '../src/data/sprints';
import { calculateReadinessScore } from '../src/domain/readiness';
import type { AttemptRecord, TeamProfile } from '../src/types';

const team: TeamProfile = {
  id: 'T1',
  teamName: 'STEMM Winners',
  yearLevel: 'Year 7',
  memberNames: ['Kaveeja', 'Partner'],
  discriminator: 'STEM-123',
  createdAt: '2026-05-22T10:00:00.000Z',
};

function attempt(id: string, activityId: string): AttemptRecord {
  return {
    id,
    teamId: team.id,
    activityId,
    activityTitle: ACTIVITY_CATALOGUE.find((activity) => activity.id === activityId)?.title ?? activityId,
    memberName: 'Kaveeja',
    measurement: { prediction: 'Prediction', outcome: '10', unit: 'seconds', notes: 'Complete evidence notes', rating: 4 },
    deviceContext: {
      batteryLevel: 0.7,
      batteryState: 'UNPLUGGED',
      locationPermission: 'granted',
      notificationPermission: 'granted',
      latitude: -37.72,
      longitude: 145.04,
    },
    sensorSnapshot: { accelerometerMagnitude: 0.8, gyroscopeMagnitude: 0.2, sampleCount: 8 },
    evidenceUri: 'video.mp4',
    localStatus: 'synced',
    syncStatus: 'demo-mode',
    createdAt: '2026-05-22T10:00:00.000Z',
  };
}

describe('integration tests: rubric readiness', () => {
  test('reports missing work before team and attempts exist', () => {
    const result = calculateReadinessScore({ team: null, attempts: [], activities: ACTIVITY_CATALOGUE, sprints: SPRINTS });
    expect(result.score).toBeLessThan(50);
    expect(result.missing).toContain('Team profile created');
    expect(result.passed).toContain('All seven STEMM activities available');
  });

  test('reaches full readiness when evidence covers team, sprints, sensors, sync, and videos', () => {
    const attempts = [
      attempt('A1', 'parachute-drop'),
      attempt('A2', 'sound-pollution'),
      attempt('A3', 'earthquake-structure'),
    ];
    const result = calculateReadinessScore({ team, attempts, activities: ACTIVITY_CATALOGUE, sprints: SPRINTS });
    expect(result.score).toBe(100);
    expect(result.missing).toHaveLength(0);
  });
});
