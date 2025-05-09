// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { CurrentWeather, Location, getWeatherIcon, getWeatherLabel } from '../utils/types';
import { formatDate, formatTime } from '../utils/api';

interface CurrentWeatherPanelProps {
  current: CurrentWeather;
  location: Location;
}

export function CurrentWeatherPanel({ current, location }: CurrentWeatherPanelProps) {
  const weatherIcon = getWeatherIcon(current.weatherCode);
  const weatherCondition = getWeatherLabel(current.weatherCode);
  const localTime = formatTime(current.time);
  const localDate = formatDate(current.time);

  return (
    <Container
      header={
        <Header variant="h2" description={`Last updated: ${localTime}, ${localDate}`}>
          Current weather
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Grid gridDefinition={[{ colspan: { default: 12 } }, { colspan: { default: 6 } }, { colspan: { default: 6 } }]}>
          <Box textAlign="center">
            <SpaceBetween size="xs">
              <Box fontSize="display-l" fontWeight="bold">
                {Math.round(current.temperature)}°C
              </Box>
              <Box fontSize="heading-m">
                <Icon name={weatherIcon} /> {weatherCondition}
              </Box>
            </SpaceBetween>
          </Box>

          <div>
            <SpaceBetween size="s">
              <Grid gridDefinition={[{ colspan: { default: 6 } }, { colspan: { default: 6 } }]}>
                <Box variant="awsui-key-label">Wind</Box>
                <Box variant="awsui-value-large">{current.windSpeed} km/h</Box>
              </Grid>
              <Grid gridDefinition={[{ colspan: { default: 6 } }, { colspan: { default: 6 } }]}>
                <Box variant="awsui-key-label">Wind direction</Box>
                <Box variant="awsui-value-large">{current.windDirection}°</Box>
              </Grid>
            </SpaceBetween>
          </div>

          <div>
            <SpaceBetween size="s">
              <Grid gridDefinition={[{ colspan: { default: 6 } }, { colspan: { default: 6 } }]}>
                <Box variant="awsui-key-label">Humidity</Box>
                <Box variant="awsui-value-large">{current.humidity}%</Box>
              </Grid>
              <Grid gridDefinition={[{ colspan: { default: 6 } }, { colspan: { default: 6 } }]}>
                <Box variant="awsui-key-label">Precipitation</Box>
                <Box variant="awsui-value-large">{current.precipitation} mm</Box>
              </Grid>
            </SpaceBetween>
          </div>
        </Grid>
      </SpaceBetween>
    </Container>
  );
}
