/* =========================
   VARIABLES GLOBALES
========================= */
let isStalkerless = false;
let currentRoom = null;
let activePrivateChat = null;
let users = [];
let timeline = [];
let privateTimeline = [];
let globalFreeze = false;

let rooms = [
  {name:"Norte de Chile 🌵", users:[]},
  {name:"Sur de Chile 🗻", users:[]},
  {name:"Centro 🌃", users:[]},
  {name:"Global 🌎", users:[]},
  {name:"Curiosidades 🧠", users:[]},
  {name:"Directo al 🕳️", users:[], hidden:true}
];

/* =========================
   ELEMENTOS HTML
========================= */
const landingScreen = document.getElementById('landingScreen');
const roomsListScreen = document.getElementById('roomsListScreen');
const chatScreen = document.getElementById('chatScreen');

const chatInput = document.getElementById('chatInput');
const imageInput = document.getElementById('imageInput');
const chatMessages = document.getElementById('chatMessages');
const privateChatContainer = document.getElementById('privateChatContainer');
const privateChatMessages = document.getElementById('privateChatMessages');
const privateChatName = document.getElementById('privateChatName');
const sendBtn = document.getElementById('sendBtn');
const roomsList = document.getElementById('roomsList');
const connectedUsersList = document.getElementById('connectedUsers');
const totalUsersCounter = document.getElementById('totalUsersCounter');

const rootBar = document.getElementById('rootBar');
const shadowBtn = document.getElementById('shadowBtn');
const viewMapBtn = document.getElementById('viewMapBtn');
const freezeBtn = document.getElementById('freezeBtn');
const godViewBtn = document.getElementById('godViewBtn');
const vanishBtn = document.getElementById('vanishBtn');

/* =========================
   FUNCIONES DE PANTALLAS
========================= */
function showScreen(screen){
  document.querySelectorAll('.screen').forEach(s => s.style.display='none');
  screen.style.display='flex';
}

/* =========================
   TOTAL USUARIOS
========================= */
function updateTotalUsers(){
  let allUsers = [];
  rooms.forEach(r => allUsers.push(...r.users));
  const uniqueUsers = [...new Set(allUsers)];
  totalUsersCounter.textContent = `(${uniqueUsers.length} usuarios conectados)`;
}

/* =========================
   RENDER SALAS
========================= */
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

/* =========================
   ENTRAR A SALA
========================= */
function enterRoom(i){
  currentRoom = i;
  chatMessages.innerHTML='';
  const userName = isStalkerless ? 'Stalkerless' : 'User'+Math.floor(Math.random()*1000);
  rooms[i].users.push(userName);
  renderRooms();
  renderConnectedUsers();
  showScreen(chatScreen);
  document.getElementById('currentRoomName').textContent = rooms[i].name;
  if(isStalkerless) rootBar.style.display='flex';
}

/* =========================
   CHAT
========================= */
sendBtn.onclick = () => {
  if(globalFreeze) return alert("¡Chat congelado!");
  const msg = chatInput.value.trim();
  if(!msg && !imageInput.files.length) return;

  const user = isStalkerless ? 'Stalkerless' : 'User'+Math.floor(Math.random()*1000);

  if(activePrivateChat){
    // Chat privado
    const data = {user, msg, privateWith: activePrivateChat, time: new Date(), image: imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : null};
    privateTimeline.push(data);
    appendPrivateMessage(data);
    setTimeout(()=> removePrivateMessage(data), 60000);
  } else {
    // Sala pública
    const data = {user, msg, room: rooms[currentRoom].name, time: new Date(), image: imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : null};
    timeline.push(data);
    appendMessage(data);
    setTimeout(()=> removeMessage(data), 30000);
  }
  chatInput.value='';
  imageInput.value='';
};

function appendMessage(data){
  const div = document.createElement('div');
  div.className='glow';
  div.innerHTML = data.image ? `[${data.room}] <b>${data.user}</b>: ${data.msg}<br><img src="${data.image}" style="max-width:200px;">` : `[${data.room}] <b>${data.user}</b>: ${data.msg}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendPrivateMessage(data){
  const div = document.createElement('div');
  div.className='glow';
  div.innerHTML = data.image ? `<b>${data.user}</b>: ${data.msg}<br><img src="${data.image}" style="max-width:200px;">` : `<b>${data.user}</b>: ${data.msg}`;
  privateChatMessages.appendChild(div);
  privateChatMessages.scrollTop = privateChatMessages.scrollHeight;
}

function removeMessage(data){
  chatMessages.querySelectorAll('div').forEach(div=>{
    if(div.textContent.includes(data.msg)) div.remove();
  });
  const index = timeline.indexOf(data);
  if(index!==-1) timeline.splice(index,1);
}

function removePrivateMessage(data){
  privateChatMessages.querySelectorAll('div').forEach(div=>{
    if(div.textContent.includes(data.msg)) div.remove();
  });
  const index = privateTimeline.indexOf(data);
  if(index!==-1) privateTimeline.splice(index,1);
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
  if(user === (isStalkerless ? 'Stalkerless' : null)) return;
  activePrivateChat = user;
  privateChatContainer.style.display='flex';
  privateChatName.textContent = user;
}

/* =========================
   BOTONES ROOT
========================= */
shadowBtn.onclick = () => alert("ShadowBan aplicado");
viewMapBtn.onclick = () => alert("ViewMap activado");
freezeBtn.onclick = () => { globalFreeze=!globalFreeze; alert(`Freeze global: ${globalFreeze}`); };
godViewBtn.onclick = () => alert("GodView activado");
vanishBtn.onclick = () => alert("Modo invisible activado");

/* =========================
   BOTONES NAVEGACIÓN
========================= */
document.getElementById("backToStartBtn").onclick = ()=>{
  showScreen(landingScreen);
  currentRoom = null;
  activePrivateChat = null;
  privateChatContainer.style.display='none';
};

document.getElementById("backToRoomsBtn").onclick = ()=>{
  showScreen(roomsListScreen);
  activePrivateChat = null;
  privateChatContainer.style.display='none';
  renderRooms();
};

/* =========================
   LOGIN STALKERLESS
========================= */
document.getElementById("rootLoginBtn").onclick = ()=>{
  const nick = prompt("Usuario Root:");
  const pass = prompt("Clave Root:");
  if(nick==='stalkerless' && pass==='stalkerless1234'){
    isStalkerless=true;
    alert("Bienvenido Stalkerless");
    showScreen(roomsListScreen);
    renderRooms();
  } else alert("Credenciales incorrectas");
};

/* =========================
   BOTÓN INICIALIZAR
========================= */
document.getElementById("initializeBtn").onclick = ()=>{
  showScreen(roomsListScreen);
  renderRooms();
};

/* =========================
   INICIALIZACIÓN
========================= */
renderRooms();
showScreen(landingScreen);
