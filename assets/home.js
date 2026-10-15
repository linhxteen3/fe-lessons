
const PHASES = {
  p0: { label:"Chưa bắt đầu", short:"Chưa" },
  p4: { label:"Đã xong",      short:"Xong"  },
};
const PHASE_ORDER = ["p0","p4"];

const SAMPLE = {
  lessons:[
    {stt:1,  topic:"n進数の概念 · Khái niệm hệ cơ số n",   theory:"ly-thuyet/1.html",  test:"kiem-tra/1.html",  status:"p4"},
    {stt:2,  topic:"基数変換 · Chuyển đổi cơ số",          theory:"ly-thuyet/2.html",  test:"kiem-tra/2.html",  status:"p4"},
    {stt:6,  topic:"論理回路 · Mạch logic",                 theory:"ly-thuyet/6.html",  test:"kiem-tra/6.html",  status:"p4"},
    {stt:13, topic:"ソート · Sắp xếp",                     theory:"ly-thuyet/13.html", test:"kiem-tra/13.html", status:"p0"},
    {stt:14, topic:"OOP+UML + 過去問 Ch.3",                 theory:null, test:null, status:"p0"},
    {stt:15, topic:"5大装置・CPU基本",                      theory:null, test:null, status:"p0"},
  ]
};

let DATA = [], filter = "all", query = "", sampleMode = false, cur = null, curTab = "theory";
const $ = s => document.querySelector(s);

function migrate(s){
  if(s==="done"||s==="p4"||s==="p3"||s==="p2"||s==="p1") return "p4";
  return "p0";
}

async function load(){
  try{
    const r = await fetch("./lessons.json", {cache:"no-store"});
    if(!r.ok) throw 0;
    const j = await r.json();
    DATA = (j.lessons||[]).map(l=>({...l, status:FE.read("status:"+l.stt,migrate(l.status))}));
  }catch{
    DATA = SAMPLE.lessons.map(l=>({...l, status:FE.read("status:"+l.stt,"p0")}));
    sampleMode = true; $("#banner").classList.add("show");
  }
  DATA.sort((a,b)=>a.stt-b.stt);
  DATA.forEach(l=>FE.write("status:"+l.stt,l.status));
  render(); updateProgress();
}

function updateProgress(){
  const tot = DATA.length;
  const cnt = {}; PHASE_ORDER.forEach(p=>cnt[p]=0);
  DATA.forEach(l=>cnt[l.status]=(cnt[l.status]||0)+1);
  const d4 = cnt.p4||0;
  const pct = tot ? Math.round(d4/tot*100) : 0;

  $("#pnum").textContent = d4 + " / " + tot;
  const sum = $("#phaseSum");
  sum.innerHTML = `
    <div class="ps-chip p4"><span class="dot"></span>${cnt.p4||0} Đã xong</div>
    <div class="ps-chip p0"><span class="dot"></span>${cnt.p0||0} Chưa bắt đầu</div>`;
}

function render(){
  const q = query.trim().toLowerCase();
  const rows = DATA.filter(l=>{
    if(filter!=="all" && l.status!==filter) return false;
    if(q && !((l.topic||"").toLowerCase().includes(q)||String(l.stt).includes(q))) return false;
    return true;
  });
  const list = $("#list"), empty = $("#empty");
  list.innerHTML = "";
  empty.style.display = rows.length ? "none" : "block";
  for(const l of rows){
    const idx = PHASE_ORDER.indexOf(l.status);
    const ph  = PHASES[l.status] || PHASES.p0;
    const li  = document.createElement("li");
    li.className = "row";
    li.innerHTML = `
      <div class="stt">${String(l.stt).padStart(2,"0")}</div>
      <div class="meta">
        <div class="topic"></div>
        <div class="row-foot">
          <span class="badge ${l.status}"><span class="dot"></span>${ph.label}</span>
          <button class="toggle-btn ${l.status}" data-stt="${l.stt}">${l.status==="p4"?"↩ Đánh dấu chưa xong":"✓ Đánh dấu đã xong"}</button>
        </div>
      </div>
      <div class="actions">
        <button class="btn" data-t="theory" ${l.theory?"":"disabled"}>Lý thuyết</button>
        <button class="btn" data-t="test"   ${l.test?"":"disabled"}>Kiểm tra</button>
      </div>`;
    li.querySelector(".topic").textContent = l.topic || "(chưa có chủ đề)";
    li.querySelectorAll("button[data-t]").forEach(b=>{ if(!b.disabled) b.onclick = ()=>openPane(l,b.dataset.t) });
    li.querySelector(".toggle-btn").onclick = ()=>toggleStatus(l);
    list.appendChild(li);
  }
}

function toggleStatus(l){
  l.status = l.status === "p4" ? "p0" : "p4";
  FE.write("status:"+l.stt,l.status);
  render(); updateProgress();
  showToast(`Bài ${String(l.stt).padStart(2,"0")} → ${PHASES[l.status].label}`);
}

let toastT;
function showToast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("show"),2200);
}

function openPane(l, tab){
  cur=l; curTab=(tab==="test"&&l.test)?"test":(l.theory?"theory":"test");
  $("#pPstt").textContent=String(l.stt).padStart(2,"0");
  $("#pTopic").textContent=l.topic||"";
  $("#tabTheory").style.display=l.theory?"":"none";
  $("#tabTest").style.display=l.test?"":"none";
  $("#pane").classList.add("open");
  document.body.style.overflow="hidden";
  showTab(curTab);
}
function showTab(tab){
  curTab=tab;
  $("#tabTheory").setAttribute("aria-selected",tab==="theory");
  $("#tabTest").setAttribute("aria-selected",tab==="test");
  const src=tab==="theory"?cur.theory:cur.test;
  $("#pNew").href=src||"#";
  const frame=$("#frame"),ph=$("#placeholder");
  if(sampleMode){ frame.style.display="none"; ph.style.display="flex"; ph.textContent="Bản mẫu — nội dung bài sẽ hiển thị sau khi deploy lên GitHub Pages."; }
  else{ ph.style.display="none"; frame.style.display="block"; frame.src=src; }
}
function closePane(){
  $("#pane").classList.remove("open");
  document.body.style.overflow="";
  $("#frame").src="about:blank"; cur=null;
}

$("#tabTheory").onclick=()=>showTab("theory");
$("#tabTest").onclick=()=>showTab("test");
$("#pClose").onclick=closePane;
$("#pane").onclick=e=>{ if(e.target.id==="pane") closePane() };
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closePane() });
$("#q").addEventListener("input",e=>{ query=e.target.value; render() });
document.querySelectorAll(".chip").forEach(c=>{
  c.onclick=()=>{
    filter=c.dataset.f;
    document.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",x===c));
    render();
  };
});

window.addEventListener("storage",()=>{DATA.forEach(l=>l.status=FE.read("status:"+l.stt,"p0"));render();updateProgress();});
load();
