// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { WeatherApiResponse, getWeatherIcon } from '../types';
import { formatTemperature, formatSpeed, formatPercentage, formatTime, getWindDirection } from '../api';
import { SimpleWeatherIcon } from './weather-icon';

interface HourlyForecastWidgetProps {
  data: WeatherApiResponse | null;
  loading: boolean;
  error: string | null;
}

export function HourlyForecastWidget({ data, loading, error }: HourlyForecastWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">24-Hour Forecast</Header>}>
        <Box>Loading hourly forecast data...</Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">24-Hour Forecast</Header>}>
        <StatusIndicator type="error">Error loading forecast data: {error}</StatusIndicator>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container header={<Header variant="h2">24-Hour Forecast</Header>}>
        <Box>No forecast data available</Box>
      </Container>
    );
  }

  // Get next 24 hours
  const next24Hours = Array.from({ length: 24 }, (_, i) => {
    const hourly = data.hourly;
    return {
      time: hourly.time[i],
      temperature: hourly.temperature_2m[i],
      humidity: hourly.relative_humidity_2m[i],
      precipitation: hourly.precipitation[i],
      precipitationProbability: hourly.precipitation_probability[i],
      weatherCode: hourly.weather_code[i],
      cloudCover: hourly.cloud_cover[i],
      windSpeed: hourly.wind_speed_10m[i],
      windDirection: hourly.wind_direction_10m[i],
    };
  });

  return (
    <Container
      header={
        <Header variant="h2" description="Hourly weather forecast for the next 24 hours">
          24-Hour Forecast
        </Header>
      }
    >
      <div style={{ overflowX: 'auto', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '16px', minWidth: 'max-content', padding: '8px 0' }}>
          {next24Hours.map((hour, index) => {
            const weatherCondition = WEATHER_CODES[hour.weatherCode] || {
              description: 'Unknown',
              icon: 'status-info',
            };

            return (
              <div
                key={index}
                style={{
                  minWidth: '120px',
                  padding: '12px',
                  border: '1px solid var(--color-border-divider-default)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <SpaceBetween size="xs">
                  <Box variant="small" fontWeight="bold">
                    {formatTime(hour.time)}
                  </Box>
                  <Box fontSize="heading-s">{formatTemperature(hour.temperature)}</Box>
                  <StatusIndicator type={weatherCondition.icon.replace('status-', '') as any} />
                  <Box variant="small">{weatherCondition.description}</Box>
                  {hour.precipitation > 0 && (
                    <Box variant="small" color="text-status-info">
                      {hour.precipitation.toFixed(1)}mm
                    </Box>
                  )}
                  {hour.precipitationProbability > 0 && (
                    <Box variant="small" color="text-status-info">
                      {formatPercentage(hour.precipitationProbability)} chance
                    </Box>
                  )}
                  <Box variant="small">
                    {formatSpeed(hour.windSpeed)} {getWindDirection(hour.windDirection)}
                  </Box>
                </SpaceBetween>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
