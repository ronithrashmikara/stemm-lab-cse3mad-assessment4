import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

const BACKGROUND_SYNC_TASK = 'stemm-lab-background-sync';

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  return BackgroundTask.BackgroundTaskResult.Success;
});

export async function registerBackgroundSyncTask(): Promise<string> {
  if (Platform.OS === 'web') {
    return 'Background task documented; web preview uses foreground sync only';
  }

  const status = await BackgroundTask.getStatusAsync();

  if (status !== BackgroundTask.BackgroundTaskStatus.Available) {
    return 'Background tasks restricted on this platform';
  }

  await BackgroundTask.registerTaskAsync(BACKGROUND_SYNC_TASK, { minimumInterval: 15 });
  return 'Background sync task registered';
}

export async function triggerBackgroundSyncForTesting(): Promise<boolean> {
  return BackgroundTask.triggerTaskWorkerForTestingAsync();
}
