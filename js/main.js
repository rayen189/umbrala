/* ===============================
   UMBRALA MAIN.JS
   =============================== */

document.addEventListener("DOMContentLoaded", ()=>{

  /* SCREENS */
  const terminalScreen = document.getElementById("terminalScreen");
  const roomsScreen    = document.getElementById("roomsScreen");
  const identityScreen = document.getElementById("identityScreen");
  const chatScreen     = document.getElementById("chatScreen");

  /* ROOMS */
  const rooms = document.querySelectorAll(".room");
  let selectedRoom = null;

  /* IDENTITY */
  const joiningRoomTitle = document.getElementById("joiningRoomTitle");
  const nicknameInput    = document.getElementById("nicknameInput");
  const randomNickBtn    = document.getElementById("randomNick");
  const enterChatBtn     = document.getElementById("enterChatBtn");
  const backToRoomsBtn   = document.getElementById("backToRooms");

  let nickname = null;

  /* CHAT */
  const messagesBox = document.getElementById("messages");
  const chatInput   = document.getElementById("chatInput");
  const sendBtn     = document.getElementById("sendBtn");

  /* ===============================
     HELPERS
     =============================== */

  function showScreen(screen){
    [terminalScreen, roomsScreen, identityScreen, chatScreen]
      .forEach(s => s && s.classList.remove("active"));
    screen && screen.classList.add("active");
  }

  function generateNick(){
    return "anon_" + Math.floor(Math.random() * 9000 + 1000);
  }

  /* ===============================
     SALAS → IDENTIDAD
     =============================== */

  rooms.forEach(room=>{
    room.addEventListener("click", ()=>{
      selectedRoom = room.dataset.room || room.textContent.trim();
      joiningRoomTitle.textContent = `JOINING ROOM\n${selectedRoom}`;
      nicknameInput.value = "";
      showScreen(identityScreen);
    });
  });

  /* ===============================
     IDENTIDAD
     =============================== */

  randomNickBtn.addEventListener("click", ()=>{
    nicknameInput.value = generateNick();
  });

  backToRoomsBtn.addEventListener("click", ()=>{
    showScreen(roomsScreen);
  });

  enterChatBtn.addEventListener("click", ()=>{
    const value = nicknameInput.value.trim();
    if(!value){
      alert("Debes elegir un nickname");
      return;
    }
    nickname = value;
    enterChat(selectedRoom, nickname);
  });

  /* ===============================
     ENTRAR AL CHAT
     =============================== */

  function enterChat(room, nick){
    showScreen(chatScreen);
    messagesBox.innerHTML = "";

    systemMessage(`Has entrado a ${room}`);
    systemMessage(`Tu identidad: ${nick}`);
  }

  function systemMessage(text){
    const div = document.createElement("div");
    div.className = "msg system";
    div.textContent = text;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  function userMessage(text){
    const div = document.createElement("div");
    div.className = "msg user";
    div.innerHTML = `<b>${nickname}:</b> ${text}`;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  /* ===============================
     ENVÍO DE MENSAJES
     =============================== */

  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", e=>{
    if(e.key === "Enter") sendMessage();
  });

  function sendMessage(){
    const text = chatInput.value.trim();
    if(!text) return;
    userMessage(text);
    chatInput.value = "";
  }

  /* ===============================
     START
     =============================== */

  // Si ya saltas directo a salas
  showScreen(roomsScreen);

});
