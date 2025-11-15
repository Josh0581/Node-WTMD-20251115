import express from 'express';
import posts from './mock.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 헬스 체크
app.get('/', (req, res) => {
  res.send('Prisma + PostgreSQL API');
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
