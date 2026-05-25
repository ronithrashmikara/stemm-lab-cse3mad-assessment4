import {
  calculateAcceleration,
  calculateGForce,
  calculateLeaderboardScore,
  calculateVelocityFromDrop,
  classifySoundRisk,
  estimateMotionStability,
  isMeasurementComplete,
} from '../src/domain/calculations';
import type { AttemptRecord } from '../src/types';

describe('unit tests: STEMM calculations', () => {
  test('calculates drop velocity and acceleration', () => {
    expect(calculateVelocityFromDrop(2, 1.25)).toBe(1.6);
    expect(calculateAcceleration(1.6, 1.25)).toBe(1.28);
  });

  test('calculates impact g-force for parachute evidence', () => {
    expect(calculateGForce(2, 0.05)).toBe(4.08);
  });

  test('classifies classroom sound risk', () => {
    expect(classifySoundRisk(45)).toContain('Safe');
    expect(classifySoundRisk(92)).toContain('possible');
    expect(classifySoundRisk(123)).toContain('Immediate');
  });

  test('classifies motion stability from sensor snapshots', () => {
    expect(estimateMotionStability({ accelerometerMagnitude: 0.4, gyroscopeMagnitude: 0.2, sampleCount: 8 })).toBe('Stable');
    expect(estimateMotionStability({ accelerometerMagnitude: 1.8, gyroscopeMagnitude: 0.7, sampleCount: 8 })).toBe('Moderate movement');
    expect(estimateMotionStability({ accelerometerMagnitude: 3.1, gyroscopeMagnitude: 1.1, sampleCount: 8 })).toBe('High movement');
  });

  test('validates measurement completion', () => {
    expect(isMeasurementComplete({ prediction: 'slowest', outcome: '1.8', unit: 'seconds', notes: 'large canopy worked', rating: 5 })).toBe(true);
    expect(isMeasurementComplete({ prediction: '', outcome: '1.8', unit: 'seconds', notes: 'missing prediction', rating: 3 })).toBe(false);
  });
});

describe('unit tests: leaderboard scoring', () => {
  test('awards score for rating, evidence, sync, and sensors', () => {
    const attempt: AttemptRecord = {
      id: 'A1',
      teamId: 'T1',
      activityId: 'earthquake-structure',
      activityTitle: 'Earthquake-Resistant Structure',
      memberName: 'Student',
      measurement: { prediction: '4 folds', outcome: '1.2', unit: 'cm', notes: 'less movement', rating: 5 },
      sensorSnapshot: { accelerometerMagnitude: 0.7, gyroscopeMagnitude: 0.4, sampleCount: 12 },
      deviceContext: {
        batteryLevel: 0.82,
        batteryState: 'FULL',
        locationPermission: 'granted',
        notificationPermission: 'granted',
        latitude: -37.721,
        longitude: 145.048,
      },
      evidenceUri: 'videos/earthquake-1.mp4',
      localStatus: 'synced',
      syncStatus: 'synced',
      createdAt: '2026-05-22T10:00:00.000Z',
    };

    expect(calculateLeaderboardScore(attempt)).toBe(75);
  });
});
