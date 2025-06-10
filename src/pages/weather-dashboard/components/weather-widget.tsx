// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';
import Icon from '@cloudscape-design/components/icon';
import { format } from 'date-fns';

import { CurrentWeather, weatherCodes } from '../types';

interface WeatherWidgetProps {
  weather: CurrentWeather;
  locationName: string;
  timezone: string;
}

export function WeatherWidget({ weather, locationName, timezone }: WeatherWidgetProps) {
  const weatherInfo = weatherCodes[weather.weathercode] || { description: 'Unknown', icon: 'cloud' };
  const lastUpdated = new Date(weather.time);

  const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;
  const formatWindSpeed = (speed: number) => `${Math.round(speed)} km/h`;
  const formatWindDirection = (direction: number) => {
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
    const index = Math.round(direction / 22.5) % 16;
    return directions[index];
  };

  return (
    <Container
      header={
        <Header
          variant="h2"
          description={`Current weather conditions in ${locationName}`}
          actions={<Badge color={weather.is_day ? 'blue' : 'grey'}>{weather.is_day ? 'Day' : 'Night'}</Badge>}
        >
          Current Weather
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2} borders="vertical">
          <div>
            <SpaceBetween size="m">
              <Box>
                <Box variant="h1" display="inline" fontSize="display-l">
                  {formatTemperature(weather.temperature)}
                </Box>
                <Box margin={{ left: 'm' }} display="inline">
                  <Icon name={weatherInfo.icon as any} size="large" />
                </Box>
              </Box>
              <Box variant="h3" color="text-body-secondary">
                {weatherInfo.description}
              </Box>
            </SpaceBetween>
          </div>

          <div>
            <SpaceBetween size="s">
              <ColumnLayout columns={1}>
                <Box>
                  <Box variant="awsui-key-label">Wind Speed</Box>
                  <Box variant="span" fontSize="body-m">
                    {formatWindSpeed(weather.windspeed)}
                  </Box>
                </Box>
                <Box>
                  <Box variant="awsui-key-label">Wind Direction</Box>
                  <Box variant="span" fontSize="body-m">
                    {formatWindDirection(weather.winddirection)} ({weather.winddirection}°)
                  </Box>
                </Box>
                <Box>
                  <Box variant="awsui-key-label">Location</Box>
                  <Box variant="span" fontSize="body-m">
                    {locationName}
                  </Box>
                </Box>
                <Box>
                  <Box variant="awsui-key-label">Timezone</Box>
                  <Box variant="span" fontSize="body-m">
                    {timezone}
                  </Box>
                </Box>
              </ColumnLayout>
            </SpaceBetween>
          </div>
        </ColumnLayout>

        <Box padding={{ top: 's' }} color="text-body-secondary" fontSize="body-s">
          Last updated: {format(lastUpdated, 'PPpp')}
        </Box>
      </SpaceBetween>
    </Container>
  );
}
