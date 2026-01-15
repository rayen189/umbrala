document.addEventListener('DOMContentLoaded',()=>{

// ---------- Variables ----------
const landingScreen=document.getElementById('landing-screen');
const roomsScreen=document.getElementById('rooms-screen');
const chatScreen=document.getElementById('chat-screen');
const privateChatScreen=document.getElementById('private-chat');

const initBtn=document.getElementById('init-btn');
const rootBtn=document.getElementById('root-btn');
const roomsList=document.getElementById('rooms-list');
const chatRoomName=document.getElementById('chat-room-name');
const chatContainer=document.getElementById('chat-container');
const chatInput=document.getElementById('chat-input');
const sendBtn=document.getElementById('send-btn');
const chatFile=document.getElementById('chat-file');
const sendFileBtn=document.getElementById('send-file-btn');
const usersList=document.getElementById('users-list');
const exitRoom=document.getElementById('exit-room');
const userCount=document.getElementById('user-count');

const privateUserSpan=document.getElementById('private-user');
const privateContainer=document.getElementById('private-container');
const privateInput=document.getElementById('private-input');
const privateFile=document.getElementById('private-file');
const privateSend=document.getElementById('private-send');
const privateSendFile=document.getElementById('private-send-file');
const closePrivate=document.getElementById('close-private');

const homeBtn=document.getElementById('home-btn');

// Root login
const rootLoginScreen=document.getElementById('root-login');
const rootNickInput=document.getElementById('root-nick');
const rootPassInput=document.getElementById('root-pass');
const rootLoginBtn=document.getElementById('root-login-btn');
const rootError=document.getElementById('root-error');

let currentRoom='';
let currentUser='User'+Math.floor(Math.random()*1000);
const rootUser={nick:'root',password:'1234'};
let usersByRoom={};
let messagesByRoom={};
let privateMessages={};

const rooms=['General','Norte','Sur','La Serena','VIP'];

// ---------- Funciones ----------
function showRooms(){
  roomsList.innerHTML='';
  rooms.forEach(r=>{
    if(!usersByRoom[r]) usersByRoom[r]=[];
    if(!messagesByRoom[r]) messagesByRoom[r]=[];
    const div=document.createElement('div');
    div.innerHTML=`<strong>${r}</strong> - Usuarios conectados: ${usersByRoom[r].length} 
                   <button onclick="enterRoom('${r}')">Entrar</button>`;
    roomsList.appendChild(div);
  });
}

function renderChat(){
  chatContainer.innerHTML='';
  messagesByRoom[currentRoom].forEach(m=>{
    const div=document.createElement('div');
    div.className=(m.user===currentUser)?'user new-msg':(m.user==='root'?'admin':'user');
    if(m.file){
      if(m.type.startsWith('image')){
        const img=document.createElement('img');
        img.src=m.file;
        img.style.maxWidth='200px'; img.style.borderRadius='10px';
        div.appendChild(document.createTextNode(`${m.user}: `));
        div.appendChild(img);
      } else if(m.type.startsWith('video')){
        const vid=document.createElement('video');
        vid.src=m.file;
        vid.controls=true; vid.style.maxWidth='250px'; vid.style.borderRadius='10px';
        div.appendChild(document.createTextNode(`${m.user}: `));
        div.appendChild(vid);
      }
    } else {
      div.textContent=`${m.user}: ${m.text}`;
    }
    chatContainer.appendChild(div);
  });
  chatContainer.scrollTop=chatContainer.scrollHeight;
}

function renderUsers(){
  usersList.innerHTML='';
  usersByRoom[currentRoom].forEach(u=>{
    const li=document.createElement('li');
    li.textContent=u;
    if(u!==currentUser) li.onclick=()=>openPrivate(u);
    if(u==='root') li.style.color='#ff00ff';
    usersList.appendChild(li);
  });
  userCount.textContent=usersByRoom[currentRoom].length;
}

function openPrivate(u){
  privateUserSpan.textContent=u;
  if(!privateMessages[u]) privateMessages[u]=[];
  privateContainer.innerHTML='';
  privateMessages[u].forEach(m=>{
    const div=document.createElement('div');
    div.textContent=`${m.user}: ${m.text || ''}`;
    if(m.file){
      if(m.type.startsWith('image')){
        const img=document.createElement('img'); img.src=m.file; img.style.maxWidth='200px'; img.style.borderRadius='10px';
        div.appendChild(img);
      } else if(m.type.startsWith('video')){
        const vid=document.createElement('video'); vid.src=m.file; vid.controls=true; vid.style.maxWidth='250px'; vid.style.borderRadius='10px';
        div.appendChild(vid);
      }
    }
    privateContainer.appendChild(div);
  });
  chatScreen.style.display='none';
  privateChatScreen.style.display='block';
}

// ---------- Eventos ----------
initBtn.onclick=()=>{
  landingScreen.style.display='none';
  roomsScreen.style.display='block';
  showRooms();
}

rootBtn.onclick=()=>{ landingScreen.style.display='none'; rootLoginScreen.style.display='block'; }

rootLoginBtn.onclick=()=>{
  const nick=rootNickInput.value.trim(), pass=rootPassInput.value.trim();
  if(nick===rootUser.nick && pass===rootUser.password){
    currentUser=rootUser.nick;
    rootLoginScreen.style.display='none';
    roomsScreen.style.display='block';
    showRooms();
  } else rootError.textContent='Credenciales incorrectas';
}

window.enterRoom=(r)=>{
  currentRoom=r;
  chatRoomName.textContent=r;
  if(!usersByRoom[r].includes(currentUser)) usersByRoom[r].push(currentUser);
  renderChat(); renderUsers();
  roomsScreen.style.display='none'; chatScreen.style.display='block';
}

exitRoom.onclick=()=>{
  if(currentRoom && usersByRoom[currentRoom]) usersByRoom[currentRoom]=usersByRoom[currentRoom].filter(u=>u!==currentUser);
  chatScreen.style.display='none';
  roomsScreen.style.display='block';
  showRooms();
}

sendBtn.onclick=()=>{
  const t=chatInput.value.trim();
  if(!t) return;
  messagesByRoom[currentRoom].push({user:currentUser,text:t});
  chatInput.value='';
  renderChat();
}
chatInput.addEventListener('keypress',e=>{if(e.key==='Enter') sendBtn.click();})

sendFileBtn.onclick=()=>{
  const f=chatFile.files[0]; if(!f) return;
  const reader=new FileReader();
  reader.onload=(e)=>{ messagesByRoom[currentRoom].push({user:currentUser,file:e.target.result,type:f.type}); renderChat(); };
  reader.readAsDataURL(f); chatFile.value='';
}

privateSend.onclick=()=>{
  const t=privateInput.value.trim(); const u=privateUserSpan.textContent; if(!t) return;
  if(!privateMessages[u]) privateMessages[u]=[];
  privateMessages[u].push({user:currentUser,text:t}); privateInput.value='';
  openPrivate(u);
}

privateSendFile.onclick=()=>{
  const f=privateFile.files[0]; const u=privateUserSpan.textContent; if(!f) return;
  const reader=new FileReader();
  reader.onload=(e)=>{ if(!privateMessages[u]) privateMessages[u]=[]; privateMessages[u].push({user:currentUser,file:e.target.result,type:f.type}); openPrivate(u); };
  reader.readAsDataURL(f); privateFile.value='';
}

closePrivate.onclick=()=>{ privateChatScreen.style.display='none'; chatScreen.style.display='block'; renderUsers(); }

homeBtn.onclick=()=>{
  landingScreen.style.display='block';
  roomsScreen.style.display='none';
  chatScreen.style.display='none';
  privateChatScreen.style.display='none';
}

// ---------- Inicial render ----------
showRooms();

});
