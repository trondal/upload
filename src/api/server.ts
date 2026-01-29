import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { uploadRouter } from './routes/upload';

const app = express();
const PORT = Number(process.env.API_PORT ?? 5174);

// Useful when running Vite dev server on 5173
app.use(
  cors({
    origin: ['http://localhost:5173']
  })
);

// Optional health check
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Routes
app.use('/api', uploadRouter);

// Serve uploaded files statically (optional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.listen(PORT, () => {
  console.log(`[api] Express listening on http://localhost:${PORT}`);
});
