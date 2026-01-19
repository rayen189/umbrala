function enterRooms() {
  show('rooms');
}

function enterChat(room) {
  show('chat');
}

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function openPrivate(user) {
  const tabs = document.querySelector('.tabs');
  if (![...tabs.children].some(t => t.textContent === user)) {
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.textContent = user;
    tabs.appendChild(tab);
  }
}
