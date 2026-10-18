const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

(async () => {
  const root = process.cwd();
  const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + req.url.split('?')[0]);
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.json') ? 'application/json' : 'text/html');
    fs.createReadStream(file).on('error', () => res.writeHead(404).end()).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const cloud = new Map();
  let deny = false;
  async function client() {
    const context = await browser.newContext();
    await context.route('https://fonts.googleapis.com/**', route => route.abort());
    await context.exposeBinding('mockCloud', (_source, operation, uid, key, value) => {
      if (deny) throw new Error('permission-denied');
      if (operation === 'list') return [...cloud].filter(([k]) => k.startsWith(uid + '/')).map(([k, v]) => [k.slice(uid.length + 1), v]);
      if (operation === 'set') cloud.set(uid + '/' + key, value);
      return cloud.get(uid + '/' + key) || null;
    });
    await context.route('https://www.gstatic.com/firebasejs/**', async route => {
      const url = route.request().url();
      let body;
      if (url.endsWith('firebase-app.js')) body = 'export const initializeApp = () => ({});';
      else if (url.endsWith('firebase-auth.js')) body = `
        let listener;
        const current = () => { const uid = localStorage.getItem('mock-user'); return uid ? { uid, displayName: uid } : null; };
        export const getAuth = () => ({});
        export class GoogleAuthProvider { setCustomParameters() {} }
        export function onAuthStateChanged(auth, callback) { listener = callback; setTimeout(() => callback(current()), 0); }
        export async function signInWithPopup() { localStorage.setItem('mock-user', localStorage.getItem('mock-choice') || 'alice'); listener(current()); }
        export async function signOut() { localStorage.removeItem('mock-user'); listener(null); }
      `;
      else body = `
        export const getFirestore = () => ({});
        export const collection = (db, users, uid) => ({ uid });
        export const doc = (db, users, uid, progress, key) => ({ uid, key });
        export function onSnapshot(ref, options, callback, error) {
          let active = true;
          window.mockSnapshot = async () => {
            try {
              const rows = await window.mockCloud('list', ref.uid);
              if (active) callback({ metadata: { fromCache: false, hasPendingWrites: false }, docs: rows.map(([id, value]) => ({ id, data: () => value })) });
            } catch { if (active) error({ code: 'permission-denied' }); }
          };
          window.mockSnapshot();
          return () => active = false;
        }
        export async function runTransaction(db, callback) {
          const writes = [];
          const result = await callback({
            get: async ref => {
              if (localStorage.getItem('mock-user') !== ref.uid) throw Error('wrong account');
              const value = await window.mockCloud('get', ref.uid, ref.key);
              return { exists: () => !!value, data: () => value };
            },
            set: (ref, record) => writes.push([ref, record])
          });
          for (const [ref, record] of writes) await window.mockCloud('set', ref.uid, ref.key, record);
          return result;
        }
      `;
      await route.fulfill({ contentType: 'text/javascript', body });
    });
    return context;
  }
  try {
    const context = await client();
    const page = await context.newPage();
    await page.goto(origin + '/index.html');
    await page.waitForFunction(() => !document.querySelector('#account-login')?.disabled);
    await page.evaluate(() => {
      FE.write('status:2', 'p4');
      FE.write('test:2', { cur: 0, picks: [1, null], total: 2 });
    });
    await page.click('#accountTop');
    await page.waitForFunction(() => FE.owner === 'alice' && document.querySelector('#account-import')?.hidden === false);
    assert.equal(await page.evaluate(() => FE.read('status:2', null)), null, 'Do not silently import guest progress');
    await page.click('#account-import');
    await page.waitForFunction(() => document.querySelector('#account-status').textContent.includes('Đã đồng bộ'));
    assert.equal(cloud.get('alice/status:2').value, 'p4');
    assert.equal(await page.evaluate(() => FE.record('status:2', '')), 'p4', 'Guest data is preserved');
    await page.click('#account-logout');
    await page.waitForFunction(() => FE.owner === '' && document.querySelector('#account-login')?.disabled === false);
    await page.evaluate(() => localStorage.setItem('mock-choice', 'bob'));
    await page.click('#account-login');
    await page.waitForFunction(() => FE.owner === 'bob' && document.querySelector('#account-status')?.textContent.includes('Đã đồng bộ'));
    assert.equal(await page.evaluate(() => FE.read('status:2', null)), null, 'Bob cannot see Alice progress');
    assert.equal(await page.evaluate(() => FE.validRecord('test:2', { value: { cur: 0, picks: [99] }, updatedAt: 1 })), false);

    const second = await client();
    const other = await second.newPage();
    await other.goto(origin + '/index.html');
    await other.waitForFunction(() => document.querySelector('#account-login')?.disabled === false);
    await other.click('#account-login');
    await other.waitForFunction(() => FE.owner === 'alice' && FE.read('status:2') === 'p4');
    assert.deepEqual(await other.evaluate(() => FE.read('test:2').picks), [1, null], 'Resume on another device');
    await other.evaluate(() => FE.write('test-result:2', { answered: 2, correct: 1, total: 2 }));
    await other.waitForFunction(() => document.querySelector('#account-status').textContent.includes('Đã đồng bộ'));
    assert.equal(cloud.get('alice/test-result:2').value.correct, 1);
    const remote = { value: { cur: 1, picks: [1, 3], total: 2 }, updatedAt: Date.now() + 1000 };
    cloud.set('alice/test:2', remote);
    await other.evaluate(() => window.mockSnapshot());
    await other.waitForFunction(() => FE.read('test:2').cur === 1);
    deny = true;
    await other.evaluate(() => FE.write('status:3', 'p4'));
    await other.waitForFunction(() => !document.querySelector('#account-retry').hidden);
    assert.equal(await other.evaluate(() => FE.read('status:3')), 'p4', 'Failed sync keeps local work');
    deny = false;
    await other.click('#account-retry');
    await other.waitForFunction(() => document.querySelector('#account-status')?.textContent.includes('Đã đồng bộ'));
    assert.equal(cloud.get('alice/status:3').value, 'p4', 'Retry uploads unsynced work');
    console.log('Account isolation, explicit guest import, cross-device resume, scores, remote updates and failed-sync recovery passed (mock Firebase).');
  } finally { await browser.close(); server.close(); }
})();
