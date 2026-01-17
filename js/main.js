// ===============================
// UMBRALA MAIN.JS
// ===============================

// PANTALLAS
const bootScreen  = document.getElementById("bootScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen  = document.getElementById("chatScreen");

// TERMINAL
const output = document.getElementById("terminalOutput");

// CHAT
const chatTitle = document.getElementById("chatTitle");

// ===============================
// BOOT SEQUENCE (TERMINAL)
// ===============================
const bootLines = [
  "> UMBRALA SYSTEM v2.4.1",
  "> Initializing secure connection...",
  "> [OK] Encryption module loaded",
  "> [OK] Anonymous routing enabled",
  "> [OK] No logs policy active",
  "> Loading chat nodes...",
  "",
  "> System ready."
];

let lineIndex = 0;

function typeTerminal() {
  if (lineIndex < bootLines.length) {
    output.textContent += bootLines[lineIndex] + "\n";
    lineIndex++;
    setTimeout(typeTerminal, 420);
  } else {
    setTimeout(showRooms, 1200);
  }
}

function showRooms() {
  bootScreen.classList.remove("active");
  roomsScreen.classList.add("active");
}

// INICIAR BOOT
typeTerminal();

// ===============================
// EVENTOS DE SALAS
// ===============================
const roomButtons = document.querySelectorAll(".room");

roomButtons.forEach(button => {
  button.addEventListener("click", () => {
    enterRoom(button);
  });
});

function enterRoom(button) {
  const roomName = button.textContent;

  // Transición portal
  roomsScreen.classList.remove("active");

  setTimeout(() => {
    chatTitle.textContent = roomName;
    chatScreen.classList.add("active");
  }, 400);
}

// ===============================
// CHAT BÁSICO LOCAL (TEMPORAL)
// ===============================
const chatBox   = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");

if (chatInput) {
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && chatInput.value.trim() !== "") {
      addMessage(chatInput.value);
      chatInput.value = "";
    }
  });
}

function addMessage(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.style.margin = "6px 0";
  msg.style.opacity = "0";
  msg.style.transform = "translateY(10px)";
  msg.style.transition = "0.6s";

  chatBox.appendChild(msg);

  requestAnimationFrame(() => {
    msg.style.opacity = "1";
    msg.style.transform = "translateY(0)";
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

// ===============================
// VOLVER A SALAS (FUTURO)
// ===============================
// Aquí puedes agregar un botón
// para volver con portal inverso
