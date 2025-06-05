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
          console.log('Got geolocation:', position.coords);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        { timeout: 5000, enableHighAccuracy: false, maximumAge: 300000 }
      );
    });
  }
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
      // Simplified parameter construction
      const url = `${OPEN_METEO_BASE_URL}/forecast` +
        `?latitude=${location.latitude}` +
        `&longitude=${location.longitude}` +
        `&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,surface_pressure,uv_index` +
        `&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code,uv_index_max` +
        `&timezone=auto` +
        `&forecast_days=7`;

      console.log('Weather API URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Weather API error response:', response.status, errorText);
        throw new Error(`Weather API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Weather API response keys:', Object.keys(data));
      console.log('Current data:', data.current);

      // Check if we have the expected data structure
      if (!data.current) {
        console.error('No current weather data in response:', data);
        throw new Error('No current weather data available');
      }

      return {
        current: {
          temperature: data.current.temperature_2m ?? 0,
          weatherCode: data.current.weather_code ?? 0,
          windSpeed: data.current.wind_speed_10m ?? 0,
          windDirection: data.current.wind_direction_10m ?? 0,
          humidity: data.current.relative_humidity_2m ?? 0,
          pressure: data.current.surface_pressure ?? 1013,
          visibility: 10000, // Default visibility since not always available
          uvIndex: data.current.uv_index ?? 0,
          time: data.current.time ?? new Date().toISOString(),
        },
        hourly: {
          time: (data.hourly?.time || []).slice(0, 24),
          temperature: (data.hourly?.temperature_2m || []).slice(0, 24),
          humidity: (data.hourly?.relative_humidity_2m || []).slice(0, 24),
          precipitation: (data.hourly?.precipitation || []).slice(0, 24),
          windSpeed: (data.hourly?.wind_speed_10m || []).slice(0, 24),
          weatherCode: (data.hourly?.weather_code || []).slice(0, 24),
        },
        daily: {
          time: data.daily?.time || [],
          temperatureMax: data.daily?.temperature_2m_max || [],
          temperatureMin: data.daily?.temperature_2m_min || [],
          precipitation: data.daily?.precipitation_sum || [],
          windSpeedMax: data.daily?.wind_speed_10m_max || [],
          weatherCode: data.daily?.weather_code || [],
          uvIndexMax: data.daily?.uv_index_max || [],
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