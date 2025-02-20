import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
router.get('/', (_req, res) => {
  console.log('Serving index.html');
  res.sendFile(path.join(__dirname, './Users/edwardoreilly/Desktop/bootcamp/Rainy-Days/client/index.html.'));
});

// TODO: Define route to serve history.html
router.get('/api/weather/history', (_req, res) => {
  console.log('Serving history.html');
  res.sendFile(path.join(__dirname, '../public/history.html'));
});
export default router;
