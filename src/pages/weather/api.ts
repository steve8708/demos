// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { WeatherData, WeatherError, WeatherLocation } from './types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeatherData(location: WeatherLocation): Promise<WeatherData> {
  try {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      current:
        'temperature_2m,weathercode,windspeed_10m,winddirection_10m,is_day,relative_humidity_2m,surface_pressure,cloud_cover',
      hourly: 'temperature_2m,precipitation,weathercode,windspeed_10m',
      daily:
        'weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max',
      timezone: 'auto',
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.reason || 'Failed to fetch weather data');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Weather API error: ${error.message}`);
    }
    throw new Error('Unknown error occurred while fetching weather data');
  }
}

export async function searchLocation(query: string): Promise<WeatherLocation[]> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();

    if (!data.results) {
      return [];
    }

    return data.results.map((result: any) => ({
      latitude: result.latitude,
      longitude: result.longitude,
      name: `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}${result.country ? `, ${result.country}` : ''}`,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Location search error: ${error.message}`);
    }
    throw new Error('Unknown error occurred while searching for location');
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}
