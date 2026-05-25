# Firebase Test Lab Evidence Steps

Use this after the APK is built.

## Required Evidence

Each student should capture a different Firebase Test Lab device run if possible.

Save screenshots or exported results showing:

- Firebase project name.
- APK uploaded.
- Device model and Android version.
- Test type.
- Pass/fail result.
- Logs.
- Screenshots or videos from the run.

## Suggested Test

Use a Robo test if instrumentation tests are not configured.

Suggested steps:

1. Upload APK to Firebase Test Lab.
2. Select Android device 1 for student A.
3. Select Android device 2 for student B.
4. Run the test.
5. Download logs and screenshots.
6. Put evidence in `evidence/firebase-test-lab/`.

## What To Say In Presentation

Firebase Test Lab was used to check that the APK launches on real Android devices outside the local development environment. The results support deployment readiness and help identify device-specific issues that are not visible in web preview or local unit tests.
