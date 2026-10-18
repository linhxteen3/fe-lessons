import { firebaseConfig } from './firebase-config.js';

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = new URL('./account.css', import.meta.url).href;
document.head.append(style);

const ja = FE.read('language', 'vi') === 'ja';
const label = (vi, jp) => ja ? jp : vi;
const panel = document.createElement('section');
panel.className = 'account-panel';
panel.id = 'account';
panel.setAttribute('aria-label', label('Tài khoản và đồng bộ', 'アカウントと同期'));
panel.innerHTML = `<strong id="account-name"></strong><p id="account-status" role="status"></p>
  <div class="account-actions"><button id="account-login" type="button" disabled>${label('Đăng nhập bằng Google', 'Googleでログイン')}</button>
  <button id="account-logout" type="button" hidden>${label('Đăng xuất', 'ログアウト')}</button>
  <button id="account-import" type="button" hidden>${label('Nhập tiến độ học thử trên máy này', 'この端末のお試し学習を取り込む')}</button>
  <button id="account-retry" type="button" hidden>${label('Thử kết nối lại', '再接続')}</button></div>`;
(document.querySelector('.course-sidebar') || document.querySelector('.lesson-shell')).append(panel);
const name = panel.querySelector('#account-name');
const status = panel.querySelector('#account-status');
const login = panel.querySelector('#account-login');
const logout = panel.querySelector('#account-logout');
const importButton = panel.querySelector('#account-import');
const retry = panel.querySelector('#account-retry');
const topButton = document.getElementById('accountTop');
if (topButton) topButton.onclick = () => {
  if (!login.hidden && !login.disabled) login.click();
  else panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
name.textContent = label('Tài khoản', 'アカウント');
status.textContent = label('Đang kết nối… Học thử vẫn được lưu trên máy.', '接続中…お試し学習は端末に保存されます。');
retry.onclick = () => location.reload();
let user = null, ready = false, stopped = false, unsubscribe = () => {};
const pending = new Set();

function fail(error) {
  const code = error?.code || '';
  const message = code.includes('unauthorized-domain')
    ? label('Tên miền này chưa được cho phép trong Firebase Authentication.', 'このドメインはFirebase Authenticationで許可されていません。')
    : code.includes('operation-not-allowed') || code.includes('configuration-not-found')
    ? label('Cần bật Google trong Firebase Authentication.', 'Firebase AuthenticationでGoogleを有効にしてください。')
    : code.includes('permission-denied')
    ? label('Chưa có quyền đồng bộ. Cần xuất bản quy tắc Firestore của website.', '同期権限がありません。このサイトのFirestoreルールを公開してください。')
    : code.includes('popup-blocked')
    ? label('Trình duyệt đã chặn cửa sổ Google. Cho phép cửa sổ bật lên rồi thử lại.', 'Googleのポップアップがブロックされました。許可して再試行してください。')
    : label('Chưa kết nối được. Tiến độ vẫn giữ trên máy; hãy thử lại.', '接続できません。進捗は端末に保持されています。再試行してください。');
  status.textContent = message;
  retry.hidden = false;
}

try {
  const [{ initializeApp }, authSDK, store] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = authSDK.getAuth(app);
  const db = store.getFirestore(app);
  const provider = new authSDK.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  function notify() {
    window.dispatchEvent(new Event('fe-synced'));
    // Keep an open quiz's in-memory answers aligned with remote changes.
    const frame = document.querySelector('#frame');
    if (frame?.getAttribute('src') && frame.getAttribute('src') !== 'about:blank') frame.contentWindow.location.reload();
    else if (document.getElementById('quiz-app')) location.reload();
  }
  function showSaved() {
    if (ready && !pending.size && !stopped) {
      status.textContent = label('Đã đồng bộ với tài khoản.', 'アカウントと同期済みです。');
      retry.hidden = true;
    }
  }
  async function sync(key) {
    if (!user || !ready || stopped || pending.has(key)) return;
    const uid = user.uid;
    const local = FE.record(key, uid);
    if (!FE.validRecord(key, local)) return;
    pending.add(key);
    status.textContent = label('Đang đồng bộ…', '同期中…');
    let changed = false;
    try {
      const ref = store.doc(db, 'users', uid, 'progress', key);
      // A transaction prevents an older tab from overwriting a newer saved answer.
      const remote = await store.runTransaction(db, async transaction => {
        const snapshot = await transaction.get(ref);
        const cloud = snapshot.exists() ? snapshot.data() : null;
        if (FE.validRecord(key, cloud) && cloud.updatedAt >= local.updatedAt) return cloud;
        transaction.set(ref, local);
        return local;
      });
      if (stopped || user?.uid !== uid) return;
      const latest = FE.record(key, uid);
      if (remote.updatedAt > (latest?.updatedAt || 0)) changed = FE.putRecord(key, remote, uid);
    } catch (error) { stopped = true; fail(error); }
    finally {
      pending.delete(key);
      if (changed) notify();
      if (!stopped && user?.uid === uid && FE.record(key, uid)?.updatedAt > local.updatedAt) void sync(key);
      else showSaved();
    }
  }

  login.onclick = async () => {
    login.disabled = true;
    try { await authSDK.signInWithPopup(auth, provider); }
    catch (error) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        status.textContent = label('Đã hủy đăng nhập. Bạn có thể tiếp tục học thử.', 'ログインをキャンセルしました。お試し学習を続けられます。');
      } else fail(error);
    } finally { login.disabled = false; }
  };
  logout.onclick = async () => {
    logout.disabled = true;
    try { await authSDK.signOut(auth); }
    catch (error) { logout.disabled = false; fail(error); }
  };
  importButton.onclick = () => {
    if (!ready || !user || stopped) return;
    // Import only missing keys; the user's cloud progress always takes precedence.
    for (const key of FE.keys('')) {
      if (!FE.record(key)) FE.write(key, FE.record(key, ''));
    }
    importButton.hidden = true;
    notify();
  };

  authSDK.onAuthStateChanged(auth, current => {
    unsubscribe();
    ready = false;
    user = current;
    const uid = current?.uid || '';
    if (uid !== FE.owner) {
      localStorage.setItem('fe-lessons:account', uid);
      location.reload();
      return;
    }
    login.disabled = false;
    login.hidden = !!current;
    if (topButton) topButton.textContent = current ? label('Tài khoản', 'アカウント') : label('Đăng nhập Google', 'Googleでログイン');
    logout.hidden = !current;
    if (!current) {
      status.textContent = label('Học thử: lưu trên máy. Đăng nhập để lưu vào tài khoản và dùng trên thiết bị khác.', 'お試し学習は端末に保存されます。ログインするとアカウントに保存し、別の端末で続けられます。');
      return;
    }
    name.textContent = current.displayName || current.email || label('Tài khoản của bạn', 'アカウント');
    status.textContent = label('Đang tải tiến độ tài khoản…', 'アカウントの進捗を読み込み中…');
    unsubscribe = store.onSnapshot(store.collection(db, 'users', uid, 'progress'), { includeMetadataChanges: true }, snapshot => {
      if (stopped || user?.uid !== uid || snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
      const remote = new Map();
      let changed = false;
      snapshot.docs.forEach(item => {
        const record = item.data();
        if (!FE.validRecord(item.id, record)) return;
        remote.set(item.id, record);
        const local = FE.record(item.id, uid);
        if (!local || record.updatedAt > local.updatedAt) changed = FE.putRecord(item.id, record, uid) || changed;
      });
      ready = true;
      for (const key of FE.keys(uid)) {
        if ((FE.record(key, uid)?.updatedAt || 0) > (remote.get(key)?.updatedAt || 0)) void sync(key);
      }
      importButton.hidden = !FE.keys('').some(key => !FE.record(key, uid));
      if (changed) notify();
      showSaved();
    }, error => { stopped = true; fail(error); });
  }, fail);
  window.addEventListener('fe-progress', event => void sync(event.detail));
  window.addEventListener('storage', event => {
    if (user && event.key?.startsWith(FE.prefix(user.uid))) void sync(event.key.slice(FE.prefix(user.uid).length));
  });
} catch (error) { fail(error); }
