// data.js

const usersKey = "users";
const loggedInUserKey = "loggedInUser";
const postsKey = "posts";
const messagesKey = "messages";

let users = JSON.parse(localStorage.getItem(usersKey)) || {};
let loggedInUser = localStorage.getItem(loggedInUserKey);
let posts = JSON.parse(localStorage.getItem(postsKey)) || [];
let messages = JSON.parse(localStorage.getItem(messagesKey)) || {};

export function getLoggedInUser() {
  return loggedInUser;
}

export function isLoggedIn() {
  return !!loggedInUser;
}

export function registerUser(login, password) {
  if (!login || !password) throw new Error("Заполните поля");
  if (users[login]) throw new Error("Пользователь уже существует");
  users[login] = password;
  localStorage.setItem(usersKey, JSON.stringify(users));
}

export function loginUser(login, password) {
  if (users[login] && users[login] === password) {
    loggedInUser = login;
    localStorage.setItem(loggedInUserKey, login);
  } else {
    throw new Error("Неверный логин или пароль");
  }
}

export function logoutUser() {
  loggedInUser = null;
  localStorage.removeItem(loggedInUserKey);
}

export function createPost(text) {
  if (!loggedInUser) throw new Error("Не авторизован");
  if (!text) throw new Error("Введите текст поста");
  posts.unshift({
    id: Date.now(),
    author: loggedInUser,
    text,
    likes: 0,
    likedBy: []
  });
  localStorage.setItem(postsKey, JSON.stringify(posts));
}

export function getPosts() {
  return posts;
}

export function likePost(id) {
  if (!loggedInUser) throw new Error("Не авторизован");
  const post = posts.find(p => p.id === id);
  if (!post) throw new Error("Пост не найден");
  if (post.likedBy.includes(loggedInUser)) throw new Error("Уже лайкнули");
  post.likes++;
  post.likedBy.push(loggedInUser);
  localStorage.setItem(postsKey, JSON.stringify(posts));
}

export function sendMessage(recipient, text) {
  if (!loggedInUser) throw new Error("Не авторизован");
  if (!users[recipient]) throw new Error("Пользователь не найден");
  if (!text) throw new Error("Введите текст сообщения");
  if (!messages[recipient]) messages[recipient] = [];
  messages[recipient].push({ sender: loggedInUser, text, date: new Date().toISOString() });
  localStorage.setItem(messagesKey, JSON.stringify(messages));
}

export function getMessagesForUser(user) {
  return messages[user] || [];
}
