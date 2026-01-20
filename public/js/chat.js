const socket = io();

let currentRoom = null;
let activeChat = { type: "public" };

const privateChats = {}; // socketId -> { nick, messages }
const tabs = document.getElementById("chatTabs");

/* ================= JOIN ROOM ================= */

function joinRoom(room) {
  currentRoom = room;
  socket.emit("joinRoom", { nick, room });
}

/* ================= TABS ================= */

function setActiveTab(tab) {
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.remove("active")
  );
  tab.classList.add("active");
}

function openPrivateTab(user) {
  if (!privateChats[user.socketId]) {
    privateChats[user.socketId] = {
      nick: user.nick,
      messages: []
    };

    const tab = document.createElement("div");
    tab.className = "tab";
    tab.textContent = `🔒 ${user.nick}`;
    tab.dataset.socket = user.socketId;

    tab.onclick = () => {
      activeChat = { type: "private", socketId: user.socketId };
      renderMessages();
      setActiveTab(tab);
    };

    tabs.appendChild(tab);
  }

  activeChat = { type: "private", socketId: user.socketId };
  renderMessages();
  setActiveTab(
    [...tabs.children].find(t => t.dataset.socket === user.socketId)
  );
}

function renderMessages() {
  messages.innerHTML = "";

  if (activeChat.type === "public") return;

  privateChats[activeChat.socketId].messages.forEach(m => {
    addMessage("text", m);
  });
}

/* ================= SEND ================= */

sendBtn.onclick = sendMessage;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  if (!msgInput.value.trim()) return;

  if (activeChat.type === "private") {
    socket.emit("privateMessage", {
      toSocketId: activeChat.socketId,
      text: msgInput.value
    });
  } else {
    socket.emit("chatMessage", {
      room: currentRoom,
      text: msgInput.value
    });
  }

  msgInput.value = "";
}

/* ================= SOCKET LISTENERS ================= */

socket.on("message", data => {
  if (activeChat.type === "public") {
    addMessage("text", `${data.user}: ${data.text}`);
  }
});

socket.on("privateMessage", data => {
  const socketId =
    data.fromSocketId === socket.id
      ? activeChat.socketId
      : data.fromSocketId;

  if (!privateChats[socketId]) {
    privateChats[socketId] = {
      nick: data.from,
      messages: []
    };

    const tab = document.createElement("div");
    tab.className = "tab";
    tab.textContent = `🔒 ${data.from}`;
    tab.dataset.socket = socketId;

    tab.onclick = () => {
      activeChat = { type: "private", socketId };
      renderMessages();
      setActiveTab(tab);
    };

    tabs.appendChild(tab);
  }

  privateChats[socketId].messages.push(
    `${data.from}: ${data.text}`
  );

  if (
    activeChat.type === "private" &&
    activeChat.socketId === socketId
  ) {
    renderMessages();
  }
});

/* ================= USERS ================= */

socket.on("users", users => {
  usersList.innerHTML = "";

  users.forEach(u => {
    const div = document.createElement("div");
    div.className = "user";
    div.textContent = u.nick;
    div.onclick = () => openPrivateTab(u);
    usersList.appendChild(div);
  });

  roomCount.textContent = `👥 ${users.length}`;
});
