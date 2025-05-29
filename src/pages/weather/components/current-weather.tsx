// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { CurrentWeather, Location, WEATHER_CONDITIONS } from '../types';

interface CurrentWeatherProps {
  weather: CurrentWeather;
  location: Location;
}

export function CurrentWeatherWidget({ weather, location }: CurrentWeatherProps) {
  const condition = WEATHER_CONDITIONS[weather.weatherCode] || {
    description: 'Unknown',
    icon: 'status-info' as const,
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

  const getUVLevel = (uvIndex: number): { level: string; color: 'success' | 'warning' | 'error' } => {
    if (uvIndex <= 2) return { level: 'Low', color: 'success' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'warning' };
    if (uvIndex <= 7) return { level: 'High', color: 'warning' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'error' };
    return { level: 'Extreme', color: 'error' };
  };

  const uvLevel = getUVLevel(weather.uvIndex);

  return (
    <Container header={<Header variant="h2">Current Weather - {location.name}</Header>}>
      <SpaceBetween size="l">
        <div className="current-weather-main">
          <ColumnLayout columns={3}>
            <div className="temperature-display">
              <Box variant="h1" fontSize="display-l">
                {weather.temperature}°C
              </Box>
              <Box variant="small" color="text-status-info">
                Feels like {weather.apparentTemperature}°C
              </Box>
              <StatusIndicator type={condition.icon as any}>{condition.description}</StatusIndicator>
            </div>

            <div>
              <SpaceBetween size="s">
                <div>
                  <Box variant="awsui-key-label">Wind</Box>
                  <div>
                    {weather.windSpeed} km/h {getWindDirection(weather.windDirection)}
                  </div>
                </div>
                <div>
                  <Box variant="awsui-key-label">Humidity</Box>
                  <div>{weather.humidity}%</div>
                </div>
                <div>
                  <Box variant="awsui-key-label">Visibility</Box>
                  <div>{weather.visibility} km</div>
                </div>
              </SpaceBetween>
            </div>

            <div>
              <SpaceBetween size="s">
                <div>
                  <Box variant="awsui-key-label">Pressure</Box>
                  <div>{weather.pressure} hPa</div>
                </div>
                <div>
                  <Box variant="awsui-key-label">Cloud Cover</Box>
                  <div>{weather.cloudCover}%</div>
                </div>
                <div>
                  <Box variant="awsui-key-label">UV Index</Box>
                  <StatusIndicator type={uvLevel.color}>
                    {weather.uvIndex} ({uvLevel.level})
                  </StatusIndicator>
                </div>
              </SpaceBetween>
            </div>
          </ColumnLayout>
        </div>

        {weather.precipitation > 0 && (
          <div>
            <Box variant="awsui-key-label">Precipitation</Box>
            <StatusIndicator type="info">{weather.precipitation} mm</StatusIndicator>
          </div>
        )}
      </SpaceBetween>
    </Container>
  );
}
