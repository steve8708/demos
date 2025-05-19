// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {
  City,
  CurrentWeatherData,
  DailyForecastData,
  GeocodeResponse,
  HourlyForecastData,
  WeatherResponseData,
} from './types';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search for cities based on a query string
 */
export async function searchCities(query: string): Promise<City[]> {
  try {
    const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=10`);

    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.statusText}`);
    }

    const data: GeocodeResponse = await response.json();

    if (data.error) {
      throw new Error(data.reason || 'Failed to fetch cities');
    }

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map(result => ({
      id: result.id,
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1,
      population: result.population,
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}

/**
 * Fetch weather data for a specific location
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number,
): Promise<{
  current: CurrentWeatherData;
  hourly: HourlyForecastData[];
  daily: DailyForecastData[];
}> {
  try {
    const url = new URL(WEATHER_API_URL);
    url.searchParams.append('latitude', latitude.toString());
    url.searchParams.append('longitude', longitude.toString());
    url.searchParams.append(
      'current',
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index',
    );
    url.searchParams.append(
      'hourly',
      'temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m',
    );
    url.searchParams.append(
      'daily',
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,uv_index_max',
    );
    url.searchParams.append('timezone', 'auto');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data: WeatherResponseData = await response.json();

    // Transform response to our app format
    const current: CurrentWeatherData = {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      weatherCode: data.current.weather_code,
      time: data.current.time,
      relativeHumidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      precipitation: data.current.precipitation,
      uvIndex: data.current.uv_index,
    };

    // Transform hourly data
    const hourly: HourlyForecastData[] = data.hourly.time.map((time, index) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      apparentTemperature: data.hourly.apparent_temperature[index],
      precipitation: data.hourly.precipitation[index],
      weatherCode: data.hourly.weather_code[index],
      windSpeed: data.hourly.wind_speed_10m[index],
      windDirection: data.hourly.wind_direction_10m[index],
      relativeHumidity: data.hourly.relative_humidity_2m[index],
    }));

    // Transform daily data
    const daily: DailyForecastData[] = data.daily.time.map((date, index) => ({
      date,
      temperatureMax: data.daily.temperature_2m_max[index],
      temperatureMin: data.daily.temperature_2m_min[index],
      precipitationSum: data.daily.precipitation_sum[index],
      weatherCode: data.daily.weather_code[index],
      sunrise: data.daily.sunrise[index],
      sunset: data.daily.sunset[index],
      uvIndexMax: data.daily.uv_index_max[index],
    }));

    return { current, hourly, daily };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}
