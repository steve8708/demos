// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { WeatherApiResponse, getWeatherIcon } from '../types';
import {
  formatTemperature,
  formatSpeed,
  formatPressure,
  formatPercentage,
  getWindDirection,
  getTemperatureEmoji,
  getHumidityEmoji,
} from '../api';
import { WeatherIcon } from './weather-icon';

interface CurrentWeatherWidgetProps {
  data: WeatherApiResponse | null;
  loading: boolean;
  error: string | null;
  locationName: string;
}

export function CurrentWeatherWidget({ data, loading, error, locationName }: CurrentWeatherWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">Current Weather</Header>}>
        <Box>Loading current weather data...</Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Current Weather</Header>}>
        <StatusIndicator type="error">Error loading weather data: {error}</StatusIndicator>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container header={<Header variant="h2">Current Weather</Header>}>
        <Box>No weather data available</Box>
      </Container>
    );
  }

  const current = data.current;
  const weatherCondition = getWeatherIcon(current.weather_code, current.is_day === 1);

  return (
    <Container
      header={
        <Header
          variant="h2"
          description={`Current conditions in ${locationName}`}
          info={<Box>Updated: {new Date(current.time).toLocaleString()}</Box>}
        >
          Current Weather
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Temperature</Box>
            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
              <Box fontSize="display-l" fontWeight="bold">
                {formatTemperature(current.temperature_2m)}
              </Box>
              <Box fontSize="heading-l">{getTemperatureEmoji(current.temperature_2m)}</Box>
            </SpaceBetween>
            <Box variant="small" color="text-status-info">
              Feels like {formatTemperature(current.apparent_temperature)}
            </Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Condition</Box>
            <WeatherIcon condition={weatherCondition} size="large" showDescription={true} />
          </div>
        </ColumnLayout>

        <ColumnLayout columns={4} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Humidity</Box>
            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
              <Box fontSize="heading-m">{formatPercentage(current.relative_humidity_2m)}</Box>
              <Box>{getHumidityEmoji(current.relative_humidity_2m)}</Box>
            </SpaceBetween>
          </div>
          <div>
            <Box variant="awsui-key-label">Wind</Box>
            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
              <Box fontSize="heading-m">
                {formatSpeed(current.wind_speed_10m)} {getWindDirection(current.wind_direction_10m)}
              </Box>
              <Box>💨</Box>
            </SpaceBetween>
            {current.wind_gusts_10m > 0 && (
              <Box variant="small" color="text-status-info">
                Gusts {formatSpeed(current.wind_gusts_10m)}
              </Box>
            )}
          </div>
          <div>
            <Box variant="awsui-key-label">Pressure</Box>
            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
              <Box fontSize="heading-m">{formatPressure(current.pressure_msl)}</Box>
              <Box>🔽</Box>
            </SpaceBetween>
          </div>
          <div>
            <Box variant="awsui-key-label">Cloud Cover</Box>
            <Box fontSize="heading-m">{formatPercentage(current.cloud_cover)}</Box>
          </div>
        </ColumnLayout>

        {current.precipitation > 0 && (
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="awsui-key-label">Precipitation</Box>
              <Box fontSize="heading-m">{current.precipitation.toFixed(1)} mm</Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Rain</Box>
              <Box fontSize="heading-m">{current.rain.toFixed(1)} mm</Box>
            </div>
          </ColumnLayout>
        )}
      </SpaceBetween>
    </Container>
  );
}
