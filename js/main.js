/* =========================
   VARIABLES
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
let globalFreeze = false;
let timeline = [];

/* =========================
   SELECTORES
========================= */
const landingScreen = document.getElementById('landingScreen');
const roomsListScreen = document.getElementById('roomsListScreen');
const chatScreen = document.getElementById('chatScreen');
const rootScreen = document.getElementById('rootScreen');

const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');
const exitChatBtn = document.getElementById('exitChatBtn');
const roomsList = document.getElementById('roomsList');
const exitRoomsListBtn = document.getElementById('exitRoomsListBtn');
const imageInput = document.getElementById('imageInput');
const initializeBtn = document.getElementById('initializeBtn');

/* =========================
   EMOJIS
========================= */
const emojiPicker = document.getElementById('emoji-picker');
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
  [landingScreen, roomsListScreen, chatScreen, rootScreen].forEach(s=>s.style.display='none');
  screen.style.display='flex';
}

/* =========================
   BOTÓN INICIALIZAR
========================= */
initializeBtn.onclick = () => {
  showScreen(roomsListScreen);
  renderRooms();
};

/* =========================
   RENDER SALAS PORTAL
========================= */
function renderRooms(){
  roomsList.innerHTML='';
  rooms.forEach((room,i)=>{
    if(room.hidden && !isRoot) return;
    const btn = document.createElement('button');
    btn.className = 'portal-btn';
    btn.textContent = room.name;
    btn.onclick = () => enterRoom(i);
    roomsList.appendChild(btn);
  });
}

exitRoomsListBtn.onclick = () => showScreen(landingScreen);

function enterRoom(i){
  currentRoom = i;
  chatMessages.innerHTML='';
  showScreen(chatScreen);
}

/* =========================
   CHAT
========================= */
sendBtn.onclick = () => {
  if(globalFreeze || currentRoom===null) return;
  const msg = chatInput.value.trim();
  if(!msg) return;
  const data = {user:'User'+Math.floor(Math.random()*1000), msg, room:rooms[currentRoom].name, time:new Date()};
  timeline.push(data);
  const div = document.createElement('div');
  div.textContent = `[${data.room}] ${data.user}: ${data.msg}`;
  div.className='glow';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatInput.value='';
};

exitChatBtn.onclick = () => showScreen(roomsListScreen);

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
