// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import Icon from '@cloudscape-design/components/icon';

import { CurrentWeather, LocationData, WEATHER_CODES } from '../../types';
import { WeatherService } from '../../weather-service';

interface CurrentWeatherWidgetProps {
  currentWeather: CurrentWeather | null;
  location: LocationData;
  loading: boolean;
}

export function CurrentWeatherWidget({ currentWeather, location, loading }: CurrentWeatherWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">Current Weather</Header>}>
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            Loading current weather...
          </Box>
        </Box>
      </Container>
    );
  }

  if (!currentWeather) {
    return (
      <Container header={<Header variant="h2">Current Weather</Header>}>
        <Box textAlign="center" padding="xl">
          <Icon name="status-warning" size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            Weather data unavailable
          </Box>
        </Box>
      </Container>
    );
  }

  const weatherInfo = WEATHER_CODES[currentWeather.weathercode] || {
    description: 'Unknown',
    icon: 'status-info',
  };

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
    <Container
      header={
        <Header variant="h2" description={`Current conditions in ${location.name}`}>
          Current Weather
        </Header>
      }
    >
      <SpaceBetween size="l">
        <div style={{ textAlign: 'center' }}>
          <Box variant="h1" margin={{ bottom: 'xs' }}>
            {WeatherService.formatTemperature(currentWeather.temperature)}
          </Box>
          <Box variant="h3" color="text-status-info" margin={{ bottom: 's' }}>
            {weatherInfo.description}
          </Box>
          <Box variant="small" color="text-body-secondary">
            Feels like {WeatherService.formatTemperature(currentWeather.temperature)}
          </Box>
        </div>

        <SpaceBetween direction="horizontal" size="l">
          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Wind</Box>
            <Box variant="h4">{WeatherService.formatWindSpeed(currentWeather.windspeed)}</Box>
            <Box variant="small" color="text-body-secondary">
              {getWindDirection(currentWeather.winddirection)} ({currentWeather.winddirection}°)
            </Box>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Box variant="awsui-key-label">Weather Code</Box>
            <Box variant="h4">{currentWeather.weathercode}</Box>
            <Box variant="small" color="text-body-secondary">
              Last updated: {WeatherService.formatTime(currentWeather.time)}
            </Box>
          </SpaceBetween>
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
}
