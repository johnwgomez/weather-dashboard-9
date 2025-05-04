// TODO: Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}

import path from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const filePath = path.join(process.cwd(), 'searchHistory.json');
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        // File does not exist yet; return empty history
        return [];
      }
      throw err;
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const filePath = path.join(process.cwd(), 'searchHistory.json');
    await fs.writeFile(filePath, JSON.stringify(cities, null, 2), 'utf-8');
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(name: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(uuidv4(), name);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<City[]> {
    const cities = await this.read();
    const filtered = cities.filter(city => city.id !== id);
    await this.write(filtered);
    return filtered;
  }
}

export default new HistoryService();
