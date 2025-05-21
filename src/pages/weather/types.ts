// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherLocation {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
  is_day: number;
  humidity: number;
  pressure: number;
  cloudcover: number;
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
  weathercode: number[];
  windspeed_10m: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: Record<string, string>;
  current?: CurrentWeather;
  daily_units?: Record<string, string>;
  daily?: DailyForecast;
  hourly_units?: Record<string, string>;
  hourly?: HourlyForecast;
}

export interface WeatherError {
  error: boolean;
  reason: string;
}

export interface WeatherCode {
  code: number;
  description: string;
  icon: string;
}

export const WEATHER_CODES: Record<number, WeatherCode> = {
  0: { code: 0, description: 'Clear sky', icon: 'sun' },
  1: { code: 1, description: 'Mainly clear', icon: 'sun' },
  2: { code: 2, description: 'Partly cloudy', icon: 'cloud' },
  3: { code: 3, description: 'Overcast', icon: 'cloud' },
  45: { code: 45, description: 'Fog', icon: 'cloud' },
  48: { code: 48, description: 'Depositing rime fog', icon: 'cloud' },
  51: { code: 51, description: 'Light drizzle', icon: 'raindrops' },
  53: { code: 53, description: 'Moderate drizzle', icon: 'raindrops' },
  55: { code: 55, description: 'Dense drizzle', icon: 'raindrops' },
  56: { code: 56, description: 'Light freezing drizzle', icon: 'raindrops' },
  57: { code: 57, description: 'Dense freezing drizzle', icon: 'raindrops' },
  61: { code: 61, description: 'Slight rain', icon: 'raindrops' },
  63: { code: 63, description: 'Moderate rain', icon: 'raindrops' },
  65: { code: 65, description: 'Heavy rain', icon: 'raindrops' },
  66: { code: 66, description: 'Light freezing rain', icon: 'raindrops' },
  67: { code: 67, description: 'Heavy freezing rain', icon: 'raindrops' },
  71: { code: 71, description: 'Slight snow fall', icon: 'snowflake' },
  73: { code: 73, description: 'Moderate snow fall', icon: 'snowflake' },
  75: { code: 75, description: 'Heavy snow fall', icon: 'snowflake' },
  77: { code: 77, description: 'Snow grains', icon: 'snowflake' },
  80: { code: 80, description: 'Slight rain showers', icon: 'raindrops' },
  81: { code: 81, description: 'Moderate rain showers', icon: 'raindrops' },
  82: { code: 82, description: 'Violent rain showers', icon: 'raindrops' },
  85: { code: 85, description: 'Slight snow showers', icon: 'snowflake' },
  86: { code: 86, description: 'Heavy snow showers', icon: 'snowflake' },
  95: { code: 95, description: 'Thunderstorm', icon: 'flash' },
  96: { code: 96, description: 'Thunderstorm with slight hail', icon: 'flash' },
  99: { code: 99, description: 'Thunderstorm with heavy hail', icon: 'flash' },
};
