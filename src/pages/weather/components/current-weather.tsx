// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { City, CurrentWeatherData } from '../utils/types';
import { getWeatherIconComponent } from '../utils/weather-icons';
import { formatDate } from '../utils/helpers';

interface CurrentWeatherProps {
  city: City;
  data: CurrentWeatherData;
}

export function CurrentWeather({ city, data }: CurrentWeatherProps) {
  const WeatherIcon = getWeatherIconComponent(data.weatherCode);
  const formattedDate = formatDate(new Date(data.time));

  const getWeatherDescription = (code: number): string => {
    const descriptions: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };

    return descriptions[code] || 'Unknown';
  };

  return (
    <Container
      header={
        <Header
          variant="h2"
          description={formattedDate}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <StatusIndicator type="success">Updated just now</StatusIndicator>
            </SpaceBetween>
          }
        >
          {city.name}, {city.country}
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <SpaceBetween size="xs">
              <div className="weather-icon-container">
                <WeatherIcon size={48} />
                <Box variant="h1" padding={{ left: 's' }} display="inline">
                  {Math.round(data.temperature)}°C
                </Box>
              </div>
              <Box variant="h3">{getWeatherDescription(data.weatherCode)}</Box>
              <Box variant="p">Feels like: {Math.round(data.apparentTemperature)}°C</Box>
            </SpaceBetween>
          </div>
          <div>
            <SpaceBetween size="m">
              <div>
                <Box variant="h3">Details</Box>
                <ColumnLayout columns={2} variant="text-grid">
                  <Box variant="p">Humidity</Box>
                  <Box variant="p">{data.relativeHumidity}%</Box>

                  <Box variant="p">Wind</Box>
                  <Box variant="p">{Math.round(data.windSpeed)} km/h</Box>

                  <Box variant="p">Precipitation</Box>
                  <Box variant="p">{data.precipitation} mm</Box>

                  <Box variant="p">UV Index</Box>
                  <Box variant="p">{data.uvIndex}</Box>
                </ColumnLayout>
              </div>
            </SpaceBetween>
          </div>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}
