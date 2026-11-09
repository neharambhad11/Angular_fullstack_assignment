
import { Request, Response } from 'express';
import axios from 'axios';

export class WeatherController {

  static async getWeather(req: Request, res: Response) {
    try {
      const city = String(req.query.city || 'Mumbai');

      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: city,
            appid: process.env.WEATHER_API_KEY,
            units: 'metric'
          },
          timeout: 8000
        }
      );

      res.status(200).json({
        success: true,
        data: response.data
      });

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return res.status(404).json({
          message: 'City not found'
        });
      }

      res.status(502).json({
        message: 'Weather service unavailable'
      });
    }
  }
}
