// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import Spinner from '@cloudscape-design/components/spinner';

import { useWeatherData } from '../../hooks/use-weather-data';
import { Coordinates, weatherCodeToDescription, WidgetConfig } from '../interfaces';

interface CurrentWeatherHeaderProps {
  isLoading: boolean;
  error: string | null;
}

function CurrentWeatherHeader({ isLoading, error }: CurrentWeatherHeaderProps) {
  return (
    <Header
      variant="h2"
      info={<Link variant="info">Info</Link>}
      description={isLoading ? 'Loading weather data...' : error ? 'Error loading data' : 'Current weather conditions'}
    >
      Current Weather
    </Header>
  );
}

interface CurrentWeatherWidgetProps {
  coordinates: Coordinates;
}

function CurrentWeatherWidget({ coordinates }: CurrentWeatherWidgetProps) {
  const { data: weatherData, isLoading, error } = useWeatherData(coordinates);

  if (isLoading) {
    return (
      <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
        <Spinner size="large" />
        <Box variant="p" padding={{ top: 'm' }}>
          Loading weather data...
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert type="error" header="Error loading weather data">
        {error}. Please try again or check your coordinates.
      </Alert>
    );
  }

  if (!weatherData || !weatherData.current) {
    return (
      <Alert type="warning" header="No weather data available">
        Could not retrieve weather information for this location. Please try another location or try again later.
      </Alert>
    );
  }

  const { current } = weatherData;
  const weatherDescription = weatherCodeToDescription[current.weatherCode] || 'Unknown';

  return (
    <Box padding={{ vertical: 'l', horizontal: 'l' }}>
      <Box variant="h1" padding={{ bottom: 'm' }} fontSize="display-l" fontWeight="bold">
        {current.temperature.toFixed(1)}°C
      </Box>
      <Box variant="h2" padding={{ bottom: 's' }} fontSize="heading-xl">
        {weatherDescription}
      </Box>
      <Box variant="p" fontSize="heading-m">
        Feels like {current.apparentTemperature.toFixed(1)}°C
      </Box>
      <Box variant="p" fontSize="body-m" padding={{ top: 'm' }}>
        Last updated: {new Date(current.time).toLocaleTimeString()}
      </Box>
    </Box>
  );
}

export function createCurrentWeatherWidget(coordinates: Coordinates): WidgetConfig {
  const { isLoading, error } = useWeatherData(coordinates);

  return {
    definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
    data: {
      icon: 'status',
      title: 'Current Weather',
      description: 'Current weather conditions',
      header: () => <CurrentWeatherHeader isLoading={isLoading} error={error} />,
      content: () => <CurrentWeatherWidget coordinates={coordinates} />,
    },
  };
}

export const currentWeather = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
  data: {
    icon: 'status',
    title: 'Current Weather',
    description: 'Current weather conditions',
    header: CurrentWeatherHeader,
    content: CurrentWeatherWidget,
  },
};
