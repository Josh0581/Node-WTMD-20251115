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

  // PATCH 요청에서 null 과 undefined 를 다르게 처리하는 방법
  // title이 null 이면 null 로, undefined라면 post.title 을 업데이트 하지 않도록 한다
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
