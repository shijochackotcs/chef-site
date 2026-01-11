import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Ensure upload directories exist
const baseDir = path.resolve('uploads');
const imageDir = path.join(baseDir, 'images');
const videoDir = path.join(baseDir, 'videos');
for (const p of [baseDir, imageDir, videoDir]) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// Storage per type
const storageImage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imageDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_');
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});

const storageVideo = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, videoDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_');
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});

const uploadImage = multer({ storage: storageImage, limits: { fileSize: 25 * 1024 * 1024 } });
const uploadVideo = multer({ storage: storageVideo, limits: { fileSize: 200 * 1024 * 1024 } });

app.post('/api/upload/image', uploadImage.single('file'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file provided' });
  const url = `/uploads/images/${file.filename}`;
  res.json({ url, filename: file.filename, size: file.size, mimetype: file.mimetype });
});

app.post('/api/upload/video', uploadVideo.single('file'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file provided' });
  const url = `/uploads/videos/${file.filename}`;
  res.json({ url, filename: file.filename, size: file.size, mimetype: file.mimetype });
});

// Serve uploaded files statically
app.use('/uploads', express.static(baseDir));

app.listen(PORT, () => {
  console.log(`Upload server listening on http://localhost:${PORT}`);
});
