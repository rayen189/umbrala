/* =========================
   UMBRALA MAIN.JS FINAL
========================= */

let currentRoom = null;
let activePrivateChat = null;
let isRoot = false;

const ROOM_MESSAGE_TTL = 30000;   // 30s
const PRIVATE_MESSAGE_TTL = 60000; // 60s

// Screens
const landingScreen = document.getElementById("landingScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");

// UI
const roomTitle = document.getElementById("roomTitle");
const messagesBox = document.getElementById("messages");
const usersList = document.getElementById("usersList");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Fake users (demo)
let connectedUsers = [
  "ShadowFox", "VoidX", "Anon47", "Lúgubre", "Specter"
];

/* =========================
   SCREEN CONTROL
========================= */

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
    s.style.display = "none";
  });

  screen.style.display = "flex";
  setTimeout(() => screen.classList.add("active"), 10);
}

/* =========================
   INIT
========================= */

document.getElementById("initBtn")?.addEventListener("click", () => {
  showScreen(roomsScreen);
  renderRooms();
});

/* =========================
   ROOMS
========================= */

const rooms = [
  { id: "norte", name: "Norte de Chile 🌵" },
  { id: "centro", name: "Centro 🌃" },
  { id: "sur", name: "Sur de Chile 🗻" },
  { id: "global", name: "Global 🌎" },
  { id: "void", name: "Directo al Vacío 🕳️" }
];

function renderRooms() {
  const container = document.getElementById("roomsContainer");
  container.innerHTML = "";

  rooms.forEach(room => {
    const card = document.createElement("div");
    card.className = "room-card";
    card.innerHTML = `
      <div class="room-name">${room.name}</div>
      <div class="room-count">${connectedUsers.length}</div>
    `;
    card.onclick = () => enterRoom(room.id, room.name);
    container.appendChild(card);
  });

  document.getElementById("globalUserCount").innerText = connectedUsers.length;
}

function enterRoom(roomId, roomName) {
  currentRoom = roomId;
  activePrivateChat = null;

  roomTitle.innerText = roomName;
  messagesBox.innerHTML = "";

  renderUsers();
  showScreen(chatScreen);
}

/* =========================
   USERS
========================= */

function renderUsers() {
  usersList.innerHTML = "";

  connectedUsers.forEach(user => {
    const li = document.createElement("li");
    li.innerText = user;
    li.onclick = () => openPrivateChat(user);
    usersList.appendChild(li);
  });
}

function openPrivateChat(user) {
  activePrivateChat = user;
  roomTitle.innerText = `Chat privado con ${user}`;
  messagesBox.innerHTML = "";
}

/* =========================
   MESSAGES
========================= */

sendBtn.addEventListener("click", sendMessage);

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerText = text;
  messagesBox.appendChild(msg);

  messageInput.value = "";
  messagesBox.scrollTop = messagesBox.scrollHeight;

  const ttl = activePrivateChat ? PRIVATE_MESSAGE_TTL : ROOM_MESSAGE_TTL;

  setTimeout(() => {
    msg.classList.add("fade-out");
    setTimeout(() => msg.remove(), 1000);
  }, ttl);
}

/* =========================
   ROOT LOGIN
========================= */

function rootLogin(user, pass) {
  if (user === "stalkerless" && pass === "stalkerless1234") {
    isRoot = true;
    document.body.classList.add("root-mode");
    alert("Modo ROOT activado");
  }
}

/* =========================
   BACK BUTTONS
========================= */

document.getElementById("backToStartBtn")?.addEventListener("click", () => {
  currentRoom = null;
  showScreen(landingScreen);
});

document.getElementById("backToRoomsBtn")?.addEventListener("click", () => {
  currentRoom = null;
  activePrivateChat = null;
  showScreen(roomsScreen);
});

/* =========================
   AUTO START
========================= */

showScreen(landingScreen);
