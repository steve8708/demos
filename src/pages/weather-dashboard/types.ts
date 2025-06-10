// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
  winddirection: number;
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  precipitation_sum: number[];
  windspeed_10m_max: number[];
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation: number[];
  weathercode: number[];
  windspeed_10m: number[];
}

export interface WeatherApiResponse {
  current_weather?: CurrentWeather;
  daily?: DailyWeather;
  hourly?: HourlyWeather;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
}

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
}

export const WEATHER_CODES: { [key: number]: { description: string; icon: string } } = {
  0: { description: 'Clear sky', icon: 'sunny' },
  1: { description: 'Mainly clear', icon: 'sunny' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy' },
  3: { description: 'Overcast', icon: 'cloudy' },
  45: { description: 'Fog', icon: 'fog' },
  48: { description: 'Depositing rime fog', icon: 'fog' },
  51: { description: 'Light drizzle', icon: 'rain' },
  53: { description: 'Moderate drizzle', icon: 'rain' },
  55: { description: 'Dense drizzle', icon: 'rain' },
  56: { description: 'Light freezing drizzle', icon: 'sleet' },
  57: { description: 'Dense freezing drizzle', icon: 'sleet' },
  61: { description: 'Slight rain', icon: 'rain' },
  63: { description: 'Moderate rain', icon: 'rain' },
  65: { description: 'Heavy rain', icon: 'storm' },
  66: { description: 'Light freezing rain', icon: 'sleet' },
  67: { description: 'Heavy freezing rain', icon: 'sleet' },
  71: { description: 'Slight snow fall', icon: 'snow' },
  73: { description: 'Moderate snow fall', icon: 'snow' },
  75: { description: 'Heavy snow fall', icon: 'snow' },
  77: { description: 'Snow grains', icon: 'snow' },
  80: { description: 'Slight rain showers', icon: 'rain' },
  81: { description: 'Moderate rain showers', icon: 'rain' },
  82: { description: 'Violent rain showers', icon: 'storm' },
  85: { description: 'Slight snow showers', icon: 'snow' },
  86: { description: 'Heavy snow showers', icon: 'snow' },
  95: { description: 'Thunderstorm', icon: 'storm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'storm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'storm' },
};

export const DEFAULT_LOCATIONS: LocationData[] = [
  { name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'USA', timezone: 'America/New_York' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'UK', timezone: 'Europe/London' },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', timezone: 'Asia/Tokyo' },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia', timezone: 'Australia/Sydney' },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', timezone: 'Europe/Paris' },
  { name: 'Berlin', latitude: 52.52, longitude: 13.405, country: 'Germany', timezone: 'Europe/Berlin' },
];
