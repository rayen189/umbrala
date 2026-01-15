// ==========================================
// UMBRALA MAIN.JS — ROOT VISUAL
// ==========================================

const landingScreen = document.getElementById('landing-screen');
const roomsScreen = document.getElementById('rooms-screen');
const chatScreen = document.getElementById('chat-screen');
const rootLoginScreen = document.getElementById('root-login');
const rootDashboard = document.getElementById('root-dashboard');

const siteTitle = document.getElementById('site-title');
const initBtn = document.getElementById('init-btn');
const rootBtn = document.getElementById('root-btn');
const homeBtns = document.querySelectorAll('#home-btn');

const roomsList = document.getElementById('rooms-list');
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const usersList = document.getElementById('users-list');
const userCount = document.getElementById('user-count');
const exitRoomBtn = document.getElementById('exit-room');

const rootNickInput = document.getElementById('root-nick');
const rootPassInput = document.getElementById('root-pass');
const rootLoginBtn = document.getElementById('root-login-btn');
const rootError = document.getElementById('root-error');

const rootUsersList = document.getElementById('root-users-list');
const rootRoomsList = document.getElementById('root-rooms-list');
const rootFreezeBtn = document.getElementById('root-freeze-btn');
const rootGodViewBtn = document.getElementById('root-godview-btn');
const rootShutdownBtn = document.getElementById('root-shutdown-btn');
const rootConsole = document.getElementById('root-console');
const rootLogoutBtn = document.getElementById('root-logout-btn');

// ===================
// DATOS
// ===================
let rooms = ['Norte de Chile','Sur de Chile','La Serena','Chile Central','Chile Austral'];
let hiddenRooms = ['Shadow Nexus','Void Chamber'];
let usersByRoom = {};
let messagesByRoom = {};
let shadowBanned = [];
let freezeGlobal = false;
let currentRoom = null;

const ROOT = {nick:'root', primary:'root123'};
let isRoot=false;

// ===================
// FUNCIONES
// ===================
function showScreen(screen){
  [landingScreen, roomsScreen, chatScreen, rootLoginScreen, rootDashboard].forEach(s=>s.style.display='none');
  screen.style.display='flex';
}

function updateRoomsList(){
  roomsList.innerHTML='';
  rooms.concat(hiddenRooms).forEach(r=>{
    const div = document.createElement('div');
    div.textContent = r + ` (${(usersByRoom[r]||[]).length})`;
    div.onclick = ()=>enterRoom(r);
    roomsList.appendChild(div);
  });
  if(isRoot) updateRootRooms();
}

function updateUsersList(){
  usersList.innerHTML='';
  (usersByRoom[currentRoom]||[]).forEach(u=>{
    const li = document.createElement('li');
    li.textContent = u + (shadowBanned.includes(u)? ' 🔒' : '');
    usersList.appendChild(li);
  });
  userCount.textContent=`Usuarios: ${(usersByRoom[currentRoom]||[]).length}`;
}

function enterRoom(room){
  currentRoom = room;
  showScreen(chatScreen);
  document.getElementById('chat-room-name').textContent=room;
  updateUsersList();
  chatContainer.innerHTML='';
}

// ===================
// CHAT
// ===================
sendBtn.onclick = ()=>{
  if(freezeGlobal) return alert('Sala congelada ❄️');
  const msg = chatInput.value.trim();
  if(!msg) return;
  if(currentRoom){
    if(!messagesByRoom[currentRoom]) messagesByRoom[currentRoom]=[];
    messagesByRoom[currentRoom].push({user:'Anon', text:msg});
    const p=document.createElement('p');
    p.textContent=`Anon: ${msg}`;
    chatContainer.appendChild(p);
    chatInput.value='';
  }
};
exitRoomBtn.onclick = ()=>showScreen(roomsScreen);

// ===================
// ROOT LOGIN
// ===================
rootBtn.onclick = ()=>showScreen(rootLoginScreen);
rootLoginBtn.onclick = ()=>{
  if(rootNickInput.value===ROOT.nick && rootPassInput.value===ROOT.primary){
    isRoot=true;
    showScreen(rootDashboard);
    updateRootUsers();
    updateRootRooms();
    logRoot('Bienvenido ROOT ✅','success');
  }else rootError.textContent='Credenciales incorrectas ❌';
};

// ===================
// ROOT DASHBOARD VISUAL
// ===================
function logRoot(text,type='info'){
  const p = document.createElement('p');
  switch(type){
    case 'success': p.style.color='#0f0'; p.textContent=`✅ ${text}`; break;
    case 'error': p.style.color='#f00'; p.textContent=`❌ ${text}`; break;
    case 'alert': p.style.color='#ff0'; p.textContent=`⚠️ ${text}`; break;
    default: p.style.color='#0ff'; p.textContent=text;
  }
  rootConsole.appendChild(p);
  rootConsole.scrollTop=rootConsole.scrollHeight;
}

function updateRootUsers(){
  rootUsersList.innerHTML='';
  Object.values(usersByRoom).flat().forEach(u=>{
    const li=document.createElement('li');
    li.textContent=u + (shadowBanned.includes(u)? ' 🔒':'');
    const sbBtn=document.createElement('button');
    sbBtn.textContent='🔒';
    sbBtn.onclick=()=>{shadowBanned.push(u); logRoot(`${u} shadowbaneado 🔒`,'alert');};
    const ubBtn=document.createElement('button');
    ubBtn.textContent='🟢';
    ubBtn.onclick=()=>{shadowBanned=shadowBanned.filter(s=>s!==u); logRoot(`${u} liberado de shadowban ✅`,'success');};
    li.appendChild(sbBtn);
    li.appendChild(ubBtn);
    rootUsersList.appendChild(li);
  });
}

function updateRootRooms(){
  rootRoomsList.innerHTML='';
  rooms.concat(hiddenRooms).forEach(r=>{
    const li=document.createElement('li');
    li.textContent=r;
    const toggle=document.createElement('button');
    toggle.textContent = hiddenRooms.includes(r)? '🔒':'🟢';
    toggle.onclick=()=>{
      if(hiddenRooms.includes(r)){
        hiddenRooms=hiddenRooms.filter(h=>h!==r); rooms.push(r); toggle.textContent='🟢';
        logRoot(`Sala ${r} ahora visible ✅`,'success');
      }else{
        rooms=rooms.filter(h=>h!==r); hiddenRooms.push(r); toggle.textContent='🔒';
        logRoot(`Sala ${r} oculta 🔒`,'alert');
      }
      updateRoomsList();
    };
    li.appendChild(toggle);
    rootRoomsList.appendChild(li);
  });
}

// ===================
// BOTONES ROOT
// ===================
rootFreezeBtn.onclick = ()=>{
  freezeGlobal=!freezeGlobal;
  logRoot(`Freeze Global: ${freezeGlobal?'ACTIVADO ❄️':'DESACTIVADO 🌞'}`,'alert');
};

rootGodViewBtn.onclick = ()=>{
  logRoot('God View activado 🌐','success');
};

rootShutdownBtn.onclick = ()=>{
  logRoot('Apagando Umbrala... 💀','alert');
  setTimeout(()=>{document.body.innerHTML='<h1 style="color:#0ff;text-align:center">UMBRALA OFF</h1>';},2000);
};

rootLogoutBtn.onclick = ()=>{
  isRoot=false;
  showScreen(landingScreen);
};
  
// ===================
// EVENTOS INICIALES
// ===================
siteTitle.onclick = ()=>showScreen(landingScreen);
initBtn.onclick = ()=>{ showScreen(roomsScreen); updateRoomsList(); };
homeBtns.forEach(b=>b.onclick=()=>showScreen(landingScreen));
