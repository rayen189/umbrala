const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const users = {};

io.on("connection", socket => {
  console.log("🟢 Conectado:", socket.id);

  socket.on("joinRoom", ({ nick, room }) => {
    users[socket.id] = { nick, room, socketId: socket.id };

    socket.join(room);

    io.to(room).emit("message", {
      user: "Umbrala",
      text: `${nick} entró a la sala`
    });

    io.to(room).emit(
      "users",
      Object.values(users).filter(u => u.room === room)
    );
  });

  socket.on("chatMessage", ({ room, text }) => {
    const user = users[socket.id];
    if (!user) return;

    io.to(room).emit("message", {
      user: user.nick,
      text
    });
  });

  // 🔐 PRIVADOS REALES
  socket.on("privateMessage", ({ toSocketId, text }) => {
    const fromUser = users[socket.id];
    const toUser = users[toSocketId];

    if (!fromUser || !toUser) return;

    const privateRoom = [socket.id, toSocketId].sort().join("_");

    socket.join(privateRoom);
    io.to(toSocketId).socketsJoin(privateRoom);

    io.to(privateRoom).emit("privateMessage", {
      room: privateRoom,
      from: fromUser.nick,
      text
    });
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (!user) return;

    io.to(user.room).emit("message", {
      user: "Umbrala",
      text: `${user.nick} salió`
    });

    delete users[socket.id];

    io.to(user.room).emit(
      "users",
      Object.values(users).filter(u => u.room === user.room)
    );

    console.log("🔴 Desconectado:", socket.id);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("🔥 Umbrala corriendo");
});
