/* =========================
   REFERENCIAS DOM
========================= */
const boot = document.getElementById("bootScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");
const terminal = document.getElementById("terminal");

const modal = document.getElementById("nickModal");
const modalTitle = document.getElementById("modalTitle");
const nickInput = document.getElementById("nickInput");
const nickError = document.getElementById("nickError");

const tabs = document.getElementById("privateTabs");
const usersList = document.getElementById("usersList");
const messages = document.getElementById("messages");

const globalCount = document.getElementById("globalCount");
const roomCount = document.getElementById("roomCount");

const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const backBtn = document.getElementById("backBtn");

const fileInput = document.getElementById("fileInput");
const fileBtn = document.getElementById("fileBtn");

/* =========================
   ESTADO
========================= */
let currentRoom = "";
let currentUser = "";
let activeTab = "";
let usedNicknames = [];
let users = [];

const badWords = ["puta", "mierda", "weon"];

/* =========================
   NAVEGACIÓN DE PANTALLAS
========================= */
function showScreen(screen) {
  [boot, roomsScreen, chatScreen].forEach(s =>
    s.classList.remove("active")
  );
  screen.classList.add("active");
  window.scrollTo(0, 0);
}

/* =========================
   BOOT / SUPERMAN
========================= */
function bootSequence() {
  terminal.innerHTML = "";
  const lines = [
    "Iniciando Umbrala...",
    "Cargando módulos...",
    "Inicializando salas...",
    "Sistema listo."
  ];

  let i = 0;
  const interval = setInterval(() => {
    terminal.innerHTML += lines[i] + "<br>";
    i++;

    if (i === lines.length) {
      clearInterval(interval);
      setTimeout(() => {
        showScreen(roomsScreen);
      }, 800);
    }
  }, 600);
}

bootSequence();

/* =========================
   SALAS
========================= */
document.querySelectorAll(".room").forEach(room => {
  room.onclick = () => {
    currentRoom = room.textContent;
    modalTitle.textContent = "Entrar a " + currentRoom;
    nickInput.value = "";
    nickError.textContent = "";
    modal.classList.remove("hidden");
    modal.classList.add("active");
  };
});

/* =========================
   MODAL NICK
========================= */
document.getElementById("randomNick").onclick = () => {
  const base = ["neo", "umbra", "void", "ghost", "green"];
  nickInput.value =
    base[Math.floor(Math.random() * base.length)] +
    "_" +
    Math.floor(Math.random() * 999);
};

document.getElementById("enterRoom").onclick = () => {
  const nick = nickInput.value.trim();

  if (!nick) {
    nickError.textContent = "Ingresa un nickname";
    return;
  }

  if (badWords.some(w => nick.toLowerCase().includes(w))) {
    nickError.textContent = "Nickname no permitido";
    return;
  }

  if (usedNicknames.includes(nick)) {
    nickError.textContent = "Nickname en uso";
    return;
  }

  currentUser = nick;
  usedNicknames.push(nick);

  modal.classList.remove("active");
  modal.classList.add("hidden");

  showScreen(chatScreen);
  initRoom();
};

/* =========================
   INIT CHAT
========================= */
function initRoom() {
  users = [currentUser, "neo", "void"];

  usersList.innerHTML = "";
  tabs.innerHTML = "";
  messages.innerHTML = "";

  const roomTab = document.createElement("div");
  roomTab.className = "tab active";
  roomTab.textContent = currentRoom;
  roomTab.onclick = () => setTab(roomTab);
  tabs.appendChild(roomTab);

  activeTab = currentRoom;

  users.forEach(u => {
    const div = document.createElement("div");
    div.className = "user";
    div.textContent = u;
    div.onclick = () => openTab(u);
    usersList.appendChild(div);
  });

  roomCount.textContent = users.length;
  globalCount.textContent = usedNicknames.length;
}

/* =========================
   TABS
========================= */
function openTab(name) {
  if ([...tabs.children].some(t => t.textContent === name)) return;

  const tab = document.createElement("div");
  tab.className = "tab";
  tab.textContent = name;
  tab.onclick = () => setTab(tab);
  tabs.appendChild(tab);
}

function setTab(tab) {
  [...tabs.children].forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  activeTab = tab.textContent;
  messages.innerHTML = "";
}

/* =========================
   MENSAJES
========================= */
sendBtn.onclick = () => {
  if (!msgInput.value.trim()) return;
  addMessage("text", msgInput.value.trim());
  msgInput.value = "";
};

msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

fileBtn.onclick = () => fileInput.click();

fileInput.onchange = () => {
  const file = fileInput.files[0];
  if (!file) return;

  if (file.type.startsWith("image")) {
    addMessage("image", URL.createObjectURL(file));
  } else if (file.type.startsWith("audio")) {
    addMessage("audio", URL.createObjectURL(file));
  }

  fileInput.value = "";
};

function addMessage(type, content) {
  const div = document.createElement("div");
  div.className = "message";

  const isRoom = activeTab === currentRoom;
  const lifetime = isRoom ? 60 : 30;

  if (type === "text") {
    div.textContent = `${currentUser}: ${content}`;
  }

  if (type === "image") {
    const img = document.createElement("img");
    img.src = content;
    img.style.maxWidth = "180px";
    div.appendChild(img);
  }

  if (type === "audio") {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = content;
    div.appendChild(audio);
  }

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  startFade(div, lifetime);
}

/* =========================
   VOLVER A SALAS
========================= */
backBtn.onclick = () => {
  showScreen(roomsScreen);
};

/* =========================
   EFECTO EFÍMERO
========================= */
function startFade(element, seconds) {
  let remaining = seconds;
  const total = seconds;

  const interval = setInterval(() => {
    remaining--;
    element.style.opacity = remaining / total;

    if (remaining <= 0) {
      clearInterval(interval);
      element.remove();
    }
  }, 1000);
}
