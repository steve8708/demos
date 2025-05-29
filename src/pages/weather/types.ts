// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyWeather[];
  hourly: HourlyWeather[];
  location: Location;
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
  apparentTemperature: number;
  precipitation: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  pressure: number;
}

export interface DailyWeather {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  weatherCode: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
}

export interface HourlyWeather {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country: string;
  admin1?: string;
}

export interface WeatherError {
  message: string;
  code?: string;
}

export interface LocationSearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

// Weather condition codes and descriptions
export const WEATHER_CONDITIONS: Record<number, { description: string; icon: string; emoji: string }> = {
  0: { description: 'Clear sky', icon: 'status-positive', emoji: '☀️' },
  1: { description: 'Mainly clear', icon: 'status-positive', emoji: '🌤️' },
  2: { description: 'Partly cloudy', icon: 'status-warning', emoji: '⛅' },
  3: { description: 'Overcast', icon: 'status-info', emoji: '☁️' },
  45: { description: 'Fog', icon: 'status-info', emoji: '🌫️' },
  48: { description: 'Depositing rime fog', icon: 'status-info', emoji: '🌫️' },
  51: { description: 'Light drizzle', icon: 'status-warning', emoji: '🌦️' },
  53: { description: 'Moderate drizzle', icon: 'status-warning', emoji: '🌧️' },
  55: { description: 'Dense drizzle', icon: 'status-warning', emoji: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: 'status-negative', emoji: '🌨️' },
  57: { description: 'Dense freezing drizzle', icon: 'status-negative', emoji: '🌨️' },
  61: { description: 'Slight rain', icon: 'status-warning', emoji: '🌦️' },
  63: { description: 'Moderate rain', icon: 'status-warning', emoji: '🌧️' },
  65: { description: 'Heavy rain', icon: 'status-negative', emoji: '⛈️' },
  66: { description: 'Light freezing rain', icon: 'status-negative', emoji: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: 'status-negative', emoji: '🌨️' },
  71: { description: 'Slight snow fall', icon: 'status-info', emoji: '🌨️' },
  73: { description: 'Moderate snow fall', icon: 'status-warning', emoji: '❄️' },
  75: { description: 'Heavy snow fall', icon: 'status-negative', emoji: '🌨️' },
  77: { description: 'Snow grains', icon: 'status-info', emoji: '❄️' },
  80: { description: 'Slight rain showers', icon: 'status-warning', emoji: '🌦️' },
  81: { description: 'Moderate rain showers', icon: 'status-warning', emoji: '🌧️' },
  82: { description: 'Violent rain showers', icon: 'status-negative', emoji: '⛈️' },
  85: { description: 'Slight snow showers', icon: 'status-info', emoji: '🌨️' },
  86: { description: 'Heavy snow showers', icon: 'status-negative', emoji: '🌨️' },
  95: { description: 'Thunderstorm', icon: 'status-negative', emoji: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: 'status-negative', emoji: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'status-negative', emoji: '⛈️' },
};

export function getWeatherEmoji(weatherCode: number): string {
  return WEATHER_CONDITIONS[weatherCode]?.emoji || '❓';
}
