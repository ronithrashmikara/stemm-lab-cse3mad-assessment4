import { StyleSheet, Text, View } from 'react-native';

import { isFirebaseConfigured } from '../services/firebaseRest';
import type { DeviceContext, ScreenKey, TeamProfile } from '../types';
import { PrimaryButton, SectionCard, StatusPill } from '../ui/components';
import { globalStyles } from '../ui/theme';

type Props = {
  team: TeamProfile | null;
  deviceContext: DeviceContext | null;
  onNavigate: (screen: ScreenKey) => void;
  onRefreshDevice: () => Promise<void>;
  onEditTeam: () => void;
};

export function SettingsScreen({ team, deviceContext, onNavigate, onRefreshDevice, onEditTeam }: Props) {
  return (
    <View style={styles.stack}>
      <SectionCard title="Configuration">
        <View style={styles.wrap}>
          <StatusPill label={team ? `Team ${team.discriminator}` : 'No team'} tone={team ? 'good' : 'bad'} />
          <StatusPill label={isFirebaseConfigured() ? 'Firebase configured' : 'Firebase demo mode'} tone={isFirebaseConfigured() ? 'good' : 'warn'} />
        </View>
        <Text style={globalStyles.body}>
          Add EXPO_PUBLIC_FIREBASE_API_KEY and EXPO_PUBLIC_FIREBASE_PROJECT_ID in an env file to sync live Firestore
          documents. Without them, the app keeps working and records demo-mode sync evidence.
        </Text>
        <View style={styles.actions}>
          <PrimaryButton label="Edit team" variant="secondary" onPress={onEditTeam} />
          <PrimaryButton label="Dashboard" variant="ghost" onPress={() => onNavigate('dashboard')} />
        </View>
      </SectionCard>

      <SectionCard title="Device status">
        <Text style={globalStyles.body}>Battery state: {deviceContext?.batteryState ?? 'unknown'}</Text>
        <Text style={globalStyles.body}>Battery level: {deviceContext?.batteryLevel === null || deviceContext?.batteryLevel === undefined ? 'not sampled' : `${Math.round(deviceContext.batteryLevel * 100)}%`}</Text>
        <Text style={globalStyles.body}>Location permission: {deviceContext?.locationPermission ?? 'unknown'}</Text>
        <Text style={globalStyles.body}>Notification permission: {deviceContext?.notificationPermission ?? 'unknown'}</Text>
        <Text style={globalStyles.body}>
          Location: {deviceContext?.latitude === null || deviceContext?.latitude === undefined ? 'not tagged' : `${deviceContext.latitude.toFixed(4)}, ${deviceContext.longitude?.toFixed(4)}`}
        </Text>
        <PrimaryButton label="Refresh device context" variant="secondary" onPress={onRefreshDevice} />
      </SectionCard>
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
});
