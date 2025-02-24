import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import the routes
import apiRoutes from './routes/api/index.js';

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

// Calculate the correct path to the client dist directory
// When running from dist/server.js, we need to go up 2 levels to get to server root
// then up one more level to project root, then into client/dist
const clientDistPath = path.resolve(__dirname, '..', '..', 'client', 'dist');

// Verify the client dist directory exists
if (!fs.existsSync(clientDistPath)) {
  console.error(`Client dist directory not found at: ${clientDistPath}`);
  console.error('Please ensure you have built the client application');
  process.exit(1);
}

// Verify index.html exists
const indexPath = path.join(clientDistPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error(`index.html not found at: ${indexPath}`);
  console.error('Please ensure you have built the client application');
  process.exit(1);
}

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Body parser middleware MUST come before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));        

// API routes
app.use('/api', apiRoutes);

// Static files and catch-all route should come after API routes
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  res.sendFile(indexPath);
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('API endpoints available at /api/*');
  console.log(`Serving static files from: ${clientDistPath}`);
  console.log(`Index file location: ${indexPath}`);
});
