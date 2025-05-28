// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    time: string;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    humidity: number;
    precipitation: number;
    weatherCode: number;
  }>;
  daily: Array<{
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    precipitationSum: number;
    weatherCode: number;
  }>;
}

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

export class WeatherService {
  static async searchLocations(query: string): Promise<LocationData[]> {
    if (!query.trim()) return [];

    try {
      const response = await fetch(
        `${GEOCODING_URL}/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`,
      );

      if (!response.ok) {
        throw new Error('Failed to search locations');
      }

      const data = await response.json();

      return (data.results || []).map((result: any) => ({
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
        admin1: result.admin1,
      }));
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }

  static async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code',
        hourly: 'temperature_2m,relative_humidity_2m,precipitation,weather_code',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
        timezone: 'auto',
        forecast_days: '7',
      });

      const response = await fetch(`${OPEN_METEO_BASE_URL}/forecast?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      return {
        location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        latitude,
        longitude,
        current: {
          temperature: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          windDirection: data.current.wind_direction_10m,
          weatherCode: data.current.weather_code,
          time: data.current.time,
        },
        hourly: data.hourly.time.slice(0, 24).map((time: string, index: number) => ({
          time,
          temperature: Math.round(data.hourly.temperature_2m[index]),
          humidity: data.hourly.relative_humidity_2m[index],
          precipitation: data.hourly.precipitation[index],
          weatherCode: data.hourly.weather_code[index],
        })),
        daily: data.daily.time.map((date: string, index: number) => ({
          date,
          temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
          temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
          precipitationSum: data.daily.precipitation_sum[index],
          weatherCode: data.daily.weather_code[index],
        })),
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  static getWeatherDescription(code: number): string {
    const descriptions: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };

    return descriptions[code] || 'Unknown';
  }

  static getWeatherIcon(code: number): string {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 57) return '🌦️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    if (code <= 86) return '🌨️';
    if (code <= 99) return '⛈️';
    return '🌤️';
  }
}
