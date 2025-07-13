// data.js — Хранилище пользователей и функций для BekoBook

const usersKey = "bekoUsers";
const loggedInUserKey = "bekoLoggedInUser";

if (!localStorage.getItem(usersKey)) {
  // Создаём начальных юзеров — чтобы сразу тестить
  const initialUsers = {
    "permskiy71": { password: "123", posts: [], messages: {} },
    "Egorka_Aks": { password: "123", posts: [], messages: {} }
  };
  localStorage.setItem(usersKey, JSON.stringify(initialUsers));
}

let users = JSON.parse(localStorage.getItem(usersKey));
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

function getLoggedInUser() {
  return loggedInUser;
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
  for (const user in users) {
    const userPosts = users[user].posts;
    const post = userPosts.find(p => p.id === id);
    if (post) {
      if (post.likedBy.includes(loggedInUser)) return false; // Уже лайкал
      post.likes++;
      post.likedBy.push(loggedInUser);
      saveUsers();
      return true;
    }
  }
  return false;
}

function sendMessage(recipient, text) {
  if (!loggedInUser) return false;
  if (!users[recipient]) return false; // Нет такого юзера — не отправляем
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

function getUserMessages() {
  if (!loggedInUser) return {};
  return users[loggedInUser].messages || {};
}

function getAllPosts() {
  let allPosts = [];
  for (const user in users) {
    allPosts = allPosts.concat(users[user].posts || []);
  }
  allPosts.sort((a,b) => b.id - a.id);
  return allPosts;
}

function getAllUserLogins() {
  return Object.keys(users);
}
