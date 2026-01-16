/* =========================
   VARIABLES GLOBALES
========================= */
let isStalkerless = false;
let currentRoom = null;
let activePrivateChat = null;

let users = [];
let rooms = [
  {name:"Norte de Chile 🌵", users:[]},
  {name:"Sur de Chile 🗻", users:[]},
  {name:"Centro 🌃", users:[]},
  {name:"Global 🌎", users:[]},
  {name:"Curiosidades 🧠", users:[]},
  {name:"Directo al 🕳️", users:[], hidden:true}
];

let globalFreeze = false;
let timeline = [];
let privateTimeline = [];

/* =========================
   ELEMENTOS HTML
========================= */
const landingScreen = document.getElementById('landingScreen');
const roomsListScreen = document.getElementById('roomsListScreen');
const chatScreen = document.getElementById('chatScreen');

const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');
const imageInput = document.getElementById('imageInput');
const roomsList = document.getElementById('roomsList');

const rootBar = document.getElementById('rootBar');
const shadowBtn = document.getElementById('shadowBtn');
const viewMapBtn = document.getElementById('viewMapBtn');
const freezeBtn = document.getElementById('freezeBtn');
const godViewBtn = document.getElementById('godViewBtn');
const vanishBtn = document.getElementById('vanishBtn');

const connectedUsersList = document.getElementById('connectedUsers');
const totalUsersCounter = document.getElementById('totalUsersCounter');

const privateChatContainer = document.getElementById('privateChatContainer');
const privateChatMessages = document.getElementById('privateChatMessages');
const privateChatName = document.getElementById('privateChatName');

/* =========================
   FUNCIONES PRINCIPALES
========================= */
function showScreen(screen){
  document.querySelectorAll('.screen').forEach(s=>s.style.display='none');
  screen.style.display='flex';
}

function updateTotalUsers(){
  let allUsers = [];
  rooms.forEach(r => allUsers.push(...r.users));
  const uniqueUsers = [...new Set(allUsers)];
  totalUsersCounter.textContent = `Usuarios conectados: ${uniqueUsers.length}`;
}

function renderRooms(){
  roomsList.innerHTML = '';
  rooms.forEach((r,i)=>{
    if(r.hidden && !isStalkerless) return;
    const btn = document.createElement('button');
    btn.textContent = `${r.name} (${r.users.length})`;
    btn.className='portal-btn';
    btn.onclick = ()=> enterRoom(i);
    roomsList.appendChild(btn);
  });
  updateTotalUsers();
}

function enterRoom(i){
  currentRoom = i;
  chatMessages.innerHTML='';
  const userName = isStalkerless ? 'Stalkerless' : 'User'+Math.floor(Math.random()*1000);
  rooms[i].users.push(userName);
  showScreen(chatScreen);
  document.getElementById('currentRoomName').textContent = rooms[i].name;
  renderConnectedUsers();
}

/* =========================
   CHAT
========================= */
sendBtn.onclick = ()=>{
  if(globalFreeze) return alert("¡Chat congelado!");
  if(currentRoom===null && !activePrivateChat) return;

  const msg = chatInput.value.trim();
  const file = imageInput.files[0];

  if(!msg && !file) return;

  const user = isStalkerless ? 'Stalkerless' : 'User'+Math.floor(Math.random()*1000);

  if(activePrivateChat){
    const data = {user, msg, file, privateWith: activePrivateChat, time: new Date()};
    privateTimeline.push(data);
    appendPrivateMessage(data);

    setTimeout(()=>{
      const index = privateTimeline.indexOf(data);
      if(index!==-1){
        privateTimeline.splice(index,1);
        removePrivateMessageFromDOM(data);
      }
    }, 60000); // 60 segundos
  } else {
    const data = {user, msg, file, room: rooms[currentRoom].name, time: new Date()};
    timeline.push(data);
    appendMessage(data);

    setTimeout(()=>{
      const index = timeline.indexOf(data);
      if(index!==-1){
        timeline.splice(index,1);
        removeMessageFromDOM(data);
      }
    }, 30000); // 30 segundos
  }

  chatInput.value='';
  imageInput.value='';
};

function appendMessage(data){
  const div = document.createElement('div');
  div.className='glow';
  if(data.msg) div.textContent = `[${data.room}] ${data.user}: ${data.msg}`;
  if(data.file){
    const img = document.createElement('img');
    img.src = URL.createObjectURL(data.file);
    img.style.maxWidth = '200px';
    img.style.maxHeight = '150px';
    img.style.display = 'block';
    div.appendChild(img);
  }
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendPrivateMessage(data){
  const div = document.createElement('div');
  div.className='glow';
  if(data.msg) div.textContent = `${data.user}: ${data.msg}`;
  if(data.file){
    const img = document.createElement('img');
    img.src = URL.createObjectURL(data.file);
    img.style.maxWidth = '200px';
    img.style.maxHeight = '150px';
    img.style.display = 'block';
    div.appendChild(img);
  }
  privateChatMessages.appendChild(div);
  privateChatMessages.scrollTop = privateChatMessages.scrollHeight;
}

function removeMessageFromDOM(data){
  const divs = document.querySelectorAll('#chatMessages div');
  divs.forEach(div=>{
    if(data.msg && div.textContent.includes(`[${data.room}] ${data.user}: ${data.msg}`)) div.remove();
    if(data.file && div.querySelector('img') && div.querySelector('img').src === URL.createObjectURL(data.file)) div.remove();
  });
}

function removePrivateMessageFromDOM(data){
  const divs = document.querySelectorAll('#privateChatMessages div');
  divs.forEach(div=>{
    if(data.msg && div.textContent.includes(`${data.user}: ${data.msg}`)) div.remove();
    if(data.file && div.querySelector('img') && div.querySelector('img').src === URL.createObjectURL(data.file)) div.remove();
  });
}

/* =========================
   USUARIOS CONECTADOS
========================= */
function renderConnectedUsers(){
  connectedUsersList.innerHTML='';
  rooms[currentRoom].users.forEach(u=>{
    const li = document.createElement('li');
    li.textContent = u;
    li.onclick = ()=> openPrivateChat(u);
    connectedUsersList.appendChild(li);
  });
}

function openPrivateChat(user){
  if(user=== (isStalkerless ? 'Stalkerless' : null)) return;
  activePrivateChat = user;
  privateChatContainer.style.display='flex';
  privateChatName.textContent = user;
}

/* =========================
   BOTONES ROOT
========================= */
shadowBtn.onclick = () => alert("ShadowBan aplicado");
viewMapBtn.onclick = () => alert("Mapa activado");
freezeBtn.onclick = () => {
  globalFreeze = !globalFreeze;
  alert(`Freeze global: ${globalFreeze}`);
};
godViewBtn.onclick = () => alert("GodView activado");
vanishBtn.onclick = () => alert("Modo invisible activado");

/* =========================
   BOTONES NAVEGACIÓN
========================= */
document.getElementById("backToStartBtn").onclick = ()=>{
  showScreen(landingScreen);
  currentRoom = null;
};

document.getElementById("backToRoomsBtn").onclick = ()=>{
  showScreen(roomsListScreen);
  activePrivateChat = null;
  privateChatContainer.style.display='none';
  renderRooms();
};

/* =========================
   BOTONES INICIALIZAR / LOGIN ROOT
========================= */
document.getElementById('initializeBtn').onclick = ()=>{
  showScreen(roomsListScreen);
  renderRooms();
};

document.getElementById('rootLoginBtn').onclick = ()=>{
  const user = prompt("Usuario Root:");
  const pass = prompt("Contraseña Root:");
  if(user==='stalkerless' && pass==='stalkerless1234'){
    isStalkerless = true;
    alert("Acceso Root concedido");
    rootBar.style.display='flex';
    showScreen(roomsListScreen);
    renderRooms();
  } else {
    alert("Acceso denegado");
  }
};

/* =========================
   INICIALIZACIÓN
========================= */
renderRooms();
showScreen(landingScreen);
