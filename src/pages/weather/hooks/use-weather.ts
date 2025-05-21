// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useState, useCallback } from 'react';

interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
}

interface WeatherDataState {
  data: any;
  loading: boolean;
  error: string | null;
  fetchWeatherData: (location: WeatherLocation, units: 'metric' | 'imperial') => Promise<void>;
}

export function useWeatherData(): WeatherDataState {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async (location: WeatherLocation, units: 'metric' | 'imperial') => {
    try {
      setLoading(true);
      setError(null);

      // Set up the API parameters based on units
      const temperatureUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
      const windSpeedUnit = units === 'imperial' ? 'mph' : 'kmh';
      const precipitationUnit = units === 'imperial' ? 'inch' : 'mm';

      // Build the API URL
      const url = new URL('https://api.open-meteo.com/v1/forecast');
      url.searchParams.append('latitude', location.latitude.toString());
      url.searchParams.append('longitude', location.longitude.toString());
      url.searchParams.append(
        'current',
        'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
      );
      url.searchParams.append(
        'hourly',
        'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day',
      );
      url.searchParams.append(
        'daily',
        'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
      );
      url.searchParams.append('timezone', 'auto');
      url.searchParams.append('temperature_unit', temperatureUnit);
      url.searchParams.append('wind_speed_unit', windSpeedUnit);
      url.searchParams.append('precipitation_unit', precipitationUnit);

      // Fetch the data
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const weatherData = await response.json();

      // Add location info to the data
      const enrichedData = {
        ...weatherData,
        location: {
          name: location.name,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        units,
      };

      setData(enrichedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching weather data');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchWeatherData };
}
