const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = './data/users.json';

// Загрузка данных из файла
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
  }
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

// Сохранение данных в файл
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- API ---

// Регистрация
app.post('/api/register', (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).json({ error: 'Нужно логин и пароль' });

  const data = loadData();
  if (data[login]) {
    return res.status(400).json({ error: 'Пользователь уже существует' });
  }

  data[login] = { password, posts: [], messages: {} };
  saveData(data);

  res.json({ success: true });
});

// Логин
app.post('/api/login', (req, res) => {
  const { login, password } = req.body;
  const data = loadData();

  if (data[login] && data[login].password === password) {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Неверный логин или пароль' });
  }
});

// Получить все посты
app.get('/api/posts', (req, res) => {
  const data = loadData();
  let posts = [];
  for (const user in data) {
    if (data[user].posts) posts = posts.concat(data[user].posts);
  }
  posts.sort((a, b) => b.id - a.id);
  res.json(posts);
});

// Создать пост
app.post('/api/posts', (req, res) => {
  const { login, text } = req.body;
  if (!login || !text) return res.status(400).json({ error: 'Нужно логин и текст' });

  const data = loadData();
  if (!data[login]) return res.status(400).json({ error: 'Пользователь не найден' });

  const post = {
    id: Date.now(),
    author: login,
    text,
    likes: 0,
    likedBy: []
  };

  if (!Array.isArray(data[login].posts)) data[login].posts = [];
  data[login].posts.unshift(post);

  saveData(data);
  res.json({ success: true });
});

// Лайк поста
app.post('/api/posts/like', (req, res) => {
  const { login, postId } = req.body;
  if (!login || !postId) return res.status(400).json({ error: 'Нужно логин и ID поста' });

  const data = loadData();
  for (const user in data) {
    const post = data[user].posts?.find(p => p.id === postId);
    if (post) {
      if (post.likedBy.includes(login)) {
        return res.status(400).json({ error: 'Вы уже лайкали этот пост' });
      }
      post.likes++;
      post.likedBy.push(login);
      saveData(data);
      return res.json({ success: true });
    }
  }
  res.status(400).json({ error: 'Пост не найден' });
});

// Получить список всех пользователей
app.get('/api/users', (req, res) => {
  const data = loadData();
  res.json(Object.keys(data));
});

// Отправить сообщение
app.post('/api/messages', (req, res) => {
  const { from, to, text } = req.body;
  if (!from || !to || !text) return res.status(400).json({ error: 'Нужно from, to и текст' });

  const data = loadData();
  if (!data[from] || !data[to]) return res.status(400).json({ error: 'Пользователь не найден' });

  if (!data[to].messages[from]) data[to].messages[from] = [];
  data[to].messages[from].push({ text, date: new Date().toISOString() });

  saveData(data);
  res.json({ success: true });
});

// Получить сообщения с пользователем
app.get('/api/messages/:login1/:login2', (req, res) => {
  const { login1, login2 } = req.params;
  const data = loadData();
  if (!data[login1] || !data[login2]) return res.status(400).json({ error: 'Пользователь не найден' });

  const messages1to2 = data[login1].messages[login2] || [];
  const messages2to1 = data[login2].messages[login1] || [];
  // Объединяем и сортируем по дате
  const allMessages = [...messages1to2.map(m => ({ ...m, from: login1 })), ...messages2to1.map(m => ({ ...m, from: login2 }))];
  allMessages.sort((a, b) => new Date(a.date) - new Date(b.date));

  res.json(allMessages);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
