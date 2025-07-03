// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { WeatherData, WeatherService } from '../weather-api';

interface CurrentWeatherProps {
  weather: WeatherData;
  location: string;
}

export function CurrentWeather({ weather, location }: CurrentWeatherProps) {
  const { current } = weather;
  const weatherDescription = WeatherService.getWeatherDescription(current.weather_code);

  return (
    <Container
      header={
        <Header variant="h2" description={`Current conditions for ${location}`}>
          Current Weather
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2}>
          <div>
            <Box variant="awsui-key-label">Temperature</Box>
            <Box fontSize="display-l" fontWeight="bold">
              {Math.round(current.temperature_2m)}°C
            </Box>
            <Box variant="small" color="text-body-secondary">
              {weatherDescription}
            </Box>
          </div>
          <SpaceBetween size="s">
            <div>
              <Box variant="awsui-key-label">Humidity</Box>
              <Box variant="h3">{current.relative_humidity_2m}%</Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Wind Speed</Box>
              <Box variant="h3">{Math.round(current.wind_speed_10m)} km/h</Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Wind Direction</Box>
              <Box variant="h3">{current.wind_direction_10m}°</Box>
            </div>
          </SpaceBetween>
        </ColumnLayout>

        <div>
          <Box variant="awsui-key-label">Last Updated</Box>
          <Box variant="small" color="text-body-secondary">
            {new Date(current.time).toLocaleString()}
          </Box>
        </div>
      </SpaceBetween>
    </Container>
  );
}
