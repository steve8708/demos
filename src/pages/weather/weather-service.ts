// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WeatherApiResponse, WeatherLocation } from './types';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export class WeatherService {
  /**
   * Fetch current weather for a location
   */
  static async getCurrentWeather(location: WeatherLocation): Promise<WeatherApiResponse> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      current_weather: 'true',
      timezone: 'auto',
    });

    const response = await fetch(`${OPEN_METEO_BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch 7-day weather forecast for a location
   */
  static async getWeatherForecast(location: WeatherLocation): Promise<WeatherApiResponse> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      current_weather: 'true',
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'wind_speed_10m_max',
        'weathercode',
      ].join(','),
      timezone: 'auto',
    });

    const response = await fetch(`${OPEN_METEO_BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch detailed hourly weather for today
   */
  static async getHourlyWeather(location: WeatherLocation): Promise<WeatherApiResponse> {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      start_date: today,
      end_date: tomorrow,
      timezone: 'auto',
    });

    const response = await fetch(`${OPEN_METEO_BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch comprehensive weather data (current + forecast + hourly)
   */
  static async getCompleteWeatherData(location: WeatherLocation): Promise<WeatherApiResponse> {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      current_weather: 'true',
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'wind_speed_10m_max',
        'weathercode',
      ].join(','),
      start_date: today,
      end_date: nextWeek,
      timezone: 'auto',
    });

    const response = await fetch(`${OPEN_METEO_BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
