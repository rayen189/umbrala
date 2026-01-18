const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");
const roomTitle = document.getElementById("roomTitle");

const messages = document.getElementById("messages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const backRooms = document.getElementById("backRooms");
const toggleUsers = document.getElementById("toggleUsers");
const usersList = document.getElementById("usersList");
const usersUl = document.getElementById("users");

const userCount = document.getElementById("userCount");
const roomUserCount = document.getElementById("roomUserCount");

/* ===== USUARIOS SIMULADOS ===== */
const users = ["Xime", "Oracle", "Specter"];

/* ===== INICIO ===== */
// asegúrate que NO entre directo a salas
roomsScreen.classList.add("active");
chatScreen.classList.remove("active");

/* ===== ROOMS ===== */
document.querySelectorAll(".room-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    roomTitle.textContent = btn.dataset.room;

    roomsScreen.classList.remove("active");
    chatScreen.classList.add("active");

    messages.innerHTML = "";
    loadUsers();
    updateRoomUserCount();
  });
});

backRooms.addEventListener("click", () => {
  chatScreen.classList.remove("active");
  roomsScreen.classList.add("active");
});

/* ===== USERS ===== */
toggleUsers.addEventListener("click", () => {
  usersList.classList.toggle("hidden");
});

function loadUsers() {
  usersUl.innerHTML = "";
  users.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    usersUl.appendChild(li);
  });
  updateGlobalUserCount();
}

function updateGlobalUserCount() {
  if (userCount) {
    userCount.textContent = users.length;
  }
}

function updateRoomUserCount() {
  if (roomUserCount) {
    roomUserCount.textContent = users.length;
  }
}

/* ===== CHAT ===== */
function addMessage(author, text) {
  const div = document.createElement("div");
  div.className = "message" + (author === "yo" ? " me" : "");
  div.textContent = `${author}: ${text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage("yo", text);
  chatInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
