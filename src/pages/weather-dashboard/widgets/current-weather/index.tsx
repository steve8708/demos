// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Spinner from '@cloudscape-design/components/spinner';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { WeatherAPI, DEFAULT_LOCATIONS } from '../../services/weather-api';
import { CurrentWeatherData } from '../interfaces';
import { WeatherWidgetConfig } from '../interfaces';

function CurrentWeatherHeader() {
  return (
    <Header variant="h2" description="Live weather conditions for New York">
      Current Weather
    </Header>
  );
}

function CurrentWeatherWidget() {
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await WeatherAPI.getCurrentWeather(DEFAULT_LOCATIONS[0]); // New York
        setWeatherData(response.current);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" padding="l">
        <Spinner size="large" />
        <Box variant="p" margin={{ top: 's' }}>
          Loading current weather...
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" padding="l">
        <StatusIndicator type="error">{error}</StatusIndicator>
      </Box>
    );
  }

  if (!weatherData) {
    return (
      <Box textAlign="center" padding="l">
        <StatusIndicator type="warning">No weather data available</StatusIndicator>
      </Box>
    );
  }

  const weatherIcon = WeatherAPI.getWeatherIcon(weatherData.weatherCode, weatherData.isDay);
  const weatherDescription = WeatherAPI.getWeatherDescription(weatherData.weatherCode);

  return (
    <Box>
      <Box textAlign="center" margin={{ bottom: 'l' }}>
        <Box fontSize="display-l" margin={{ bottom: 'xs' }}>
          {weatherIcon}
        </Box>
        <Box fontSize="heading-xl" margin={{ bottom: 'xs' }}>
          {Math.round(weatherData.temperature)}°C
        </Box>
        <Box variant="p" color="text-status-inactive">
          {weatherDescription}
        </Box>
      </Box>

      <KeyValuePairs
        columns={2}
        items={[
          {
            label: 'Humidity',
            value: `${weatherData.humidity}%`,
          },
          {
            label: 'Wind Speed',
            value: `${Math.round(weatherData.windSpeed)} km/h`,
          },
          {
            label: 'Pressure',
            value: `${Math.round(weatherData.pressure)} hPa`,
          },
          {
            label: 'UV Index',
            value: weatherData.uvIndex.toString(),
          },
        ]}
      />
    </Box>
  );
}

export const currentWeather: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 3, defaultColumnSpan: 2 },
  data: {
    icon: 'status-positive',
    title: 'Current Weather',
    description: 'Real-time weather conditions',
    header: CurrentWeatherHeader,
    content: CurrentWeatherWidget,
    staticMinHeight: 250,
  },
};
