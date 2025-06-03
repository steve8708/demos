// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { LocationData, WeatherData } from '../types';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchLocations(query: string): Promise<LocationData[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching locations:', error);
    throw new Error('Failed to search locations. Please try again.');
  }
}

export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m',
      daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max',
      timezone: 'auto',
      forecast_days: '7',
    });

    const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new Error('Invalid weather data received from API');
    }

    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data. Please try again.');
  }
}

export function getLocationDisplayName(location: LocationData): string {
  const parts = [location.name];

  if (location.admin1) {
    parts.push(location.admin1);
  }

  if (location.country) {
    parts.push(location.country);
  }

  return parts.join(', ');
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

export function formatWindDirection(direction: number): string {
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

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
