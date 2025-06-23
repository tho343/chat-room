const {
  userJoin,
  removeUser,
  userLeave,
  getUser,
  getRoomUsers,
} = require("./utils/users");
const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
//static file dir
app.use(express.static(path.join(__dirname, "../public")));
//run when clients connect
io.on("connection", (socket) => {
  console.log("new websocker connection");
  socket.on("joinRoom", ({ userName, room }) => {
    userJoin(socket.id, userName, room);
    users = getRoomUsers(room);
    socket.userName = userName;
    socket.room = room;
    socket.join(room);

    socket.emit("message", `Welcome ${userName} to room ${room}`);
    socket.broadcast
      .to(room)
      .emit("message", `${userName} has joined the room`);
    io.to(room).emit("roomUsers", getRoomUsers(room));
  });
  socket.on("chatMessage", (msg) => {
    const userName = socket.userName;
    const room = socket.room;
    if (userName && room) {
      io.emit("message", `${userName}: ${msg}`);
    }
  });
  socket.on("typing", () => {
    const userName = socket.userName;
    const room = socket.room;
    socket.broadcast.to(room).emit("showTyping", userName);
  });
  socket.on("stopTyping", () => {
    const userName = socket.userName;
    const room = socket.room;
    socket.broadcast.to(room).emit("hideTyping", userName);
  });
  socket.on("disconnect", () => {
    const userName = socket.userName;
    const room = socket.room;
    if (userName && room) {
      io.to(room).emit("hideTyping");
      removeUser(userName);
      io.to(room).emit("message", `${userName} has left`);
      io.to(room).emit("roomUsers", getRoomUsers(room));
    }
  });
});
//listening on port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http:/localhost:${PORT}`);
});
