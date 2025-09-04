import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Database from "better-sqlite3";

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Database setup (better-sqlite3)
const db = new Database(path.join(__dirname, "database.db"));
db.prepare(`
  CREATE TABLE IF NOT EXISTS recordings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    filesize INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Routes
// Upload recording
app.post("/api/recordings", upload.single("recording"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { filename, path: filepath, size } = req.file;
  const stmt = db.prepare(
    `INSERT INTO recordings (filename, filepath, filesize) VALUES (?, ?, ?)`
  );
  const info = stmt.run(filename, filepath, size);
  res.json({
    id: info.lastInsertRowid,
    filename,
    filepath,
    filesize: size,
    createdAt: new Date().toISOString(),
    message: "Upload successful",
  });
});

// Get all recordings
app.get("/api/recordings", (req, res) => {
  const rows = db.prepare(`SELECT * FROM recordings ORDER BY createdAt DESC`).all();
  res.json(rows);
});

// Get recording by ID
app.get("/api/recordings/:id", (req, res) => {
  const { id } = req.params;
  const row = db.prepare(`SELECT * FROM recordings WHERE id = ?`).get(id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

// Delete recording by ID
app.delete("/api/recordings/:id", (req, res) => {
  const { id } = req.params;
  const row = db.prepare(`SELECT * FROM recordings WHERE id = ?`).get(id);
  if (!row) return res.status(404).json({ error: "Not found" });
  fs.unlink(row.filepath, (fsErr) => {
    if (fsErr && fsErr.code !== 'ENOENT') {
      return res.status(500).json({ error: "Failed to delete file" });
    }
    db.prepare(`DELETE FROM recordings WHERE id = ?`).run(id);
    res.json({ message: "Recording deleted successfully" });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
