import { Router } from 'express';
import weatherRoutes from './weatherRoutes.js';
import historyRoutes from './historyRoutes.js';

const router = Router();

// Add some logging to verify routes are being registered
console.log('Registering API routes...');

// Mount weather and history routes
router.use('/weather', weatherRoutes);
router.use('/history', historyRoutes);

console.log('API routes registered');

export default router;