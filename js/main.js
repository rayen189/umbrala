window.onload=()=>{

let isStalkerless=false, currentRoom=null, activePrivateChat=null;
let timeline=[], privateTimeline=[];
let globalFreeze=false;

let rooms=[
  {name:"Norte de Chile 🌵", users:[]},
  {name:"Sur de Chile 🗻", users:[]},
  {name:"Centro 🌃", users:[]},
  {name:"Global 🌎", users:[]},
  {name:"Curiosidades 🧠", users:[]},
  {name:"Directo al 🕳️", users:[], hidden:true}
];

const landingScreen=document.getElementById('landingScreen');
const roomsListScreen=document.getElementById('roomsListScreen');
const chatScreen=document.getElementById('chatScreen');

const chatInput=document.getElementById('chatInput');
const chatMessages=document.getElementById('chatMessages');
const privateChatMessages=document.getElementById('privateChatMessages');
const sendBtn=document.getElementById('sendBtn');
const roomsList=document.getElementById('roomsList');
const connectedUsersList=document.getElementById('connectedUsers');
const totalUsersCounter=document.getElementById('totalUsersCounter');

const rootBar=document.getElementById('rootBar');
const shadowBtn=document.getElementById('shadowBtn');
const viewMapBtn=document.getElementById('viewMapBtn');
const freezeBtn=document.getElementById('freezeBtn');
const godViewBtn=document.getElementById('godViewBtn');
const vanishBtn=document.getElementById('vanishBtn');

const privateChatContainer=document.getElementById('privateChatContainer');
const privateChatName=document.getElementById('privateChatName');

const imageBtn=document.getElementById('imageBtn');
const imageInput=document.getElementById('imageInput');

function showScreen(screen){
  document.querySelectorAll('.screen').forEach(s=>{s.classList.remove('active'); s.classList.add('inactive');});
  screen.classList.remove('inactive'); screen.classList.add('active');
}

function updateTotalUsers(){
  let allUsers=[]; rooms.forEach(r=>allUsers.push(...r.users));
  const unique=[...new Set(allUsers)];
  totalUsersCounter.textContent=`Usuarios conectados: ${unique.length}`;
}

function renderRooms(){
  roomsList.innerHTML='';
  rooms.forEach((r,i)=>{
    if(r.hidden && !isStalkerless) return;
    const btn=document.createElement('button');
    btn.textContent=`${r.name} (${r.users.length})`;
    btn.className='portal-btn';
    btn.onclick=()=>enterRoom(i);
    roomsList.appendChild(btn);
  });
  updateTotalUsers();
}

function enterRoom(i){
  currentRoom=i; chatMessages.innerHTML='';
  const user=isStalkerless?'Stalkerless':'User'+Math.floor(Math.random()*1000);
  rooms[i].users.push(user); renderRooms(); showScreen(chatScreen);
  document.getElementById('currentRoomName').textContent=rooms[i].name;
  renderConnectedUsers();
}

function appendMessage(d){
  const div=document.createElement('div');
  if(d.img) { const img=document.createElement('img'); img.src=d.img; img.style.maxWidth='150px'; div.appendChild(img); }
  div.appendChild(document.createTextNode(d.msg ? ` ${d.msg}` : ''));
  div.className='glow'; chatMessages.appendChild(div); chatMessages.scrollTop=chatMessages.scrollHeight;
}
function appendPrivateMessage(d){
  const div=document.createElement('div');
 
