console.log("🟢 chat.js cargado");

const socket = io();

/* ================= STATE ================= */

let currentRoom = null;
let currentChat = {
  type: "room", // room | private
  id: null
};

const privateTabs = {};

/* ================= JOIN ROOM ================= */

function joinRoom(roomId) {
  currentRoom = roomId;
  currentChat = { type: "room", id: roomId };

  socket.emit("joinRoom", {
    nick,
    room: roomId
  });
}

/* ================= SEND MESSAGE ================= */

function sendMessageSocket(text) {
  if (!text.trim()) return;

  if (currentChat.type === "room") {
    socket.emit("chatMessage", {
      room: currentRoom,
      text
    });
  }

  if (currentChat.type === "private") {
    const targetSocketId = currentChat.id
      .split("_")
      .find(id => id !== socket.id);

    socket.emit("privateMessage", {
      toSocketId: targetSocketId,
      text
    });
  }
}

/* ================= SOCKET LISTENERS ================= */

socket.on("message", data => {
  addMessage("text", `${data.user}: ${data.text}`);
});

socket.on("users", users => {
  usersList.innerHTML = "";

  users.forEach(u => {
    if (u.nick === nick) return;

    const div = document.createElement("div");
    div.className = "user";
    div.textContent = u.nick;

    div.onclick = () => openPrivate(u);

    usersList.appendChild(div);
  });

  roomCount.textContent = `👥 ${users.length}`;
});

socket.on("privateMessage", data => {
  if (!privateTabs[data.room]) {
    privateTabs[data.room] = { id: data.room, nick: data.from };
    createPrivateTab(data.room, data.from);
  }

  currentChat = { type: "private", id: data.room };
  addMessage("text", `(Privado) ${data.from}: ${data.text}`);
});

/* ================= UI ================= */

sendBtn.onclick = () => {
  if (!msgInput.value.trim()) return;
  sendMessageSocket(msgInput.value);
  msgInput.value = "";
};

msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!msgInput.value.trim()) return;
    sendMessageSocket(msgInput.value);
    msgInput.value = "";
  }
});

/* ================= PRIVATE ================= */

function openPrivate(user) {
  const privateId = [socket.id, user.socketId].sort().join("_");

  if (!privateTabs[privateId]) {
    privateTabs[privateId] = { id: privateId, nick: user.nick };
    createPrivateTab(privateId, user.nick);
  }

  currentChat = { type: "private", id: privateId };
  messages.innerHTML = "";
}

function createPrivateTab(id, nick) {
  const tab = document.createElement("button");
  tab.className = "chat-tab";
  tab.textContent = `🔒 ${nick}`;

  tab.onclick = () => {
    currentChat = { type: "private", id };
    messages.innerHTML = "";
  };

  document.getElementById("chatTabs").appendChild(tab);
}

/* ================= MESSAGE UI ================= */

function addMessage(type, text) {
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
