import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { calculateLeaderboardScore, summarizeAttempt } from '../domain/calculations';
import { exportAttemptsJson } from '../services/localRepository';
import type { AttemptRecord, ScreenKey, TeamProfile } from '../types';
import { PrimaryButton, SectionCard, StatusPill } from '../ui/components';
import { colors, globalStyles } from '../ui/theme';

type Props = {
  team: TeamProfile | null;
  attempts: AttemptRecord[];
  onRefresh: () => Promise<void>;
  onNavigate: (screen: ScreenKey) => void;
};

export function EvidenceScreen({ team, attempts, onRefresh, onNavigate }: Props) {
  const [exportText, setExportText] = useState('');
  const score = useMemo(
    () => (attempts.length ? Math.round(attempts.reduce((total, attempt) => total + calculateLeaderboardScore(attempt), 0) / attempts.length) : 0),
    [attempts],
  );

  const exportEvidence = async () => {
    setExportText(await exportAttemptsJson());
  };

  return (
    <View style={styles.stack}>
      <SectionCard title="Evidence package">
        <Text style={globalStyles.body}>
          These records are saved in local SQLite. Use this screen during presentation to show data persistence, evidence,
          sync status, sensor samples, GPS/battery context, and team contribution records.
        </Text>
        <View style={styles.wrap}>
          <StatusPill label={team?.teamName ?? 'No team'} tone={team ? 'good' : 'bad'} />
          <StatusPill label={`${attempts.length} attempts`} tone={attempts.length ? 'good' : 'warn'} />
          <StatusPill label={`Average evidence score ${score}`} tone={score > 60 ? 'good' : 'warn'} />
        </View>
        <View style={styles.actions}>
          <PrimaryButton label="Refresh" variant="secondary" onPress={onRefresh} />
          <PrimaryButton label="Export JSON" variant="secondary" onPress={exportEvidence} />
          <PrimaryButton label="Dashboard" variant="ghost" onPress={() => onNavigate('dashboard')} />
        </View>
      </SectionCard>

      {attempts.map((attempt) => (
        <SectionCard key={attempt.id} title={attempt.activityTitle}>
          <Text style={styles.summary}>{summarizeAttempt(attempt)}</Text>
          <Text style={globalStyles.muted}>
            Member: {attempt.memberName} | Rating: {attempt.measurement.rating}/5 | Sync: {attempt.syncStatus}
          </Text>
          <Text style={globalStyles.muted}>
            Sensor samples: {attempt.sensorSnapshot.sampleCount} | Battery:{' '}
            {attempt.deviceContext.batteryLevel === null ? 'not sampled' : `${Math.round(attempt.deviceContext.batteryLevel * 100)}%`}
          </Text>
          <Text style={globalStyles.body}>{attempt.measurement.notes}</Text>
          {attempt.evidenceUri && <StatusPill label={`Evidence: ${attempt.evidenceUri}`} tone="good" />}
        </SectionCard>
      ))}

      {exportText.length > 0 && (
        <SectionCard title="Export preview">
          <Text selectable style={styles.exportText}>
            {exportText.slice(0, 3000)}
            {exportText.length > 3000 ? '\n...export truncated in preview...' : ''}
          </Text>
        </SectionCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14,
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
  summary: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
  exportText: {
    fontFamily: 'Courier',
    color: colors.text,
    fontSize: 11,
    lineHeight: 15,
  },
});
