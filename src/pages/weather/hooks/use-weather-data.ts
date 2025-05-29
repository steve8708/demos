// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useEffect, useState } from 'react';

import { WeatherData, WeatherError, Location, LocationSearchResult } from '../types';

interface UseWeatherDataReturn {
  data: WeatherData | null;
  loading: boolean;
  error: WeatherError | null;
  refetch: () => void;
}

const DEFAULT_LOCATION: Location = {
  name: 'New York',
  latitude: 40.7128,
  longitude: -74.006,
  timezone: 'America/New_York',
  country: 'United States',
  admin1: 'New York',
};

export function useWeatherData(location: Location = DEFAULT_LOCATION): UseWeatherDataReturn {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<WeatherError | null>(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

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
          'uv_index',
          'visibility',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_sum',
          'wind_speed_10m_max',
          'wind_direction_10m_dominant',
          'uv_index_max',
        ].join(','),
        hourly: ['temperature_2m', 'weather_code', 'precipitation', 'wind_speed_10m', 'relative_humidity_2m'].join(','),
        timezone: 'auto',
        forecast_days: '7',
      });

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.reason || 'Failed to fetch weather data');
      }

      const weatherData: WeatherData = {
        current: {
          temperature: Math.round(result.current.temperature_2m),
          humidity: result.current.relative_humidity_2m,
          windSpeed: Math.round(result.current.wind_speed_10m * 10) / 10,
          windDirection: result.current.wind_direction_10m,
          weatherCode: result.current.weather_code,
          isDay: result.current.is_day === 1,
          apparentTemperature: Math.round(result.current.apparent_temperature),
          precipitation: result.current.precipitation,
          cloudCover: result.current.cloud_cover,
          visibility: result.current.visibility ? Math.round(result.current.visibility / 1000) : 0,
          uvIndex: result.current.uv_index,
          pressure: Math.round(result.current.pressure_msl),
        },
        daily: result.daily.time.slice(0, 7).map((date: string, index: number) => ({
          date,
          maxTemperature: Math.round(result.daily.temperature_2m_max[index]),
          minTemperature: Math.round(result.daily.temperature_2m_min[index]),
          weatherCode: result.daily.weather_code[index],
          precipitation: result.daily.precipitation_sum[index],
          windSpeed: Math.round(result.daily.wind_speed_10m_max[index] * 10) / 10,
          windDirection: result.daily.wind_direction_10m_dominant[index],
          uvIndex: result.daily.uv_index_max[index],
        })),
        hourly: result.hourly.time.slice(0, 24).map((time: string, index: number) => ({
          time,
          temperature: Math.round(result.hourly.temperature_2m[index]),
          weatherCode: result.hourly.weather_code[index],
          precipitation: result.hourly.precipitation[index],
          windSpeed: Math.round(result.hourly.wind_speed_10m[index] * 10) / 10,
          humidity: result.hourly.relative_humidity_2m[index],
        })),
        location,
      };

      setData(weatherData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location.latitude, location.longitude]);

  return {
    data,
    loading,
    error,
    refetch: fetchWeatherData,
  };
}

export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  try {
    if (!query.trim()) {
      return [];
    }

    const params = new URLSearchParams({
      name: query,
      count: '10',
      language: 'en',
      format: 'json',
    });

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const result = await response.json();

    return (result.results || []).map((location: any) => ({
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      country: location.country,
      admin1: location.admin1,
      admin2: location.admin2,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}
