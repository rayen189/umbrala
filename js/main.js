const boot = document.getElementById("bootScreen");
const rooms = document.getElementById("roomsScreen");
const chat = document.getElementById("chatScreen");

const out = document.getElementById("terminalOutput");
const messages = document.getElementById("messages");
const usersList = document.getElementById("usersList");

let currentRoom = null;
let nickname = "User" + Math.floor(Math.random()*999);
let users = [];

/* BOOT */
const lines = [
 "> UMBRALA SYSTEM",
 "> Secure routing enabled",
 "> Anonymous mode active",
 "> Loading nodes...",
 "> Ready."
];
let i = 0;

function type(){
  if(i < lines.length){
    out.textContent += lines[i++] + "\n";
    setTimeout(type, 400);
  } else {
    setTimeout(() => switchScreen(boot, rooms), 800);
  }
}
type();

/* SCREEN SWITCH */
function switchScreen(from, to){
  from.classList.add("exit");
  setTimeout(()=>{
    from.classList.remove("active","exit");
    to.classList.add("active");
  },600);
}

/* ROOMS */
document.querySelectorAll(".room").forEach(btn=>{
  btn.onclick = () => enterRoom(btn.dataset.room);
});

function enterRoom(room){
  currentRoom = room;
  messages.innerHTML = "";
  usersList.innerHTML = "";
  users = [nickname];

  document.getElementById("roomTitle").textContent = room;
  updateUsers();

  systemMessage(`Has entrado a ${room}`);
  switchScreen(rooms, chat);
}

/* USERS */
function updateUsers(){
  document.getElementById("roomUsers").textContent = "👥 " + users.length;
  usersList.innerHTML = "";
  users.forEach(u=>{
    const li = document.createElement("li");
    li.textContent = u;
    li.onclick = () => privateChat(u);
    usersList.appendChild(li);
  });
}

/* MESSAGES */
document.getElementById("sendBtn").onclick = sendMessage;

function sendMessage(){
  const input = document.getElementById("msgInput");
  if(!input.value) return;

  addMessage(nickname, input.value);
  input.value = "";
}

function addMessage(user, text){
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = user + ": " + text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function systemMessage(text){
  const div = document.createElement("div");
  div.className = "message";
  div.style.opacity = ".6";
  div.textContent = "[SYSTEM] " + text;
  messages.appendChild(div);
}

/* IMAGE UPLOAD */
document.getElementById("imgInput").onchange = e =>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () =>{
    const img = document.createElement("img");
    img.src = reader.result;
    img.style.maxWidth = "120px";
    const wrap = document.createElement("div");
    wrap.className = "message";
    wrap.appendChild(img);
    messages.appendChild(wrap);
  };
  reader.readAsDataURL(file);
};

/* BACK */
document.getElementById("backRooms").onclick = () =>{
  switchScreen(chat, rooms);
};

/* ROOT */
document.getElementById("rootBtn").onclick = ()=>{
  const u = prompt("root");
  const p = prompt("password");
  if(u === "stalkerless" && p === "1234"){
    document.getElementById("rootBar").classList.add("active");
    systemMessage("ROOT MODE ENABLED");
  }
};

function privateChat(user){
  alert("Chat privado con " + user + " (en desarrollo)");
}

const usersPanel = document.querySelector(".users-panel");
const usersToggle = document.getElementById("usersToggle");

if(usersToggle){
  usersToggle.onclick = ()=>{
    usersPanel.classList.toggle("active");
  };
}
