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

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current?: CurrentWeather;
  daily?: DailyWeather;
}

export interface GeocodingResult {
  results: WeatherLocation[];
}

export interface WeatherCodeInfo {
  description: string;
  iconName: 'status-positive' | 'status-warning' | 'status-info' | 'status-stopped' | 'refresh';
}

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', iconName: 'status-positive' },
  1: { description: 'Mainly clear', iconName: 'status-positive' },
  2: { description: 'Partly cloudy', iconName: 'status-warning' },
  3: { description: 'Overcast', iconName: 'status-warning' },
  45: { description: 'Fog', iconName: 'status-info' },
  48: { description: 'Depositing rime fog', iconName: 'status-info' },
  51: { description: 'Light drizzle', iconName: 'status-info' },
  53: { description: 'Moderate drizzle', iconName: 'status-info' },
  55: { description: 'Dense drizzle', iconName: 'status-info' },
  56: { description: 'Light freezing drizzle', iconName: 'status-info' },
  57: { description: 'Dense freezing drizzle', iconName: 'status-info' },
  61: { description: 'Slight rain', iconName: 'status-info' },
  63: { description: 'Moderate rain', iconName: 'status-info' },
  65: { description: 'Heavy rain', iconName: 'status-stopped' },
  66: { description: 'Light freezing rain', iconName: 'status-stopped' },
  67: { description: 'Heavy freezing rain', iconName: 'status-stopped' },
  71: { description: 'Slight snow fall', iconName: 'status-info' },
  73: { description: 'Moderate snow fall', iconName: 'status-info' },
  75: { description: 'Heavy snow fall', iconName: 'status-stopped' },
  77: { description: 'Snow grains', iconName: 'status-info' },
  80: { description: 'Slight rain showers', iconName: 'status-info' },
  81: { description: 'Moderate rain showers', iconName: 'status-info' },
  82: { description: 'Violent rain showers', iconName: 'status-stopped' },
  85: { description: 'Slight snow showers', iconName: 'status-info' },
  86: { description: 'Heavy snow showers', iconName: 'status-stopped' },
  95: { description: 'Thunderstorm', iconName: 'status-stopped' },
  96: { description: 'Thunderstorm with slight hail', iconName: 'status-stopped' },
  99: { description: 'Thunderstorm with heavy hail', iconName: 'status-stopped' },
};
