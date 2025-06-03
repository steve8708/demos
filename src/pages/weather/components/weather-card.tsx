// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WeatherData, WEATHER_CODES, LocationData } from '../types';
import { formatTemperature, formatWindSpeed, formatWindDirection, getLocationDisplayName } from '../utils/weather-api';

interface WeatherCardProps {
  weatherData: WeatherData;
  location: LocationData;
}

export function WeatherCard({ weatherData, location }: WeatherCardProps) {
  const current = weatherData.current;
  const weatherCode = WEATHER_CODES[current.weather_code] || { description: 'Unknown', icon: '❓' };

  return (
    <Container header={<Header variant="h2">Current Weather - {getLocationDisplayName(location)}</Header>}>
      <SpaceBetween direction="vertical" size="l">
        <div className="weather-current-display">
          <SpaceBetween direction="horizontal" size="xl" alignItems="center">
            <div className="weather-temperature-section">
              <Box fontSize="display-l" fontWeight="bold" color="text-status-info">
                {formatTemperature(current.temperature_2m)}
              </Box>
              <Box variant="small" color="text-body-secondary">
                Feels like {formatTemperature(current.temperature_2m)}
              </Box>
            </div>

            <div className="weather-conditions-section">
              <SpaceBetween direction="vertical" size="xs">
                <Box fontSize="heading-xl">{weatherCode.icon}</Box>
                <Box variant="h3">{weatherCode.description}</Box>
              </SpaceBetween>
            </div>
          </SpaceBetween>
        </div>

        <div className="weather-details-grid">
          <SpaceBetween direction="horizontal" size="xl">
            <div className="weather-detail-item">
              <Box variant="h4" margin={{ bottom: 'xxs' }}>
                Humidity
              </Box>
              <Box variant="h3" color="text-status-info">
                {current.relative_humidity_2m}%
              </Box>
            </div>

            <div className="weather-detail-item">
              <Box variant="h4" margin={{ bottom: 'xxs' }}>
                Wind Speed
              </Box>
              <Box variant="h3" color="text-status-info">
                {formatWindSpeed(current.wind_speed_10m)}
              </Box>
            </div>

            <div className="weather-detail-item">
              <Box variant="h4" margin={{ bottom: 'xxs' }}>
                Wind Direction
              </Box>
              <Box variant="h3" color="text-status-info">
                {formatWindDirection(current.wind_direction_10m)}
              </Box>
            </div>

            <div className="weather-detail-item">
              <Box variant="h4" margin={{ bottom: 'xxs' }}>
                Updated
              </Box>
              <Box variant="small" color="text-body-secondary">
                {new Date(current.time).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Box>
            </div>
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </Container>
  );
}
