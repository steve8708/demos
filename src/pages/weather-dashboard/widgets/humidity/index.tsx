// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Spinner from '@cloudscape-design/components/spinner';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { WeatherAPI } from '../../services/weather-api';
import { CurrentWeatherData } from '../interfaces';
import { WeatherWidgetConfig } from '../interfaces';
import { useWeatherContext } from '../../context/weather-context';
import { HumidityMeter } from './humidity-meter';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Spinner from '@cloudscape-design/components/spinner';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { WeatherAPI } from '../../services/weather-api';
import { useWeatherContext } from '../../context/weather-context';
import { CurrentWeatherData } from '../interfaces';
import { WeatherWidgetConfig } from '../interfaces';

function HumidityHeader() {
  return (
    <Header variant="h2" description="Atmospheric humidity levels">
      Humidity
    </Header>
  );
}

function HumidityWidget() {
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLocation } = useWeatherContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await WeatherAPI.getCurrentWeather(currentLocation);
        setWeatherData(response.current);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch humidity data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentLocation]);

  if (loading) {
    return (
      <Box textAlign="center" padding="l">
        <Spinner size="large" />
        <Box variant="p" margin={{ top: 's' }}>
          Loading humidity data...
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
        <StatusIndicator type="warning">No humidity data available</StatusIndicator>
      </Box>
    );
  }

  const getHumidityLevel = (humidity: number): { description: string; emoji: string; color: string } => {
    if (humidity < 30) return { description: 'Very dry', emoji: '🏜️', color: '#d91515' };
    if (humidity < 50) return { description: 'Dry', emoji: '🌵', color: '#ff9900' };
    if (humidity < 70) return { description: 'Comfortable', emoji: '��', color: '#1d8102' };
    if (humidity < 80) return { description: 'Humid', emoji: '💧', color: '#0073bb' };
    return { description: 'Very humid', emoji: '🌊', color: '#232f3e' };
  };

  const humidityLevel = getHumidityLevel(weatherData.humidity);

  return (
    <Box>
      <Box textAlign="center" margin={{ bottom: 'l' }}>
        <Box fontSize="display-l" margin={{ bottom: 'xs' }}>
          {humidityLevel.emoji}
        </Box>
        <Box fontSize="heading-xl" margin={{ bottom: 'xs' }}>
          {weatherData.humidity}%
        </Box>
        <Box variant="p" color="text-status-inactive">
          {humidityLevel.description}
        </Box>
      </Box>

      <HumidityMeter humidity={weatherData.humidity} color={humidityLevel.color} />

      <KeyValuePairs
        columns={2}
        items={[
          {
            label: 'Current level',
            value: `${weatherData.humidity}%`,
          },
          {
            label: 'Status',
            value: humidityLevel.description,
          },
          {
            label: 'Pressure',
            value: `${Math.round(weatherData.pressure)} hPa`,
          },
          {
            label: 'Comfort',
            value: weatherData.humidity >= 40 && weatherData.humidity <= 60 ? 'Optimal' : 'Suboptimal',
          },
        ]}
      />
    </Box>
  );
}

export const humidity: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
  data: {
    icon: 'notification',
    title: 'Humidity',
    description: 'Atmospheric humidity monitoring',
    header: HumidityHeader,
    content: HumidityWidget,
    staticMinHeight: 200,
  },
};
