const socket = io();

let currentRoom = '';
let nick = 'Rayen'; // luego se pide

function join(room) {
  currentRoom = room;
  socket.emit('joinRoom', { nick, room });
}

socket.on('message', msg => {
  const box = document.querySelector('.messages');
  box.innerHTML += `<div><b>${msg.user}:</b> ${msg.text}</div>`;
  box.scrollTop = box.scrollHeight;
});
