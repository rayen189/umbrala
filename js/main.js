const home = document.getElementById("home");
const chat = document.getElementById("chat");
const rootPanel = document.getElementById("rootPanel");

const roomSelect = document.getElementById("roomSelect");
const roomName = document.getElementById("roomName");
const messages = document.getElementById("messages");

const ROOT_PASS = "umbrala-root";

/* ===== SALAS POR SESIÓN ===== */
const savedRoom = sessionStorage.getItem("room");
if (savedRoom) enterRoom(savedRoom);

document.getElementById("enterRoom").onclick = () => {
  if (!roomSelect.value) return;
  sessionStorage.setItem("room", roomSelect.value);
  enterRoom(roomSelect.value);
};

function enterRoom(room) {
  home.classList.add("hidden");
  chat.classList.remove("hidden");
  roomName.textContent = "Sala: " + room;
}

document.getElementById("exitRoom").onclick = () => {
  sessionStorage.clear();
  location.reload();
};

/* ===== CHAT EFÍMERO ===== */
document.getElementById("chatForm").onsubmit = e => {
  e.preventDefault();
  const input = document.getElementById("messageInput");
  createMessage(input.value);
  input.value = "";
};

function createMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message";
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
  setTimeout(() => msg.remove(), 6000);
}

/* ===== ROOT MODE ===== */
document.getElementById("rootTrigger").ondblclick = () => {
  const pass = prompt("Clave Root:");
  if (pass === ROOT_PASS) {
    home.classList.add("hidden");
    chat.classList.add("hidden");
    rootPanel.classList.remove("hidden");

    document.getElementById("rootInfo").textContent =
      "Sala activa: " + (sessionStorage.getItem("room") || "ninguna");
  }
};

document.getElementById("clearMessages").onclick = () => {
  messages.innerHTML = "";
};

document.getElementById("forceExit").onclick = () => {
  sessionStorage.clear();
  location.reload();
};

document.getElementById("shutdown").onclick = () => {
  document.body.innerHTML =
    "<h1 style='color:#0ff;text-align:center;margin-top:40vh'>UMBRALA OFFLINE</h1>";
};

document.getElementById("exitRoot").onclick = () => {
  rootPanel.classList.add("hidden");
  home.classList.remove("hidden");
};
