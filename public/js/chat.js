const socket = io();
let currentRoom = null;

function joinRoom(room) {
  currentRoom = room;
  socket.emit("joinRoom", { nick, room });
}

sendBtn.onclick = () => {
  if (!msgInput.value.trim()) return;

  socket.emit("chatMessage", {
    room: currentRoom,
    text: msgInput.value
  });

  msgInput.value = "";
};

msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendBtn.onclick();
});

/* ===== SOCKET LISTENERS ===== */

socket.on("message", data => {
  addMessage("text", `${data.user}: ${data.text}`);
});

socket.on("users", users => {
  usersList.innerHTML = "";
  users.forEach(u => {
    const div = document.createElement("div");
    div.textContent = u.nick;
    usersList.appendChild(div);
  });
  roomCount.textContent = `👥 ${users.length}`;
});

socket.on("roomsUpdate", data => {
  document.querySelectorAll(".room").forEach(div => {
    const id = div.dataset.room;
    const count = data[id] || 0;
    div.querySelector("span").textContent = `👥 ${count}`;
  });
});
