// client data.js
let loggedInUser = null;

async function registerUser(login, pass) {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ login, password: pass })
  });
  if (res.ok) return true;
  else {
    const err = await res.json();
    alert(err.error);
    return false;
  }
}

async function loginUser(login, pass) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ login, password: pass })
  });
  if (res.ok) {
    loggedInUser = login;
    return true;
  } else {
    const err = await res.json();
    alert(err.error);
    return false;
  }
}

async function createPost(text) {
  if (!loggedInUser) return;
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ login: loggedInUser, text })
  });
  if (!res.ok) {
    const err = await res.json();
    alert(err.error);
  }
}

async function getAllPosts() {
  const res = await fetch('/api/posts');
  if (!res.ok) return [];
  return await res.json();
}

async function likePost(postId) {
  if (!loggedInUser) return false;
  const res = await fetch('/api/posts/like', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ login: loggedInUser, postId })
  });
  if (res.ok) return true;
  else {
    const err = await res.json();
    alert(err.error);
    return false;
  }
}

async function getAllUserLogins() {
  const res = await fetch('/api/users');
  if (!res.ok) return [];
  return await res.json();
}

async function sendMessage(to, text) {
  if (!loggedInUser) return false;
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ from: loggedInUser, to, text })
  });
  if (res.ok) return true;
  else {
    const err = await res.json();
    alert(err.error);
    return false;
  }
}

async function getMessagesWith(user) {
  if (!loggedInUser) return [];
  const res = await fetch(`/api/messages/${loggedInUser}/${user}`);
  if (!res.ok) return [];
  return await res.json();
}
