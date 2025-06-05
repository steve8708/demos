// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  time: string;
}

export interface HourlyWeather {
  time: string[];
  temperature: number[];
  humidity: number[];
  precipitation: number[];
  windSpeed: number[];
  weatherCode: number[];
}

export interface DailyWeather {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  precipitation: number[];
  windSpeedMax: number[];
  weatherCode: number[];
  uvIndexMax: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  timezone: string;
  location: WeatherLocation;
}

export interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

export interface WeatherCodeInfo {
  description: string;
  icon: string;
  emoji: string;
}

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', icon: 'status-positive', emoji: '☀️' },
  1: { description: 'Mainly clear', icon: 'status-positive', emoji: '🌤️' },
  2: { description: 'Partly cloudy', icon: 'status-warning', emoji: '⛅' },
  3: { description: 'Overcast', icon: 'status-warning', emoji: '☁️' },
  45: { description: 'Fog', icon: 'status-info', emoji: '🌫️' },
  48: { description: 'Depositing rime fog', icon: 'status-info', emoji: '🌫️' },
  51: { description: 'Light drizzle', icon: 'status-info', emoji: '🌦️' },
  53: { description: 'Moderate drizzle', icon: 'status-info', emoji: '🌦️' },
  55: { description: 'Dense drizzle', icon: 'status-info', emoji: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: 'status-info', emoji: '🌨️' },
  57: { description: 'Dense freezing drizzle', icon: 'status-info', emoji: '🌨️' },
  61: { description: 'Slight rain', icon: 'status-info', emoji: '🌦️' },
  63: { description: 'Moderate rain', icon: 'status-info', emoji: '🌧️' },
  65: { description: 'Heavy rain', icon: 'status-negative', emoji: '🌧️' },
  66: { description: 'Light freezing rain', icon: 'status-negative', emoji: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: 'status-negative', emoji: '🌨️' },
  71: { description: 'Slight snow', icon: 'status-info', emoji: '🌨️' },
  73: { description: 'Moderate snow', icon: 'status-info', emoji: '❄️' },
  75: { description: 'Heavy snow', icon: 'status-negative', emoji: '❄️' },
  77: { description: 'Snow grains', icon: 'status-info', emoji: '🌨️' },
  80: { description: 'Slight rain showers', icon: 'status-info', emoji: '🌦️' },
  81: { description: 'Moderate rain showers', icon: 'status-info', emoji: '🌧️' },
  82: { description: 'Violent rain showers', icon: 'status-negative', emoji: '⛈️' },
  85: { description: 'Slight snow showers', icon: 'status-info', emoji: '🌨️' },
  86: { description: 'Heavy snow showers', icon: 'status-negative', emoji: '❄️' },
  95: { description: 'Thunderstorm', icon: 'status-negative', emoji: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: 'status-negative', emoji: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'status-negative', emoji: '⛈️' },
};
