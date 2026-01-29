import { Router } from 'express';
import { upload } from '../middleware/multer';

export const uploadRouter = Router();

// field name must match the client: "file"
uploadRouter.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No file uploaded' });
  }

  return res.json({
    ok: true,
    originalName: req.file.originalname,
    storedName: req.file.filename,
    size: req.file.size,
    mimeType: req.file.mimetype
  });
});
