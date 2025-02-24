import { Router } from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';

const router = Router();

router.post('/weather', async (req, res) => {
  console.log("Received request body:", req.body);
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const weatherService = new WeatherService();
    const weatherData = await weatherService.getWeatherForCity(city);
    console.log("Weather data to send:", weatherData);
    await HistoryService.addCity(city);
    res.json(weatherData);
  } catch (error: unknown) {
    console.error("Error fetching weather:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

export default router;