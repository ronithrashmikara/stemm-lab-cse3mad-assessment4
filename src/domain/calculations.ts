import type { AttemptRecord, MeasurementEntry, SensorSnapshot } from '../types';

export function calculateVelocityFromDrop(heightMeters: number, timeSeconds: number): number {
  if (heightMeters <= 0 || timeSeconds <= 0) {
    return 0;
  }

  return Number((heightMeters / timeSeconds).toFixed(2));
}

export function calculateAcceleration(finalVelocity: number, timeSeconds: number): number {
  if (timeSeconds <= 0) {
    return 0;
  }

  return Number((finalVelocity / timeSeconds).toFixed(2));
}

export function calculateGForce(impactVelocity: number, contactTimeSeconds: number): number {
  if (contactTimeSeconds <= 0) {
    return 0;
  }

  return Number((Math.abs(impactVelocity) / contactTimeSeconds / 9.81).toFixed(2));
}

export function classifySoundRisk(decibels: number): string {
  if (decibels < 60) {
    return 'Safe for long classroom exposure';
  }

  if (decibels < 85) {
    return 'Usually safe, but can cause fatigue';
  }

  if (decibels < 100) {
    return 'Hearing damage possible with long exposure';
  }

  if (decibels < 120) {
    return 'Hearing damage likely after short exposure';
  }

  return 'Immediate damage risk; avoid this sound level';
}

export function estimateMotionStability(snapshot: SensorSnapshot): string {
  const motion = snapshot.accelerometerMagnitude + snapshot.gyroscopeMagnitude;

  if (motion < 1.2) {
    return 'Stable';
  }

  if (motion < 3) {
    return 'Moderate movement';
  }

  return 'High movement';
}

export function calculateLeaderboardScore(attempt: AttemptRecord): number {
  const ratingScore = attempt.measurement.rating * 10;
  const evidenceBonus = attempt.evidenceUri ? 10 : 0;
  const syncBonus = attempt.syncStatus === 'synced' || attempt.syncStatus === 'demo-mode' ? 5 : 0;
  const sensorBonus = attempt.sensorSnapshot.sampleCount > 0 ? 10 : 0;

  return Math.min(100, ratingScore + evidenceBonus + syncBonus + sensorBonus);
}

export function isMeasurementComplete(measurement: MeasurementEntry): boolean {
  return Boolean(measurement.prediction.trim() && measurement.outcome.trim() && measurement.notes.trim());
}

export function summarizeAttempt(attempt: AttemptRecord): string {
  return `${attempt.activityTitle}: ${attempt.measurement.outcome} ${attempt.measurement.unit}`.trim();
}
