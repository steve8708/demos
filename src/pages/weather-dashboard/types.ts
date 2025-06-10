// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  wind_speed_10m: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current?: CurrentWeather;
  daily?: DailyWeather;
  hourly?: HourlyWeather;
}

export interface GeocodingResult {
  results: WeatherLocation[];
}

export interface WeatherCodeInfo {
  description: string;
  iconName: 'status-positive' | 'status-warning' | 'status-info' | 'status-stopped' | 'refresh';
  emoji: string;
}

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', iconName: 'status-positive', emoji: '☀️' },
  1: { description: 'Mainly clear', iconName: 'status-positive', emoji: '🌤️' },
  2: { description: 'Partly cloudy', iconName: 'status-warning', emoji: '⛅' },
  3: { description: 'Overcast', iconName: 'status-warning', emoji: '☁️' },
  45: { description: 'Fog', iconName: 'status-info', emoji: '🌫️' },
  48: { description: 'Depositing rime fog', iconName: 'status-info', emoji: '🌫️' },
  51: { description: 'Light drizzle', iconName: 'status-info', emoji: '🌦️' },
  53: { description: 'Moderate drizzle', iconName: 'status-info', emoji: '🌦️' },
  55: { description: 'Dense drizzle', iconName: 'status-info', emoji: '🌧️' },
  56: { description: 'Light freezing drizzle', iconName: 'status-info', emoji: '🌨️' },
  57: { description: 'Dense freezing drizzle', iconName: 'status-info', emoji: '🌨️' },
  61: { description: 'Slight rain', iconName: 'status-info', emoji: '🌧️' },
  63: { description: 'Moderate rain', iconName: 'status-info', emoji: '🌧️' },
  65: { description: 'Heavy rain', iconName: 'status-stopped', emoji: '⛈️' },
  66: { description: 'Light freezing rain', iconName: 'status-stopped', emoji: '🌨️' },
  67: { description: 'Heavy freezing rain', iconName: 'status-stopped', emoji: '🌨️' },
  71: { description: 'Slight snow fall', iconName: 'status-info', emoji: '🌨️' },
  73: { description: 'Moderate snow fall', iconName: 'status-info', emoji: '❄️' },
  75: { description: 'Heavy snow fall', iconName: 'status-stopped', emoji: '❄️' },
  77: { description: 'Snow grains', iconName: 'status-info', emoji: '🌨️' },
  80: { description: 'Slight rain showers', iconName: 'status-info', emoji: '🌦️' },
  81: { description: 'Moderate rain showers', iconName: 'status-info', emoji: '🌧️' },
  82: { description: 'Violent rain showers', iconName: 'status-stopped', emoji: '⛈️' },
  85: { description: 'Slight snow showers', iconName: 'status-info', emoji: '🌨️' },
  86: { description: 'Heavy snow showers', iconName: 'status-stopped', emoji: '❄️' },
  95: { description: 'Thunderstorm', iconName: 'status-stopped', emoji: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', iconName: 'status-stopped', emoji: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', iconName: 'status-stopped', emoji: '⛈️' },
};
