import { StyleSheet, Text, View } from 'react-native';

import { getAdMobReadiness } from '../services/adMob';
import type { ScreenKey } from '../types';
import { PrimaryButton, SectionCard, StatusPill } from '../ui/components';
import { colors, globalStyles } from '../ui/theme';

type Props = {
  onNavigate: (screen: ScreenKey) => void;
};

const testPlan = [
  {
    title: 'Unit tests',
    evidence: 'Jest tests for physics calculations, sound risk, measurement completion, readiness scoring, and ID creation.',
    status: 'Implemented in __tests__',
  },
  {
    title: 'Integration tests',
    evidence: 'Workflow tests prove activity catalogue, sprint records, and readiness progression work together.',
    status: 'Implemented in __tests__',
  },
  {
    title: 'End-to-end demo test',
    evidence: 'Manual script: create team, record activity, sample sensor/GPS/battery, save, export evidence, show dashboard score.',
    status: 'Documented in testing report',
  },
  {
    title: 'Firebase Test Lab',
    evidence: 'Run uploaded APK on at least one different device per person and save console screenshots/logs/videos.',
    status: 'Requires Firebase project access',
  },
];

export function TestingScreen({ onNavigate }: Props) {
  const admob = getAdMobReadiness();

  return (
    <View style={styles.stack}>
      <SectionCard title="Testing and deployment">
        <Text style={globalStyles.body}>
          Use this screen in the presentation to explain the difference between unit, integration, end-to-end, and Firebase
          Test Lab evidence.
        </Text>
        <PrimaryButton label="Back to dashboard" variant="ghost" onPress={() => onNavigate('dashboard')} />
      </SectionCard>

      {testPlan.map((item) => (
        <SectionCard key={item.title} title={item.title}>
          <StatusPill label={item.status} tone={item.status.includes('Requires') ? 'warn' : 'good'} />
          <Text style={globalStyles.body}>{item.evidence}</Text>
        </SectionCard>
      ))}

      <SectionCard title="AdMob test placement">
        <Text style={styles.adBox}>Google AdMob test banner: {admob.testBannerId}</Text>
        <Text style={globalStyles.muted}>{admob.implementationNote}</Text>
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14,
  },
  adBox: {
    minHeight: 54,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softAmber,
    color: colors.primary,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 12,
  },
});
