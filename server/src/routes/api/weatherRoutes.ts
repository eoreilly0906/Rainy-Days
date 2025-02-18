import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (_req, res) => {
  // TODO: GET weather data from city name
  const city = _req.body.city;
  const weatherData = await WeatherService.getWeatherForCity(city);
  // TODO: save city to search history
  await HistoryService.addCity(city);
  res.json(weatherData);
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  const cities = await HistoryService.getCities();
  res.json(cities);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req, res) => {
  const id = _req.params.id;
  await HistoryService.removeCity(id);
  res.json({ message: 'City removed from history' });
});

export default router;


