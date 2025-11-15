import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// 헬스 체크
app.get("/", (req, res) => {
  res.send("Prisma + PostgreSQL API");
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
