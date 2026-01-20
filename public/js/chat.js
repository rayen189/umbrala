const socket = io();

let currentRoom = null;
let activeChat = { type: "public" };

// privados por nick
const privateChats = {}; // nick -> { nick, socketId, messages }

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

function openPublicTab() {
  activeChat = { type: "public" };
  messages.innerHTML = "";
}

/* ===== PRIVATE TAB ===== */

function openPrivateTab(user) {
  if (!privateChats[user.nick]) {
    privateChats[user.nick] = {
      nick: user.nick,
      socketId: user.socketId,
      messages: []
    };

    const tab = document.createElement("div");
    tab.className = "tab";
    tab.textContent = `🔒 ${user.nick}`;
    tab.onclick = () => {
      activeChat = {
        type: "private",
        nick: user.nick,
        socketId: user.socketId
      };
      renderMessages();
      setActiveTab(tab);
    };

    tabs.appendChild(tab);
  }

  activeChat = {
    type: "private",
    nick: user.nick,
    socketId: user.socketId
  };

  renderMessages();

  const tab = [...tabs.children].find(t =>
    t.textContent.includes(user.nick)
  );
  if (tab) setActiveTab(tab);
}

/* ================= RENDER ================= */

function renderMessages() {
  messages.innerHTML = "";

  if (activeChat.type === "public") return;

  const chat = privateChats[activeChat.nick];
  if (!chat) return;

  chat.messages.forEach(m => addMessage("text", m));
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
  const text = msgInput.value.trim();
  if (!text) return;

  if (activeChat.type === "private") {
    socket.emit("privateMessage", {
      toSocketId: activeChat.socketId,
      text
    });

    privateChats[activeChat.nick].messages.push(`Tú: ${text}`);
    renderMessages();
  } else {
    socket.emit("chatMessage", {
      room: currentRoom,
      text
    });
  }

  msgInput.value = "";
}

/* ================= SOCKET ================= */

socket.on("message", data => {
  if (activeChat.type === "public") {
    addMessage("text", `${data.user}: ${data.text}`);
  }
});

/* 🔥 FIX PRINCIPAL */
socket.on("privateMessage", data => {
  if (!privateChats[data.from]) {
    privateChats[data.from] = {
      nick: data.from,
      socketId: null,
      messages: []
    };

    const tab = document.createElement("div");
    tab.className = "tab";
    tab.textContent = `🔒 ${data.from}`;
    tab.onclick = () => {
      activeChat = { type: "private", nick: data.from };
      renderMessages();
      setActiveTab(tab);
    };

    tabs.appendChild(tab);
  }

  privateChats[data.from].messages.push(
    `${data.from}: ${data.text}`
  );

  renderMessages();
});

/* ================= USERS ================= */

socket.on("users", users => {
  usersList.innerHTML = "";

  users.forEach(u => {
    if (u.nick === nick) return;

    const div = document.createElement("div");
    div.className = "user";
    div.textContent = u.nick;
    div.onclick = () => openPrivateTab(u);
    usersList.appendChild(div);
  });

  roomCount.textContent = `👥 ${users.length}`;
});
