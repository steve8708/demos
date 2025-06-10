// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Coordinates, WeatherData, Location } from './types';

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

export class WeatherService {
  static async getCurrentWeatherAndForecast(coordinates: Coordinates): Promise<WeatherData> {
    const { latitude, longitude } = coordinates;
    const url = `${BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=7`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw new Error('Failed to fetch weather data. Please check your internet connection and try again.');
    }
  }

  static async searchLocations(query: string): Promise<Location[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const url = `${GEOCODING_URL}/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.results) {
        return [];
      }

      return data.results.map(
        (result: any): Location => ({
          name: result.name,
          country: result.country || 'Unknown',
          coordinates: {
            latitude: result.latitude,
            longitude: result.longitude,
          },
        }),
      );
    } catch (error) {
      console.error('Failed to search locations:', error);
      throw new Error('Failed to search locations. Please check your internet connection and try again.');
    }
  }

  static async getCurrentLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
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
          let message = 'Unable to retrieve your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out.';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      );
    });
  }
}
