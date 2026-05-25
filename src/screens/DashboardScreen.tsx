import { Pressable, StyleSheet, Text, View } from 'react-native';

import { calculateLeaderboardScore } from '../domain/calculations';
import type { ActivityDefinition, AttemptRecord, DeviceContext, ReadinessResult, ScreenKey, TeamProfile } from '../types';
import { MetricTile, PrimaryButton, SectionCard, StatusPill } from '../ui/components';
import { colors, globalStyles } from '../ui/theme';

type Props = {
  team: TeamProfile | null;
  attempts: AttemptRecord[];
  activities: ActivityDefinition[];
  readiness: ReadinessResult;
  deviceContext: DeviceContext | null;
  onOpenActivity: (activity: ActivityDefinition) => void;
  onNavigate: (screen: ScreenKey) => void;
};

export function DashboardScreen({ team, attempts, activities, readiness, deviceContext, onOpenActivity, onNavigate }: Props) {
  const completedActivities = new Set(attempts.map((attempt) => attempt.activityId)).size;
  const bestScore = attempts.length ? Math.max(...attempts.map(calculateLeaderboardScore)) : 0;

  return (
    <View style={styles.stack}>
      <SectionCard title="Product dashboard">
        <Text style={globalStyles.body}>
          {team
            ? `${team.teamName} (${team.discriminator}) is ready to collect STEMM activity evidence.`
            : 'Create a team profile before recording attempts.'}
        </Text>
        <View style={styles.metrics}>
          <MetricTile label="Activities covered" value={`${completedActivities}/${activities.length}`} />
          <MetricTile label="Saved attempts" value={attempts.length} />
          <MetricTile label="Best evidence score" value={bestScore} />
        </View>
        <View style={styles.actions}>
          <PrimaryButton label="Evidence" variant="secondary" onPress={() => onNavigate('evidence')} />
          <PrimaryButton label="Sprints" variant="secondary" onPress={() => onNavigate('sprints')} />
          <PrimaryButton label="Testing" variant="secondary" onPress={() => onNavigate('testing')} />
          <PrimaryButton label="Settings" variant="secondary" onPress={() => onNavigate('settings')} />
        </View>
      </SectionCard>

      <SectionCard title="Rubric readiness">
        {readiness.passed.map((item) => (
          <StatusPill key={item} label={item} tone="good" />
        ))}
        {readiness.missing.map((item) => (
          <StatusPill key={item} label={`Need: ${item}`} tone="warn" />
        ))}
      </SectionCard>

      <SectionCard title="Device context">
        <Text style={globalStyles.muted}>
          Battery: {deviceContext?.batteryLevel !== null && deviceContext?.batteryLevel !== undefined
            ? `${Math.round(deviceContext.batteryLevel * 100)}%`
            : 'not sampled'}{' '}
          | Location: {deviceContext?.locationPermission ?? 'unknown'} | Notifications:{' '}
          {deviceContext?.notificationPermission ?? 'unknown'}
        </Text>
      </SectionCard>

      <SectionCard title="STEMM activities">
        {activities.map((activity) => {
          const hasAttempt = attempts.some((attempt) => attempt.activityId === activity.id);
          return (
            <Pressable key={activity.id} style={styles.activityRow} onPress={() => onOpenActivity(activity)}>
              <View style={styles.activityText}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityMeta}>{activity.discipline}</Text>
              </View>
              <StatusPill label={hasAttempt ? 'Evidence saved' : 'Start'} tone={hasAttempt ? 'good' : 'neutral'} />
            </Pressable>
          );
        })}
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityRow: {
    minHeight: 66,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    backgroundColor: colors.surfaceAlt,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
  activityMeta: {
    ...globalStyles.muted,
  },
});
