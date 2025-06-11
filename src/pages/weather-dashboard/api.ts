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

// Weather code mappings based on WMO standards with emojis
export const WEATHER_CODES: WeatherCodeMapping = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌧️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌨️' },
  57: { description: 'Dense freezing drizzle', icon: '🌨️' },
  61: { description: 'Slight rain', icon: '🌦️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: '🌨️' },
  71: { description: 'Slight snow fall', icon: '🌨️' },
  73: { description: 'Moderate snow fall', icon: '❄️' },
  75: { description: 'Heavy snow fall', icon: '❄️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
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

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(temp: number, unit: string = '°C', convertToFahrenheit: boolean = false): string {
  const temperature = convertToFahrenheit ? celsiusToFahrenheit(temp) : temp;
  const displayUnit = convertToFahrenheit ? '°F' : unit;
  return `${Math.round(temperature)}${displayUnit}`;
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
