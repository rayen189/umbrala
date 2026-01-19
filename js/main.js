const screens = {
  boot: document.getElementById("bootScreen"),
  rooms: document.getElementById("roomsScreen"),
  chat: document.getElementById("chatScreen")
};

const modal = document.getElementById("nickModal");
const modalTitle = document.getElementById("modalTitle");
const nickInput = document.getElementById("nickInput");
const nickError = document.getElementById("nickError");

let currentRoom = "";
let nickname = "";

/* ===== SCREEN SWITCH ===== */
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

/* ===== BOOT SEQUENCE ===== */
setTimeout(() => {
  showScreen("rooms");
}, 2200);

/* ===== CLICK EN SALAS (MÓVIL SAFE) ===== */
document.addEventListener("click", e => {
  const room = e.target.closest(".room");
  if (!room) return;

  currentRoom = room.textContent.trim();
  modalTitle.textContent = currentRoom;
  nickInput.value = "";
  nickError.textContent = "";

  modal.classList.remove("hidden");
  modal.classList.add("active");
});

/* ===== ENTRAR AL CHAT ===== */
document.getElementById("enterRoom").onclick = () => {
  const value = nickInput.value.trim();
  if (value.length < 2) {
    nickError.textContent = "Nickname muy corto";
    return;
  }

  nickname = value;
  modal.classList.remove("active");
  modal.classList.add("hidden");

  document.getElementById("chatHeader").textContent = currentRoom;
  showScreen("chat");
};

/* ===== RANDOM NICK ===== */
document.getElementById("randomNick").onclick = () => {
  nickInput.value = "anon" + Math.floor(Math.random() * 9999);
};

/* ===== VOLVER A SALAS ===== */
document.getElementById("backBtn").onclick = () => {
  showScreen("rooms");
};
