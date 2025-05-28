// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';
import Icon from '@cloudscape-design/components/icon';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { WeatherData, LocationData, getWeatherDescription } from '../weather-api';

interface WeatherCardProps {
  weatherData: WeatherData;
  location: LocationData;
}

export function WeatherCard({ weatherData, location }: WeatherCardProps) {
  const { current } = weatherData;
  const weatherInfo = getWeatherDescription(current.weatherCode);

  return (
    <Container
      header={
        <Header
          variant="h2"
          description={`Current weather conditions for ${location.name}${location.country ? `, ${location.country}` : ''}`}
        >
          Current Weather
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xxs: 12, xs: 6, s: 4, m: 3, l: 3, xl: 3 } },
            { colspan: { default: 12, xxs: 12, xs: 6, s: 4, m: 3, l: 3, xl: 3 } },
            { colspan: { default: 12, xxs: 12, xs: 6, s: 4, m: 3, l: 3, xl: 3 } },
            { colspan: { default: 12, xxs: 12, xs: 6, s: 4, m: 3, l: 3, xl: 3 } },
          ]}
        >
          <div className="weather-metric-card">
            <SpaceBetween size="xs">
              <Box variant="small" color="text-status-inactive">
                Temperature
              </Box>
              <Box variant="h1" color="text-status-success">
                {current.temperature}°C
              </Box>
              <Box variant="small">
                <StatusIndicator type="success">
                  <Icon name={weatherInfo.icon} /> {weatherInfo.description}
                </StatusIndicator>
              </Box>
            </SpaceBetween>
          </div>

          <div className="weather-metric-card">
            <SpaceBetween size="xs">
              <Box variant="small" color="text-status-inactive">
                Humidity
              </Box>
              <Box variant="h2" color="text-body-secondary">
                {current.humidity}%
              </Box>
              <Box variant="small">
                <Icon name="status-info" /> Relative humidity
              </Box>
            </SpaceBetween>
          </div>

          <div className="weather-metric-card">
            <SpaceBetween size="xs">
              <Box variant="small" color="text-status-inactive">
                Wind Speed
              </Box>
              <Box variant="h2" color="text-body-secondary">
                {current.windSpeed} km/h
              </Box>
              <Box variant="small">
                <Icon name="arrow-right" /> Wind velocity
              </Box>
            </SpaceBetween>
          </div>

          <div className="weather-metric-card">
            <SpaceBetween size="xs">
              <Box variant="small" color="text-status-inactive">
                Last Updated
              </Box>
              <Box variant="h3" color="text-body-secondary">
                {new Date(current.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Box>
              <Box variant="small">
                <Icon name="refresh" /> Live data
              </Box>
            </SpaceBetween>
          </div>
        </Grid>
      </SpaceBetween>
    </Container>
  );
}
