const boot = document.getElementById("boot");
const rooms = document.getElementById("rooms");
const chat = document.getElementById("chat");
const messages = document.getElementById("messages");
const roomName = document.getElementById("roomName");

const channel = new BroadcastChannel("umbrala");

let isRoot = false;

document.getElementById("initBtn").onclick = () => {
  boot.classList.add("hidden");
  rooms.classList.remove("hidden");
};

document.getElementById("exitBtn").onclick = () => {
  rooms.classList.add("hidden");
  boot.classList.remove("hidden");
};

document.getElementById("logo").onclick = () => {
  rooms.classList.add("hidden");
  boot.classList.remove("hidden");
};

function enterRoom(name) {
  roomName.textContent = name;
  rooms.classList.add("hidden");
  chat.classList.remove("hidden");
}

function backRooms() {
  chat.classList.add("hidden");
  rooms.classList.remove("hidden");
}

document.getElementById("chatForm").onsubmit = e => {
  e.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;
  sendMessage({ type: "text", content: text });
  msgInput.value = "";
};

document.getElementById("imgBtn").onclick = () => imgInput.click();

imgInput.onchange = () => {
  const file = imgInput.files[0];
  const reader = new FileReader();
  reader.onload = () => sendMessage({ type: "img", content: reader.result });
  reader.readAsDataURL(file);
};

function sendMessage(msg) {
  channel.postMessage(msg);
  renderMessage(msg);
}

channel.onmessage = e => renderMessage(e.data);

function renderMessage(msg) {
  const div = document.createElement("div");
  div.className = "message";

  if (msg.type === "text") div.textContent = msg.content;
  if (msg.type === "img") {
    const img = document.createElement("img");
    img.src = msg.content;
    div.appendChild(img);
  }

  const timer = document.createElement("span");
  timer.className = "timer";
  let t = 10;
  timer.textContent = ` ${t}`;
  div.appendChild(timer);

  messages.appendChild(div);

  const interval = setInterval(() => {
    t--;
    timer.textContent = ` ${t}`;
    if (t <= 0) {
      div.remove();
      clearInterval(interval);
    }
  }, 1000);
}

/* ROOT SECRETO */
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key === "r") {
    isRoot = true;
    enterRoom("ROOT");
  }
});
