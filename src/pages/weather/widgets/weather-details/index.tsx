// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Link from '@cloudscape-design/components/link';
import Spinner from '@cloudscape-design/components/spinner';

import { useWeatherData } from '../../hooks/use-weather-data';
import { Coordinates, WidgetConfig } from '../interfaces';

interface WeatherDetailsHeaderProps {
  isLoading?: boolean;
  error?: string | null;
}

function WeatherDetailsHeader({ isLoading, error }: WeatherDetailsHeaderProps) {
  return (
    <Header
      variant="h2"
      info={<Link variant="info">Info</Link>}
      description={
        isLoading ? 'Loading weather details...' : error ? 'Error loading data' : 'Detailed weather information'
      }
    >
      Weather Details
    </Header>
  );
}

interface WeatherDetailsWidgetProps {
  coordinates: Coordinates;
}

function WeatherDetailsWidget({ coordinates }: WeatherDetailsWidgetProps) {
  const { data: weatherData, isLoading, error } = useWeatherData(coordinates);

  if (isLoading) {
    return (
      <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
        <Spinner size="large" />
        <Box variant="p" padding={{ top: 'm' }}>
          Loading weather details...
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert type="error" header="Error loading weather details">
        {error}. Please try again or check your coordinates.
      </Alert>
    );
  }

  if (!weatherData || !weatherData.current) {
    return (
      <Alert type="warning" header="No weather details available">
        Could not retrieve weather details for this location. Please try another location or try again later.
      </Alert>
    );
  }

  const { current } = weatherData;

  // Format wind direction as cardinal direction
  const getWindDirection = (degrees: number): string => {
    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <KeyValuePairs
      items={[
        {
          label: 'Temperature',
          value: `${current.temperature.toFixed(1)}°C`,
        },
        {
          label: 'Feels Like',
          value: `${current.apparentTemperature.toFixed(1)}°C`,
        },
        {
          label: 'Wind Speed',
          value: `${current.windSpeed.toFixed(1)} km/h`,
        },
        {
          label: 'Wind Direction',
          value: `${getWindDirection(current.windDirection)} (${current.windDirection}°)`,
        },
        {
          label: 'Humidity',
          value: `${current.humidity}%`,
        },
        {
          label: 'Precipitation',
          value: `${current.precipitation.toFixed(1)} mm`,
        },
        {
          label: 'Time',
          value: new Date(current.time).toLocaleString(),
        },
        {
          label: 'Day/Night',
          value: current.isDay === 1 ? 'Day' : 'Night',
        },
      ]}
    />
  );
}

export function createWeatherDetailsWidget(coordinates: Coordinates): WidgetConfig {
  const { isLoading, error } = useWeatherData(coordinates);

  return {
    definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
    data: {
      icon: 'list',
      title: 'Weather Details',
      description: 'Detailed weather information',
      header: () => <WeatherDetailsHeader isLoading={isLoading} error={error} />,
      content: () => <WeatherDetailsWidget coordinates={coordinates} />,
    },
  };
}

export const weatherDetails = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
  data: {
    icon: 'list',
    title: 'Weather Details',
    description: 'Detailed weather information',
    header: WeatherDetailsHeader,
    content: WeatherDetailsWidget,
  },
};
