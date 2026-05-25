# Five-Minute Presentation Script

## 0:00-0:30 - Product Pitch

STEMM Lab is a mobile app for upper-primary and lower-high-school students. It turns real-world STEMM classroom activities into guided experiments where teams predict, measure, record evidence, and compare results.

## 0:30-3:00 - App Demonstration

1. Show team setup and generated discriminator.
2. Open dashboard and readiness score.
3. Open the activity catalogue.
4. Demonstrate one activity, such as Earthquake-Resistant Structure.
5. Record a prediction, outcome, unit, notes, rating, and evidence URI.
6. Sample sensors, GPS, and battery context.
7. Save the attempt.
8. Show the evidence screen and exported JSON.

## 3:00-4:00 - Testing and Contributions

Show:

- Jest tests passing.
- TypeScript typecheck passing.
- Firebase Test Lab screenshots after APK upload.
- GitHub commits and branches from both team members.
- Sprint board screenshots from all three sprints.

Explain that unit tests check calculations, integration tests check readiness workflow, and the manual test script checks the real mobile flow.

## 4:00-5:00 - Code Review and Q&A Prep

Explain this path:

`CaptureScreen -> AttemptRecord -> SQLite localRepository -> Firestore REST adapter -> EvidenceScreen -> readiness score`

Likely questions:

- Why SQLite? Offline classroom drafts and local evidence cache.
- Why Firestore? Shared cloud storage for teams, activities, attempts, and leaderboard data.
- Why sensors/GPS/battery? The specification requires context-aware mobile computing and device capabilities.
- Why background tasks and notifications? To demonstrate modern mobile behaviour such as deferred sync and challenge reminders.
- What did testing reveal? TypeScript caught an async background task issue, and tests protect calculations and workflow readiness.
