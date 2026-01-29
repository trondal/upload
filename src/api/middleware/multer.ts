import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

const uploadDir = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    // basic safe-ish filename
    const ts = Date.now();
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${base}_${ts}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});
