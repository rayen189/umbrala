// ===============================
// UMbrala main.js AVANZADO
// ===============================

// ---------- CONFIG ----------
const ROOT = { nick: 'root', password: 'root123', secondary: 'umbralaSecret' };
let currentUser = null;
let isRoot = false;
let rootSecured = false;
let freezeGlobal = false;
let currentRoom = null;

// SALAS
const rooms = ['Norte', 'Sur', 'Centro', 'La Serena', 'VIP'];
const hiddenRooms = ['Sala Fantasma', 'VIP Oculta']; // solo root

const usersByRoom = {};
const messagesByRoom = {};

// ---------- ELEMENTOS ----------
const landingScreen = document.getElementById('landing-screen');
const roomsScreen = document.getElementById('rooms-screen');
const chatScreen = document.getElementById('chat-screen');
const roomsList = document.getElementById('rooms-list');
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const sendFileBtn = document.getElementById('send-file-btn');
const chatFile = document.getElementById('chat-file');
const usersList = document.getElementById('users-list');
const userCount = document.getElementById('user-count');
const exitRoomBtn = document.getElementById('exit-room');
const initBtn = document.getElementById('init-btn');

// ROOT LOGIN
const rootBtn = document.getElementById('root-btn');
const rootLogin = document.getElementById('root-login');
const rootNickInput = document.getElementById('root-nick');
const rootPassInput = document.getElementById('root-pass');
const rootLoginBtn = document.getElementById('root-login-btn');
const rootError = document.getElementById('root-error');

// ROOT TERMINAL
const rootTerminal = document.getElementById('root-terminal');
const rootConsole = document.getElementById('root-console');
const rootCmd = document.getElementById('root-command');
const rootExec = document.getElementById('root-exec');
const rootExit = document.getElementById('root-exit');

// ---------- EVENTOS PRINCIPALES ----------
initBtn.onclick = () => {
  landingScreen.style.display = 'none';
  roomsScreen.style.display = 'block';
  showRooms();
};

rootBtn.onclick = () => {
  landingScreen.style.display = 'none';
  rootLogin.style.display = 'block';
};

// ---------- LOGIN ROOT ----------
rootLoginBtn.onclick = () => {
  if (rootNickInput.value === ROOT.nick && rootPassInput.value === ROOT.password) {
    currentUser = ROOT.nick;
    isRoot = true;
    rootLogin.style.display = 'none';
    rootTerminal.style.display = 'block';
    initRootTerminal();
  } else {
    rootError.textContent = 'Credenciales incorrectas';
  }
};

// ---------- ROOT TERMINAL ----------
function rootPrint(text) {
  const line = document.createElement('div');
  line.textContent = text;
  rootConsole.appendChild(line);
  rootConsole.scrollTop = rootConsole.scrollHeight;
}

function initRootTerminal() {
  rootConsole.innerHTML = '';
  rootPrint('UMBRALA ROOT TERMINAL');
  rootPrint('Modo espectador total activo 👁️');
  rootPrint('Ingrese la clave secundaria para activar comandos críticos:');
}

rootExec.onclick = () => {
  if (!rootCmd.value.trim()) return;
  execRootCommand(rootCmd.value.trim());
  rootCmd.value = '';
};

rootCmd.addEventListener('keydown', e => {
  if (e.key === 'Enter') rootExec.click();
});

rootExit.onclick = () => { location.reload(); };

function execRootCommand(cmd) {
  if (!rootSecured) {
    if (cmd === ROOT.secondary) {
      rootSecured = true;
      rootPrint('Acceso total ROOT ACTIVADO 🔐');
    } else {
      rootPrint('Clave secundaria incorrecta');
    }
    return;
  }

  rootPrint('> ' + cmd);

  // COMANDOS ROOT
  switch (true) {
    case cmd.startsWith('/ban '):
      const banNick = cmd.split(' ')[1];
      rootPrint(`Usuario ${banNick} baneado`);
      break;

    case cmd.startsWith('/shadow '):
      const shNick = cmd.split(' ')[1];
      rootPrint(`Usuario ${shNick} shadowbanned`);
      break;

    case cmd === '/freeze':
      toggleFreeze();
      break;

    case cmd === '/timeline':
      replayTimeline();
      break;

    case cmd === '/panel':
      rootPrint('Panel root: puedes agregar aquí más funciones visuales');
      break;

    case cmd === '/help':
      rootPrint('/ban nick | /shadow nick | /unban nick | /freeze | /timeline | /panel | /shutdown');
      break;

    case cmd === '/shutdown':
      rootPrint('Apagando Umbrala...');
      document.body.innerHTML = '<h1 style="color:#0ff;">UMBRALA APAGADO</h1>';
      break;

    case cmd === '/replay':
      replayTimeline();
      break;

    default:
      rootPrint('Comando no reconocido. /help');
  }
}

// ---------- SALAS ----------
function showRooms() {
  roomsList.innerHTML = '';
  rooms.concat(isRoot ? hiddenRooms : []).forEach(r => {
    if (!usersByRoom[r]) usersByRoom[r] = [];
    if (!messagesByRoom[r]) messagesByRoom[r] = [];
    const div = document.createElement('div');
    div.innerHTML = `<strong>${r}</strong> | Usuarios: ${usersByRoom[r].length} <button onclick="enterRoom('${r}')">Entrar</button>`;
    roomsList.appendChild(div);
  });
}

// ---------- ENTRAR A SALA ----------
function enterRoom(room) {
  currentRoom = room;
  roomsScreen.style.display = 'none';
  chatScreen.style.display = 'block';
  document.getElementById('chat-room-name').textContent = room;
  renderChat();
  renderUsers();
}

// ---------- CHAT ----------
sendBtn.onclick = () => {
  if (freezeGlobal || (isRoot && !rootSecured)) return;
  const msg = chatInput.value.trim();
  if (!msg) return;
  addMessage(currentUser, msg, currentRoom);
  chatInput.value = '';
};

sendFileBtn.onclick = () => {
  if (!chatFile.files.length) return;
  const file = chatFile.files[0];
  const reader = new FileReader();
  reader.onload = e => addMessage(currentUser, '[archivo]', currentRoom, e.target.result);
  reader.readAsDataURL(file);
  chatFile.value = '';
};

exitRoomBtn.onclick = () => {
  chatScreen.style.display = 'none';
  roomsScreen.style.display = 'block';
  showRooms();
};

// ---------- FUNCIONES CHAT ----------
function addMessage(user, text, room, file) {
  const msg = { user, text, room, file: file || null, timestamp: Date.now() };
  if (!messagesByRoom[room]) messagesByRoom[room] = [];
  messagesByRoom[room].push(msg);
  renderChat();
  if (isRoot) renderTimeline();
}

function renderChat() {
  chatContainer.innerHTML = '';
  if (!messagesByRoom[currentRoom]) return;
  messagesByRoom[currentRoom].forEach(m => {
    const div = document.createElement('div');
    div.className = 'user';
    div.textContent = `${m.user}: ${m.text}`;
    if (m.file) {
      const media = document.createElement(m.file.startsWith('data:image') ? 'img' : 'video');
      media.src = m.file;
      media.style.maxWidth = '200px';
      media.style.maxHeight = '150px';
      if (media.tagName === 'VIDEO') media.controls = true;
      div.appendChild(media);
    }
    chatContainer.appendChild(div);
  });
}

function renderUsers() {
  usersList.innerHTML = '';
  const users = usersByRoom[currentRoom] || [];
  users.forEach(u => {
    if (isRoot) return; // root invisible
    const li = document.createElement('li');
    li.textContent = u;
    usersList.appendChild(li);
  });
  userCount.textContent = users.length;
}

// ---------- FREEZE GLOBAL ----------
function toggleFreeze() {
  freezeGlobal = !freezeGlobal;
  chatInput.disabled = freezeGlobal;
  sendBtn.disabled = freezeGlobal;
  sendFileBtn.disabled = freezeGlobal;
  rootPrint(`[SISTEMA] Chat ${freezeGlobal ? 'congelado' : 'descongelado'} por ROOT`);
}

// ---------- REPLAY TIMELINE ----------
function replayTimeline() {
  if (!isRoot) return;
  const allMessages = [];
  Object.keys(messagesByRoom).forEach(room => {
    messagesByRoom[room].forEach(msg => allMessages.push({ ...msg, room }));
  });
  allMessages.sort((a, b) => a.timestamp - b.timestamp);
  let index = 0;
  rootPrint('--- REPLAY DEL TIMELINE ---');
  function step() {
    if (index >= allMessages.length) return rootPrint('--- FIN DEL REPLAY ---');
    const m = allMessages[index];
    rootPrint(`[${m.room}] ${m.user}: ${m.text || '[archivo]'}`);
    index++;
    setTimeout(step, 200);
  }
  step();
}
// ===============================
// GOD VIEW CYBERPUNK ULTRA VISUAL
// ===============================

let mapUltraInterval = null;

const ROOM_COLORS_ULTRA = {
  'Norte': '#0ff',
  'Sur': '#ff0',
  'Centro': '#f0f',
  'La Serena': '#7a7cff',
  'VIP': '#ff007f',
  'Sala Fantasma': '#888',
  'VIP Oculta': '#555'
};

function showMapUltra() {
  if (!isRoot || !rootSecured) {
    rootPrint('⚠️ Acceso denegado: Root no seguro');
    return;
  }

  rootPrint('--- GOD VIEW ULTRA VISUAL ACTIVADO ---');

  if (mapUltraInterval) clearInterval(mapUltraInterval);

  mapUltraInterval = setInterval(() => {
    rootConsole.innerHTML = ''; // limpia consola

    rootPrint('--- 🌌 UMBRALA :: GOD VIEW CYBERPUNK ULTRA ---');

    rooms.concat(hiddenRooms).forEach(r => {
      const users = usersByRoom[r] || [];
      const color = ROOM_COLORS_ULTRA[r] || '#0ff';
      const roomLabel = hiddenRooms.includes(r) ? `🔒 ${r}` : r;

      // Sala
      const roomDiv = document.createElement('div');
      roomDiv.innerHTML = `<span style="color:${color}; font-weight:bold; text-shadow:0 0 5px ${color}, 0 0 10px ${color};">[${roomLabel}] → ${users.length} usuario(s)</span>`;
      rootConsole.appendChild(roomDiv);

      // Usuarios
      users.forEach(u => {
        const userDiv = document.createElement('div');
        const glow = `text-shadow:0 0 5px ${color},0 0 10px ${color},0 0 20px ${color}; animation: glowAnim 1s infinite alternate;`;
        const lastMsg = (messagesByRoom[r] || []).filter(m => m.user === u).slice(-1)[0];
        const msgText = lastMsg ? lastMsg.text || '[archivo]' : '[sin mensaje]';
        userDiv.innerHTML = `<span style="color:${color}; ${glow}">• ${u} : ${msgText}</span>`;
        rootConsole.appendChild(userDiv);
      });

      rootConsole.appendChild(document.createElement('br'));
    });
  }, 1500); // refresco más rápido para efecto dinámico
}

// Detener mapa ultra visual
function stopMapUltra() {
  if (mapUltraInterval) {
    clearInterval(mapUltraInterval);
    mapUltraInterval = null;
    rootPrint('--- GOD VIEW ULTRA VISUAL DESACTIVADO ---');
  }
}

// ---------- COMANDOS ROOT ----------
function execRootCommand(cmd) {
  if (!rootSecured) {
    if (cmd === ROOT.secondary) {
      rootSecured = true;
      rootPrint('Acceso total ROOT ACTIVADO 🔐');
    } else {
      rootPrint('Clave secundaria incorrecta');
    }
    return;
  }

  rootPrint('> ' + cmd);

  switch (true) {
    case cmd.startsWith('/map ultra'):
      showMapUltra();
      break;

    case cmd.startsWith('/map stop'):
      stopMapUltra();
      break;

    case cmd.startsWith('/help'):
      rootPrint('/map ultra | /map stop | /ban nick | /shadowban nick | /freeze ...');
      break;

    default:
      rootPrint('Comando no reconocido. /help');
  }
}

// ---------- ANIMACIÓN CSS GLOW ----------
const styleGlow = document.createElement('style');
styleGlow.innerHTML = `
@keyframes glowAnim {
  0% { text-shadow: 0 0 5px #0ff,0 0 10px #0ff,0 0 15px #0ff; }
  50% { text-shadow: 0 0 10px #0ff,0 0 20px #0ff,0 0 30px #0ff; }
  100% { text-shadow: 0 0 5px #0ff,0 0 10px #0ff,0 0 15px #0ff; }
}
`;
document.head.appendChild(styleGlow);
