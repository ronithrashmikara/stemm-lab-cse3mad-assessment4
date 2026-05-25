# STEMM Lab - CSE3MAD Assessment 4

STEMM Lab is an Expo/React Native mobile application for the CSE3MAD Assessment 4 specification. It turns real-world STEMM classroom activities into guided, evidence-based experiments for upper-primary and lower-high-school students.

The app includes:

- Team setup with generated discriminator.
- Seven STEMM activities from the 2026 User Specification.
- Functional screens, navigation, and data passing between screens.
- Local SQLite persistence for team profile and attempt evidence.
- Firestore REST sync adapter with demo-mode fallback.
- Device context capture: battery, location permission/GPS, accelerometer, gyroscope, notifications.
- Background task registration and challenge reminder notifications.
- AdMob test placement documentation and test banner ID.
- Jest unit, integration, and end-to-end style tests.
- Submission docs and packaging script.

## Quick Start

Recommended Node version: Node 22 LTS. The current machine can run the tests on Node 23, but React Native prints engine warnings for that version.

```bash
npm install --legacy-peer-deps
npm run verify
npm start
```

Open the Expo QR code in Expo Go, or run:

```bash
npm run web
```

## Firebase Setup

The app runs without Firebase credentials and marks sync as `demo-mode`. For real Firestore sync, create `.env` from `.env.example`:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your-web-api-key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
```

Firestore paths used:

- `teams/{teamId}`
- `teams/{teamId}/attempts/{attemptId}`

## Android APK Build

Recommended EAS build:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

The `preview` profile in `eas.json` is configured to produce an APK.

Local native prebuild option:

```bash
npx expo prebuild --platform android
cd android
gradlew assembleRelease
```

Place the APK in `submission/Assessment4_STEMM_Lab/apk-build/`.

## Verification

```bash
npm run typecheck
npm test -- --runInBand
npm run test:report
```

Current implemented tests:

- Physics calculations, g-force, sound risk, motion stability.
- Measurement completion and leaderboard scoring.
- Readiness scoring across team, sprint, sensor, GPS/battery, Firestore, and evidence checks.
- Activity catalogue and sprint workflow integrity.

## Submission Packaging

Generate the zip-ready folder:

```bash
npx expo export --platform web --clear
npm run screenshots:mobile
npm run package:submission
```

The script creates:

- `submission/Assessment4_STEMM_Lab/`
- `submission/Assessment4_STEMM_Lab_Submission.zip`

Before final upload, add real screenshots/videos:

- GitHub contributions and branches.
- Azure DevOps/Jira/Trello sprint boards.
- Firebase Test Lab results.
- App screenshots/videos.
- Team communication evidence.
- APK build.
- Backup demo video.

## Presentation Demo Flow

1. Show team setup and dashboard readiness.
2. Open two or three STEMM activities.
3. Record an attempt with prediction, outcome, notes, sensor/GPS/battery evidence, and evidence URI.
4. Show the evidence screen and exported JSON.
5. Show testing screen, Jest result screenshots, Firebase Test Lab screenshots, GitHub history, and sprint evidence.
6. Explain one code path: screen -> measurement -> SQLite -> Firestore adapter -> readiness score.
