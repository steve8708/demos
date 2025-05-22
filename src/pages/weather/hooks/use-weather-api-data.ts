// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useState, useEffect } from 'react';

import { WeatherData } from '../widgets/interfaces';

export function useWeatherApiData(city: string) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock weather data
        const mockData: WeatherData = {
          current: {
            temp: 20,
            humidity: 65,
            windSpeed: 12,
            description: 'Partly cloudy',
            icon: '04d',
          },
          daily: Array(5)
            .fill(null)
            .map((_, i) => ({
              temp: {
                min: 15 + Math.random() * 5,
                max: 25 + Math.random() * 5,
              },
              icon: '04d',
              description: 'Partly cloudy',
            })),
          hourly: Array(24)
            .fill(null)
            .map((_, i) => ({
              temp: 20 + Math.sin((i / 24) * Math.PI * 2) * 5,
              time: new Date(Date.now() + i * 3600 * 1000).toISOString(),
            })),
        };

        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch weather data'));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [city]);

  return { data, loading, error };
}
