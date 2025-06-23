const users = {};
function userJoin(id, username, room) {
  users[username] = { id, room };
}

function getUser(username) {
  return users[username];
}
function removeUser(username) {
  delete users[username];
}

function userLeaves(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  } else {
    return null;
  }
}

function getRoomUsers(room) {
  return Object.entries(users)
    .filter(([_, u]) => u.room === room)
    .map(([username]) => username);
}

module.exports = { userJoin, removeUser, getUser, userLeaves, getRoomUsers };
