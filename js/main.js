document.addEventListener("DOMContentLoaded", () => {

  /* === PANTALLAS === */
  const boot = document.getElementById("boot");
  const rooms = document.getElementById("rooms");
  const chat = document.getElementById("chat");

  /* === BOTONES === */
  const initBtn = document.getElementById("initBtn");

  /* === CHAT === */
  const roomName = document.getElementById("roomName");
  const messages = document.getElementById("messages");
  const chatForm = document.getElementById("chatForm");
  const msgInput = document.getElementById("msgInput");

  /* === MEDIA === */
  const mediaInput = document.getElementById("mediaInput");
  const mediaBtn = document.getElementById("mediaBtn");

  /* ===============================
     INICIALIZAR SISTEMA
  =============================== */
  initBtn.addEventListener("click", () => {
    boot.classList.add("hidden");
    rooms.classList.remove("hidden");
  });

  /* ===============================
     ENTRAR A SALA
  =============================== */
  window.enterRoom = (name) => {
    rooms.classList.add("hidden");
    chat.classList.remove("hidden");
    roomName.textContent = name;
    messages.innerHTML = "";
  };

  /* ===============================
     VOLVER A SALAS
  =============================== */
  window.backRooms = () => {
    chat.classList.add("hidden");
    rooms.classList.remove("hidden");
  };

  /* ===============================
     ENVIAR MENSAJE TEXTO
  =============================== */
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = msgInput.value.trim();
    if (!text) return;

    createTextMessage(text);
    msgInput.value = "";
  });

  function createTextMessage(text) {
    const msg = document.createElement("div");
    msg.className = "msg";
    msg.textContent = text;

    messages.appendChild(msg);
    autoScroll();
    autoDestroy(msg, 15000);
  }

  /* ===============================
     MEDIA (IMG / VIDEO)
  =============================== */
  mediaBtn.addEventListener("click", () => {
    mediaInput.click();
  });

  mediaInput.addEventListener("change", () => {
    const file = mediaInput.files[0];
    if (!file) return;

    const msg = document.createElement("div");
    msg.className = "msg";

    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = "100%";
      img.style.borderRadius = "4px";
      msg.appendChild(img);
    }

    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.controls = true;
      video.style.maxWidth = "100%";
      video.style.borderRadius = "4px";
      msg.appendChild(video);
    }

    messages.appendChild(msg);
    autoScroll();
    autoDestroy(msg, 15000);

    mediaInput.value = "";
  });

  /* ===============================
     AUTO SCROLL
  =============================== */
  function autoScroll() {
    messages.scrollTop = messages.scrollHeight;
  }

  /* ===============================
     AUTODESTRUCCIÓN
  =============================== */
  function autoDestroy(element, time) {
    setTimeout(() => {
      element.style.opacity = "0";
      element.style.transform = "translateY(-10px)";
      setTimeout(() => element.remove(), 600);
    }, time);
  }

});
