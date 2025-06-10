// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WeatherApiResponse, WeatherLocation } from './types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeatherData(location: WeatherLocation): Promise<WeatherApiResponse> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
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
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant',
    ].join(','),
    timezone: location.timezone,
    forecast_days: '7',
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function getWindDirection(degrees: number): string {
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

export function formatTemperature(temp: number, unit: string = '°C'): string {
  return `${Math.round(temp)}${unit}`;
}

export function formatSpeed(speed: number, unit: string = 'km/h'): string {
  return `${Math.round(speed)} ${unit}`;
}

export function formatPressure(pressure: number, unit: string = 'hPa'): string {
  return `${Math.round(pressure)} ${unit}`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatTime(timeString: string): string {
  return new Date(timeString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getTemperatureEmoji(temperature: number): string {
  if (temperature >= 35) return '🔥'; // Very hot
  if (temperature >= 25) return '🌡️'; // Warm
  if (temperature >= 15) return '🌤️'; // Mild
  if (temperature >= 5) return '🌬️'; // Cool
  if (temperature >= -5) return '❄️'; // Cold
  return '🧊'; // Freezing
}

export function getHumidityEmoji(humidity: number): string {
  if (humidity >= 80) return '💧'; // Very humid
  if (humidity >= 60) return '🌫️'; // Humid
  if (humidity >= 40) return '💨'; // Moderate
  return '🏜️'; // Dry
}

export function getUVIndexEmoji(uvIndex: number): string {
  if (uvIndex >= 11) return '🟣'; // Extreme
  if (uvIndex >= 8) return '🔴'; // Very high
  if (uvIndex >= 6) return '🟠'; // High
  if (uvIndex >= 3) return '🟡'; // Moderate
  return '🟢'; // Low
}
