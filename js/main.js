const boot = document.getElementById("boot");
const rooms = document.getElementById("rooms");
const chat = document.getElementById("chat");
const roomName = document.getElementById("roomName");
const chatWith = document.getElementById("chatWith");
const messages = document.getElementById("messages");
const usersBox = document.getElementById("users");
const typing = document.getElementById("typing");
const glitchSound = document.getElementById("glitchSound");

const PUBLIC_LIFE = 15000;
const PRIVATE_LIFE = 60000;

let currentRoom = "";
let privateUser = null;

const users = ["Axiom", "Nova", "Echo", "Void"];

document.getElementById("initBtn").onclick = () => {
  glitchSound.play();
  boot.classList.add("hidden");
  rooms.classList.remove("hidden");
};

document.getElementById("exitBtn").onclick = () => {
  rooms.classList.add("hidden");
  boot.classList.remove("hidden");
};

document.getElementById("logo").onclick = () => location.reload();

function enterRoom(room) {
  currentRoom = room;
  roomName.textContent = room;
  chatWith.textContent = "";
  rooms.classList.add("hidden");
  chat.classList.remove("hidden");
  renderUsers();
}

function backRooms() {
  chat.classList.add("hidden");
  rooms.classList.remove("hidden");
}

function renderUsers() {
  usersBox.innerHTML = "";
  users.forEach(u => {
    const d = document.createElement("div");
    d.textContent = u;
    d.onclick = () => {
      privateUser = u;
      chatWith.textContent = "🔐 " + u;
      document.querySelectorAll("#users div").forEach(e=>e.classList.remove("active"));
      d.classList.add("active");
    };
    usersBox.appendChild(d);
  });
}

document.getElementById("chatForm").onsubmit = e => {
  e.preventDefault();
  const input = msgInput.value.trim();
  if (!input) return;

  const msg = document.createElement("div");
  msg.className = "message";

  if (privateUser) {
    msg.classList.add("private");
    msg.textContent = "🔐 " + input;
    autoDestroy(msg, PRIVATE_LIFE);
  } else {
    msg.textContent = input;
    autoDestroy(msg, PUBLIC_LIFE);
  }

  messages.appendChild(msg);
  msgInput.value = "";
};

function autoDestroy(el, time) {
  setTimeout(() => {
    el.classList.add("fade-out");
    setTimeout(() => el.remove(), 800);
  }, time);
}

msgInput.oninput = () => {
  typing.style.opacity = 1;
  clearTimeout(window.t);
  window.t = setTimeout(()=>typing.style.opacity=0,800);
};
