import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the routes
import weatherRoutes from './routes/api/weatherRoutes.js';
import htmlRoutes from './routes/htmlRoutes.js';
import historyRoutes from './routes/api/historyRoutes.js';

// Load environment variables first
dotenv.config();

// Check if API key exists
if (!process.env.OPENWEATHER_API_KEY) {
  console.error('ERROR: OPENWEATHER_API_KEY is not set in .env file');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));        

// API routes
app.use('/api', weatherRoutes);
app.use('/api', historyRoutes);
app.use('/api', htmlRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('API endpoints available at /api/*');
});
