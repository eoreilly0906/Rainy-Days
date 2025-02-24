import { Router } from 'express';
import WeatherService from '../../service/weatherService.js';

const router = Router();
const weatherService = new WeatherService();

console.log('Registering weather routes...');

// GET weather data
router.get('/', async (req, res) => {
    console.log('GET /api/weather called');
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }
        const data = await weatherService.getWeatherData(city as string);
        res.json(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// POST weather request
router.post('/', async (req, res) => {
    console.log('POST /api/weather called', req.body);
    try {
        const { city } = req.body;
        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }
        const data = await weatherService.getWeatherData(city);
        res.json(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

console.log('Weather routes registered');

export default router;