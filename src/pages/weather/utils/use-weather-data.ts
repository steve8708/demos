// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useCallback, useEffect, useState } from 'react';
import { City, CurrentWeatherData, DailyForecastData, HourlyForecastData } from './types';
import { fetchWeatherData } from './api';

export function useWeatherData(city: City | null) {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!city) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { current, hourly, daily } = await fetchWeatherData(city.latitude, city.longitude);

      setCurrentWeather(current);
      setHourlyForecast(hourly);
      setDailyForecast(daily);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    if (city) {
      fetchData();
    } else {
      // Reset state when no city is selected
      setCurrentWeather(null);
      setHourlyForecast([]);
      setDailyForecast([]);
      setError(null);
    }
  }, [city, fetchData]);

  return {
    currentWeather,
    hourlyForecast,
    dailyForecast,
    loading,
    error,
    refreshData: fetchData,
  };
}
