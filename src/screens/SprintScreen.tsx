import { StyleSheet, Text, View } from 'react-native';

import type { ScreenKey, SprintEvidence } from '../types';
import { PrimaryButton, SectionCard, StatusPill } from '../ui/components';
import { colors, globalStyles } from '../ui/theme';

type Props = {
  sprints: SprintEvidence[];
  onNavigate: (screen: ScreenKey) => void;
};

export function SprintScreen({ sprints, onNavigate }: Props) {
  return (
    <View style={styles.stack}>
      <SectionCard title="Sprint board evidence">
        <Text style={globalStyles.body}>
          This screen is the in-app explanation of the three Agile-style sprints required by the assessment. Pair it with
          Azure DevOps, Trello, Jira, or GitHub Project screenshots in the final zip.
        </Text>
        <PrimaryButton label="Back to dashboard" variant="ghost" onPress={() => onNavigate('dashboard')} />
      </SectionCard>

      {sprints.map((sprint) => (
        <SectionCard key={sprint.id} title={`${sprint.title}: ${sprint.weeks}`}>
          <StatusPill label={sprint.goal} tone="good" />
          <Text style={styles.subheading}>User stories</Text>
          {sprint.userStories.map((story) => (
            <Text key={story} style={globalStyles.body}>
              - {story}
            </Text>
          ))}
          <Text style={styles.subheading}>Deliverables</Text>
          {sprint.deliverables.map((item) => (
            <Text key={item} style={globalStyles.body}>
              - {item}
            </Text>
          ))}
          <Text style={styles.subheading}>Evidence to screenshot</Text>
          {sprint.evidence.map((item) => (
            <Text key={item} style={globalStyles.body}>
              - {item}
            </Text>
          ))}
        </SectionCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14,
  },
  subheading: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
});
