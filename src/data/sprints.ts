import type { SprintEvidence } from '../types';

export const SPRINTS: SprintEvidence[] = [
  {
    id: 'sprint-1',
    title: 'Sprint 1',
    weeks: 'Weeks 3-5',
    goal: 'Create the product skeleton and prove the main STEMM Lab workflow.',
    userStories: [
      'As a teacher, I want students to create a team profile so attempts are grouped clearly.',
      'As a student, I want to browse STEMM activities so I can choose the right experiment.',
      'As a marker, I want to see early commits and task ownership.',
    ],
    deliverables: ['Expo project setup', 'Team profile screen', 'Activity catalogue', 'Navigation and local database schema'],
    evidence: ['Initial board screenshot', 'GitHub branch/commit screenshots', 'Wireframe or first app screenshots'],
  },
  {
    id: 'sprint-2',
    title: 'Sprint 2',
    weeks: 'Weeks 6-8',
    goal: 'Add real data capture, Firebase-ready sync, local persistence, and device context.',
    userStories: [
      'As a student, I want to save predictions and outcomes for each activity.',
      'As a student, I want sensor/location/battery data captured where relevant.',
      'As a marker, I want Firebase, SQLite, and screen-to-screen data passing evidence.',
    ],
    deliverables: ['SQLite attempt storage', 'Firestore REST sync adapter', 'Sensor and location capture', 'Evidence export'],
    evidence: ['Sprint 2 task board', 'Feature screenshots/videos', 'Firestore/SQLite explanation screenshots'],
  },
  {
    id: 'sprint-3',
    title: 'Sprint 3',
    weeks: 'Weeks 9-11',
    goal: 'Finish testing, background work, notifications, AdMob evidence, APK/build readiness, and submission artifacts.',
    userStories: [
      'As a team, we want test results so we can prove quality.',
      'As a student, I want reminders and background sync to support experiment work.',
      'As a marker, I want a zip with code, docs, tests, Git evidence, and demo material.',
    ],
    deliverables: ['Jest tests', 'Background task registration', 'Notification reminders', 'AdMob placeholder/test banner', 'Docs and packaging'],
    evidence: ['Jest screenshots', 'Firebase Test Lab screenshots', 'APK/build screenshot', 'Final commit contribution evidence'],
  },
];
