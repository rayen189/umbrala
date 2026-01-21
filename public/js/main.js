/* =====================================================
   ESTADO GLOBAL (NO volver a declarar en otros JS)
===================================================== */

window.nick = "";
window.currentRoom = "";

const screens = {
  boot: document.getElementById("bootScreen"),
  rooms: document.getElementById("roomsScreen"),
  chat: document.getElementById("chatScreen")
};

/* =====================================================
   ELEMENTOS DOM
===================================================== */

const terminal = document.getElementById("terminal");
const roomsList = document.getElementById("roomsList");

const nickModal = document.getElementById("nickModal");
const nickInput = document.getElementById("nickInput");
const randomNick = document.getElementById("randomNick");
const enterChat = document.getElementById("enterChat");

const backBtn = document.getElementById("backToRooms");
const roomTitle = document.getElementById("roomTitle");

/* =====================================================
   BOOT (terminal inicial)
===================================================== */

const bootLines = [
  "Inicializando Umbrala...",
  "Comunica en las sombras",
  "Anónimo. Sin rastro",
  "Efímero. Sin logs",
  "Sistema activo ✔"
];

let bootIndex = 0;

const bootInterval = setInterval(() => {
  terminal.innerHTML += bootLines[bootIndex] + "<br>";
  bootIndex++;

  if (bootIndex >= bootLines.length) {
    clearInterval(bootInterval);
    setTimeout(() => switchScreen("rooms"), 800);
  }
}, 450);

/* =====================================================
   SALAS
===================================================== */

const rooms = [
  { id: "global", name: "🌍 Global" },
  { id: "norte", name: "🌵 Norte" },
  { id: "centro", name: "🏙 Centro" },
  { id: "sur", name: "🌊 Sur" },
  { id: "curiosidades", name: "🧠 Curiosidades" },
  { id: "vacio", name: "🕳️ Vacío" }
];

roomsList.innerHTML = "";

rooms.forEach(room => {
  const div = document.createElement("div");
  div.className = "room";
  div.innerHTML = `${room.name} <span>👥</span>`;

  div.addEventListener("click", () => {
    console.log("CLICK SALA:", room.id);
    window.currentRoom = room.id;
    roomTitle.textContent = room.name;
    nickModal.classList.add("active");
  });

  roomsList.appendChild(div);
});

/* =====================================================
   NICK
===================================================== */

randomNick.addEventListener("click", () => {
  nickInput.value = "ghost_" + Math.floor(Math.random() * 9999);
});

enterChat.addEventListener("click", () => {
  const value = nickInput.value.trim();
  if (!value || !window.currentRoom) return;

  window.nick = value;
  nickModal.classList.remove("active");

  switchScreen("chat");

  // 👉 chat.js escucha esto
  if (window.joinRoom) {
    window.joinRoom(window.nick, window.currentRoom);
  }
});

/* =====================================================
   BOTÓN VOLVER
===================================================== */

backBtn.addEventListener("click", () => {
  switchScreen("rooms");
});

/* =====================================================
   UTILIDADES
===================================================== */

function switchScreen(name) {
  Object.values(screens).forEach(screen => {
    screen.classList.remove("active");
  });

  screens[name].classList.add("active");
}
