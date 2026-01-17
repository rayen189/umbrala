let currentRoom = null;
let activePrivateChat = null;

const ROOM_TTL = 30000;
const PRIVATE_TTL = 60000;

const landingScreen = document.getElementById("landingScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");

const roomsContainer = document.getElementById("roomsContainer");
const messagesBox = document.getElementById("messages");
const usersList = document.getElementById("usersList");
const roomTitle = document.getElementById("roomTitle");

const connectedUsers = ["Void", "Specter", "AnonX", "Umbra"];

const rooms = [
  { id: "norte", name: "Norte de Chile 🌵" },
  { id: "centro", name: "Centro 🌃" },
  { id: "sur", name: "Sur de Chile 🗻" },
  { id: "global", name: "Global 🌎" },
  { id: "void", name: "Directo al Vacío 🕳️" }
];

function show(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

document.getElementById("initBtn").onclick = () => {
  show(roomsScreen);
  renderRooms();
};

function renderRooms() {
  roomsContainer.innerHTML = "";
  document.getElementById("globalUserCount").innerText = connectedUsers.length;

  rooms.forEach(r => {
    const div = document.createElement("div");
    div.className = "room-card";
    div.innerHTML = `<span>${r.name}</span><span>${connectedUsers.length}</span>`;
    div.onclick = () =>
