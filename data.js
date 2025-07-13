// data.js
if (!localStorage.getItem("bekoUsers")) {
  const initialUsers = {
    "permskiy71": { password: "123", posts: [], messages: {} },
    "Egorka_Aks": { password: "123", posts: [], messages: {} }
  };
  localStorage.setItem("bekoUsers", JSON.stringify(initialUsers));
}


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
  // Ищем пост у всех пользователей, чтобы можно было лайкать не только свои посты
  for (const user in users) {
    const userPosts = users[user].posts;
    const post = userPosts.find(p => p.id === id);
    if (post) {
      if (post.likedBy.includes(loggedInUser)) return false;
      post.likes++;
      post.likedBy.push(loggedInUser);
      saveUsers();
      return true;
    }
  }
  return false;
}

// Отправка сообщения — если получателя нет, создаём его
function sendMessage(recipient, text) {
  if (!loggedInUser) return false;
  if (!users[recipient]) {
    users[recipient] = { password: "", posts: [], messages: {} };
  }
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

// Получаем посты всех пользователей (чтобы видеть чужие посты)
function getAllPosts() {
  let allPosts = [];
  for (const user in users) {
    allPosts = allPosts.concat(users[user].posts || []);
  }
  // Отсортируем по дате
  allPosts.sort((a,b) => b.id - a.id);
  return allPosts;
}

function getUserMessages() {
  if (!loggedInUser) return {};
  return users[loggedInUser].messages || {};
}

// Экспорт базы
function exportUsers() {
  return JSON.stringify(users, null, 2);
}

// Импорт базы
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

// Возвращаем список логинов для удобства
function getAllUserLogins() {
  return Object.keys(users);
}
