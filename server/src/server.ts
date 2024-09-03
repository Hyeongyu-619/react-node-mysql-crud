import express from "express";
import cors from "cors";
import mysql, {
  Connection,
  RowDataPacket,
  ResultSetHeader,
} from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "myblog-schema",
};

let connection: Connection;

const connectToDatabase = async () => {
  connection = await mysql.createConnection(dbConfig);
  console.log("MySQL에 연결되었습니다.");
};

connectToDatabase().catch((err) => {
  console.error("MySQL 연결 오류:", err);
});

app.get("/api/posts", async (req, res) => {
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(
      "SELECT * FROM posts"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "데이터를 가져오는 데 실패했습니다." });
  }
});

app.post("/api/posts", async (req, res) => {
  const { title, content } = req.body;
  try {
    const [result] = await connection.execute<ResultSetHeader>(
      "INSERT INTO posts (title, content) VALUES (?, ?)",
      [title, content]
    );
    res.status(201).json({ id: result.insertId, title, content });
  } catch (err) {
    res.status(500).json({ error: "게시물을 추가하는 데 실패했습니다." });
  }
});

app.put("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const [result] = await connection.execute<ResultSetHeader>(
      "UPDATE posts SET title = ?, content = ? WHERE id = ?",
      [title, content, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }

    res.json({ id, title, content });
  } catch (err) {
    res.status(500).json({ error: "게시물을 수정하는 데 실패했습니다." });
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await connection.execute<ResultSetHeader>(
      "DELETE FROM posts WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "게시물을 삭제하는 데 실패했습니다." });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
