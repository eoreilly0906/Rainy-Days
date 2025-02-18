import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
router.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// TODO: Define route to serve history.html
router.get('/history', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/history.html'));
});
export default router;
