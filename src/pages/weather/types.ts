// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation: number[];
  pressure_msl: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
  weathercode: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather?: CurrentWeather;
  hourly?: HourlyWeather;
  daily?: DailyWeather;
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather?: CurrentWeather;
  hourly_units?: Record<string, string>;
  hourly?: HourlyWeather;
  daily_units?: Record<string, string>;
  daily?: DailyWeather;
}

export const WEATHER_CODE_DESCRIPTIONS: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: 'sun' },
  1: { description: 'Mainly clear', icon: 'sun' },
  2: { description: 'Partly cloudy', icon: 'cloud-sun' },
  3: { description: 'Overcast', icon: 'cloud' },
  45: { description: 'Fog', icon: 'cloud-haze' },
  48: { description: 'Depositing rime fog', icon: 'cloud-haze' },
  51: { description: 'Light drizzle', icon: 'cloud-rain' },
  53: { description: 'Moderate drizzle', icon: 'cloud-rain' },
  55: { description: 'Dense drizzle', icon: 'cloud-rain' },
  56: { description: 'Light freezing drizzle', icon: 'cloud-rain' },
  57: { description: 'Dense freezing drizzle', icon: 'cloud-rain' },
  61: { description: 'Slight rain', icon: 'cloud-rain' },
  63: { description: 'Moderate rain', icon: 'cloud-rain' },
  65: { description: 'Heavy rain', icon: 'cloud-rain' },
  66: { description: 'Light freezing rain', icon: 'cloud-rain' },
  67: { description: 'Heavy freezing rain', icon: 'cloud-rain' },
  71: { description: 'Slight snow fall', icon: 'snowflake' },
  73: { description: 'Moderate snow fall', icon: 'snowflake' },
  75: { description: 'Heavy snow fall', icon: 'snowflake' },
  77: { description: 'Snow grains', icon: 'snowflake' },
  80: { description: 'Slight rain showers', icon: 'cloud-rain' },
  81: { description: 'Moderate rain showers', icon: 'cloud-rain' },
  82: { description: 'Violent rain showers', icon: 'cloud-rain' },
  85: { description: 'Slight snow showers', icon: 'snowflake' },
  86: { description: 'Heavy snow showers', icon: 'snowflake' },
  95: { description: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { description: 'Thunderstorm with slight hail', icon: 'cloud-lightning' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
};

export const PREDEFINED_LOCATIONS: WeatherLocation[] = [
  { name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'US' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'GB' },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'JP' },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'AU' },
  { name: 'Berlin', latitude: 52.52, longitude: 13.405, country: 'DE' },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'FR' },
  { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, country: 'US' },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198, country: 'SG' },
  { name: 'São Paulo', latitude: -23.5505, longitude: -46.6333, country: 'BR' },
  { name: 'Dubai', latitude: 25.2762, longitude: 55.2968, country: 'AE' },
];
