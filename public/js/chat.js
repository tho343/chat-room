const params = new URLSearchParams(window.location.search);
const userName = params.get("username");
const room = params.get("room");
const roomName = document.createElement("h1");
const typing = document.getElementById("typing-status");
const typingUsers = new Set();
const socket = io();
roomName.innerHTML = `Chat Room  ${room}`;
let typingTimeOut;
let isTyping = false;

//store to localStorage
if (userName) {
  localStorage.setItem("username", userName);
  localStorage.setItem("room", room);
} else {
  //load from localStorage
  userName = localStorage.getItem("username");
  room = localStorage.getItem("room");
}
if (userName && room) {
  socket.emit("joinRoom", { userName, room });
}
socket.on("message", (message) => {
  const div = document.createElement("div");
  div.textContent = message;
  document.getElementById("message").appendChild(div);
});
socket.on("roomUsers", (list) => {
  const userContainer = document.getElementById("users-list");
  userContainer.innerHTML = "";
  list.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user;
    userContainer.appendChild(li);
  });
});
socket.on("showTyping", (userName) => {
  typingUsers.add(userName);
  updateTypingStatus();
});
socket.on("hideTyping", (userName) => {
  typingUsers.delete(userName);
  updateTypingStatus();
});
document.getElementById("chat-text").addEventListener("input", () => {
  const message = document.getElementById("chat-text").value.trim();
  if (message && !isTyping) {
    socket.emit("typing");
    isTyping = true;
  }
  if (!message && isTyping) {
    socket.emit("stopTyping");
    isTyping = false;
    clearTimeout(typingTimeOut);
    return;
  }
  clearTimeout(typingTimeOut);
  typingTimeOut = setTimeout(() => {
    if (isTyping) {
      socket.emit("stopTyping");
      isTyping = false;
    }
  }, 6000);
});

document.getElementById("chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = document.getElementById("chat-text").value;
  socket.emit("chatMessage", msg);
  document.getElementById("chat-text").value = "";
});
document.getElementById("disconnectBtn").addEventListener("click", () => {
  socket.disconnect();
  window.location.href = "index.html";
});

function updateTypingStatus() {
  if (typingUsers.size === 0) {
    typing.textContent = "";
    return;
  }

  const names = [...typingUsers];
  const formatted =
    names.length === 1
      ? `${names[0]} is typing...`
      : `${names.length} users are typing...`;
  typing.textContent = formatted;
}
