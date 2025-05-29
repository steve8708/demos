// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WEATHER_CODES, API_CONFIG } from './weather-config';

export interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
    wind_speed_10m_max: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
  admin1?: string;
}

export interface GeocodingResult {
  results: LocationData[];
}

export class WeatherAPI {
  static async searchLocations(query: string): Promise<LocationData[]> {
    if (!query.trim()) return [];

    try {
      const response = await fetch(
        `${API_CONFIG.GEOCODING_URL}/search?name=${encodeURIComponent(query)}&count=${API_CONFIG.SEARCH_LIMIT}&language=${API_CONFIG.LANGUAGE}&format=${API_CONFIG.FORMAT}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeocodingResult = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching locations:', error);
      throw new Error('Failed to search locations. Please try again.');
    }
  }

  static async getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'precipitation',
          'weather_code',
          'cloud_cover',
          'pressure_msl',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m',
        ].join(','),
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_sum',
          'weather_code',
          'wind_speed_10m_max',
        ].join(','),
        hourly: ['temperature_2m', 'precipitation', 'weather_code', 'wind_speed_10m'].join(','),
        timezone: 'auto',
        forecast_days: '7',
      });

      const response = await fetch(`${this.BASE_URL}/forecast?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data. Please try again.');
    }
  }

  static getWeatherDescription(code: number): string {
    return WEATHER_CODES[code]?.description || 'Unknown';
  }

  static getWeatherIcon(code: number): string {
    return WEATHER_CODES[code]?.icon || 'unknown';
  }

  static formatTemperature(temp: number): string {
    return `${Math.round(temp)}°C`;
  }

  static formatWindSpeed(speed: number): string {
    return `${Math.round(speed)} km/h`;
  }

  static formatWindDirection(direction: number): string {
    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    const index = Math.round(direction / 22.5) % 16;
    return directions[index];
  }

  static formatPressure(pressure: number): string {
    return `${Math.round(pressure)} hPa`;
  }

  static formatHumidity(humidity: number): string {
    return `${Math.round(humidity)}%`;
  }

  static formatPrecipitation(precipitation: number): string {
    return `${precipitation.toFixed(1)} mm`;
  }
}
