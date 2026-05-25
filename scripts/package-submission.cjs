const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const root = process.cwd();
const submission = path.join(root, 'submission', 'Assessment4_STEMM_Lab');
const evidence = path.join(root, 'evidence');

const folders = [
  submission,
  path.join(submission, 'source-code'),
  path.join(submission, 'docs'),
  path.join(submission, 'evidence', 'github-contributions'),
  path.join(submission, 'evidence', 'sprint-boards-user-stories'),
  path.join(submission, 'evidence', 'testing-jest'),
  path.join(submission, 'evidence', 'firebase-test-lab'),
  path.join(submission, 'evidence', 'app-screenshots-videos'),
  path.join(submission, 'evidence', 'team-communication'),
  path.join(submission, 'apk-build'),
  path.join(submission, 'demo'),
];

for (const folder of folders) {
  fs.mkdirSync(folder, { recursive: true });
}

const copyFiles = [
  'App.tsx',
  'app.json',
  'eas.json',
  'index.ts',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'jest.config.cjs',
  '.env.example',
  '.nvmrc',
  'README.md',
];

for (const file of copyFiles) {
  const source = path.join(root, file);
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, path.join(submission, 'source-code', file));
  }
}

copyDir(path.join(root, 'src'), path.join(submission, 'source-code', 'src'));
copyDir(path.join(root, '__tests__'), path.join(submission, 'source-code', '__tests__'));
copyDir(path.join(root, 'assets'), path.join(submission, 'source-code', 'assets'));
copyDir(path.join(root, 'scripts'), path.join(submission, 'source-code', 'scripts'));
copyDir(path.join(root, 'docs'), path.join(submission, 'docs'));

if (fs.existsSync(evidence)) {
  copyDir(evidence, path.join(submission, 'evidence'));
}

writePlaceholder(path.join(submission, 'apk-build', 'PUT_APK_HERE.txt'), 'Place the EAS/local Android APK here after running the build command in README.md.');
writePlaceholder(path.join(submission, 'demo', 'PUT_DEMO_VIDEO_HERE.txt'), 'Place the 5-minute live-demo backup video here.');
writePlaceholder(path.join(submission, 'github-repository-link.txt'), 'Paste your GitHub repository link here before submission.');

const zipPath = path.join(root, 'submission', 'Assessment4_STEMM_Lab_Submission.zip');
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

try {
  childProcess.execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path "${submission}\\*" -DestinationPath "${zipPath}" -Force`], {
    stdio: 'inherit',
  });
  console.log(zipPath);
} catch (error) {
  console.log('Submission folder prepared. Zip failed; compress it manually from:', submission);
}

function copyDir(source, destination) {
  if (!fs.existsSync(source)) {
    return;
  }
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function writePlaceholder(file, text) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, text, 'utf8');
  }
}
