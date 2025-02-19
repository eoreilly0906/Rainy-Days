// TODO: Define an interface for the Coordinates object
interface Coordinates { 
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public temperature: number,
    public description: string,
    public icon: string
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL = 'https://api.openweathermap.org/data/2.5';
  apiKey = '42a818799edaf4fb33ab8e27bde181da';
  cityName = '';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    const data = await response.json();
    return data[0];
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      latitude: locationData.lat,
      longitude: locationData.lon
    };
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    return new Weather(response.main.temp, response.weather[0].description, response.weather[0].icon);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(_currentWeather: Weather, weatherData: any[]) {
    return weatherData.map((day) => new Weather(day.main.temp, day.weather[0].description, day.weather[0].icon));
  }
  // TODO: Complete getWeatherForCity method
  static async getWeatherForCity(city: string) {
    const weatherService = new WeatherService();
    const coordinates = await weatherService.fetchAndDestructureLocationData(city);
    const currentWeather = await weatherService.fetchCurrentWeather(coordinates);
    const forecast = await weatherService.fetchForecast(coordinates);
    return { currentWeather, forecast };
  }

  private async fetchCurrentWeather(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    return this.parseCurrentWeather(data);
  }

  private async fetchForecast(coordinates: Coordinates) {
    const response = await fetch(`${this.baseURL}/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`);
    const data = await response.json();
    return this.buildForecastArray(await this.fetchCurrentWeather(coordinates), data.list);
  }
}

export default WeatherService;
