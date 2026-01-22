console.log("🟢 main.js cargado");

/* ================= ELEMENTOS ================= */

const screens = {
  boot: document.getElementById("bootScreen"),
  rooms: document.getElementById("roomsScreen"),
  chat: document.getElementById("chatScreen")
};

const terminal = document.getElementById("terminal");
const roomsList = document.getElementById("roomsList");

const nickModal = document.getElementById("nickModal");
const nickInput = document.getElementById("nickInput");
const randomNickBtn = document.getElementById("randomNick");
const enterChatBtn = document.getElementById("enterChat");

const backBtn = document.getElementById("backToRooms");
const roomTitle = document.getElementById("roomTitle");

/* ================= ESTADO GLOBAL ================= */

window.nick = "";
window.currentRoom = null;

/* ================= BOOT ================= */

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

  if (bootIndex === bootLines.length) {
    clearInterval(bootInterval);
    setTimeout(() => switchScreen("rooms"), 700);
  }
}, 450);

/* ================= SALAS ================= */

const rooms = [
  { id: "global", name: "🌍 Global" },
  { id: "norte", name: "🌵 Norte" },
  { id: "centro", name: "🏙 Centro" },
  { id: "sur", name: "🌊 Sur" },
  { id: "curiosidades", name: "🧠 Curiosidades" },
  { id: "vacio", name: "🕳 Vacío" }
];

roomsList.innerHTML = "";

rooms.forEach(room => {
  const div = document.createElement("div");
  div.className = "room";
  div.textContent = room.name;

  div.onclick = () => {
    console.log("👉 Sala seleccionada:", room.id);

    window.currentRoom = room.id;
    roomTitle.textContent = room.name;

    nickModal.classList.add("active");
    nickInput.focus();
  };

  roomsList.appendChild(div);
});

/* ================= NICK ================= */

randomNickBtn.onclick = () => {
  nickInput.value = "ghost_" + Math.floor(Math.random() * 9000 + 1000);
};

enterChatBtn.onclick = () => {
  const value = nickInput.value.trim();

  if (!value) {
    console.warn("⚠️ Nick vacío");
    return;
  }

  if (!window.currentRoom) {
    console.error("❌ No hay sala seleccionada");
    return;
  }

  window.nick = value;
  nickModal.classList.remove("active");

  switchScreen("chat");

  // conexión segura con chat.js
  if (typeof window.joinRoom === "function") {
    console.log("🔌 joinRoom()", window.currentRoom);
    window.joinRoom(window.currentRoom);
  } else {
    console.error("❌ joinRoom no está definido (chat.js no cargó)");
  }
};

/* ================= VOLVER A SALAS ================= */

backBtn.onclick = () => {
  console.log("↩️ Volviendo a salas");

  window.currentRoom = null;
  switchScreen("rooms");
};

/* ================= UTIL ================= */

function switchScreen(name) {
  Object.values(screens).forEach(screen =>
    screen.classList.remove("active")
  );

  if (!screens[name]) {
    console.error("❌ Screen no existe:", name);
    return;
  }

  screens[name].classList.add("active");
}
