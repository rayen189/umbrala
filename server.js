const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* ================= STATIC ================= */

app.use(express.static("public"));

/* ================= STATE ================= */

// users = {
//   socketId: { nick, room, socketId }
// }
const users = {};

// roomsCount = { roomId: number }
const roomsCount = {};

/* ================= SOCKET ================= */

io.on("connection", socket => {
  console.log("🟢 Conectado:", socket.id);

  /* ===== JOIN ROOM ===== */
  socket.on("joinRoom", ({ nick, room }) => {
    if (!nick || !room) return;

    // Guardar usuario
    users[socket.id] = {
      nick,
      room,
      socketId: socket.id
    };

    socket.join(room);

    // Contador sala
    roomsCount[room] = (roomsCount[room] || 0) + 1;

    // Enviar contadores a todos
    io.emit("roomsUpdate", roomsCount);

    // Mensaje sistema
    io.to(room).emit("message", {
      user: "Umbrala",
      text: `${nick} entró a la sala`
    });

    // Lista usuarios sala
    io.to(room).emit(
      "users",
      Object.values(users).filter(u => u.room === room)
    );
  });

  /* ===== PUBLIC MESSAGE ===== */
  socket.on("chatMessage", ({ room, text }) => {
    const user = users[socket.id];
    if (!user || !text) return;

    io.to(room).emit("message", {
      user: user.nick,
      text
    });
  });

  /* ===== PRIVATE MESSAGE ===== */
  socket.on("privateMessage", ({ toSocketId, text }) => {
    const user = users[socket.id];
    if (!user || !toSocketId || !text) return;

    io.to(toSocketId).emit("privateMessage", {
      from: user.nick,
      text
    });
  });

  /* ===== DISCONNECT ===== */
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (!user) return;

    const { room, nick } = user;

    // Reducir contador
    roomsCount[room] = Math.max((roomsCount[room] || 1) - 1, 0);

    // Actualizar contadores
    io.emit("roomsUpdate", roomsCount);

    // Avisar salida
    io.to(room).emit("message", {
      user: "Umbrala",
      text: `${nick} salió`
    });

    // Eliminar usuario
    delete users[socket.id];

    // Actualizar lista usuarios sala
    io.to(room).emit(
      "users",
      Object.values(users).filter(u => u.room === room)
    );

    console.log("🔴 Desconectado:", socket.id);
  });
});

/* ================= START ================= */

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Umbrala activo en puerto ${PORT}`);
});
