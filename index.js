import express from 'express';
import posts from './mock.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 헬스 체크
app.get('/', (req, res) => {
  res.send('Prisma + PostgreSQL API');
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/posts', (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  // const { title, content } = req.body;
  const newPost = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    title,
    content,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
