export type ScreenKey = 'setup' | 'dashboard' | 'activity' | 'capture' | 'evidence' | 'sprints' | 'testing' | 'settings';

export type MeasurementKind =
  | 'time'
  | 'sound'
  | 'bend'
  | 'motion'
  | 'reaction'
  | 'breathing'
  | 'location'
  | 'video'
  | 'rating';

export type ActivityDefinition = {
  id: string;
  title: string;
  discipline: string;
  summary: string;
  targetQuestion: string;
  equipment: string[];
  instructions: string[];
  measurements: MeasurementKind[];
  curriculumLinks: string[];
  deviceFeatures: string[];
  safetyNote: string;
};

export type TeamProfile = {
  id: string;
  teamName: string;
  yearLevel: string;
  memberNames: string[];
  discriminator: string;
  createdAt: string;
};

export type SensorSnapshot = {
  accelerometerMagnitude: number;
  gyroscopeMagnitude: number;
  sampleCount: number;
};

export type DeviceContext = {
  batteryLevel: number | null;
  batteryState: string;
  locationPermission: string;
  notificationPermission: string;
  latitude: number | null;
  longitude: number | null;
};

export type MeasurementEntry = {
  prediction: string;
  outcome: string;
  unit: string;
  notes: string;
  rating: number;
};

export type AttemptRecord = {
  id: string;
  teamId: string;
  activityId: string;
  activityTitle: string;
  memberName: string;
  measurement: MeasurementEntry;
  deviceContext: DeviceContext;
  sensorSnapshot: SensorSnapshot;
  evidenceUri?: string;
  localStatus: 'draft' | 'ready' | 'synced';
  syncStatus: 'pending' | 'synced' | 'demo-mode' | 'failed';
  createdAt: string;
};

export type SprintEvidence = {
  id: string;
  title: string;
  weeks: string;
  goal: string;
  userStories: string[];
  deliverables: string[];
  evidence: string[];
};

export type ReadinessResult = {
  score: number;
  passed: string[];
  missing: string[];
};
