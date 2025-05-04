import { Router, type Request, type Response } from 'express';
const router = Router();

import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const { city } = req.body;
  const weatherData = await weatherService.getWeatherForCity(city);
  // TODO: save city to search history
  await historyService.addCity(city);
  res.json(weatherData);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  const cities = await historyService.getCities();
  res.json(cities);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await historyService.removeCity(id);
  res.json(updated);
});

export default router;
