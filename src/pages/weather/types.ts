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
}

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', icon: 'status-positive' },
  1: { description: 'Mainly clear', icon: 'status-positive' },
  2: { description: 'Partly cloudy', icon: 'status-warning' },
  3: { description: 'Overcast', icon: 'status-warning' },
  45: { description: 'Fog', icon: 'status-info' },
  48: { description: 'Depositing rime fog', icon: 'status-info' },
  51: { description: 'Light drizzle', icon: 'status-info' },
  53: { description: 'Moderate drizzle', icon: 'status-info' },
  55: { description: 'Dense drizzle', icon: 'status-info' },
  56: { description: 'Light freezing drizzle', icon: 'status-info' },
  57: { description: 'Dense freezing drizzle', icon: 'status-info' },
  61: { description: 'Slight rain', icon: 'status-info' },
  63: { description: 'Moderate rain', icon: 'status-info' },
  65: { description: 'Heavy rain', icon: 'status-negative' },
  66: { description: 'Light freezing rain', icon: 'status-negative' },
  67: { description: 'Heavy freezing rain', icon: 'status-negative' },
  71: { description: 'Slight snow', icon: 'status-info' },
  73: { description: 'Moderate snow', icon: 'status-info' },
  75: { description: 'Heavy snow', icon: 'status-negative' },
  77: { description: 'Snow grains', icon: 'status-info' },
  80: { description: 'Slight rain showers', icon: 'status-info' },
  81: { description: 'Moderate rain showers', icon: 'status-info' },
  82: { description: 'Violent rain showers', icon: 'status-negative' },
  85: { description: 'Slight snow showers', icon: 'status-info' },
  86: { description: 'Heavy snow showers', icon: 'status-negative' },
  95: { description: 'Thunderstorm', icon: 'status-negative' },
  96: { description: 'Thunderstorm with slight hail', icon: 'status-negative' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'status-negative' },
};
