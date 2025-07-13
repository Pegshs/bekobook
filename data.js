// Храним данные постов
const posts = JSON.parse(localStorage.getItem("posts")) || [];

// Храним данные сообщений
const messages = JSON.parse(localStorage.getItem("messages")) || {};

// Функция для сохранения постов
function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Функция для сохранения сообщений
function saveMessages() {
  localStorage.setItem("messages", JSON.stringify(messages));
}

// Добавление нового поста
function createPost(author, text) {
  const newPost = {
    id: Date.now(),
    author,
    text,
    likes: 0,
    likedBy: []
  };
  posts.unshift(newPost); // Добавляем новый пост в начало
  savePosts();
}

// Получение всех постов
function getPosts() {
  return posts;
}

// Добавление нового сообщения
function sendMessage(sender, recipient, text) {
  if (!messages[recipient]) {
    messages[recipient] = [];
  }
  messages[recipient].push({ sender, text, date: new Date() });
  saveMessages();
}

// Получение всех сообщений для пользователя
function getMessages(user) {
  return messages[user] || [];
}

// Лайк поста
function likePost(postId, user) {
  const post = posts.find(p => p.id === postId);
  if (post) {
    if (!post.likedBy.includes(user)) {
      post.likes++;
      post.likedBy.push(user);
      savePosts();
    }
  }
}

// Экспортируем функции, чтобы они были доступны в других файлах
export {
  createPost,
  getPosts,
  sendMessage,
  getMessages,
  likePost
};
