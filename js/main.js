document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     SCREENS
     =============================== */

  const bootScreen     = document.getElementById("bootScreen");
  const roomsScreen    = document.getElementById("roomsScreen");
  const identityScreen = document.getElementById("identityScreen");
  const chatScreen     = document.getElementById("chatScreen");

  function show(screen){
    [bootScreen, roomsScreen, identityScreen, chatScreen]
      .forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
  }

  /* ===============================
     BOOT SEQUENCE
     =============================== */

  const terminalOutput = document.getElementById("terminalOutput");

  const bootLines = [
    "Inicializando Umbrala...",
    "",
    "modo: anónimo",
    "rastros: deshabilitados",
    "identidad: inexistente",
    "mensajes: efímeros",
    "persistencia: nula",
    "",
    "seguridad: activa",
    "conexión: encriptada",
    "privacidad: total",
    "logs: deshabilitados",
    "tracking: ninguno",
    "",
    "estado: estable",
    "abriendo umbral..."
  ];

  let bootIndex = 0;

  function typeLine(text, cb){
    let i = 0;
    const interval = setInterval(() => {
      terminalOutput.textContent += text.charAt(i);
      i++;
      if(i >= text.length){
        clearInterval(interval);
        terminalOutput.textContent += "\n";
        setTimeout(cb, 250);
      }
    }, 30);
  }

  function runBoot(){
    if(bootIndex >= bootLines.length){
      setTimeout(() => show(roomsScreen), 800);
      return;
    }
    typeLine(bootLines[bootIndex], () => {
      bootIndex++;
      runBoot();
    });
  }

  terminalOutput.textContent = "";
  runBoot();

  /* ===============================
     ROOMS → IDENTITY
     =============================== */

  const rooms = document.querySelectorAll(".room");
  const joiningRoomTitle = document.getElementById("joiningRoomTitle");

  rooms.forEach(room => {
    room.onclick = () => {
      joiningRoomTitle.textContent = `JOINING ROOM: ${room.textContent}`;
      show(identityScreen);
    };
  });

  /* ===============================
     IDENTITY
     =============================== */

  const nicknameInput = document.getElementById("nicknameInput");
  const randomNick    = document.getElementById("randomNick");
  const enterChatBtn  = document.getElementById("enterChatBtn");
  const backToRooms   = document.getElementById("backToRooms");

  let nickname = "";

  randomNick.onclick = () => {
    nicknameInput.value = "anon_" + Math.floor(Math.random() * 9000 + 1000);
  };

  backToRooms.onclick = () => show(roomsScreen);

  enterChatBtn.onclick = () => {
    nickname = nicknameInput.value.trim();
    if(!nickname){
      alert("Elige un nickname");
      return;
    }
    currentChat = "public";
    show(chatScreen);
    systemMsg("Has entrado a la sala");
  };

  /* ===============================
     CHAT CORE
     =============================== */

  const messagesBox = document.getElementById("messages");
  const msgInput    = document.getElementById("msgInput");
  const sendBtn     = document.getElementById("sendBtn");
  const imgInput    = document.getElementById("imgInput");

  const chatTabs = document.getElementById("chatTabs");
  const backRooms = document.getElementById("backRooms");

  let currentChat = "public";

  const chatHistories = {
    public: []
  };

  function renderChat(chatName){
    messagesBox.innerHTML = "";
    const history = chatHistories[chatName] || [];

    history.forEach(html => {
      const div = document.createElement("div");
      div.className = "message";
      div.innerHTML = html;
      messagesBox.appendChild(div);
    });

    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  function systemMsg(text){
    if(!chatHistories[currentChat]) chatHistories[currentChat] = [];
    chatHistories[currentChat].push(text);
    renderChat(currentChat);
  }

  function userMsg(text){
    const html = `<b>${nickname}:</b> ${text}`;
    if(!chatHistories[currentChat]) chatHistories[currentChat] = [];
    chatHistories[currentChat].push(html);
    renderChat(currentChat);
  }

  sendBtn.onclick = () => {
    const text = msgInput.value.trim();
    if(!text) return;
    userMsg(text);
    msgInput.value = "";
  };

  msgInput.addEventListener("keydown", e => {
    if(e.key === "Enter") sendBtn.click();
  });

  imgInput.onchange = () => {
    const file = imgInput.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const html = `<b>${nickname}:</b><br><img src="${reader.result}">`;
      if(!chatHistories[currentChat]) chatHistories[currentChat] = [];
      chatHistories[currentChat].push(html);
      renderChat(currentChat);
    };
    reader.readAsDataURL(file);
  };

  /* ===============================
     PRIVATE CHATS (TABS)
     =============================== */

  const users = document.querySelectorAll(".user-item");

  users.forEach(user => {
    user.onclick = () => {
      const name = user.textContent;

      if(document.querySelector(`[data-chat="${name}"]`)) return;

      const tab = document.createElement("span");
      tab.className = "chat-tab";
      tab.dataset.chat = name;
      tab.textContent = "🔒 " + name;
      chatTabs.appendChild(tab);

      tab.onclick = () => {
        document.querySelectorAll(".chat-tab")
          .forEach(t => t.classList.remove("active"));

        tab.classList.add("active");
        currentChat = name;

        if(!chatHistories[name]){
          chatHistories[name] = [];
          chatHistories[name].push(`Chat privado con ${name}`);
        }

        renderChat(name);
      };
    };
  });

  backRooms.onclick = () => show(roomsScreen);

});
