// ==========================================
// UMBRALA MAIN.JS — FULL ROOT CON LOGS VISUALES
// ==========================================

/* =====================
   VARIABLES GLOBALES
===================== */
const landingScreen = document.getElementById('landing-screen');
const roomsScreen = document.getElementById('rooms-screen');
const chatScreen = document.getElementById('chat-screen');
const rootLoginScreen = document.getElementById('root-login');
const rootTerminalScreen = document.getElementById('root-terminal');

const siteTitle = document.getElementById('site-title');
const initBtn = document.getElementById('init-btn');
const rootBtn = document.getElementById('root-btn');
const homeBtns = document.querySelectorAll('#home-btn, #home-btn-2');

const roomsList = document.getElementById('rooms-list');
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const sendFileBtn = document.getElementById('send-file-btn');
const usersList = document.getElementById('users-list');
const userCount = document.getElementById('user-count');
const exitRoomBtn = document.getElementById('exit-room');

const rootNickInput = document.getElementById('root-nick');
const rootPassInput = document.getElementById('root-pass');
const rootLoginBtn = document.getElementById('root-login-btn');
const rootError = document.getElementById('root-error');

const rootConsole = document.getElementById('root-console');
const rootCommandInput = document.getElementById('root-command');
const rootExecBtn = document.getElementById('root-exec');
const rootExitBtn = document.getElementById('root-exit');

/* =====================
   DATOS DEL SISTEMA
===================== */
let rooms = ['Norte de Chile','Sur de Chile','La Serena','Chile Central','Chile Austral'];
let hiddenRooms = ['Sala Secreta 1','Sala Secreta 2'];
let usersByRoom = {};
let messagesByRoom = {};
let shadowBanned = [];
let freezeGlobal = false;
let currentRoom = null;

// Root
const ROOT = {nick:'root', primary:'root123', secondary:'umbralaSecret'};
let isRoot = false;
let rootSecured = false;
let mapInterval = null;

/* =====================
   FUNCIONES GLOBALES
===================== */
function showScreen(screen){
  [landingScreen, roomsScreen, chatScreen, rootLoginScreen, rootTerminalScreen].forEach(s => s.style.display='none');
  screen.style.display='flex';
}

function updateRoomsList(){
  roomsList.innerHTML='';
  rooms.concat(hiddenRooms).forEach(r => {
    const div = document.createElement('div');
    div.textContent = r + ` (${(usersByRoom[r]||[]).length})`;
    div.onclick = () => enterRoom(r);
    roomsList.appendChild(div);
  });
}

function updateUsersList(){
  usersList.innerHTML='';
  (usersByRoom[currentRoom]||[]).forEach(u => {
    const li = document.createElement('li');
    li.textContent = u + (shadowBanned.includes(u)? ' 🔒' : '');
    li.onclick = () => {
      if(isRoot) rootPrint(`Abriste chat 1:1 con ${u}`,'command');
    };
    usersList.appendChild(li);
  });
  userCount.textContent=`Usuarios: ${(usersByRoom[currentRoom]||[]).length}`;
}

function enterRoom(room){
  currentRoom = room;
  showScreen(chatScreen);
  document.getElementById('chat-room-name').textContent = room;
  updateUsersList();
  chatContainer.innerHTML='';
}

/* =====================
   CHAT
===================== */
sendBtn.onclick = () => {
  if(freezeGlobal) return alert('Sala congelada 🔒');
  const msg = chatInput.value.trim();
  if(!msg) return;
  if(currentRoom && !shadowBanned.includes(ROOT.nick)){
    if(!messagesByRoom[currentRoom]) messagesByRoom[currentRoom]=[];
    messagesByRoom[currentRoom].push({user:isRoot?ROOT.nick:'Anon', text:msg});
    const p = document.createElement('p');
    p.textContent = `${isRoot?ROOT.nick:'Anon'}: ${msg}`;
    chatContainer.appendChild(p);
    chatInput.value='';
  }
};
exitRoomBtn.onclick = ()=>showScreen(roomsScreen);

/* =====================
   ROOT LOGIN
===================== */
rootBtn.onclick = ()=>showScreen(rootLoginScreen);
rootLoginBtn.onclick = ()=>{
  if(rootNickInput.value===ROOT.nick && rootPassInput.value===ROOT.primary){
    isRoot=true;
    rootSecured=false;
    showScreen(rootTerminalScreen);
    rootConsole.innerHTML='';
    rootPrint('Bienvenido ROOT\nIngrese clave secundaria:','command');
  }else{
    rootError.textContent='Credenciales incorrectas';
  }
};

/* =====================
   ROOT LOG VISUAL
===================== */
function rootPrint(text, type='info') {
    const p = document.createElement('p');

    switch(type){
        case 'command':
            p.style.color = '#0ff';
            p.style.textShadow = '0 0 5px #0ff, 0 0 15px #0ff';
            p.innerHTML = `🛠️ ${text}`;
            break;
        case 'success':
            p.style.color = '#0f0';
            p.style.textShadow = '0 0 5px #0f0, 0 0 15px #0f0';
            p.innerHTML = `✅ ${text}`;
            break;
        case 'error':
            p.style.color = '#f00';
            p.style.textShadow = '0 0 5px #f00, 0 0 15px #f00';
            p.innerHTML = `❌ ${text}`;
            break;
        case 'alert':
            p.style.color = '#ff0';
            p.style.textShadow = '0 0 5px #ff0, 0 0 15px #ff0';
            p.innerHTML = `⚠️ ${text}`;
            break;
        default:
            p.style.color = '#0ff';
            p.innerHTML = text;
    }

    p.classList.add('glow');
    rootConsole.appendChild(p);
    rootConsole.scrollTop = rootConsole.scrollHeight;
}

/* =====================
   ROOT TERMINAL
===================== */
function execRootCommand(cmd){
  if(!rootSecured){
    if(cmd===ROOT.secondary){rootSecured=true;rootPrint('Acceso ROOT total 🔐','success');}
    else rootPrint('Clave secundaria incorrecta','error');
    return;
  }
  rootPrint('> '+cmd,'command');

  switch(true){
    case cmd.startsWith('/help'):
      rootPrint('/map ultra | /map stop | /freeze | /timeline | /shadowban nick | /unshadow nick | /hide room | /unhide room | /shutdown','command');
      break;

    case cmd.startsWith('/map ultra'):
      showMapLive();
      break;

    case cmd.startsWith('/map stop'):
      stopMapLive();
      break;

    case cmd.startsWith('/freeze'):
      freezeGlobal=!freezeGlobal;
      rootPrint(`Freeze Global: ${freezeGlobal?'ACTIVADO':'DESACTIVADO'}`,'alert');
      break;

    case cmd.startsWith('/shadowban'):
      const sbNick=cmd.split(' ')[1];
      if(sbNick && !shadowBanned.includes(sbNick)) shadowBanned.push(sbNick);
      rootPrint(`${sbNick} shadowbaneado`,'alert');
      break;

    case cmd.startsWith('/unshadow'):
      const usNick=cmd.split(' ')[1];
      shadowBanned=shadowBanned.filter(u=>u!==usNick);
      rootPrint(`${usNick} liberado de shadowban`,'success');
      break;

    case cmd.startsWith('/hide room'):
      const hr=cmd.split(' ')[2];
      if(hr && rooms.includes(hr)){
        rooms=rooms.filter(r=>r!==hr);
        hiddenRooms.push(hr);
        updateRoomsList();
        rootPrint(`Sala ${hr} oculta`,'alert');
      }
      break;

    case cmd.startsWith('/unhide room'):
      const uh=cmd.split(' ')[2];
      if(uh && hiddenRooms.includes(uh)){
        hiddenRooms=hiddenRooms.filter(r=>r!==uh);
        rooms.push(uh);
        updateRoomsList();
        rootPrint(`Sala ${uh} visible`,'success');
      }
      break;

    case cmd.startsWith('/shutdown'):
      rootPrint('Apagando Umbrala...','alert');
      setTimeout(()=>{document.body.innerHTML='<h1 style="color:#0ff;text-align:center">UMBRALA OFF</h1>';},2000);
      break;

    case cmd.startsWith('/timeline'):
      rootPrint('--- Timeline ---','command');
      Object.keys(messagesByRoom).forEach(r=>{
        (messagesByRoom[r]||[]).forEach(m=>{
          rootPrint(`[${r}] ${m.user}: ${m.text||'[archivo]'}`,'info');
        });
      });
      break;

    default:
      rootPrint('Comando no reconocido. /help','error');
  }
}

rootExecBtn.onclick=()=>execRootCommand(rootCommandInput.value.trim());
rootExitBtn.onclick=()=>{
  isRoot=false; rootSecured=false;
  showScreen(landingScreen);
};

/* =====================
   GOD VIEW
===================== */
function showMapLive(){
  if(mapInterval) clearInterval(mapInterval);
  rootPrint('--- GOD VIEW ACTIVADO ---','command');

  mapInterval=setInterval(()=>{
    rootConsole.innerHTML='';
    rootPrint('--- UMBRALA :: GOD VIEW ---','command');
    rooms.concat(hiddenRooms).forEach(r=>{
      const users=usersByRoom[r]||[];
      rootPrint(`[${r}] -> ${users.length} usuario(s)`,'info');
      users.forEach(u=>{
        const last=messagesByRoom[r]?.filter(m=>m.user===u).slice(-1)[0];
        if(last) rootPrint(`   • ${u} ultimo msg: ${last.text||'[archivo]'}`,'info');
      });
    });
  },2000);
}

function stopMapLive(){
  if(mapInterval){
    clearInterval(mapInterval);
    mapInterval=null;
    rootPrint('--- GOD VIEW DESACTIVADO ---','alert');
  }
}

/* =====================
   EVENTOS INICIALES
===================== */
siteTitle.onclick = ()=>showScreen(landingScreen);
initBtn.onclick = ()=>{ showScreen(roomsScreen); updateRoomsList(); };
homeBtns.forEach(b=>b.onclick=()=>showScreen(landingScreen));
