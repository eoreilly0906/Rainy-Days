import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// Import the routes
import weatherRoutes from './routes/api/weatherRoutes.js';
import htmlRoutes from './routes/htmlRoutes.js';
import historyRoutes from './routes/api/historyRoutes.js';

const app = express();

const PORT = process.env.PORT || 3001;

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));        

// API routes - let's add a prefix
app.use('/api', weatherRoutes);
app.use('/api', historyRoutes);
app.use('/api', htmlRoutes);

app.post('/api/weather', async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  // Example response (replace this with your real API call)
  res.json({ city, weather: 'Sunny', temp: 75 });
});

// Serve static files - only need this once
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('API endpoints available at /api/*');
});
