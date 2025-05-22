// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useEffect, useState } from 'react';

import { Coordinates, CurrentWeatherData, DailyForecastData, WeatherData } from '../widgets/interfaces';

export function useWeatherData(coordinates: Coordinates) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Construct the Open Meteo API URL with the given coordinates
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        url.searchParams.append('latitude', coordinates.latitude.toString());
        url.searchParams.append('longitude', coordinates.longitude.toString());
        url.searchParams.append(
          'current',
          'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day',
        );
        url.searchParams.append(
          'daily',
          'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max',
        );
        url.searchParams.append('timezone', 'auto');

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const weatherApiData = await response.json();

        // Transform the API response to our data model
        const transformedData: WeatherData = {
          current: {
            temperature: weatherApiData.current.temperature_2m,
            weatherCode: weatherApiData.current.weather_code,
            windSpeed: weatherApiData.current.wind_speed_10m,
            windDirection: weatherApiData.current.wind_direction_10m,
            humidity: weatherApiData.current.relative_humidity_2m,
            apparentTemperature: weatherApiData.current.apparent_temperature,
            precipitation: weatherApiData.current.precipitation,
            time: weatherApiData.current.time,
            isDay: weatherApiData.current.is_day,
          },
          daily: weatherApiData.daily.time.map((time: string, index: number) => ({
            date: time,
            weatherCode: weatherApiData.daily.weather_code[index],
            temperatureMax: weatherApiData.daily.temperature_2m_max[index],
            temperatureMin: weatherApiData.daily.temperature_2m_min[index],
            sunrise: weatherApiData.daily.sunrise[index],
            sunset: weatherApiData.daily.sunset[index],
            precipitationSum: weatherApiData.daily.precipitation_sum[index],
            precipitationProbabilityMax: weatherApiData.daily.precipitation_probability_max[index],
          })),
          latitude: weatherApiData.latitude,
          longitude: weatherApiData.longitude,
          elevation: weatherApiData.elevation,
          timezone: weatherApiData.timezone,
          name: coordinates.name,
          isLoading: false,
          error: null,
        };

        setData(transformedData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [coordinates]);

  return { data, isLoading, error };
}
