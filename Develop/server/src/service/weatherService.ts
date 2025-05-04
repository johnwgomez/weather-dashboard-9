import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public date: string,
    public icon: string,
    public description: string,
    public temperature: number,
    public humidity: number,
    public windSpeed: number
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private geoBaseURL = 'http://api.openweathermap.org/geo/1.0/direct';
  private weatherBaseURL = 'https://api.openweathermap.org/data/2.5/forecast';
  // Use the API_KEY defined in your .env file
  private apiKey = process.env.API_KEY || '';

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `${this.geoBaseURL}?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(city: string): Promise<any> {
    const url = this.buildGeocodeQuery(city);
    const response = await axios.get(url);
    return response.data;
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(data: any): Coordinates {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Location not found');
    }
    const { lat, lon } = data[0];
    return { lat, lon };
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coords: Coordinates): string {
    // include units=imperial for Fahrenheit
    return `${this.weatherBaseURL}` +
           `?lat=${coords.lat}` +
           `&lon=${coords.lon}` +
           `&units=imperial` +
           `&appid=${this.apiKey}`;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coords: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coords);
    const response = await axios.get(url);
    return response.data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(data: any): Weather {
    const first = data.list[0];
    const weather = first.weather[0];
    const iconUrl = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    return new Weather(
      first.dt_txt,
      iconUrl,
      weather.description,
      first.main.temp,
      first.main.humidity,
      first.wind.speed
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(data: any): Weather[] {
    const forecasts = data.list.filter((item: any) =>
      item.dt_txt.endsWith('12:00:00')
    );
    return forecasts.slice(0, 5).map((item: any) => {
      const weather = item.weather[0];
      const iconUrl = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
      return new Weather(
        item.dt_txt,
        iconUrl,
        weather.description,
        item.main.temp,
        item.main.humidity,
        item.wind.speed
      );
    });
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    const locData = await this.fetchLocationData(city);
    const coords = this.destructureLocationData(locData);
    const weatherData = await this.fetchWeatherData(coords);
    const current = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(weatherData);
    return { current, forecast };
  }
}

export default new WeatherService();
