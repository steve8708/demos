// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useCallback, useEffect, useState } from 'react';
import { WeatherData, WeatherLocation, GeocodingResult } from '../types';

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1';

interface UseWeatherDataReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  fetchWeatherData: (latitude: number, longitude: number) => Promise<void>;
}

interface UseLocationSearchReturn {
  locations: WeatherLocation[];
  loading: boolean;
  error: string | null;
  searchLocations: (query: string) => Promise<void>;
  clearLocations: () => void;
}

export function useWeatherData(): UseWeatherDataReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current:
          'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
        hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m',
        timezone: 'auto',
        forecast_days: '7',
      });

      const response = await fetch(`${WEATHER_API_BASE}/forecast?${params}`);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    weatherData,
    loading,
    error,
    fetchWeatherData,
  };
}

export function useLocationSearch(): UseLocationSearchReturn {
  const [locations, setLocations] = useState<WeatherLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim()) {
      setLocations([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        name: query.trim(),
        count: '10',
        language: 'en',
        format: 'json',
      });

      const response = await fetch(`${GEOCODING_API_BASE}/search?${params}`);

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data: GeocodingResult = await response.json();
      setLocations(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search locations');
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLocations = useCallback(() => {
    setLocations([]);
    setError(null);
  }, []);

  return {
    locations,
    loading,
    error,
    searchLocations,
    clearLocations,
  };
}

// Default locations for quick access
export const DEFAULT_LOCATIONS: WeatherLocation[] = [
  {
    id: 1,
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    country: 'United States',
    admin1: 'New York',
  },
  {
    id: 2,
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    country: 'United Kingdom',
    admin1: 'England',
  },
  {
    id: 3,
    name: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    country: 'Japan',
    admin1: 'Tokyo',
  },
  {
    id: 4,
    name: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    country: 'Australia',
    admin1: 'New South Wales',
  },
  {
    id: 5,
    name: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    country: 'France',
    admin1: 'Île-de-France',
  },
];
