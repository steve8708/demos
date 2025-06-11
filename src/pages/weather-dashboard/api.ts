// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WeatherData, LocationData, WeatherCodeMapping } from './types';

const BASE_URL = 'https://api.open-meteo.com/v1';

// Default locations for demo purposes
export const DEFAULT_LOCATIONS: LocationData[] = [
  { latitude: 52.52, longitude: 13.41, city: 'Berlin', country: 'Germany' },
  { latitude: 40.7128, longitude: -74.006, city: 'New York', country: 'United States' },
  { latitude: 35.6762, longitude: 139.6503, city: 'Tokyo', country: 'Japan' },
  { latitude: 51.5074, longitude: -0.1278, city: 'London', country: 'United Kingdom' },
  { latitude: 37.7749, longitude: -122.4194, city: 'San Francisco', country: 'United States' },
];

// Weather code mappings based on WMO standards
export const WEATHER_CODES: WeatherCodeMapping = {
  0: { description: 'Clear sky', icon: 'sunny' },
  1: { description: 'Mainly clear', icon: 'mostly-sunny' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy' },
  3: { description: 'Overcast', icon: 'cloudy' },
  45: { description: 'Fog', icon: 'fog' },
  48: { description: 'Depositing rime fog', icon: 'fog' },
  51: { description: 'Light drizzle', icon: 'light-rain' },
  53: { description: 'Moderate drizzle', icon: 'rain' },
  55: { description: 'Dense drizzle', icon: 'rain' },
  56: { description: 'Light freezing drizzle', icon: 'sleet' },
  57: { description: 'Dense freezing drizzle', icon: 'sleet' },
  61: { description: 'Slight rain', icon: 'light-rain' },
  63: { description: 'Moderate rain', icon: 'rain' },
  65: { description: 'Heavy rain', icon: 'heavy-rain' },
  66: { description: 'Light freezing rain', icon: 'sleet' },
  67: { description: 'Heavy freezing rain', icon: 'sleet' },
  71: { description: 'Slight snow fall', icon: 'snow' },
  73: { description: 'Moderate snow fall', icon: 'snow' },
  75: { description: 'Heavy snow fall', icon: 'snow' },
  77: { description: 'Snow grains', icon: 'snow' },
  80: { description: 'Slight rain showers', icon: 'rain' },
  81: { description: 'Moderate rain showers', icon: 'rain' },
  82: { description: 'Violent rain showers', icon: 'heavy-rain' },
  85: { description: 'Slight snow showers', icon: 'snow' },
  86: { description: 'Heavy snow showers', icon: 'snow' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm' },
};

export async function fetchWeatherData(location: LocationData): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`${BASE_URL}/forecast?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function getWeatherDescription(weatherCode: number): string {
  return WEATHER_CODES[weatherCode]?.description || 'Unknown';
}

export function getWeatherIcon(weatherCode: number): string {
  return WEATHER_CODES[weatherCode]?.icon || 'sunny';
}

export function formatTemperature(temp: number, unit: string = '°C'): string {
  return `${Math.round(temp)}${unit}`;
}

export function formatPrecipitation(precipitation: number, unit: string = 'mm'): string {
  return `${precipitation.toFixed(1)}${unit}`;
}

export function formatWindSpeed(speed: number, unit: string = 'km/h'): string {
  return `${Math.round(speed)} ${unit}`;
}

export function formatWindDirection(direction: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(direction / 45) % 8;
  return directions[index];
}

export function formatHumidity(humidity: number): string {
  return `${Math.round(humidity)}%`;
}

export function formatPressure(pressure: number, unit: string = 'hPa'): string {
  return `${Math.round(pressure)} ${unit}`;
}
