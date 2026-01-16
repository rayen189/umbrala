/* =========================
   VARIABLES PRINCIPALES
========================= */
let isRoot = false;
let currentRoom = null;
let rooms = [
  {name:"Norte de Chile 🌵", users:[]},
  {name:"Sur de Chile 🗻", users:[]},
  {name:"Centro 🌃", users:[]},
  {name:"Global 🌎", users:[]},
  {name:"Curiosidades 🧠", users:[]},
  {name:"Sala Secreta 🕳️", users:[], hidden:true}
];
let timeline = [];

const landingScreen = document.getElementById('landingScreen');
const roomsListScreen = document.getElementById('roomsListScreen');
const chatScreen = document.getElementById('chatScreen');

const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const exitChatBtn = document.getElementById('exitChatBtn');
const roomsList = document.getElementById('roomsList');
const exitRoomsListBtn = document.getElementById('exitRoomsListBtn');
const imageInput = document.getElementById('imageInput');
const initializeBtn = document.getElementById('initializeBtn');

const totalUsersCounter = document.getElementById('totalUsersCounter');
const connectedUsers = document.getElementById('connectedUsers');
const emojiPicker = document.getElementById('emoji-picker');

/* =========================
   EMOJIS
========================= */
const emojiList = ["😎","🔥","💀","✨","🕳️","💻","⚡"];
emojiList.forEach(e=>{
  const span = document.createElement('span');
  span.className='emoji';
  span.textContent=e;
  span.onclick=()=> { chatInput.value+=e; chatInput.focus(); };
  emojiPicker.appendChild(span);
});

/* =========================
   FUNCIONES DE PANTALLA
========================= */
function showScreen(screen){
  [landingScreen, roomsListScreen, chatScreen].forEach(s=>s.style.display='none');
  screen.style.display='flex';
}

/* =========================
   INICIALIZAR
========================= */
initializeBtn.onclick = () => {
  showScreen(roomsListScreen);
  renderRooms();
};

/* =========================
   SALAS ESTILO PORTAL
========================= */
function renderRooms(){
  roomsList.innerHTML='';
  rooms.forEach((room,i)=>{
    if(room.hidden && !isRoot) return;
    const btn = document.createElement('button');
    btn.className='portal-btn';
    btn.textContent = room.name;
    btn.onclick = ()=> enterRoom(i);
    roomsList.appendChild(btn);
  });
  updateTotalUsers();
}

function updateTotalUsers(){
  let count = rooms.reduce((acc,r)=>acc+r.users.length,0);
  totalUsersCounter.textContent = "Usuarios conectados: " + count;
}

/* =========================
   ENTRAR A SALA
========================= */
function enterRoom(i){
  currentRoom = i;
  const userName = isRoot ? 'Root' : 'User'+Math.floor(Math.random()*1000);
  rooms[i].users.push(userName);
  showScreen(chatScreen);
  updateConnectedUsers();
  updateTotalUsers();
  renderRooms();
}

/* =========================
   CHAT
========================= */
function updateConnectedUsers(){
  connectedUsers.innerHTML='';
  if(currentRoom!==null){
    rooms[currentRoom].users.forEach(u=>{
      const li = document.createElement('li');
      li.textContent = u;
      connectedUsers.appendChild(li);
    });
  }
}

sendBtn.onclick = () => {
  if(currentRoom===null) return;
  const msg = chatInput.value.trim();
  if(!msg) return;
  const user = rooms[currentRoom].users[rooms[currentRoom].users.length-1];
  const data = {user,msg,room:rooms[currentRoom].name,time:new Date()};
  timeline.push(data);

  const div = document.createElement('div');
  div.textContent = `[${data.room}] ${data.user}: ${data.msg}`;
  div.className='glow';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatInput.value='';
  updateConnectedUsers();
  updateTotalUsers();
}

/* =========================
   BOTONES DE SALIR
========================= */
exitChatBtn.onclick = () => showScreen(roomsListScreen);
exitRoomsListBtn.onclick = () => showScreen(landingScreen);

/* =========================
   SUBIDA DE IMAGEN
========================= */
imageInput.onchange = e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(ev){
    const imgDiv = document.createElement('div');
    const img = document.createElement('img');
    img.src = ev.target.result;
    img.style.maxWidth = "150px";
    img.style.display = "block";
    imgDiv.appendChild(img);
    chatMessages.appendChild(imgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  reader.readAsDataURL(file);
  imageInput.value = "";
}
