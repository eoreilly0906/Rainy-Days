import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  const city = req.body.city;
  const weatherData = await WeatherService.getWeatherData(city);
  // TODO: save city to search history
  await HistoryService.addCity(city);
  res.status(200).json(weatherData);
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  const cities = await HistoryService.getCities();
  res.status(200).json(cities);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const id = req.params.id;
  await HistoryService.removeCity(id);
  res.status(200).json({ message: 'City removed from history' });
});

export default router;


