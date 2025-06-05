// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Icon from '@cloudscape-design/components/icon';
import { CurrentWeather, WeatherLocation, WEATHER_CODE_DESCRIPTIONS } from '../types';

interface CurrentWeatherCardProps {
  location: WeatherLocation;
  weather: CurrentWeather;
}

export function CurrentWeatherCard({ location, weather }: CurrentWeatherCardProps) {
  const weatherInfo = WEATHER_CODE_DESCRIPTIONS[weather.weathercode] || {
    description: 'Unknown',
    icon: 'help',
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric',
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
        <Header variant="h2" description={`Current weather conditions as of ${formatTime(weather.time)}`}>
          {location.name} Current Weather
        </Header>
      }
    >
      <Grid gridDefinition={[{ colspan: { default: 12, xs: 12, s: 6 } }, { colspan: { default: 12, xs: 12, s: 6 } }]}>
        <Box textAlign="center" padding={{ vertical: 'l' }}>
          <Box fontSize="display-l" fontWeight="bold" color="text-status-info">
            {Math.round(weather.temperature)}°C
          </Box>
          <Box variant="h3" padding={{ top: 's', bottom: 'xs' }}>
            <Icon name={weatherInfo.icon as any} size="medium" />
            <Box display="inline" margin={{ left: 'xs' }}>
              {weatherInfo.description}
            </Box>
          </Box>
          <StatusIndicator type={weather.is_day ? 'success' : 'info'}>
            {weather.is_day ? 'Daytime' : 'Nighttime'}
          </StatusIndicator>
        </Box>

        <KeyValuePairs
          columns={1}
          items={[
            {
              label: 'Temperature',
              value: `${Math.round(weather.temperature)}°C`,
            },
            {
              label: 'Wind Speed',
              value: `${Math.round(weather.windspeed)} km/h`,
            },
            {
              label: 'Wind Direction',
              value: `${getWindDirection(weather.winddirection)} (${weather.winddirection}°)`,
            },
            {
              label: 'Conditions',
              value: weatherInfo.description,
            },
            {
              label: 'Time Period',
              value: weather.is_day ? 'Day' : 'Night',
            },
          ]}
        />
      </Grid>
    </Container>
  );
}
