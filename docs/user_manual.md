# STEMM Lab User Manual

## 1. Getting Started

STEMM Lab is a mobile classroom experiment app for upper-primary and lower-high-school students. It helps teams complete real-world STEMM challenges, record predictions, capture results, attach evidence, and compare outcomes.

### Install and Open

1. Install the APK provided by the project team, or open the project in Expo Go during development.
2. Allow requested permissions when prompted. Location, notifications, and motion sensors help create stronger assessment evidence.
3. Open the app and wait for the local database to initialise.

### Create a Team

On the Team setup screen:

1. Enter the team name.
2. Enter member names separated by commas.
3. Enter the grade or year level.
4. Save the team.

The app creates a team discriminator. This appears in local records and exported evidence so results can be linked to the correct team.

## 2. Main Dashboard

The dashboard shows:

- Activities covered.
- Saved attempts.
- Best evidence score.
- Rubric readiness items.
- Battery/location/notification context.
- Links to Evidence, Sprints, Testing, and Settings.

Use the readiness score to identify missing submission evidence. A high score means the app has team data, attempts, sensor/GPS/battery evidence, sync evidence, and video/file references.

## 3. Activities

The app includes seven activities:

1. Parachute Drop Challenge.
2. Sound Pollution Hunter.
3. Hand Fan Challenge.
4. Earthquake-Resistant Structure.
5. Human Performance Lab.
6. Reaction Board Challenge.
7. Breathing Pace Trainer.

Each activity screen includes the purpose, target question, equipment, instructions, device features, safety note, and curriculum links.

## 4. Recording an Attempt

For each attempt:

1. Select the team member.
2. Enter the prediction.
3. Enter the measured outcome and unit.
4. Add notes and reflection.
5. Add an evidence URI or file name, such as `videos/parachute-test-1.mp4`.
6. Enter a team rating from 1 to 5.
7. Select **Sample sensors, GPS, battery**.
8. Select **Save locally and sync**.

The app stores the attempt in SQLite. If Firebase credentials are configured, it syncs to Firestore. If credentials are not configured, it records `demo-mode` so the app can still be demonstrated safely.

## 5. Evidence Screen

The Evidence screen displays:

- All saved attempts.
- Team member who recorded the attempt.
- Rating and sync status.
- Sensor sample count.
- Battery level.
- Notes and evidence URI.

Use **Export JSON** to preview the locally stored evidence. This supports the presentation and can be used in the testing/deployment report.

## 6. Sprint Screen

The Sprint screen describes the required three Agile-style sprints:

- Sprint 1: setup, navigation, activity catalogue, local database schema.
- Sprint 2: real data capture, Firebase-ready sync, SQLite, sensors/location.
- Sprint 3: tests, background task, notifications, AdMob evidence, docs, and packaging.

In the final submission, pair this screen with screenshots from Azure DevOps, Jira, Trello, or GitHub Projects.

## 7. Testing Screen

The Testing screen summarises:

- Unit tests.
- Integration tests.
- End-to-end demo test script.
- Firebase Test Lab evidence requirements.
- AdMob test banner ID.

Use this during the presentation to explain what the tests prove and what still requires Firebase console evidence.

## 8. Settings

Settings shows:

- Team discriminator.
- Firebase configuration status.
- Battery state.
- Location permission.
- Notification permission.
- Current GPS location if available.

Use **Refresh device context** before recording evidence if battery/location values are missing.

## 9. Troubleshooting

### Permission denied

Open device settings and allow location, camera/microphone if used, motion/sensors, and notifications.

### No Firestore sync

Check `.env` values:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`

If these are missing, the app intentionally uses demo mode.

### No sensor samples

Run the app on a real phone. Some web/emulator environments restrict accelerometer and gyroscope readings.

### APK install blocked

Enable installation from trusted sources, or install using Expo/EAS instructions from the README.

### Upload too large

The LMS allows one file up to 250 MB. Compress videos, remove `node_modules`, and submit source code plus evidence, not build caches.
