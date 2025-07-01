// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  weather_code: number;
  wind_speed: number;
  wind_direction: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uv_index: number;
  time: string;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
  wind_speed_10m: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  uv_index_max: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  timezone: string;
  timezone_abbreviation: string;
}

export interface WeatherCodeInfo {
  description: string;
  icon: string;
}

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', icon: 'sun' },
  1: { description: 'Mainly clear', icon: 'sun' },
  2: { description: 'Partly cloudy', icon: 'cloud' },
  3: { description: 'Overcast', icon: 'cloud' },
  45: { description: 'Fog', icon: 'cloud' },
  48: { description: 'Depositing rime fog', icon: 'cloud' },
  51: { description: 'Light drizzle', icon: 'rain' },
  53: { description: 'Moderate drizzle', icon: 'rain' },
  55: { description: 'Dense drizzle', icon: 'rain' },
  61: { description: 'Slight rain', icon: 'rain' },
  63: { description: 'Moderate rain', icon: 'rain' },
  65: { description: 'Heavy rain', icon: 'rain' },
  71: { description: 'Slight snow', icon: 'snow' },
  73: { description: 'Moderate snow', icon: 'snow' },
  75: { description: 'Heavy snow', icon: 'snow' },
  80: { description: 'Slight rain showers', icon: 'rain' },
  81: { description: 'Moderate rain showers', icon: 'rain' },
  82: { description: 'Violent rain showers', icon: 'rain' },
  95: { description: 'Thunderstorm', icon: 'storm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'storm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'storm' },
};
