// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  name: string;
  country: string;
  coordinates: Coordinates;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
}

export interface WeatherData {
  current_weather: CurrentWeather;
  daily: DailyWeather;
  timezone: string;
  timezone_abbreviation: string;
}

export interface WeatherCodeInfo {
  description: string;
  icon: string;
}

export const weatherCodes: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', icon: 'sun' },
  1: { description: 'Mainly clear', icon: 'sun' },
  2: { description: 'Partly cloudy', icon: 'cloud-sun' },
  3: { description: 'Overcast', icon: 'cloud' },
  45: { description: 'Fog', icon: 'cloud' },
  48: { description: 'Depositing rime fog', icon: 'cloud' },
  51: { description: 'Light drizzle', icon: 'cloud-rain' },
  53: { description: 'Moderate drizzle', icon: 'cloud-rain' },
  55: { description: 'Dense drizzle', icon: 'cloud-rain' },
  56: { description: 'Light freezing drizzle', icon: 'cloud-snow' },
  57: { description: 'Dense freezing drizzle', icon: 'cloud-snow' },
  61: { description: 'Slight rain', icon: 'cloud-rain' },
  63: { description: 'Moderate rain', icon: 'cloud-rain' },
  65: { description: 'Heavy rain', icon: 'cloud-rain' },
  66: { description: 'Light freezing rain', icon: 'cloud-snow' },
  67: { description: 'Heavy freezing rain', icon: 'cloud-snow' },
  71: { description: 'Slight snow fall', icon: 'cloud-snow' },
  73: { description: 'Moderate snow fall', icon: 'cloud-snow' },
  75: { description: 'Heavy snow fall', icon: 'cloud-snow' },
  77: { description: 'Snow grains', icon: 'cloud-snow' },
  80: { description: 'Slight rain showers', icon: 'cloud-rain' },
  81: { description: 'Moderate rain showers', icon: 'cloud-rain' },
  82: { description: 'Violent rain showers', icon: 'cloud-rain' },
  85: { description: 'Slight snow showers', icon: 'cloud-snow' },
  86: { description: 'Heavy snow showers', icon: 'cloud-snow' },
  95: { description: 'Thunderstorm', icon: 'lightning' },
  96: { description: 'Thunderstorm with slight hail', icon: 'lightning' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'lightning' },
};
