// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
  };
}

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

// Weather codes mapping for Open Meteo
export const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: 'sunny' },
  1: { description: 'Mainly clear', icon: 'partly-cloudy' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy' },
  3: { description: 'Overcast', icon: 'cloudy' },
  45: { description: 'Fog', icon: 'cloudy' },
  48: { description: 'Depositing rime fog', icon: 'cloudy' },
  51: { description: 'Light drizzle', icon: 'rainy' },
  53: { description: 'Moderate drizzle', icon: 'rainy' },
  55: { description: 'Dense drizzle', icon: 'rainy' },
  61: { description: 'Slight rain', icon: 'rainy' },
  63: { description: 'Moderate rain', icon: 'rainy' },
  65: { description: 'Heavy rain', icon: 'rainy' },
  71: { description: 'Slight snow', icon: 'snowy' },
  73: { description: 'Moderate snow', icon: 'snowy' },
  75: { description: 'Heavy snow', icon: 'snowy' },
  80: { description: 'Slight rain showers', icon: 'rainy' },
  81: { description: 'Moderate rain showers', icon: 'rainy' },
  82: { description: 'Violent rain showers', icon: 'rainy' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm' },
};

export class WeatherService {
  private static readonly BASE_URL = 'https://api.open-meteo.com/v1';
  private static readonly GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

  static async searchLocations(query: string): Promise<LocationData[]> {
    if (!query.trim()) return [];

    try {
      const response = await fetch(
        `${this.GEOCODING_URL}/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`,
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
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
        hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,weather_code',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code',
        timezone: 'auto',
        forecast_days: '7',
      });

      const response = await fetch(`${this.BASE_URL}/forecast?${params}`);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  static getWeatherDescription(code: number): string {
    return WEATHER_CODES[code]?.description || 'Unknown';
  }

  static getWeatherIcon(code: number): string {
    return WEATHER_CODES[code]?.icon || 'cloudy';
  }

  // Default locations for quick access
  static getDefaultLocations(): LocationData[] {
    return [
      { name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'United States' },
      { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom' },
      { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan' },
      { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia' },
      { name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France' },
      { name: 'Berlin', latitude: 52.52, longitude: 13.405, country: 'Germany' },
    ];
  }
}
