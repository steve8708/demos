// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherCodeConfig {
  description: string;
  icon: string;
}

export const WEATHER_CODES: { [key: number]: WeatherCodeConfig } = {
  0: { description: 'Clear sky', icon: 'sunny' },
  1: { description: 'Mainly clear', icon: 'partly-cloudy' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy' },
  3: { description: 'Overcast', icon: 'cloudy' },
  45: { description: 'Fog', icon: 'fog' },
  48: { description: 'Depositing rime fog', icon: 'fog' },
  51: { description: 'Light drizzle', icon: 'drizzle' },
  53: { description: 'Moderate drizzle', icon: 'drizzle' },
  55: { description: 'Dense drizzle', icon: 'drizzle' },
  56: { description: 'Light freezing drizzle', icon: 'freezing-rain' },
  57: { description: 'Dense freezing drizzle', icon: 'freezing-rain' },
  61: { description: 'Slight rain', icon: 'rain' },
  63: { description: 'Moderate rain', icon: 'rain' },
  65: { description: 'Heavy rain', icon: 'heavy-rain' },
  66: { description: 'Light freezing rain', icon: 'freezing-rain' },
  67: { description: 'Heavy freezing rain', icon: 'freezing-rain' },
  71: { description: 'Slight snow fall', icon: 'snow' },
  73: { description: 'Moderate snow fall', icon: 'snow' },
  75: { description: 'Heavy snow fall', icon: 'snow' },
  77: { description: 'Snow grains', icon: 'snow' },
  80: { description: 'Slight rain showers', icon: 'showers' },
  81: { description: 'Moderate rain showers', icon: 'showers' },
  82: { description: 'Violent rain showers', icon: 'heavy-rain' },
  85: { description: 'Slight snow showers', icon: 'snow' },
  86: { description: 'Heavy snow showers', icon: 'snow' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm' },
};

export const WEATHER_EMOJI_MAP: { [key: number]: string } = {
  0: '☀️', // Clear sky
  1: '🌤️', // Mainly clear
  2: '⛅', // Partly cloudy
  3: '☁️', // Overcast
  45: '🌫️', // Fog
  48: '🌫️', // Depositing rime fog
  51: '🌦️', // Light drizzle
  53: '🌦️', // Moderate drizzle
  55: '🌧️', // Dense drizzle
  56: '🌨️', // Light freezing drizzle
  57: '🌨️', // Dense freezing drizzle
  61: '🌧️', // Slight rain
  63: '🌧️', // Moderate rain
  65: '🌧️', // Heavy rain
  66: '🌨️', // Light freezing rain
  67: '🌨️', // Heavy freezing rain
  71: '❄️', // Slight snow fall
  73: '❄️', // Moderate snow fall
  75: '🌨️', // Heavy snow fall
  77: '❄️', // Snow grains
  80: '🌦️', // Slight rain showers
  81: '🌧️', // Moderate rain showers
  82: '⛈️', // Violent rain showers
  85: '🌨️', // Slight snow showers
  86: '🌨️', // Heavy snow showers
  95: '⛈️', // Thunderstorm
  96: '⛈️', // Thunderstorm with slight hail
  99: '⛈️', // Thunderstorm with heavy hail
};

export const API_CONFIG = {
  BASE_URL: 'https://api.open-meteo.com/v1',
  GEOCODING_URL: 'https://geocoding-api.open-meteo.com/v1',
  DEFAULT_FORECAST_DAYS: '7',
  SEARCH_LIMIT: 10,
  LANGUAGE: 'en',
  FORMAT: 'json',
} as const;
