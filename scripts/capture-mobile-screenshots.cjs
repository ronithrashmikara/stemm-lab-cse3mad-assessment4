const childProcess = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');
const os = require('os');
const WebSocket = require('ws');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const outDir = path.join(root, 'evidence', 'app-screenshots-videos');
const chromePath = findChrome();
const staticPort = 4178;
const debugPort = 9231;

const screens = [
  ['01-team-setup-phone.png', '/?demo=1&screen=setup'],
  ['02-dashboard-phone.png', '/?demo=1&screen=dashboard'],
  ['03-activity-detail-phone.png', '/?demo=1&screen=activity&activity=earthquake-structure'],
  ['04-capture-attempt-phone.png', '/?demo=1&screen=capture&activity=earthquake-structure'],
  ['05-evidence-phone.png', '/?demo=1&screen=evidence'],
  ['06-testing-phone.png', '/?demo=1&screen=testing'],
  ['07-sprints-phone.png', '/?demo=1&screen=sprints'],
];

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    throw new Error('dist/index.html not found. Run: npx expo export --platform web --clear');
  }
  fs.mkdirSync(outDir, { recursive: true });

  const server = await startStaticServer();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stemm-lab-chrome-'));
  const chrome = childProcess.spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${debugPort}`,
    '--window-size=390,844',
    'about:blank',
  ], { stdio: 'ignore' });

  try {
    await waitForDebugPort();
    const page = await createPage();
    const client = await connect(page.webSocketDebuggerUrl);
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    for (const [fileName, route] of screens) {
      const url = `http://127.0.0.1:${staticPort}${route}`;
      await client.send('Page.navigate', { url });
      await wait(2200);
      const result = await client.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false,
      });
      const filePath = path.join(outDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(result.data, 'base64'));
      console.log(filePath);
    }

    client.close();
  } finally {
    chrome.kill();
    server.close();
  }
}

function findChrome() {
  const candidates = [
    path.join(process.env.ProgramFiles || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env.ProgramFiles || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(process.env['ProgramFiles(x86)'] || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  ];
  const found = candidates.find((candidate) => candidate && fs.existsSync(candidate));
  if (!found) {
    throw new Error('Chrome or Edge executable not found.');
  }
  return found;
}

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const rawUrl = request.url === '/' || !request.url ? '/index.html' : request.url.split('?')[0];
    const safePath = path.normalize(rawUrl).replace(/^(\.\.[/\\])+/, '');
    let filePath = path.join(dist, safePath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(dist, 'index.html');
    }
    response.setHeader('Content-Type', contentType(filePath));
    response.end(fs.readFileSync(filePath));
  });

  return new Promise((resolve) => {
    server.listen(staticPort, '127.0.0.1', () => resolve(server));
  });
}

async function waitForDebugPort() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (response.ok) {
        return;
      }
    } catch {
      // Chrome is still starting.
    }
    await wait(250);
  }
  throw new Error('Chrome DevTools port did not open.');
}

async function createPage() {
  const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' });
  if (!response.ok) {
    throw new Error(`Could not create Chrome page: ${response.status}`);
  }
  return response.json();
}

function connect(webSocketDebuggerUrl) {
  const ws = new WebSocket(webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();

  ws.on('message', (raw) => {
    const message = JSON.parse(raw.toString());
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
    }
  });

  return new Promise((resolve, reject) => {
    ws.once('open', () => {
      resolve({
        send(method, params = {}) {
          const requestId = ++id;
          ws.send(JSON.stringify({ id: requestId, method, params }));
          return new Promise((requestResolve, requestReject) => {
            pending.set(requestId, { resolve: requestResolve, reject: requestReject });
          });
        },
        close() {
          ws.close();
        },
      });
    });
    ws.once('error', reject);
  });
}

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html';
  if (filePath.endsWith('.js')) return 'application/javascript';
  if (filePath.endsWith('.json')) return 'application/json';
  if (filePath.endsWith('.ico')) return 'image/x-icon';
  if (filePath.endsWith('.png')) return 'image/png';
  return 'application/octet-stream';
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
