// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WeatherData, ForecastData } from '../types';

const BASE_URL = 'https://api.open-meteo.com/v1';

export async function getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const url = new URL(`${BASE_URL}/forecast`);
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m',
  );
  url.searchParams.set('timezone', 'auto');

  console.log('Fetching current weather from:', url.toString());

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Weather API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Current weather data:', data);

    if (!data.current) {
      throw new Error('Invalid response format from weather API - no current data found');
    }

    return {
      temperature: data.current.temperature_2m ?? 0,
      humidity: data.current.relative_humidity_2m ?? 0,
      apparent_temperature: data.current.apparent_temperature ?? 0,
      weather_code: data.current.weather_code ?? 0,
      wind_speed: data.current.wind_speed_10m ?? 0,
      wind_direction: data.current.wind_direction_10m ?? 0,
      time: data.current.time ?? new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
}

export async function getWeatherForecast(latitude: number, longitude: number): Promise<ForecastData> {
  const url = new URL(`${BASE_URL}/forecast`);
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max',
  );
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');

  console.log('Fetching forecast from:', url.toString());

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('Forecast response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Forecast API Error Response:', errorText);
      throw new Error(`Weather API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Forecast data:', data);

    if (!data.daily) {
      throw new Error('Invalid response format from weather API - no daily data found');
    }

    return {
      time: data.daily.time ?? [],
      temperature_2m_max: data.daily.temperature_2m_max ?? [],
      temperature_2m_min: data.daily.temperature_2m_min ?? [],
      weather_code: data.daily.weather_code ?? [],
      precipitation_sum: data.daily.precipitation_sum ?? [],
      wind_speed_10m_max: data.daily.wind_speed_10m_max ?? [],
    };
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}
