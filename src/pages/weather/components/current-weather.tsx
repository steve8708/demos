// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WeatherData, WEATHER_CODES } from '../types';
import { formatDate, formatTemperature } from '../api';

interface CurrentWeatherProps {
  weatherData: WeatherData;
  locationName?: string;
}

export function CurrentWeather({ weatherData, locationName }: CurrentWeatherProps) {
  if (!weatherData.current) {
    return null;
  }

  const current = weatherData.current;
  const weatherCode = WEATHER_CODES[current.weathercode] || WEATHER_CODES[0];
  const date = new Date();

  return (
    <Container header={<Header variant="h2">Current Weather {locationName ? `- ${locationName}` : ''}</Header>}>
      <ColumnLayout columns={2} variant="text-grid">
        <SpaceBetween size="l">
          <div>
            <Box variant="h1" padding={{ bottom: 's' }}>
              {formatTemperature(current.temperature)}
            </Box>
            <Box variant="h3">
              <Icon name={weatherCode.icon} /> {weatherCode.description}
            </Box>
          </div>

          <Box variant="small">
            <div>
              {formatDate(date.toISOString())} | Last updated: {date.toLocaleTimeString()}
            </div>
          </Box>
        </SpaceBetween>

        <ColumnLayout columns={2} variant="text-grid">
          <SpaceBetween size="l">
            <Box>
              <Box variant="awsui-key-label">Humidity</Box>
              <Box variant="awsui-value-large">{current.humidity}%</Box>
            </Box>

            <Box>
              <Box variant="awsui-key-label">Pressure</Box>
              <Box variant="awsui-value-large">{current.pressure} hPa</Box>
            </Box>
          </SpaceBetween>

          <SpaceBetween size="l">
            <Box>
              <Box variant="awsui-key-label">Wind</Box>
              <Box variant="awsui-value-large">
                {current.windspeed} km/h {getWindDirection(current.winddirection)}
              </Box>
            </Box>

            <Box>
              <Box variant="awsui-key-label">Cloud Cover</Box>
              <Box variant="awsui-value-large">{current.cloudcover}%</Box>
            </Box>
          </SpaceBetween>
        </ColumnLayout>
      </ColumnLayout>
    </Container>
  );
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
