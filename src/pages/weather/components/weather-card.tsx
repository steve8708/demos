// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WeatherData, WeatherService } from '../weather-service';

interface WeatherCardProps {
  weather: WeatherData;
  locationName?: string;
}

export function WeatherCard({ weather, locationName }: WeatherCardProps) {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <Container
      header={
        <Header variant="h2" description={locationName || weather.location}>
          Current Weather
        </Header>
      }
    >
      <SpaceBetween size="m">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Box fontSize="display-l" fontWeight="bold">
            {weather.current.temperature}°C
          </Box>
          <Box fontSize="heading-xl">{WeatherService.getWeatherIcon(weather.current.weatherCode)}</Box>
          <Box fontSize="heading-s">{WeatherService.getWeatherDescription(weather.current.weatherCode)}</Box>
        </div>

        <KeyValuePairs
          columns={3}
          items={[
            {
              label: 'Humidity',
              value: `${weather.current.humidity}%`,
            },
            {
              label: 'Wind Speed',
              value: `${weather.current.windSpeed} km/h`,
            },
            {
              label: 'Wind Direction',
              value: `${getWindDirection(weather.current.windDirection)} (${weather.current.windDirection}°)`,
            },
            {
              label: 'Last Updated',
              value: formatTime(weather.current.time),
            },
            {
              label: 'Coordinates',
              value: `${weather.latitude.toFixed(4)}, ${weather.longitude.toFixed(4)}`,
            },
          ]}
        />
      </SpaceBetween>
    </Container>
  );
}
