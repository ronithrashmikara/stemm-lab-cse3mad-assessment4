import { ACTIVITY_CATALOGUE } from '../src/data/activities';
import { SPRINTS } from '../src/data/sprints';
import { createId, createTeamDiscriminator } from '../src/domain/ids';

describe('end-to-end style data workflow tests', () => {
  test('catalogue includes required STEMM activities and device features', () => {
    expect(ACTIVITY_CATALOGUE).toHaveLength(7);
    expect(ACTIVITY_CATALOGUE.some((activity) => activity.deviceFeatures.join(' ').includes('Accelerometer'))).toBe(true);
    expect(ACTIVITY_CATALOGUE.some((activity) => activity.deviceFeatures.join(' ').includes('GPS'))).toBe(true);
    expect(ACTIVITY_CATALOGUE.every((activity) => activity.instructions.length >= 3)).toBe(true);
  });

  test('sprint records document the required three agile sprints', () => {
    expect(SPRINTS).toHaveLength(3);
    expect(SPRINTS[0].weeks).toBe('Weeks 3-5');
    expect(SPRINTS[1].weeks).toBe('Weeks 6-8');
    expect(SPRINTS[2].weeks).toBe('Weeks 9-11');
    expect(SPRINTS.every((sprint) => sprint.userStories.length >= 3)).toBe(true);
  });

  test('team IDs and discriminators are stable enough for evidence exports', () => {
    expect(createId('TEAM')).toMatch(/^TEAM-/);
    expect(createTeamDiscriminator('STEMM Lab Team', 2)).toMatch(/^STEM-/);
  });
});
