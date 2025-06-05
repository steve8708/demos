// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WeatherData, WeatherLocation, GeocodeResult } from '../types';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

export class WeatherApiService {
  static async getCurrentPosition(): Promise<WeatherLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        { timeout: 10000, enableHighAccuracy: true },
      );
    });
  }

  static async searchLocations(query: string): Promise<GeocodeResult[]> {
    try {
      const response = await fetch(
        `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`,
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Failed to search locations:', error);
      throw error;
    }
  }

  static async getWeatherData(location: WeatherLocation): Promise<WeatherData> {
    try {
      const params = new URLSearchParams({
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        current: [
          'temperature_2m',
          'weather_code',
          'wind_speed_10m',
          'wind_direction_10m',
          'relative_humidity_2m',
          'surface_pressure',
          'uv_index',
        ].join(','),
        hourly: ['temperature_2m', 'relative_humidity_2m', 'precipitation', 'wind_speed_10m', 'weather_code'].join(','),
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_sum',
          'wind_speed_10m_max',
          'weather_code',
          'uv_index_max',
        ].join(','),
        timezone: 'auto',
        forecast_days: '7',
      });

      console.log('Weather API URL:', `${OPEN_METEO_BASE_URL}/forecast?${params}`);

      const response = await fetch(`${OPEN_METEO_BASE_URL}/forecast?${params}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Weather API error response:', errorText);
        throw new Error(`Weather API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Weather API response:', data);

      // Check if we have the expected data structure
      if (!data.current || !data.hourly || !data.daily) {
        throw new Error('Invalid response structure from weather API');
      }

      return {
        current: {
          temperature: data.current.temperature_2m || 0,
          weatherCode: data.current.weather_code || 0,
          windSpeed: data.current.wind_speed_10m || 0,
          windDirection: data.current.wind_direction_10m || 0,
          humidity: data.current.relative_humidity_2m || 0,
          pressure: data.current.surface_pressure || 0,
          visibility: data.current.visibility || 0,
          uvIndex: data.current.uv_index || 0,
          time: data.current.time || new Date().toISOString(),
        },
        hourly: {
          time: (data.hourly.time || []).slice(0, 24), // Next 24 hours
          temperature: (data.hourly.temperature_2m || []).slice(0, 24),
          humidity: (data.hourly.relative_humidity_2m || []).slice(0, 24),
          precipitation: (data.hourly.precipitation || []).slice(0, 24),
          windSpeed: (data.hourly.wind_speed_10m || []).slice(0, 24),
          weatherCode: (data.hourly.weather_code || []).slice(0, 24),
        },
        daily: {
          time: data.daily.time || [],
          temperatureMax: data.daily.temperature_2m_max || [],
          temperatureMin: data.daily.temperature_2m_min || [],
          precipitation: data.daily.precipitation_sum || [],
          windSpeedMax: data.daily.wind_speed_10m_max || [],
          weatherCode: data.daily.weather_code || [],
          uvIndexMax: data.daily.uv_index_max || [],
        },
        timezone: data.timezone || 'UTC',
        location,
      };
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      if (error instanceof Error) {
        throw new Error(`Weather data fetch failed: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching weather data');
    }
  }

  static async getReverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      // Use a different approach - search for the nearest place using a small radius
      const response = await fetch(
        `${GEOCODING_BASE_URL}/search?name=&latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`,
      );

      if (!response.ok) {
        console.warn(`Reverse geocoding failed: ${response.status}`);
        return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      }

      const data = await response.json();
      const result = data.results?.[0];

      if (result) {
        return `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}, ${result.country}`;
      }

      return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    } catch (error) {
      console.warn('Failed to reverse geocode:', error);
      return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    }
  }
}
