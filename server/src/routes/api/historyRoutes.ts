import { Router } from 'express';
import { getHistory, HistoryEntry, removeFromHistory } from '../../service/historyService.js';

const router = Router();

// Add logging to verify route handler is registered
console.log('Registering history routes...');

// GET: Fetch all search history
router.get('/', async (req, res) => {
  console.log('GET /api/history called');
  try {
    const history = await getHistory();
    res.json(history);
  } catch (error) {
    console.error('Error in GET /api/history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
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
    const history = await getHistory();
    const city = history.find((entry: HistoryEntry) => entry.id === id);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    await removeFromHistory(id);
    res.json({ message: 'City removed from history' });

  } catch (error) {
    console.error('Error removing city from history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

console.log('History routes registered');

export default router;