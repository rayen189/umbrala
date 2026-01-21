const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* ================= STATIC ================= */

app.use(express.static("public"));

/* ================= ENSURE UPLOAD FOLDERS ================= */

["public/uploads/images", "public/uploads/audios"].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/* ================= STATE ================= */

const users = {};
const roomsCount = {};

/* ================= SOCKET ================= */

io.on("connection", socket => {
  console.log("🟢 Conectado:", socket.id);

  socket.on("joinRoom", ({ nick, room }) => {
    if (!nick || !room) return;

    users[socket.id] = { nick, room, socketId: socket.id };
    socket.join(room);

    roomsCount[room] = (roomsCount[room] || 0) + 1;

    io.to(room).emit("message", {
      user: "Umbrala",
      text: `${nick} entró a la sala`
    });

    io.to(room).emit(
      "users",
      Object.values(users).filter(u => u.room === room)
    );
  });

  socket.on("chatMessage", ({ room, text, type, url }) => {
    const user = users[socket.id];
    if (!user) return;

    io.to(room).emit("message", {
      user: user.nick,
      text,
      type,
      url
    });
  });

  socket.on("privateMessage", ({ toSocketId, text }) => {
    const user = users[socket.id];
    if (!user) return;

    const payload = {
      from: user.nick,
      fromSocketId: socket.id,
      text
    };

    io.to(toSocketId).emit("privateMessage", payload);
    socket.emit("privateMessage", payload);
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (!user) return;

    const { room, nick } = user;
    delete users[socket.id];

    roomsCount[room] = Math.max((roomsCount[room] || 1) - 1, 0);

    io.to(room).emit("message", {
      user: "Umbrala",
      text: `${nick} salió`
    });

    io.to(room).emit(
      "users",
      Object.values(users).filter(u => u.room === room)
    );
  });
});

/* ================= UPLOAD (IMÁGENES + AUDIOS) ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, "public/uploads/images");
    } else {
      cb(null, "public/uploads/audios");
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".webm";
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.mimetype.startsWith("image") ? "images" : "audios"}/${req.file.filename}`
  });
});

/* ================= START ================= */

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Umbrala activo en puerto ${PORT}`);
});
