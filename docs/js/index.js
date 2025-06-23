const socket = io();
socket.emit("joinRoom", { username: "User", room: "general" });

//send message
document.getElementById("join-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const userName = document.getElementById("name").value;
  const room = document.getElementById("room").value;
  window.location.href = `/chat-room/chat.html?username=${userName}&room=${room}`;
});
