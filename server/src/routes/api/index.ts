import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes.js';
import historyRoutes from './historyRoutes.js'; // Add this import

// Mount weather and history routes
router.use('/weather', weatherRoutes);
router.use('/history', historyRoutes); // Add this route

export default router;