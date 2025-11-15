import express from 'express';
import { PrismaClient } from './generated/prisma/index.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 헬스체크
app.get('/', (req, res) => {
  res.send('Prisma + PostgreSQL API');
});

/**
 * 사용자
 */
// 사용자 생성
app.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) return res.status(400).json({ message: 'email, name 필요' });

    const user = await prisma.user.create({
      data: { email, name },
    });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: '이미 존재하는 email' });
    }
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 사용자 리스트 조회
app.get('/users/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 사용자 상세 조회 (프로필 + 게시글 포함)
app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        posts: true,
      },
    });
    if (!user) return res.status(404).json({ message: '사용자 없음' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 사용자 프로필 생성(1:1)
app.post('/users/:id/profile', async (req, res) => {
  try {
    const id = req.params.id;
    const { bio } = req.body;

    // 사용자 존재 확인
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: '사용자 없음' });

    const profile = await prisma.profile.create({
      data: { bio, userId: id },
    });
    res.status(201).json(profile);
  } catch (err) {
    if (err.code === 'P2002') {
      // unique 제약(이미 프로필 있음)
      return res.status(409).json({ message: '이미 프로필이 존재합니다' });
    }
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

/**
 * 게시글(Post)
 */
// 전체 게시글 조회(작성자 포함)
app.get('/posts', async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 단일 게시글 조회
app.get('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!post) return res.status(404).json({ message: 'Post 없음' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 게시글 생성 (작성자 연결)
app.post('/posts', async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    if (!title || !authorId) return res.status(400).json({ message: 'title, authorId 필요' });

    // 작성자 존재 확인
    const authorExists = await prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!authorExists) return res.status(404).json({ message: '작성자 없음' });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: authorId } },
      },
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 게시글 수정
app.patch('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content } = req.body;

    // 존재 확인
    const exists = await prisma.post.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: 'Post 없음' });

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title: typeof title === 'string' ? title : exists.title,
        content: typeof content === 'string' ? content : exists.content,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 게시글 삭제
app.delete('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // 존재 확인
    const exists = await prisma.post.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: 'Post 없음' });

    await prisma.post.delete({ where: { id } });
    res.json({ message: '삭제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
