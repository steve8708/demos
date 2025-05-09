// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { CurrentWeather, DailyForecast, HourlyForecast, Location, WeatherData } from './types';

/**
 * Fetches weather data from the Open-Meteo API
 */
export async function fetchWeatherData(location: Location): Promise<WeatherData> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');

    // Set query parameters
    url.searchParams.append('latitude', location.latitude.toString());
    url.searchParams.append('longitude', location.longitude.toString());
    url.searchParams.append(
      'current',
      'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,precipitation',
    );
    url.searchParams.append('hourly', 'temperature_2m,precipitation,weather_code,wind_speed_10m,relative_humidity_2m');
    url.searchParams.append(
      'daily',
      'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max',
    );
    url.searchParams.append('timezone', 'auto');
    url.searchParams.append('forecast_days', '7');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Process current weather data
    const current: CurrentWeather = {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      time: data.current.time,
    };

    // Process daily forecast data
    const daily: DailyForecast[] = data.daily.time.map((date: string, index: number) => ({
      date,
      temperatureMax: data.daily.temperature_2m_max[index],
      temperatureMin: data.daily.temperature_2m_min[index],
      weatherCode: data.daily.weather_code[index],
      sunrise: data.daily.sunrise[index],
      sunset: data.daily.sunset[index],
      precipitationSum: data.daily.precipitation_sum[index],
      precipitationProbabilityMax: data.daily.precipitation_probability_max[index],
    }));

    // Process hourly forecast data (next 24 hours)
    const hourly: HourlyForecast[] = data.hourly.time.slice(0, 24).map((time: string, index: number) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      precipitation: data.hourly.precipitation[index],
      weatherCode: data.hourly.weather_code[index],
      windSpeed: data.hourly.wind_speed_10m[index],
      humidity: data.hourly.relative_humidity_2m[index],
    }));

    return {
      current,
      daily,
      hourly,
      location,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Formats a date string into a more readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a time string into a more readable format
 */
export function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats an hour from an ISO time string
 */
export function formatHour(timeString: string): string {
  const date = new Date(timeString);
  return date
    .toLocaleTimeString('en-US', {
      hour: '2-digit',
    })
    .replace(/\s/g, '');
}
