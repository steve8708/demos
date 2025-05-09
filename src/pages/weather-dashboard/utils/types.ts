// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipitation: number;
  time: string;
}

export interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  precipitationSum: number;
  precipitationProbabilityMax: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  location: Location;
}

// Weather code mapping based on WMO codes
// https://open-meteo.com/en/docs/forecast-api
export const weatherCodeToLabel: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: 'sun' },
  1: { label: 'Mainly clear', icon: 'sun' },
  2: { label: 'Partly cloudy', icon: 'cloud' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'cloud' },
  48: { label: 'Depositing rime fog', icon: 'cloud' },
  51: { label: 'Light drizzle', icon: 'cloud-rain' },
  53: { label: 'Moderate drizzle', icon: 'cloud-rain' },
  55: { label: 'Dense drizzle', icon: 'cloud-rain' },
  56: { label: 'Light freezing drizzle', icon: 'cloud-snow' },
  57: { label: 'Dense freezing drizzle', icon: 'cloud-snow' },
  61: { label: 'Slight rain', icon: 'cloud-rain' },
  63: { label: 'Moderate rain', icon: 'cloud-rain' },
  65: { label: 'Heavy rain', icon: 'cloud-rain' },
  66: { label: 'Light freezing rain', icon: 'cloud-snow' },
  67: { label: 'Heavy freezing rain', icon: 'cloud-snow' },
  71: { label: 'Slight snow fall', icon: 'cloud-snow' },
  73: { label: 'Moderate snow fall', icon: 'cloud-snow' },
  75: { label: 'Heavy snow fall', icon: 'cloud-snow' },
  77: { label: 'Snow grains', icon: 'cloud-snow' },
  80: { label: 'Slight rain showers', icon: 'cloud-showers-heavy' },
  81: { label: 'Moderate rain showers', icon: 'cloud-showers-heavy' },
  82: { label: 'Violent rain showers', icon: 'cloud-showers-heavy' },
  85: { label: 'Slight snow showers', icon: 'cloud-snow' },
  86: { label: 'Heavy snow showers', icon: 'cloud-snow' },
  95: { label: 'Thunderstorm', icon: 'bolt' },
  96: { label: 'Thunderstorm with slight hail', icon: 'bolt' },
  99: { label: 'Thunderstorm with heavy hail', icon: 'bolt' },
};

export const getWeatherIcon = (code: number): string => {
  return weatherCodeToLabel[code]?.icon || 'question';
};

export const getWeatherLabel = (code: number): string => {
  return weatherCodeToLabel[code]?.label || 'Unknown';
};
