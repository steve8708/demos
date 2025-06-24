// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WeatherApiResponse, GeocodingApiResponse, GeocodingResult } from '../types';

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

/**
 * Fetches weather data from Open Meteo API
 */
export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherApiResponse> {
  const currentParams = [
    'temperature_2m',
    'wind_speed_10m',
    'wind_direction_10m',
    'relative_humidity_2m',
    'apparent_temperature',
    'precipitation',
    'weather_code',
    'is_day',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'precipitation',
    'wind_speed_10m',
    'relative_humidity_2m',
    'weather_code',
  ].join(',');

  const dailyParams = [
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_sum',
    'wind_speed_10m_max',
    'weather_code',
  ].join(',');

  const url =
    `${BASE_URL}/forecast?` +
    `latitude=${latitude}&` +
    `longitude=${longitude}&` +
    `current=${currentParams}&` +
    `hourly=${hourlyParams}&` +
    `daily=${dailyParams}&` +
    `timezone=auto&` +
    `forecast_days=7`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Searches for locations using Open Meteo Geocoding API
 */
export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) {
    return [];
  }

  const url = `${GEOCODING_URL}/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }

    const data: GeocodingApiResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

/**
 * Gets weather description from weather code
 */
export function getWeatherDescription(code: number, isDay: boolean = true): string {
  const weatherCodes: Record<number, { day: string; night: string }> = {
    0: { day: 'Clear sky', night: 'Clear sky' },
    1: { day: 'Mainly clear', night: 'Mainly clear' },
    2: { day: 'Partly cloudy', night: 'Partly cloudy' },
    3: { day: 'Overcast', night: 'Overcast' },
    45: { day: 'Fog', night: 'Fog' },
    48: { day: 'Depositing rime fog', night: 'Depositing rime fog' },
    51: { day: 'Light drizzle', night: 'Light drizzle' },
    53: { day: 'Moderate drizzle', night: 'Moderate drizzle' },
    55: { day: 'Dense drizzle', night: 'Dense drizzle' },
    56: { day: 'Light freezing drizzle', night: 'Light freezing drizzle' },
    57: { day: 'Dense freezing drizzle', night: 'Dense freezing drizzle' },
    61: { day: 'Slight rain', night: 'Slight rain' },
    63: { day: 'Moderate rain', night: 'Moderate rain' },
    65: { day: 'Heavy rain', night: 'Heavy rain' },
    66: { day: 'Light freezing rain', night: 'Light freezing rain' },
    67: { day: 'Heavy freezing rain', night: 'Heavy freezing rain' },
    71: { day: 'Slight snow fall', night: 'Slight snow fall' },
    73: { day: 'Moderate snow fall', night: 'Moderate snow fall' },
    75: { day: 'Heavy snow fall', night: 'Heavy snow fall' },
    77: { day: 'Snow grains', night: 'Snow grains' },
    80: { day: 'Slight rain showers', night: 'Slight rain showers' },
    81: { day: 'Moderate rain showers', night: 'Moderate rain showers' },
    82: { day: 'Violent rain showers', night: 'Violent rain showers' },
    85: { day: 'Slight snow showers', night: 'Slight snow showers' },
    86: { day: 'Heavy snow showers', night: 'Heavy snow showers' },
    95: { day: 'Thunderstorm', night: 'Thunderstorm' },
    96: { day: 'Thunderstorm with slight hail', night: 'Thunderstorm with slight hail' },
    99: { day: 'Thunderstorm with heavy hail', night: 'Thunderstorm with heavy hail' },
  };

  const weather = weatherCodes[code];
  if (!weather) {
    return 'Unknown';
  }

  return isDay ? weather.day : weather.night;
}

/**
 * Gets weather icon name based on weather code and time of day
 */
export function getWeatherIcon(code: number, isDay: boolean = true): string {
  if (code === 0) return isDay ? 'sun' : 'moon';
  if (code >= 1 && code <= 3) return isDay ? 'cloud-sun' : 'cloud-moon';
  if (code >= 45 && code <= 48) return 'cloud';
  if (code >= 51 && code <= 67) return 'cloud-rain';
  if (code >= 71 && code <= 86) return 'cloud-snow';
  if (code >= 95 && code <= 99) return 'cloud-lightning';

  return 'cloud';
}

/**
 * Gets weather emoji based on weather code and time of day
 */
export function getWeatherEmoji(code: number, isDay: boolean = true): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code === 1) return isDay ? '🌤️' : '🌙';
  if (code === 2) return isDay ? '⛅' : '☁️';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 65) return '🌧️';
  if (code >= 66 && code <= 67) return '🌨️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95 && code <= 99) return '⛈️';

  return '☁️';
}
