import fetch from 'node-fetch'; // Use node-fetch instead of undici
import path from "node:path";
import { fileURLToPath } from "url";
import fs from "node:fs/promises";
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

interface Coordinates {
  latitude: number;
  longitude: number;
}

class Weather {
  constructor(
    public temperature: number,
    public description: string,
    public icon: string
  ) {}
}

interface WeatherApiResponse {
  main: { temp: number };
  weather: Array<{ description: string; icon: string }>;
}

interface LocationApiResponse {
  lat: number;
  lon: number;
  name: string;
}

interface WeatherData {
    currentWeather: {
        city: string;
        temperature: number;
        description: string;
        icon: string;
    };
    forecast: Array<{
        temperature: number;
        description: string;
        icon: string;
    }>;
}

class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.OPENWEATHER_API_KEY || ''; // Secure API key
  private units = 'metric';

  private async fetchLocationData(city: string): Promise<LocationApiResponse> {
    try {
      const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`);
      console.log("HERE")
      if (!response.ok) throw new Error(`Failed to fetch location: ${response.statusText}`);
      const data = await response.json();
      if (!data.length) throw new Error(`No location found for: ${city}`);
      return data[0];
    } catch (error) {
      throw new Error(`Location fetch failed: ${(error as Error).message}`);
    }
  }

  private destructureLocationData(locationData: LocationApiResponse): Coordinates {
    return { latitude: locationData.lat, longitude: locationData.lon };
  }

  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  private parseCurrentWeather(response: WeatherApiResponse): Weather {
    return {
      temperature: response.main.temp,
      description: response.weather[0].description,
      icon: response.weather[0].icon
    };
  }

  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map((day) => ({
      temperature: day.main.temp,
      description: day.weather[0].description,
      icon: day.weather[0].icon
    }));
  }

  private async fetchCurrentWeather(coordinates: Coordinates): Promise<Weather> {
    try {
      const response = await fetch(`${this.baseURL}/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=${this.units}`);
      if (!response.ok) throw new Error(`Failed to fetch weather: ${response.statusText}`);
      const data: WeatherApiResponse = await response.json();
      return this.parseCurrentWeather(data);
    } catch (error) {
      throw new Error(`Weather fetch failed: ${(error as Error).message}`);
    }
  }

  private async fetchForecast(coordinates: Coordinates): Promise<Weather[]> {
    try {
      const response = await fetch(`${this.baseURL}/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=${this.units}`);
      if (!response.ok) throw new Error(`Failed to fetch forecast: ${response.statusText}`);
      const data = await response.json();
      return this.buildForecastArray(data.list);
    } catch (error) {
      throw new Error(`Forecast fetch failed: ${(error as Error).message}`);
    }
  }

  async getWeatherForCity(city: string) {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const currentWeather = await this.fetchCurrentWeather(coordinates);
      const forecast = await this.fetchForecast(coordinates);
      
      // Log the response structure
      console.log('Weather service response:', { currentWeather, forecast });
      
      return {
        currentWeather: {
          city,
          temperature: currentWeather.temperature,
          description: currentWeather.description,
          icon: currentWeather.icon
        },
        forecast: forecast.map(f => ({
          temperature: f.temperature,
          description: f.description,
          icon: f.icon
        }))
      };
    } catch (error) {
      console.error('Error in getWeatherForCity:', error);
      throw error;
    }
  }

  async getWeatherData(city: string): Promise<WeatherData> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const currentWeather = await this.fetchCurrentWeather(coordinates);
      const forecast = await this.fetchForecast(coordinates);
      
      return {
        currentWeather: {
          city,
          temperature: currentWeather.temperature,
          description: currentWeather.description,
          icon: currentWeather.icon
        },
        forecast: forecast.map(f => ({
          temperature: f.temperature,
          description: f.description,
          icon: f.icon
        }))
      };
    } catch (error) {
      console.error('Error in getWeatherData:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
}

export default WeatherService;