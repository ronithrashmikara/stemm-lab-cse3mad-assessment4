import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { calculateGForce, classifySoundRisk, estimateMotionStability, isMeasurementComplete } from '../domain/calculations';
import { createId } from '../domain/ids';
import { getDeviceContext, requestSensorSnapshot, scheduleChallengeReminder } from '../services/deviceServices';
import { syncAttemptToFirestore } from '../services/firebaseRest';
import type { ActivityDefinition, AttemptRecord, DeviceContext, MeasurementEntry, SensorSnapshot, TeamProfile } from '../types';
import { PrimaryButton, SectionCard, StatusPill } from '../ui/components';
import { colors, globalStyles } from '../ui/theme';

type Props = {
  activity: ActivityDefinition;
  team: TeamProfile | null;
  onCancel: () => void;
  onSaved: (attempt: AttemptRecord) => Promise<void>;
};

const emptyDevice: DeviceContext = {
  batteryLevel: null,
  batteryState: 'UNKNOWN',
  locationPermission: 'undetermined',
  notificationPermission: 'undetermined',
  latitude: null,
  longitude: null,
};

const emptySensor: SensorSnapshot = {
  accelerometerMagnitude: 0,
  gyroscopeMagnitude: 0,
  sampleCount: 0,
};

export function CaptureScreen({ activity, team, onCancel, onSaved }: Props) {
  const [memberName, setMemberName] = useState(team?.memberNames[0] ?? '');
  const [prediction, setPrediction] = useState('');
  const [outcome, setOutcome] = useState('');
  const [unit, setUnit] = useState(defaultUnit(activity.id));
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState('4');
  const [evidenceUri, setEvidenceUri] = useState('');
  const [device, setDevice] = useState<DeviceContext>(emptyDevice);
  const [sensor, setSensor] = useState<SensorSnapshot>(emptySensor);
  const [busy, setBusy] = useState(false);

  const measurement: MeasurementEntry = {
    prediction,
    outcome,
    unit,
    notes,
    rating: Number(rating) || 0,
  };

  const canSave = Boolean(team && memberName.trim() && isMeasurementComplete(measurement));

  const sampleDevice = async () => {
    setBusy(true);
    const [deviceContext, sensorSnapshot] = await Promise.all([getDeviceContext(), requestSensorSnapshot()]);
    setDevice(deviceContext);
    setSensor(sensorSnapshot);
    setBusy(false);
  };

  const save = async () => {
    if (!team || !canSave) {
      return;
    }

    setBusy(true);
    const baseAttempt: AttemptRecord = {
      id: createId('ATTEMPT'),
      teamId: team.id,
      activityId: activity.id,
      activityTitle: activity.title,
      memberName: memberName.trim(),
      measurement,
      evidenceUri: evidenceUri.trim() || undefined,
      deviceContext: device,
      sensorSnapshot: sensor,
      localStatus: 'ready',
      syncStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    let syncStatus: AttemptRecord['syncStatus'] = 'pending';
    try {
      syncStatus = await syncAttemptToFirestore(baseAttempt);
    } catch {
      syncStatus = 'failed';
    }

    await onSaved({ ...baseAttempt, syncStatus, localStatus: syncStatus === 'synced' ? 'synced' : 'ready' });
    setBusy(false);
  };

  const queueReminder = async () => {
    const message = await scheduleChallengeReminder(activity.title);
    Alert.alert('Notification', message);
  };

  return (
    <View style={styles.stack}>
      <SectionCard title={`Record: ${activity.title}`}>
        <Text style={globalStyles.body}>
          Save a prediction, outcome, notes, device context, and evidence reference. This record is stored in SQLite and
          sent through the Firestore sync adapter when Firebase env values are configured.
        </Text>
        {!team && <StatusPill label="Create a team profile first" tone="bad" />}
      </SectionCard>

      <SectionCard title="Attempt details">
        <Input label="Team member" value={memberName} onChangeText={setMemberName} placeholder="Member name" />
        <Input label="Prediction" value={prediction} onChangeText={setPrediction} placeholder="What do you expect?" />
        <Input label="Outcome" value={outcome} onChangeText={setOutcome} placeholder="Measured result" />
        <Input label="Unit" value={unit} onChangeText={setUnit} placeholder="seconds, dB, cm, bpm" />
        <Input label="Notes and reflection" value={notes} onChangeText={setNotes} placeholder="What changed? What worked?" multiline />
        <Input label="Evidence URI or file name" value={evidenceUri} onChangeText={setEvidenceUri} placeholder="video/parachute-test-1.mp4" />
        <Input label="Team rating 1-5" value={rating} onChangeText={setRating} placeholder="4" keyboardType="numeric" />
      </SectionCard>

      <SectionCard title="Device evidence">
        <View style={styles.wrap}>
          <StatusPill label={`Battery ${device.batteryLevel === null ? 'not sampled' : `${Math.round(device.batteryLevel * 100)}%`}`} />
          <StatusPill label={`GPS ${device.latitude === null ? 'not tagged' : 'tagged'}`} tone={device.latitude === null ? 'warn' : 'good'} />
          <StatusPill label={`Sensor samples ${sensor.sampleCount}`} tone={sensor.sampleCount ? 'good' : 'warn'} />
        </View>
        <Text style={styles.analysis}>{analysisFor(activity.id, outcome, sensor)}</Text>
        <View style={styles.actions}>
          <PrimaryButton label={busy ? 'Sampling...' : 'Sample sensors, GPS, battery'} onPress={sampleDevice} disabled={busy} />
          <PrimaryButton label="Queue reminder notification" variant="secondary" onPress={queueReminder} />
        </View>
      </SectionCard>

      <View style={styles.actions}>
        <PrimaryButton label={busy ? 'Saving...' : 'Save locally and sync'} onPress={save} disabled={!canSave || busy} />
        <PrimaryButton label="Cancel" variant="ghost" onPress={onCancel} />
      </View>
    </View>
  );
}

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function defaultUnit(activityId: string) {
  if (activityId === 'sound-pollution') {
    return 'dB';
  }
  if (activityId === 'breathing-trainer') {
    return 'breaths/min';
  }
  if (activityId === 'reaction-board') {
    return 'ms';
  }
  return 'seconds';
}

function analysisFor(activityId: string, outcome: string, snapshot: SensorSnapshot) {
  const numeric = Number.parseFloat(outcome);
  if (activityId === 'sound-pollution' && Number.isFinite(numeric)) {
    return classifySoundRisk(numeric);
  }
  if (activityId === 'parachute-drop' && Number.isFinite(numeric)) {
    return `Example g-force if contact time is 0.05 s: ${calculateGForce(numeric, 0.05)} g`;
  }
  if (snapshot.sampleCount > 0) {
    return `Motion classification: ${estimateMotionStability(snapshot)}`;
  }
  return 'Sample sensors or enter an outcome to generate analysis for the report.';
}

const styles = StyleSheet.create({
  stack: {
    gap: 14,
  },
  field: {
    gap: 6,
  },
  label: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  input: {
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    color: colors.text,
    fontSize: 15,
  },
  textArea: {
    minHeight: 92,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  analysis: {
    color: colors.primary,
    fontWeight: '700',
    backgroundColor: colors.softGreen,
    padding: 10,
    borderRadius: 8,
    lineHeight: 19,
  },
});
