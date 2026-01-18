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

let currentRoom = "";
let currentUser = "";
let activeTab = "";
let usedNicknames = [];
let users = [];

const badWords = ["puta", "mierda", "weon"];

function bootSequence() {
  const lines = [
    "Iniciando Umbrala...",
    "Cargando módulos...",
    "Conectando salas...",
    "Sistema listo."
  ];
  let i = 0;
  const int = setInterval(() => {
    terminal.innerHTML += lines[i] + "<br>";
    i++;
    if (i === lines.length) {
      clearInterval(int);
      setTimeout(() => {
        boot.classList.remove("active");
        roomsScreen.classList.add("active");
      }, 800);
    }
  }, 600);
}
bootSequence();

/* SALAS */
document.querySelectorAll(".room").forEach(room => {
  room.onclick = () => {
    currentRoom = room.textContent;
    modalTitle.textContent = "Entrar a " + currentRoom;
    nickInput.value = "";
    nickError.textContent = "";
    modal.classList.add("active");
  };
});

/* MODAL */
document.getElementById("randomNick").onclick = () => {
  const names = ["neo", "umbra", "void", "ghost", "green"];
  nickInput.value =
    names[Math.floor(Math.random() * names.length)] +
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
  roomsScreen.classList.remove("active");
  chatScreen.classList.add("active");

  initRoom();
};

/* CHAT */
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
    div.textContent = u;
    div.className = "user";
    div.onclick = () => openTab(u);
    usersList.appendChild(div);
  });

  roomCount.textContent = users.length;
  globalCount.textContent = usedNicknames.length;
}

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

/* VOLVER */
document.getElementById("backBtn").onclick = () => {
  chatScreen.classList.remove("active");
  roomsScreen.classList.add("active");
};
