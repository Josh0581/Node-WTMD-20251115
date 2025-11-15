import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  // 기존 유저 삭제
  await prisma.user.deleteMany();

  // 1) 사용자 생성
  const alice = await prisma.user.create({
    data: { email: 'alice@example.com', name: 'Alice' },
  });

  const bob = await prisma.user.create({
    data: { email: 'bob@example.com', name: 'Bob' },
  });

  // 2) 프로필 생성 (1:1)
  await prisma.profile.create({
    data: { bio: 'Hello, I am Alice', userId: alice.id },
  });

  // 3) 게시글 생성 (1:N)
  await prisma.post.create({
    data: {
      title: 'First Post',

      content: 'Prisma + PostgreSQL',

      authorId: alice.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Second Post',

      content: 'Relations are easy',

      authorId: alice.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Bob Post',

      content: 'By Bob',

      authorId: bob.id,
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
