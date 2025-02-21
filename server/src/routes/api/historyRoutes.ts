import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';

// GET: Fetch all search history
router.get('/', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Error retrieving history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: Remove a city from history by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure ID is provided
    if (!id) {
      return res.status(400).json({ error: 'City ID is required' });
    }

     // Check if the city exists before deletion
     const city = await HistoryService.getCityById(id);
     if (city === null || city === undefined) {
       return res.status(404).json({ error: 'City not found' });
     }
    await HistoryService.removeCity(id);
    res.json({ message: 'City removed from history' });

  } catch (error) {
    console.error('Error removing city from history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;