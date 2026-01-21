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
const randomNick = document.getElementById("randomNick");
const enterChat = document.getElementById("enterChat");

const backBtn = document.getElementById("backToRooms");
const roomTitle = document.getElementById("roomTitle");

/* ================= ESTADO GLOBAL ================= */

window.nick = "";
window.currentRoom = "";

/* ================= BOOT ================= */

const bootLines = [
  "Inicializando Umbrala...",
  "Comunica en las sombras",
  "Anónimo. Sin rastro",
  "Efímero. Sin logs",
  "Sistema activo ✔"
];

let i = 0;
const bootInterval = setInterval(() => {
  terminal.innerHTML += bootLines[i++] + "<br>";
  if (i === bootLines.length) {
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
  div.innerHTML = room.name;

  div.onclick = () => {
    console.log("👉 CLICK SALA:", room.id);
    window.currentRoom = room.id;
    roomTitle.textContent = room.name;
    nickModal.classList.add("active");
  };

  roomsList.appendChild(div);
});

/* ================= NICK ================= */

randomNick.onclick = () => {
  nickInput.value = "ghost_" + Math.floor(Math.random() * 9999);
};

enterChat.onclick = () => {
  if (!nickInput.value.trim() || !window.currentRoom) return;

  window.nick = nickInput.value.trim();
  nickModal.classList.remove("active");

  switchScreen("chat");

  // 🔥 ESTA LÍNEA ES CLAVE
  if (typeof window.joinRoom === "function") {
    window.joinRoom(window.currentRoom);
  } else {
    console.error("❌ joinRoom no existe");
  }
};

/* ================= BOTÓN VOLVER ================= */

backBtn.onclick = () => {
  switchScreen("rooms");
};

/* ================= UTIL ================= */

function switchScreen(name) {
  Object.values(screens).forEach(s =>
    s.classList.remove("active")
  );

  if (!screens[name]) {
    console.error("❌ Screen no existe:", name);
    return;
  }

  screens[name].classList.add("active");
}
