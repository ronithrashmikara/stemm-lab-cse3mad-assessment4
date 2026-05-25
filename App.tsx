import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ACTIVITY_CATALOGUE } from './src/data/activities';
import { DEMO_ATTEMPTS, DEMO_TEAM } from './src/data/demo';
import { SPRINTS } from './src/data/sprints';
import { calculateReadinessScore } from './src/domain/readiness';
import { ActivityScreen } from './src/screens/ActivityScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { EvidenceScreen } from './src/screens/EvidenceScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { SprintScreen } from './src/screens/SprintScreen';
import { TestingScreen } from './src/screens/TestingScreen';
import { registerBackgroundSyncTask } from './src/services/backgroundTasks';
import { getDeviceContext } from './src/services/deviceServices';
import {
  getTeam,
  initDatabase,
  listAttempts,
  saveAttempt,
  saveTeam,
} from './src/services/localRepository';
import type { ActivityDefinition, AttemptRecord, DeviceContext, ScreenKey, TeamProfile } from './src/types';
import { colors, globalStyles } from './src/ui/theme';

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>('setup');
  const [team, setTeam] = useState<TeamProfile | null>(null);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [activeActivity, setActiveActivity] = useState<ActivityDefinition>(ACTIVITY_CATALOGUE[0]);
  const [deviceContext, setDeviceContext] = useState<DeviceContext | null>(null);
  const [isReady, setIsReady] = useState(false);

  const readiness = useMemo(
    () => calculateReadinessScore({ team, attempts, activities: ACTIVITY_CATALOGUE, sprints: SPRINTS }),
    [team, attempts],
  );

  useEffect(() => {
    async function bootstrap() {
      await initDatabase();
      const demo = getWebDemoState();
      const storedTeam = demo.enabled ? DEMO_TEAM : await getTeam();
      const storedAttempts = demo.enabled ? DEMO_ATTEMPTS : await listAttempts();
      const context = await getDeviceContext();
      await registerBackgroundSyncTask();
      if (demo.activity) {
        setActiveActivity(demo.activity);
      }
      setTeam(storedTeam);
      setAttempts(storedAttempts);
      setDeviceContext(context);
      setScreen(demo.screen ?? (storedTeam ? 'dashboard' : 'setup'));
      setIsReady(true);
    }

    bootstrap().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown start-up error';
      Alert.alert('Start-up issue', message);
      setIsReady(true);
    });
  }, []);

  const refreshAttempts = async () => {
    const nextAttempts = await listAttempts();
    setAttempts(nextAttempts);
  };

  const handleSaveTeam = async (nextTeam: TeamProfile) => {
    await saveTeam(nextTeam);
    setTeam(nextTeam);
    setScreen('dashboard');
  };

  const handleOpenActivity = (activity: ActivityDefinition) => {
    setActiveActivity(activity);
    setScreen('activity');
  };

  const handleStartAttempt = (activity: ActivityDefinition) => {
    setActiveActivity(activity);
    setScreen('capture');
  };

  const handleSaveAttempt = async (attempt: AttemptRecord) => {
    await saveAttempt(attempt);
    await refreshAttempts();
    setScreen('evidence');
  };

  if (!isReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <Text style={styles.loadingTitle}>STEMM Lab</Text>
          <Text style={styles.loadingCopy}>Preparing local database, background task, and device context.</Text>
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>CSE3MAD Assessment 4</Text>
            <Text style={styles.title}>STEMM Lab</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.score}>{readiness.score}%</Text>
            <Text style={styles.scoreLabel}>ready</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {screen === 'setup' && <SetupScreen existingTeam={team} onSave={handleSaveTeam} />}

          {screen === 'dashboard' && (
            <DashboardScreen
              team={team}
              attempts={attempts}
              activities={ACTIVITY_CATALOGUE}
              readiness={readiness}
              deviceContext={deviceContext}
              onOpenActivity={handleOpenActivity}
              onNavigate={setScreen}
            />
          )}

          {screen === 'activity' && (
            <ActivityScreen activity={activeActivity} onStart={handleStartAttempt} onBack={() => setScreen('dashboard')} />
          )}

          {screen === 'capture' && (
            <CaptureScreen
              activity={activeActivity}
              team={team}
              onCancel={() => setScreen('activity')}
              onSaved={handleSaveAttempt}
            />
          )}

          {screen === 'evidence' && (
            <EvidenceScreen
              team={team}
              attempts={attempts}
              onRefresh={refreshAttempts}
              onNavigate={setScreen}
            />
          )}

          {screen === 'sprints' && <SprintScreen sprints={SPRINTS} onNavigate={setScreen} />}

          {screen === 'testing' && <TestingScreen onNavigate={setScreen} />}

          {screen === 'settings' && (
            <SettingsScreen
              team={team}
              deviceContext={deviceContext}
              onNavigate={setScreen}
              onRefreshDevice={async () => setDeviceContext(await getDeviceContext())}
              onEditTeam={() => setScreen('setup')}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  shell: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kicker: {
    ...globalStyles.kicker,
  },
  title: {
    ...globalStyles.screenTitle,
  },
  scoreBox: {
    minWidth: 70,
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.softBlue,
  },
  score: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 18,
  },
  scoreLabel: {
    color: colors.muted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  loadingTitle: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 28,
  },
  loadingCopy: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

function getWebDemoState(): { enabled: boolean; screen: ScreenKey | null; activity: ActivityDefinition | null } {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return { enabled: false, screen: null, activity: null };
  }

  const params = new URLSearchParams(window.location.search);
  const enabled = params.get('demo') === '1';
  const requestedScreen = params.get('screen') as ScreenKey | null;
  const screen = isScreenKey(requestedScreen) ? requestedScreen : null;
  const activity = ACTIVITY_CATALOGUE.find((item) => item.id === params.get('activity')) ?? null;

  return { enabled, screen, activity };
}

function isScreenKey(value: string | null): value is ScreenKey {
  return Boolean(
    value &&
      ['setup', 'dashboard', 'activity', 'capture', 'evidence', 'sprints', 'testing', 'settings'].includes(value),
  );
}
