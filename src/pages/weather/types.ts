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
export const WEATHER_CONDITIONS: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: 'status-positive' },
  1: { description: 'Mainly clear', icon: 'status-positive' },
  2: { description: 'Partly cloudy', icon: 'status-warning' },
  3: { description: 'Overcast', icon: 'status-info' },
  45: { description: 'Fog', icon: 'status-info' },
  48: { description: 'Depositing rime fog', icon: 'status-info' },
  51: { description: 'Light drizzle', icon: 'status-warning' },
  53: { description: 'Moderate drizzle', icon: 'status-warning' },
  55: { description: 'Dense drizzle', icon: 'status-warning' },
  56: { description: 'Light freezing drizzle', icon: 'status-negative' },
  57: { description: 'Dense freezing drizzle', icon: 'status-negative' },
  61: { description: 'Slight rain', icon: 'status-warning' },
  63: { description: 'Moderate rain', icon: 'status-warning' },
  65: { description: 'Heavy rain', icon: 'status-negative' },
  66: { description: 'Light freezing rain', icon: 'status-negative' },
  67: { description: 'Heavy freezing rain', icon: 'status-negative' },
  71: { description: 'Slight snow fall', icon: 'status-info' },
  73: { description: 'Moderate snow fall', icon: 'status-warning' },
  75: { description: 'Heavy snow fall', icon: 'status-negative' },
  77: { description: 'Snow grains', icon: 'status-info' },
  80: { description: 'Slight rain showers', icon: 'status-warning' },
  81: { description: 'Moderate rain showers', icon: 'status-warning' },
  82: { description: 'Violent rain showers', icon: 'status-negative' },
  85: { description: 'Slight snow showers', icon: 'status-info' },
  86: { description: 'Heavy snow showers', icon: 'status-negative' },
  95: { description: 'Thunderstorm', icon: 'status-negative' },
  96: { description: 'Thunderstorm with slight hail', icon: 'status-negative' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'status-negative' },
};
