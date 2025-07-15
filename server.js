const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = {};

io.on("connection", (socket) => {
  console.log("Игрок подключён:", socket.id);
  players[socket.id] = { x: 0, z: 0 };

  io.emit("spawn", players);

  socket.on("move", (pos) => {
    if (players[socket.id]) {
      players[socket.id] = pos;
      io.emit("update", players);
    }
  });

  socket.on("disconnect", () => {
    console.log("Игрок отключён:", socket.id);
    delete players[socket.id];
    io.emit("remove", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Мультиплеер сервер запущен на порту 3000 🚀");
});
