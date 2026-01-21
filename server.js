const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* ================= STATIC ================= */

app.use(express.static("public"));

/* ================= STATE ================= */

/*
users = {
  socketId: {
    nick,
    room,
    socketId
  }
}
*/
const users = {};

// roomsCount = { roomId: number }
const roomsCount = {};

/* ================= SOCKET ================= */

io.on("connection", socket => {
  console.log("🟢 Conectado:", socket.id);

  /* ===== JOIN ROOM ===== */
  socket.on("joinRoom", ({ nick, room }) => {
    if (!nick || !room) return;

    users[socket.id] = {
      nick,
      room,
      socketId: socket.id
    };

    socket.join(room);

    // Contador de sala
    roomsCount[room] = (roomsCount[room] || 0) + 1;
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

    const payload = {
      from: user.nick,
      fromSocketId: socket.id,
      text
    };

    // Enviar al receptor
    io.to(toSocketId).emit("privateMessage", payload);

    // Enviar copia al emisor (MUY IMPORTANTE)
    socket.emit("privateMessage", payload);
  });

  /* ===== DISCONNECT ===== */
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (!user) return;

    const { room, nick } = user;

    // Reducir contador sala
    roomsCount[room] = Math.max((roomsCount[room] || 1) - 1, 0);
    io.emit("roomsUpdate", roomsCount);

    // Aviso salida
    io.to(room).emit("message", {
      user: "Umbrala",
      text: `${nick} salió`
    });

    // Eliminar usuario
    delete users[socket.id];

    // Actualizar lista usuarios
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

const multer = require("multer");
const path = require("path");

/* ================= UPLOAD ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, "public/uploads/images");
    } else {
      cb(null, "public/uploads/audios");
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.mimetype.startsWith("image") ? "images" : "audios"}/${req.file.filename}`
  });
});

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "public/audios",
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".webm");
  }
});

const upload = multer({ storage });

app.use("/audios", express.static("public/audios"));

app.post("/upload-audio", upload.single("audio"), (req, res) => {
  res.json({
    url: "/audios/" + req.file.filename
  });
});
