// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { WeatherLocation, WeatherAPIResponse } from '../widgets/interfaces';

export class WeatherAPI {
  private static readonly BASE_URL = 'https://api.open-meteo.com/v1/forecast';

  static async getCurrentWeather(location: WeatherLocation): Promise<WeatherAPIResponse> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'pressure_msl',
        'cloud_cover',
        'visibility',
        'wind_speed_10m',
        'wind_direction_10m',
        'uv_index',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_sum',
        'rain_sum',
        'showers_sum',
        'snowfall_sum',
        'precipitation_hours',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant',
      ].join(','),
      timezone: location.timezone,
      forecast_days: '7',
    });

    const response = await fetch(`${this.BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        pressure: data.current.pressure_msl,
        visibility: data.hourly.visibility?.[0] || 10000,
        uvIndex: data.hourly.uv_index?.[0] || 0,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1,
        time: data.current.time,
      },
      hourly: {
        time: data.hourly.time.slice(0, 24), // Next 24 hours
        temperature: data.hourly.temperature_2m.slice(0, 24),
        humidity: data.hourly.relative_humidity_2m.slice(0, 24),
        precipitation: data.hourly.precipitation.slice(0, 24),
        windSpeed: data.hourly.wind_speed_10m.slice(0, 24),
        weatherCode: data.hourly.weather_code.slice(0, 24),
      },
      daily: {
        time: data.daily.time,
        temperatureMax: data.daily.temperature_2m_max,
        temperatureMin: data.daily.temperature_2m_min,
        precipitation: data.daily.precipitation_sum,
        windSpeedMax: data.daily.wind_speed_10m_max,
        weatherCode: data.daily.weather_code,
      },
    };
  }

  static getWeatherDescription(weatherCode: number): string {
    const weatherCodes: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };

    return weatherCodes[weatherCode] || 'Unknown';
  }

  static getWeatherIcon(weatherCode: number, isDay: boolean = true): string {
    // Map weather codes to appropriate icons
    const iconMap: Record<number, { day: string; night: string }> = {
      0: { day: '☀️', night: '🌙' },
      1: { day: '🌤️', night: '🌙' },
      2: { day: '⛅', night: '☁️' },
      3: { day: '☁️', night: '☁️' },
      45: { day: '🌫️', night: '🌫️' },
      48: { day: '🌫️', night: '🌫️' },
      51: { day: '🌦️', night: '🌧️' },
      53: { day: '🌦️', night: '🌧️' },
      55: { day: '🌦️', night: '🌧️' },
      56: { day: '🌨️', night: '🌨️' },
      57: { day: '🌨️', night: '🌨️' },
      61: { day: '🌧️', night: '🌧️' },
      63: { day: '🌧️', night: '🌧️' },
      65: { day: '🌧️', night: '🌧️' },
      66: { day: '🌨️', night: '🌨️' },
      67: { day: '🌨️', night: '🌨️' },
      71: { day: '🌨️', night: '🌨️' },
      73: { day: '❄️', night: '❄️' },
      75: { day: '❄️', night: '❄️' },
      77: { day: '🌨️', night: '🌨️' },
      80: { day: '🌦️', night: '🌧️' },
      81: { day: '🌧️', night: '🌧️' },
      82: { day: '⛈️', night: '⛈️' },
      85: { day: '🌨️', night: '🌨️' },
      86: { day: '❄️', night: '❄️' },
      95: { day: '⛈️', night: '⛈️' },
      96: { day: '⛈️', night: '⛈️' },
      99: { day: '⛈️', night: '⛈️' },
    };

    const icons = iconMap[weatherCode] || { day: '❓', night: '❓' };
    return isDay ? icons.day : icons.night;
  }
}

// Default locations for demo
export const DEFAULT_LOCATIONS: WeatherLocation[] = [
  {
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
  {
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
  },
  {
    name: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
  {
    name: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
  },
];
