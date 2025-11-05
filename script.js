// ---------------- STATE ----------------
const state = {
  hairs: 0,
  rebirths: 0,
  multiplier: 1,
  upgrades: [
    { id:'trim', name:'More Trimming', clickBonus:1, autoBonus:0, cost:20, scale:5, level:0 },
    { id:'scissors', name:'Unsafety Scissors', clickBonus:5, autoBonus:0, cost:200, scale:25, level:0 },
    { id:'razorBlade', name:'Razor Blade', clickBonus:0, autoBonus:20, cost:500, scale:50, level:0 },
    { id:'safetyRazor', name:'Safety Razor', clickBonus:0, autoBonus:100, cost:5000, scale:200, level:0 }
  ],
  clickHistory: []
};

// ---------------- DOM ----------------
const el = {
  hairs: document.getElementById('hairs'),
  rebirths: document.getElementById('rebirths'),
  multiplier: document.getElementById('multiplier'),
  cps: document.getElementById('cps'),
  upgrades: document.getElementById('upgrades'),
  clickButton: document.getElementById('clickButton'),
  rebirthBtn: document.getElementById('rebirthBtn'),
  nextRebirthCost: document.getElementById('nextRebirthCost'),
  saveCodeInput: document.getElementById('saveCodeInput')
};

// ---------------- UTILITIES ----------------
const format = n=>{
  if(n>=1e12)return(n/1e12).toFixed(2)+"T";
  if(n>=1e9)return(n/1e9).toFixed(2)+"B";
  if(n>=1e6)return(n/1e6).toFixed(2)+"M";
  if(n>=1e3)return(n/1e3).toFixed(1)+"k";
  return Math.floor(n);
};
const getNextRebirthCost = ()=>100000*Math.pow(100,state.rebirths);

// ---------------- RENDER ----------------
function renderUpgrades(){
  el.upgrades.innerHTML='';
  state.upgrades.forEach((u,i)=>{
    const btn=document.createElement('button');
    btn.className='upgrade';
    btn.innerHTML=`<strong>${u.name}</strong><div>Lvl ${u.level}</div><small>Cost: ${format(u.cost)}</small>`;
    btn.onclick=()=>buyUpgrade(i);
    el.upgrades.appendChild(btn);
  });
}
function renderAll(){
  el.hairs.textContent=format(state.hairs);
  el.rebirths.textContent=state.rebirths;
  el.multiplier.textContent=state.multiplier+'x';
  el.nextRebirthCost.textContent=format(getNextRebirthCost());
  renderUpgrades();
}

// ---------------- GAME LOGIC ----------------
function clickGain(){
  let gain=1;
  for(const u of state.upgrades)gain+=(u.clickBonus||0)*u.level;
  return gain*state.multiplier;
}
function autoGainPerSecond(){
  let sum=0;
  for(const u of state.upgrades)sum+=(u.autoBonus||0)*u.level;
  return sum*state.multiplier;
}
function doClick(){
  const g=clickGain();
  state.hairs+=g;
  state.clickHistory.push({t:Date.now(),a:g});
  const cutoff=Date.now()-2000;
  while(state.clickHistory.length&&state.clickHistory[0].t<cutoff)state.clickHistory.shift();
  saveLocal(); renderAll();
}
function buyUpgrade(i){
  const u=state.upgrades[i];
  if(state.hairs>=u.cost){state.hairs-=u.cost;u.level++;u.cost+=u.scale;saveLocal();renderAll();}
  else alert("Not enough hairs!");
}
function rebirth(){
  const cost=getNextRebirthCost();
  if(state.hairs>=cost){
    state.hairs=0;
    for(const u of state.upgrades)u.level=0;
    state.rebirths++;state.multiplier*=2;
    alert("Rebirthed! x"+state.multiplier);
    saveLocal();renderAll();
  }else alert("Need "+format(cost)+" hairs to rebirth.");
}
function calculateCPS(){
  const now=Date.now(),oneSec=now-1000;
  let manual=0;
  while(state.clickHistory.length&&state.clickHistory[0].t<now-2000)state.clickHistory.shift();
  for(const c of state.clickHistory){if(c.t>=oneSec)manual+=c.a;}
  const total=manual+autoGainPerSecond();
  el.cps.textContent=total.toFixed(1);
}
function autoTick(){state.hairs+=autoGainPerSecond();saveLocal();renderAll();}
setInterval(autoTick,1000);
setInterval(calculateCPS,250);

// ---------------- LOCAL SAVE ----------------
function saveLocal(){
  localStorage.setItem('robertClickerSave',JSON.stringify(state));
}
function loadLocal(){
  const raw=localStorage.getItem('robertClickerSave');
  if(!raw)return;
  const d=JSON.parse(raw);
  Object.assign(state,d);
}
loadLocal();

// ---------------- SAVE BY CODE ----------------
function saveToCode(){
  const key=el.saveCodeInput.value.trim();
  if(!key)return alert("Enter a code to save!");
  const data=btoa(JSON.stringify(state));
  localStorage.setItem("RC_"+key,data);
  alert("Game saved under code: "+key);
}
function loadFromCode(){
  const key=el.saveCodeInput.value.trim();
  const data=localStorage.getItem("RC_"+key);
  if(!data)return alert("No save found!");
  const decoded=JSON.parse(atob(data));
  Object.assign(state,decoded);
  renderAll();
  alert("Game loaded from code: "+key);
}

// ---------------- CUSTOMIZATION ----------------
function applyColors(){
  document.body.style.background=document.getElementById('bgColor').value;
  el.clickButton.style.background=document.getElementById('buttonColor').value;
}

// ---------------- EVENTS ----------------
el.clickButton.onclick=doClick;
el.rebirthBtn.onclick=rebirth;

// ---------------- INIT ----------------
renderAll();
setInterval(saveLocal,5000);
