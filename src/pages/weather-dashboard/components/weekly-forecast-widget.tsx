// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { WeatherApiResponse, WEATHER_CODES } from '../types';
import { formatTemperature, formatSpeed, formatPercentage, formatDate, formatTime, getWindDirection } from '../api';

interface WeeklyForecastWidgetProps {
  data: WeatherApiResponse | null;
  loading: boolean;
  error: string | null;
}

export function WeeklyForecastWidget({ data, loading, error }: WeeklyForecastWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <Box>Loading weekly forecast data...</Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <StatusIndicator type="error">Error loading forecast data: {error}</StatusIndicator>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <Box>No forecast data available</Box>
      </Container>
    );
  }

  const daily = data.daily;
  const weeklyData = Array.from({ length: 7 }, (_, i) => ({
    date: daily.time[i],
    weatherCode: daily.weather_code[i],
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
    apparentTempMax: daily.apparent_temperature_max[i],
    apparentTempMin: daily.apparent_temperature_min[i],
    sunrise: daily.sunrise[i],
    sunset: daily.sunset[i],
    uvIndex: daily.uv_index_max[i],
    precipitationSum: daily.precipitation_sum[i],
    rainSum: daily.rain_sum[i],
    precipitationHours: daily.precipitation_hours[i],
    precipitationProbability: daily.precipitation_probability_max[i],
    windSpeedMax: daily.wind_speed_10m_max[i],
    windGustsMax: daily.wind_gusts_10m_max[i],
    windDirection: daily.wind_direction_10m_dominant[i],
  }));

  return (
    <Container
      header={
        <Header variant="h2" description="Extended weather forecast for the next 7 days">
          7-Day Forecast
        </Header>
      }
    >
      <SpaceBetween size="m">
        {weeklyData.map((day, index) => {
          const weatherCondition = WEATHER_CODES[day.weatherCode] || {
            description: 'Unknown',
            icon: 'status-info',
          };

          const isToday = index === 0;
          const dayLabel = isToday ? 'Today' : formatDate(day.date);

          return (
            <div
              key={index}
              style={{
                padding: '16px',
                border: '1px solid var(--color-border-divider-default)',
                borderRadius: '8px',
                backgroundColor: isToday ? 'var(--color-background-layout-main)' : 'transparent',
              }}
            >
              <ColumnLayout columns={4} variant="text-grid">
                <div>
                  <Box variant="awsui-key-label">{dayLabel}</Box>
                  <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                    <StatusIndicator type={weatherCondition.icon.replace('status-', '') as any}>
                      {weatherCondition.description}
                    </StatusIndicator>
                  </SpaceBetween>
                </div>
                <div>
                  <Box variant="awsui-key-label">Temperature</Box>
                  <Box fontSize="heading-s">
                    {formatTemperature(day.tempMax)} / {formatTemperature(day.tempMin)}
                  </Box>
                  <Box variant="small" color="text-status-info">
                    Feels {formatTemperature(day.apparentTempMax)} / {formatTemperature(day.apparentTempMin)}
                  </Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Precipitation</Box>
                  {day.precipitationSum > 0 ? (
                    <SpaceBetween size="xxs">
                      <Box fontSize="heading-s">{day.precipitationSum.toFixed(1)} mm</Box>
                      <Box variant="small" color="text-status-info">
                        {formatPercentage(day.precipitationProbability)} chance
                      </Box>
                      <Box variant="small" color="text-status-info">
                        {day.precipitationHours.toFixed(0)} hours
                      </Box>
                    </SpaceBetween>
                  ) : (
                    <Box fontSize="heading-s">No rain</Box>
                  )}
                </div>
                <div>
                  <Box variant="awsui-key-label">Wind & UV</Box>
                  <SpaceBetween size="xxs">
                    <Box fontSize="heading-s">
                      {formatSpeed(day.windSpeedMax)} {getWindDirection(day.windDirection)}
                    </Box>
                    {day.windGustsMax > 0 && (
                      <Box variant="small" color="text-status-info">
                        Gusts {formatSpeed(day.windGustsMax)}
                      </Box>
                    )}
                    <Box variant="small" color="text-status-info">
                      UV Index: {day.uvIndex.toFixed(0)}
                    </Box>
                  </SpaceBetween>
                </div>
              </ColumnLayout>

              <div style={{ marginTop: '12px' }}>
                <ColumnLayout columns={2} variant="text-grid">
                  <div>
                    <Box variant="awsui-key-label">Sunrise</Box>
                    <Box variant="small">{formatTime(day.sunrise)}</Box>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">Sunset</Box>
                    <Box variant="small">{formatTime(day.sunset)}</Box>
                  </div>
                </ColumnLayout>
              </div>
            </div>
          );
        })}
      </SpaceBetween>
    </Container>
  );
}
