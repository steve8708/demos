// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { GeocodingResponse, WeatherResponse } from './types';

const GEOCODING_API_BASE = 'https://geocoding.open-meteo.com/v1';
const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';

export async function searchCities(query: string): Promise<GeocodingResponse> {
  const params = new URLSearchParams({
    name: query,
    count: '10',
    language: 'en',
  });

  const url = `${GEOCODING_API_BASE}/search?${params}`;
  console.log('Fetching geocoding data from:', url);

  try {
    const response = await fetch(url);

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Failed to search cities: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Geocoding API response:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherResponse> {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'rain_sum',
    'showers_sum',
    'snowfall_sum',
    'precipitation_hours',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant',
  ].join(',');

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: currentParams,
    daily: dailyParams,
    timezone: 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`${WEATHER_API_BASE}/forecast?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  return response.json();
}

export function getWeatherDescription(weatherCode: number): string {
  const weatherCodes: Record<number, string> = {
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

  return weatherCodes[weatherCode] || 'Unknown';
}

export function getWeatherIcon(weatherCode: number, isDay: boolean): string {
  if (weatherCode === 0) return isDay ? '☀️' : '🌙';
  if (weatherCode <= 3) return isDay ? '⛅' : '☁️';
  if (weatherCode === 45 || weatherCode === 48) return '🌫️';
  if (weatherCode >= 51 && weatherCode <= 57) return '🌦️';
  if (weatherCode >= 61 && weatherCode <= 67) return '🌧️';
  if (weatherCode >= 71 && weatherCode <= 77) return '❄️';
  if (weatherCode >= 80 && weatherCode <= 86) return '🌧️';
  if (weatherCode >= 95) return '⛈️';
  return '🌤️';
}

export function formatTemperature(temp: number, unit: string): string {
  return `${Math.round(temp)}${unit}`;
}

export function formatWindDirection(degrees: number): string {
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
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
