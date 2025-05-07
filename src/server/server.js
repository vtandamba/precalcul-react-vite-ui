import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(cors());

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MeeJeediexo3*",
  database: "neper", 
});

app.get('/api/rules', async (req, res) => {
  const [rows] = await db.query("SELECT * FROM rules ORDER BY priority_score DESC");
  res.json(rows);
});

app.get('/api/links', async (req, res) => {
  const [rows] = await db.query("SELECT * FROM links_maillage ORDER BY score DESC");
  res.json(rows);
});

app.listen(3001, () => console.log("API MySQL prête sur http://localhost:3001"));
