import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "url";

// Fix __dirname issue for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_PATH = '/Users/edwardoreilly/Desktop/bootcamp/Rainy-Days/searchHistory.json';

// Define City class
class City {
  constructor(public name: string, public id: string) {}
}

export interface HistoryEntry {
    id: string;
    timestamp: Date;
    query: string;
    result: any;
}

export const addToHistory = async (entry: Omit<HistoryEntry, 'id'>): Promise<HistoryEntry> => {
    try {
        const history = await getHistory();
        const newEntry: HistoryEntry = {
            ...entry,
            id: String(Date.now())
        };
        history.push(newEntry);
        await fs.writeFile(FILE_PATH, JSON.stringify(history, null, 2));
        return newEntry;
    } catch (error) {
        console.error("Error adding to history:", error);
        throw error;
    }
};

export const getHistory = async (): Promise<HistoryEntry[]> => {
    try {
        const data = await fs.readFile(FILE_PATH, "utf8");
        return JSON.parse(data) as HistoryEntry[];
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // If file doesn't exist, create it with empty array
            await fs.writeFile(FILE_PATH, '[]');
            return [];
        }
        console.error("Error reading history:", error);
        throw error;
    }
};

export const removeFromHistory = async (id: string): Promise<void> => {
    try {
        const history = await getHistory();
        const filteredHistory = history.filter(entry => entry.id !== id);
        await fs.writeFile(FILE_PATH, JSON.stringify(filteredHistory, null, 2));
    } catch (error) {
        console.error("Error removing from history:", error);
        throw error;
    }
};

export default class HistoryService {
  private static async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(FILE_PATH, "utf8");
      return JSON.parse(data) as City[];
    } catch (error) {
      console.error("Error reading search history:", error);
      return [];
    }
  }

  private static async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(FILE_PATH, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error("Error writing to search history:", error);
    }
  }

  static async getCities(): Promise<City[]> {
    return await this.read();
  }

  static async getCityById(id: string): Promise<City | null> {
    const cities = await this.read();
    return cities.find((city) => city.id === id) || null;
  }

  static async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(cityName, String(Date.now())); // Unique ID
    cities.push(newCity);
    await this.write(cities);
  }

  static async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    const filteredCities = cities.filter((city) => city.id !== id);
    if (filteredCities.length === cities.length) {
      console.warn(`City with ID ${id} not found.`);
    }
    await this.write(filteredCities);
  }
}