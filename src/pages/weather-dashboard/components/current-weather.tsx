// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Icon from '@cloudscape-design/components/icon';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { CurrentWeather, getWeatherInfo } from '../api';

interface CurrentWeatherCardProps {
  currentWeather?: CurrentWeather;
  isLoading: boolean;
  location?: { name: string; latitude: number; longitude: number };
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'mph';
  precipitationUnit: 'mm' | 'inch';
}

export function CurrentWeatherCard({
  currentWeather,
  isLoading,
  location,
  temperatureUnit,
  windSpeedUnit,
  precipitationUnit,
}: CurrentWeatherCardProps) {
  if (isLoading) {
    return (
      <Container header={<Header variant="h2">Current Weather</Header>}>
        <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
          <StatusIndicator type="loading">Loading weather data</StatusIndicator>
        </Box>
      </Container>
    );
  }

  if (!currentWeather || !location) {
    return (
      <Container header={<Header variant="h2">Current Weather</Header>}>
        <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
          <Box variant="p">No weather data available. Please select a location.</Box>
        </Box>
      </Container>
    );
  }

  const weatherInfo = getWeatherInfo(currentWeather.weathercode);
  const tempUnit = temperatureUnit === 'celsius' ? '°C' : '°F';
  const windUnit = windSpeedUnit === 'kmh' ? 'km/h' : 'mph';
  const precipUnit = precipitationUnit === 'mm' ? 'mm' : 'in';

  return (
    <Container
      header={
        <Header variant="h2" description={`Last updated: ${new Date(currentWeather.time).toLocaleString()}`}>
          Current Weather in {location.name}
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2}>
          <div>
            <SpaceBetween size="m">
              <div>
                <Box float="left" padding={{ right: 'l' }}>
                  <Icon
                    name={weatherInfo.icon as 'sun' | 'cloud' | 'rain' | 'snow' | 'lightning' | 'question'}
                    size="large"
                  />
                </Box>
                <Box variant="h1" padding={{ bottom: 's' }}>
                  {currentWeather.temperature}
                  {tempUnit}
                </Box>
                <Box variant="h3" color="text-status-info">
                  {weatherInfo.label}
                </Box>
                {currentWeather.apparent_temperature !== undefined && (
                  <Box variant="p">
                    Feels like {currentWeather.apparent_temperature}
                    {tempUnit}
                  </Box>
                )}
              </div>
            </SpaceBetween>
          </div>
          <div>
            <ColumnLayout columns={1} variant="text-grid">
              <SpaceBetween size="s">
                <div>
                  <Box variant="awsui-key-label">Wind</Box>
                  <Box variant="p">
                    {currentWeather.windspeed} {windUnit} ({getWindDirection(currentWeather.winddirection)})
                  </Box>
                </div>
                {currentWeather.humidity !== undefined && (
                  <div>
                    <Box variant="awsui-key-label">Humidity</Box>
                    <Box variant="p">{currentWeather.humidity}%</Box>
                  </div>
                )}
                {currentWeather.precipitation !== undefined && (
                  <div>
                    <Box variant="awsui-key-label">Precipitation</Box>
                    <Box variant="p">
                      {currentWeather.precipitation} {precipUnit}
                    </Box>
                  </div>
                )}
                {currentWeather.pressure_msl !== undefined && (
                  <div>
                    <Box variant="awsui-key-label">Pressure</Box>
                    <Box variant="p">{currentWeather.pressure_msl} hPa</Box>
                  </div>
                )}
                {currentWeather.cloudcover !== undefined && (
                  <div>
                    <Box variant="awsui-key-label">Cloud Cover</Box>
                    <Box variant="p">{currentWeather.cloudcover}%</Box>
                  </div>
                )}
                {currentWeather.visibility !== undefined && (
                  <div>
                    <Box variant="awsui-key-label">Visibility</Box>
                    <Box variant="p">{Math.round(currentWeather.visibility / 1000)} km</Box>
                  </div>
                )}
                <div>
                  <Box variant="awsui-key-label">Day/Night</Box>
                  <Badge color={currentWeather.is_day ? 'blue' : 'grey'}>
                    {currentWeather.is_day ? 'Day' : 'Night'}
                  </Badge>
                </div>
              </SpaceBetween>
            </ColumnLayout>
          </div>
        </ColumnLayout>
        <Box variant="small" color="text-body-secondary">
          Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </Box>
      </SpaceBetween>
    </Container>
  );
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
