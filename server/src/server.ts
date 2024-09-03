import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "your_database",
});

// CRUD API 예시
app.get("/api/items", (req, res) => {
  db.query("SELECT * FROM items", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 서버 시작
app.listen(5000, () => {
  console.log("서버가 5000번 포트에서 실행 중입니다.");
});
