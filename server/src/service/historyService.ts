import path from "node:path";
import fs from "node:fs/promises";
// TODO: Define a City class with name and id properties
class City {
  constructor(
    public name: string,
    public id: string
  ) {}
}

// TODO: Complete the HistoryService class
export default class HistoryService {
  private cities: City[] = [];

  constructor() {
    this.cities = [];
  }
  // TODO: Define a read method that reads from the searchHistory.json file
    private async read() {
    const data = await fs.readFile(path.join(__dirname, '../data/searchHistory.json'), 'utf8');
    this.cities = JSON.parse(data);
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await fs.writeFile(path.join(__dirname, '../data/searchHistory.json'), JSON.stringify(cities, null, 2));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  static async getCities() {
    const historyService = new HistoryService();
    await historyService.read();
    return historyService.cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  static async addCity(city: string) {
    const historyService = new HistoryService();
    await historyService.read();
    historyService.cities.push(new City(city, String(historyService.cities.length + 1)));
    await historyService.write(historyService.cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // 1. Reading current cities from the file via read()
  // 2. Filtering out the city with matching id
  // 3. Writing the filtered array back to the file via write()
  static async removeCity(id: string) {
    const historyService = new HistoryService();
    await historyService.read();
    historyService.cities = historyService.cities.filter((city) => city.id !== id);
    await historyService.write(historyService.cities);
  }
}