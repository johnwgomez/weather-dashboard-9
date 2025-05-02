import { Router, type Request, type Response } from 'express';
const router = Router();

import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const { city } = req.body;
  const weatherData = weatherService.getWeatherForCity(city);
  // TODO: save city to search history
  historyService.addCity(city);
  res.json(weatherData);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  const cities = historyService.getCities();
  res.json(cities);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, _res: Response) => {});

export default router;
