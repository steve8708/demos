// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WeatherApiResponse, LocationData } from './types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export class WeatherService {
  static async getCurrentWeather(location: LocationData): Promise<WeatherApiResponse> {
    const url = new URL(BASE_URL);
    url.searchParams.append('latitude', location.latitude.toString());
    url.searchParams.append('longitude', location.longitude.toString());
    url.searchParams.append('current_weather', 'true');
    url.searchParams.append('timezone', location.timezone);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    return response.json();
  }

  static async getDailyForecast(location: LocationData, days: number = 7): Promise<WeatherApiResponse> {
    const url = new URL(BASE_URL);
    url.searchParams.append('latitude', location.latitude.toString());
    url.searchParams.append('longitude', location.longitude.toString());
    url.searchParams.append(
      'daily',
      'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max',
    );
    url.searchParams.append('forecast_days', days.toString());
    url.searchParams.append('timezone', location.timezone);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    return response.json();
  }

  static async getHourlyForecast(location: LocationData, hours: number = 24): Promise<WeatherApiResponse> {
    const url = new URL(BASE_URL);
    url.searchParams.append('latitude', location.latitude.toString());
    url.searchParams.append('longitude', location.longitude.toString());
    url.searchParams.append('hourly', 'temperature_2m,relative_humidity_2m,precipitation,weathercode,windspeed_10m');
    url.searchParams.append('forecast_hours', hours.toString());
    url.searchParams.append('timezone', location.timezone);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    return response.json();
  }

  static async getCompleteWeatherData(location: LocationData): Promise<WeatherApiResponse> {
    const url = new URL(BASE_URL);
    url.searchParams.append('latitude', location.latitude.toString());
    url.searchParams.append('longitude', location.longitude.toString());
    url.searchParams.append('current_weather', 'true');
    url.searchParams.append('hourly', 'temperature_2m,relative_humidity_2m,precipitation,weathercode,windspeed_10m');
    url.searchParams.append(
      'daily',
      'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max',
    );
    url.searchParams.append('timezone', location.timezone);
    url.searchParams.append('forecast_days', '7');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    return response.json();
  }

  static formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
    if (unit === 'F') {
      return `${Math.round((temp * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  }

  static formatWindSpeed(speed: number, unit: 'kmh' | 'mph' = 'kmh'): string {
    if (unit === 'mph') {
      return `${Math.round(speed * 0.621371)} mph`;
    }
    return `${Math.round(speed)} km/h`;
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  static formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}
