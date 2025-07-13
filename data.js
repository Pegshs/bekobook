// data.js

const usersKey = "bekoUsers";
const loggedInUserKey = "bekoLoggedInUser";

let users = JSON.parse(localStorage.getItem(usersKey)) || {};
let loggedInUser = localStorage.getItem(loggedInUserKey);

function saveUsers() {
  localStorage.setItem(usersKey, JSON.stringify(users));
}

function loginUser(login, pass) {
  if (users[login] && users[login].password === pass) {
    loggedInUser = login;
    localStorage.setItem(loggedInUserKey, loggedInUser);
    return true;
  }
  return false;
}

function logoutUser() {
  loggedInUser = null;
  localStorage.removeItem(loggedInUserKey);
}

function registerUser(login, pass) {
  if (!users[login]) {
    users[login] = { password: pass, posts: [], messages: {} };
    saveUsers();
    return true;
  }
  return false;
}

function createPost(text) {
  if (!loggedInUser) return;
  const post = {
    id: Date.now(),
    author: loggedInUser,
    text,
    likes: 0,
    likedBy: []
  };
  users[loggedInUser].posts.unshift(post);
  saveUsers();
}

function likePost(id) {
  if (!loggedInUser) return false;
  const userPosts = users[loggedInUser].posts;
  const post = userPosts.find(p => p.id === id);
  if (!post) return false;
  if (post.likedBy.includes(loggedInUser)) return false;
  post.likes++;
  post.likedBy.push(loggedInUser);
  saveUsers();
  return true;
}

function sendMessage(recipient, text) {
  if (!loggedInUser) return false;
  if (!users[recipient]) return false;
  if (!users[recipient].messages[loggedInUser]) {
    users[recipient].messages[loggedInUser] = [];
  }
  users[recipient].messages[loggedInUser].push({
    text,
    date: new Date().toISOString()
  });
  saveUsers();
  return true;
}

function getUserPosts() {
  if (!loggedInUser) return [];
  return users[loggedInUser].posts || [];
}

function getUserMessages() {
  if (!loggedInUser) return {};
  return users[loggedInUser].messages || {};
}

function exportUsers() {
  return JSON.stringify(users, null, 2);
}

function importUsers(jsonStr) {
  try {
    const importedUsers = JSON.parse(jsonStr);
    users = { ...users, ...importedUsers };
    saveUsers();
    return true;
  } catch {
    return false;
  }
}
