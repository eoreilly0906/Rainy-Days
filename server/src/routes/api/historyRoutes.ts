import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';

router.get('/', async (_req, res) => {
  const cities = await HistoryService.getCities();
  res.json(cities);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await HistoryService.removeCity(id);
  res.json({ message: 'City removed from history' });
});

export default router; 