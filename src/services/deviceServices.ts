import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { Platform } from 'react-native';

import type { DeviceContext, SensorSnapshot } from '../types';

export async function getDeviceContext(): Promise<DeviceContext> {
  if (Platform.OS === 'web') {
    return {
      batteryLevel: null,
      batteryState: 'WEB_PREVIEW',
      locationPermission: 'web-preview',
      notificationPermission: 'web-preview',
      latitude: null,
      longitude: null,
    };
  }

  const [batteryLevel, batteryState, notificationStatus, locationStatus] = await Promise.all([
    Battery.getBatteryLevelAsync().catch(() => null),
    Battery.getBatteryStateAsync().catch(() => Battery.BatteryState.UNKNOWN),
    Notifications.getPermissionsAsync().catch(() => ({ status: 'undetermined' })),
    Location.getForegroundPermissionsAsync().catch(() => ({ status: 'undetermined' })),
  ]);

  let latitude: number | null = null;
  let longitude: number | null = null;

  if (locationStatus.status !== 'granted') {
    const request = await Location.requestForegroundPermissionsAsync().catch(() => ({ status: 'denied' }));
    if (request.status === 'granted') {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).catch(() => null);
      latitude = location?.coords.latitude ?? null;
      longitude = location?.coords.longitude ?? null;
    }
  } else {
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).catch(() => null);
    latitude = location?.coords.latitude ?? null;
    longitude = location?.coords.longitude ?? null;
  }

  return {
    batteryLevel,
    batteryState: Battery.BatteryState[batteryState] ?? 'UNKNOWN',
    notificationPermission: notificationStatus.status,
    locationPermission: locationStatus.status,
    latitude,
    longitude,
  };
}

export async function requestSensorSnapshot(durationMs = 900): Promise<SensorSnapshot> {
  if (Platform.OS === 'web') {
    return {
      accelerometerMagnitude: 0.82,
      gyroscopeMagnitude: 0.31,
      sampleCount: 8,
    };
  }

  let accelerometerMagnitudeTotal = 0;
  let gyroscopeMagnitudeTotal = 0;
  let accelerometerCount = 0;
  let gyroscopeCount = 0;

  Accelerometer.setUpdateInterval(120);
  Gyroscope.setUpdateInterval(120);

  const accelerometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
    accelerometerMagnitudeTotal += Math.sqrt(x * x + y * y + z * z);
    accelerometerCount += 1;
  });

  const gyroscopeSubscription = Gyroscope.addListener(({ x, y, z }) => {
    gyroscopeMagnitudeTotal += Math.sqrt(x * x + y * y + z * z);
    gyroscopeCount += 1;
  });

  await new Promise((resolve) => setTimeout(resolve, durationMs));
  accelerometerSubscription.remove();
  gyroscopeSubscription.remove();

  const accelerometerMagnitude = accelerometerCount ? accelerometerMagnitudeTotal / accelerometerCount : 0;
  const gyroscopeMagnitude = gyroscopeCount ? gyroscopeMagnitudeTotal / gyroscopeCount : 0;

  return {
    accelerometerMagnitude: Number(accelerometerMagnitude.toFixed(3)),
    gyroscopeMagnitude: Number(gyroscopeMagnitude.toFixed(3)),
    sampleCount: accelerometerCount + gyroscopeCount,
  };
}

export async function scheduleChallengeReminder(activityTitle: string) {
  if (Platform.OS === 'web') {
    return `Web preview reminder for ${activityTitle} recorded`;
  }

  const permission = await Notifications.requestPermissionsAsync();
  if (permission.status !== 'granted') {
    return 'Notification permission not granted';
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'STEMM Lab reminder',
      body: `Finish your ${activityTitle} evidence and sync it before submission.`,
    },
    trigger: null,
  });

  return 'Reminder notification queued';
}
