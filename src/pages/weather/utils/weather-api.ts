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

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error('Invalid response format from weather API');
  }

  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    apparent_temperature: data.current.apparent_temperature,
    weather_code: data.current.weather_code,
    wind_speed: data.current.wind_speed_10m,
    wind_direction: data.current.wind_direction_10m,
    time: data.current.time,
  };
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

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.daily) {
    throw new Error('Invalid response format from weather API');
  }

  return {
    time: data.daily.time,
    temperature_2m_max: data.daily.temperature_2m_max,
    temperature_2m_min: data.daily.temperature_2m_min,
    weather_code: data.daily.weather_code,
    precipitation_sum: data.daily.precipitation_sum,
    wind_speed_10m_max: data.daily.wind_speed_10m_max,
  };
}
