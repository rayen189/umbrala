const screens = {
  landing: document.getElementById("landingScreen"),
  rooms: document.getElementById("roomsScreen"),
  chat: document.getElementById("chatScreen")
};

const rooms = [
  "Norte de Chile 🌵",
  "Centro 🌆",
  "Sur de Chile 🗻",
  "Global 🌍",
  "Directo al Vacío 🕳️"
];

const users = ["Anon1", "Anon2", "Anon3", "Anon4"];

let currentRoom = null;

function show(screen) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

/* INICIO */
document.getElementById("initializeBtn").onclick = () => {
  show(screens.rooms);
  renderRooms();
};

/* SALAS */
function renderRooms() {
  const list = document.getElementById("roomsList");
  list.innerHTML = "";

  rooms.forEach(room => {
    const btn = document.createElement("button");
    btn.textContent = room;
    btn.onclick = () => enterRoom(room);
    list.appendChild(btn);
  });
}

function enterRoom(room) {
  currentRoom = room;
  document.getElementById("roomTitle").textContent = room;
  document.getElementById("messages").innerHTML = "";
  renderUsers();
  show(screens.chat);
}

document.getElementById("backToRooms").onclick = () => {
  show(screens.rooms);
};

document.getElementById("backToStart").onclick = () => {
  show(screens.landing);
};

/* USUARIOS */
function renderUsers() {
  const ul = document.getElementById("usersList");
  ul.innerHTML = "";
  users.forEach(u => {
    const li = document.createElement("li");
    li.textContent = u;
    ul.appendChild(li);
  });
}

/* MENSAJES */
document.getElementById("sendBtn").onclick = () => {
  const input = document.getElementById("messageInput");
  if (!input.value) return;

  const msg = document.createElement("div");
  msg.className = "message";
  msg.textContent = input.value;
  document.getElementById("messages").appendChild(msg);
  input.value = "";

  setTimeout(() => {
    msg.classList.add("fade");
    setTimeout(() => msg.remove(), 1000);
  }, 30000);
};
