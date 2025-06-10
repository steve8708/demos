// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Weather Dashboard - Types and Interfaces
 *
 * This module defines TypeScript types and interfaces for the Weather Dashboard
 * application that integrates with the Open-Meteo API (https://open-meteo.com/).
 *
 * Features:
 * - Real-time weather data for multiple global locations
 * - Current weather conditions with detailed metrics
 * - 24-hour hourly forecast
 * - 7-day extended forecast
 * - Weather statistics and analytics
 * - Responsive design using Cloudscape Design System
 *
 * API Information:
 * - Uses Open-Meteo free weather API (no API key required)
 * - Supports current, hourly, and daily weather data
 * - Provides global coverage with high accuracy
 * - Returns data in JSON format with various weather variables
 *
 * Supported Weather Variables:
 * - Temperature (current, apparent, min/max)
 * - Humidity, precipitation, rain
 * - Wind speed, direction, and gusts
 * - Atmospheric pressure
 * - Cloud cover and UV index
 * - Weather conditions and codes
 * - Sunrise/sunset times
 */

export interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeatherData {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  cloud_cover: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: CurrentWeatherData;
  hourly_units: Record<string, string>;
  hourly: HourlyWeatherData;
  daily_units: Record<string, string>;
  daily: DailyWeatherData;
}

export interface WeatherCondition {
  code: number;
  description: string;
  icon: string;
  emoji: string;
  statusType: 'positive' | 'info' | 'warning' | 'negative';
}

export const WEATHER_CODES: Record<number, WeatherCondition> = {
  0: { code: 0, description: 'Clear sky', icon: 'status-positive', emoji: '☀️', statusType: 'positive' },
  1: { code: 1, description: 'Mainly clear', icon: 'status-positive', emoji: '🌤️', statusType: 'positive' },
  2: { code: 2, description: 'Partly cloudy', icon: 'status-info', emoji: '⛅', statusType: 'info' },
  3: { code: 3, description: 'Overcast', icon: 'status-warning', emoji: '☁️', statusType: 'warning' },
  45: { code: 45, description: 'Fog', icon: 'status-warning', emoji: '🌫️', statusType: 'warning' },
  48: { code: 48, description: 'Depositing rime fog', icon: 'status-warning', emoji: '🌫️', statusType: 'warning' },
  51: { code: 51, description: 'Light drizzle', icon: 'status-info', emoji: '🌦️', statusType: 'info' },
  53: { code: 53, description: 'Moderate drizzle', icon: 'status-info', emoji: '🌦️', statusType: 'info' },
  55: { code: 55, description: 'Dense drizzle', icon: 'status-warning', emoji: '🌧️', statusType: 'warning' },
  56: { code: 56, description: 'Light freezing drizzle', icon: 'status-warning', emoji: '🌨️', statusType: 'warning' },
  57: { code: 57, description: 'Dense freezing drizzle', icon: 'status-negative', emoji: '🌨️', statusType: 'negative' },
  61: { code: 61, description: 'Slight rain', icon: 'status-info', emoji: '🌧️', statusType: 'info' },
  63: { code: 63, description: 'Moderate rain', icon: 'status-warning', emoji: '🌧️', statusType: 'warning' },
  65: { code: 65, description: 'Heavy rain', icon: 'status-negative', emoji: '🌧️', statusType: 'negative' },
  66: { code: 66, description: 'Light freezing rain', icon: 'status-warning', emoji: '🌨️', statusType: 'warning' },
  67: { code: 67, description: 'Heavy freezing rain', icon: 'status-negative', emoji: '🌨️', statusType: 'negative' },
  71: { code: 71, description: 'Slight snow fall', icon: 'status-info', emoji: '❄️', statusType: 'info' },
  73: { code: 73, description: 'Moderate snow fall', icon: 'status-warning', emoji: '❄️', statusType: 'warning' },
  75: { code: 75, description: 'Heavy snow fall', icon: 'status-negative', emoji: '❄️', statusType: 'negative' },
  77: { code: 77, description: 'Snow grains', icon: 'status-warning', emoji: '🌨️', statusType: 'warning' },
  80: { code: 80, description: 'Slight rain showers', icon: 'status-info', emoji: '🌦️', statusType: 'info' },
  81: { code: 81, description: 'Moderate rain showers', icon: 'status-warning', emoji: '🌧️', statusType: 'warning' },
  82: { code: 82, description: 'Violent rain showers', icon: 'status-negative', emoji: '⛈️', statusType: 'negative' },
  85: { code: 85, description: 'Slight snow showers', icon: 'status-info', emoji: '🌨️', statusType: 'info' },
  86: { code: 86, description: 'Heavy snow showers', icon: 'status-negative', emoji: '🌨️', statusType: 'negative' },
  95: { code: 95, description: 'Thunderstorm', icon: 'status-negative', emoji: '⛈️', statusType: 'negative' },
  96: {
    code: 96,
    description: 'Thunderstorm with slight hail',
    icon: 'status-negative',
    emoji: '⛈️',
    statusType: 'negative',
  },
  99: {
    code: 99,
    description: 'Thunderstorm with heavy hail',
    icon: 'status-negative',
    emoji: '⛈️',
    statusType: 'negative',
  },
};

export function getWeatherIcon(weatherCode: number, isDay: boolean = true): WeatherCondition {
  const baseCondition = WEATHER_CODES[weatherCode] || {
    description: 'Unknown',
    icon: 'status-info',
    emoji: '❓',
    statusType: 'info' as const,
    code: weatherCode,
  };

  // Adjust icons for day/night for clear sky conditions
  if (weatherCode === 0) {
    return {
      ...baseCondition,
      emoji: isDay ? '☀️' : '🌙',
      description: isDay ? 'Clear sky' : 'Clear night',
    };
  } else if (weatherCode === 1) {
    return {
      ...baseCondition,
      emoji: isDay ? '🌤️' : '🌙',
      description: isDay ? 'Mainly clear' : 'Mainly clear night',
    };
  }

  return baseCondition;
}

export const DEFAULT_LOCATIONS: WeatherLocation[] = [
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'New York, NY', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Paris, France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'San Francisco, CA', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
];
