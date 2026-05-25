import { StyleSheet, Text, View } from 'react-native';

import type { ActivityDefinition } from '../types';
import { PrimaryButton, SectionCard, StatusPill } from '../ui/components';
import { colors, globalStyles } from '../ui/theme';

type Props = {
  activity: ActivityDefinition;
  onStart: (activity: ActivityDefinition) => void;
  onBack: () => void;
};

export function ActivityScreen({ activity, onStart, onBack }: Props) {
  return (
    <View style={styles.stack}>
      <SectionCard title={activity.title}>
        <StatusPill label={activity.discipline} tone="neutral" />
        <Text style={globalStyles.body}>{activity.summary}</Text>
        <Text style={styles.question}>{activity.targetQuestion}</Text>
        <PrimaryButton label="Record an attempt" onPress={() => onStart(activity)} />
        <PrimaryButton label="Back to dashboard" variant="ghost" onPress={onBack} />
      </SectionCard>

      <SectionCard title="Instructions">
        {activity.instructions.map((instruction, index) => (
          <Text key={instruction} style={globalStyles.body}>
            {index + 1}. {instruction}
          </Text>
        ))}
      </SectionCard>

      <SectionCard title="Equipment and features">
        <View style={styles.wrap}>
          {activity.equipment.map((item) => (
            <StatusPill key={item} label={item} />
          ))}
        </View>
        <Text style={styles.subheading}>Device features</Text>
        <View style={styles.wrap}>
          {activity.deviceFeatures.map((feature) => (
            <StatusPill key={feature} label={feature} tone="good" />
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Safety and curriculum">
        <Text style={globalStyles.body}>{activity.safetyNote}</Text>
        <View style={styles.wrap}>
          {activity.curriculumLinks.map((link) => (
            <StatusPill key={link} label={link} tone="warn" />
          ))}
        </View>
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14,
  },
  question: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    backgroundColor: colors.softBlue,
    padding: 12,
    borderRadius: 8,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subheading: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
});
