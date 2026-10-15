/* Shared preferences and progress. Keys stay scoped to FE Lessons. */
window.FE = {
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem('fe-lessons:v1:' + key)) ?? fallback; }
    catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem('fe-lessons:v1:' + key, JSON.stringify(value)); }
    catch { document.documentElement.dataset.storageUnavailable = 'true'; }
  }
};
function setTheme(theme) { document.documentElement.dataset.theme = theme; }
setTheme(FE.read('theme', 'dark'));
window.addEventListener('storage', e => {
  if(e.key === 'fe-lessons:v1:theme') setTheme(FE.read('theme','dark'));
});
document.addEventListener('DOMContentLoaded', async () => {
  const page = location.pathname.match(/\/(ly-thuyet|kiem-tra)\/(\d+)\.html$/);
  const base = page ? '../' : './';
  const bar = document.createElement('nav');
  bar.className = 'fe-toolbar';
  bar.setAttribute('aria-label','Điều hướng học tập');
  const home = document.createElement('a');
  home.href = base + 'index.html'; home.textContent = '⌂ Trang chủ';
  // A top-level link also exits the reading pane.
  home.target = '_top';
  bar.append(home);
  const theme = document.createElement('button');
  theme.textContent = '◐ Sáng / tối';
  theme.onclick = () => {const value=document.documentElement.dataset.theme==='dark'?'light':'dark';FE.write('theme',value);setTheme(value);};
  bar.append(theme);
  document.body.prepend(bar);
  if(document.documentElement.dataset.storageUnavailable) {
    const warning=document.createElement('p');warning.textContent='Trình duyệt đang chặn lưu tiến độ. Hãy cho phép lưu dữ liệu trang web để giữ kết quả.';bar.after(warning);
  }
  if(!page) return;
  try {
    const response=await fetch(base+'lessons.json');
    if(!response.ok) throw new Error('catalog unavailable');
    const {lessons}=await response.json();
    const id=Number(page[2]), kind=page[1]==='ly-thuyet'?'theory':'test';
    const current=lessons.find(l=>l.stt===id);
    const available=lessons.filter(l=>l[kind]).sort((a,b)=>a.stt-b.stt);
    const index=available.findIndex(l=>l.stt===id);
    const addLink=(label,path)=>{if(!path)return;const a=document.createElement('a');a.textContent=label;a.href=base+path;bar.append(a);};
    addLink('← Bài trước',available[index-1]?.[kind]);
    addLink(kind==='theory'?'Kiểm tra →':'Lý thuyết →',current?.[kind==='theory'?'test':'theory']);
    addLink('Bài sau →',available[index+1]?.[kind]);
    const done=document.createElement('button');
    const update=()=>done.textContent=FE.read('status:'+id,'p0')==='p4'?'↩ Đánh dấu chưa xong':'✓ Đánh dấu đã xong';
    update();done.onclick=()=>{FE.write('status:'+id,FE.read('status:'+id,'p0')==='p4'?'p0':'p4');update();};bar.append(done);
  } catch { /* The home link and theme remain usable offline. */ }
});
