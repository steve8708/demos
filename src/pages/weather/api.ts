// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WeatherApiResponse, WeatherData, WeatherLocation } from './types';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';

export class WeatherApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

function transformApiResponse(response: WeatherApiResponse): WeatherData {
  return {
    current: {
      temperature: response.current.temperature_2m,
      weatherCode: response.current_weather.weathercode,
      windSpeed: response.current_weather.windspeed,
      windDirection: response.current_weather.winddirection,
      humidity: response.current.relativehumidity_2m,
      pressure: response.current.surface_pressure,
      visibility: response.current.visibility,
      uvIndex: response.current.uv_index,
      time: response.current_weather.time,
    },
    hourly: {
      time: response.hourly.time,
      temperature: response.hourly.temperature_2m,
      weatherCode: response.hourly.weathercode,
      precipitation: response.hourly.precipitation,
      windSpeed: response.hourly.windspeed_10m,
      humidity: response.hourly.relativehumidity_2m,
    },
    daily: {
      time: response.daily.time,
      temperatureMax: response.daily.temperature_2m_max,
      temperatureMin: response.daily.temperature_2m_min,
      weatherCode: response.daily.weathercode,
      precipitation: response.daily.precipitation_sum,
      windSpeedMax: response.daily.windspeed_10m_max,
      sunrise: response.daily.sunrise,
      sunset: response.daily.sunset,
    },
    timezone: response.timezone,
  };
}

export async function fetchWeatherData(location: WeatherLocation): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current_weather: 'true',
    timezone: location.timezone,
    current: ['temperature_2m', 'relativehumidity_2m', 'surface_pressure', 'visibility', 'uv_index'].join(','),
    hourly: ['temperature_2m', 'weathercode', 'relativehumidity_2m', 'precipitation', 'windspeed_10m'].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'weathercode',
      'precipitation_sum',
      'windspeed_10m_max',
      'sunrise',
      'sunset',
    ].join(','),
    forecast_days: '7',
  });

  try {
    const response = await fetch(`${OPEN_METEO_BASE_URL}/forecast?${params}`);

    if (!response.ok) {
      throw new WeatherApiError(`Failed to fetch weather data: ${response.statusText}`, response.status);
    }

    const data: WeatherApiResponse = await response.json();

    // Validate essential data exists
    if (!data.current_weather || !data.hourly || !data.daily) {
      throw new WeatherApiError('Invalid weather data received from API');
    }

    return transformApiResponse(data);
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new WeatherApiError('Network error: Unable to reach weather service');
    }

    throw new WeatherApiError('Unexpected error occurred while fetching weather data');
  }
}

export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    return `${Math.round((temp * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number, unit: 'kmh' | 'mph' = 'kmh'): string {
  if (unit === 'mph') {
    return `${Math.round(speed * 0.621371)} mph`;
  }
  return `${Math.round(speed)} km/h`;
}

export function formatWindDirection(degrees: number): string {
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function formatTime(timeString: string, timezone: string): string {
  return new Date(timeString).toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDate(timeString: string, timezone: string): string {
  return new Date(timeString).toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
