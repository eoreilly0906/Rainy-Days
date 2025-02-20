import express from 'express';
const router = express.Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/api/weather', async (_req, _res) => {
  router.post('/', async (req, res) => {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }
    res.json({ city, weather: 'Sunny', temp: 75 });
  });
  console.log('Received POST request');
  // TODO: GET weather data from city name
  const city = _req.body.city; 
  const weatherData = await WeatherService.getWeatherForCity(city);
  // TODO: save city to search history
  await HistoryService.addCity(city);
  // TODO: return weather data
  _res.json(weatherData);
});

// TODO: GET search history
router.get('/api/history', async (_req, _res) => {
  const history = await HistoryService.getCities();
  _res.json(history);
});

// * BONUS TODO: DELETE city from search history
router.delete('/api/history/:id', async (_req, _res) => {
  const id = _req.params.id;
  await HistoryService.removeCity(id);
  _res.json({ message: 'City deleted from history' });
});

export default router;
