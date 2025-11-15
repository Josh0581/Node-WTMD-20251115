import express from 'express';
import posts from './mock.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

// post 라우트
app.get('/posts', (req, res) => {
  res.json(posts);
});

app.get('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    title,
    content,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.patch('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;
  const post = posts.find((p) => p.id === id);

  if (!post) return res.status(404).json({ message: 'Post not found' });

  // PATCH 요청은 일반적으로 필드를 선택적으로 업데이트
  // title이 null 또는 undefined라면 post.title 을 사용해서 그대로 유지
  post.title = title ?? post.title;
  post.content = content ?? post.content;
  res.json(post);
});

app.delete('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) return res.status(404).json({ message: 'Post not found' });

  posts.splice(index, 1);
  res.json({ message: 'Post deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
