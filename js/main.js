const screens = {
  boot: document.getElementById("bootScreen"),
  rooms: document.getElementById("roomsScreen"),
  chat: document.getElementById("chatScreen")
};

const terminal = document.getElementById("terminal");
const roomsList = document.getElementById("roomsList");
const nickModal = document.getElementById("nickModal");
const nickInput = document.getElementById("nickInput");

const msgInput = document.getElementById("msgInput");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const fileBtn = document.getElementById("fileBtn");
const fileInput = document.getElementById("fileInput");
const backBtn = document.getElementById("backToRooms");
const roomTitle = document.getElementById("roomTitle");
const roomCount = document.getElementById("roomCount");
const usersList = document.getElementById("usersList");

let currentRoom = "";
let nick = "";

/* ================= BOOT ================= */

const bootLines = [
  "Inicializando Umbrala...",
  "Comunica en las sombras",
  "Anónimo. Sin rastro",
  "Efímero. Sin logs",
  "Seguro. Encriptado",
  "Sistema activo ✔"
];

let bootIndex = 0;

const bootInterval = setInterval(() => {
  terminal.innerHTML += bootLines[bootIndex] + "<br>";
  bootIndex++;
  if (bootIndex === bootLines.length) {
    clearInterval(bootInterval);
    setTimeout(() => switchScreen("rooms"), 700);
  }
}, 450);

/* ================= SALAS ================= */

const rooms = [
  { name:"🌍 Global", users:3 },
  { name:"🌵 Norte", users:2 },
  { name:"🏙 Centro", users:1 },
  { name:"🌊 Sur", users:0 },
  { name:"🧠 Curiosidades", users:0 },
  { name:"🕳️ Vacío", users:0 }
];

roomsList.innerHTML = "";

rooms.forEach(room => {
  const div = document.createElement("div");
  div.className = "room";
  div.innerHTML = `${room.name} <span>👥 ${room.users}</span>`;

  div.onclick = () => {
    currentRoom = room.name;
    roomTitle.textContent = room.name;
    roomCount.textContent = `👥 ${room.users + 1}`;
    nickModal.classList.add("active");
  };

  roomsList.appendChild(div);
});

/* ================= NICK ================= */

document.getElementById("randomNick").onclick = () => {
  nickInput.value = "ghost_" + Math.floor(Math.random() * 9999);
};

document.getElementById("enterChat").onclick = () => {
  if (!nickInput.value.trim()) return;
  nick = nickInput.value.trim();
  nickModal.classList.remove("active");
  usersList.innerHTML = `<div>${nick}</div>`;
  messages.innerHTML = "";
  switchScreen("chat");
};

/* ================= CHAT ================= */

backBtn.onclick = () => switchScreen("rooms");

sendBtn.onclick = sendMessage;

msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

fileBtn.onclick = () => fileInput.click();

fileInput.onchange = () => {
  const f = fileInput.files[0];
  if (!f) return;

  const url = URL.createObjectURL(f);

  if (f.type.startsWith("image")) addMessage("image", url);
  if (f.type.startsWith("audio")) addMessage("audio", url);

  fileInput.value = "";
};

function sendMessage() {
  if (!msgInput.value.trim()) return;
  addMessage("text", `${nick}: ${msgInput.value}`);
  msgInput.value = "";
}

/* ================= MENSAJES ================= */

function addMessage(type, content) {
  const div = document.createElement("div");
  div.className = "message";

  if (type === "text") div.textContent = content;
  if (type === "image") div.innerHTML = `<img src="${content}" width="140">`;
  if (type === "audio") div.innerHTML = `<audio src="${content}" controls></audio>`;

  messages.appendChild(div);
}

/* ================= UTILS ================= */

function switchScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}
