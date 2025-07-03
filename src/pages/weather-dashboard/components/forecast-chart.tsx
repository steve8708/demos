// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { WeatherData, WeatherService } from '../weather-api';

interface ForecastChartProps {
  weather: WeatherData;
}

export function ForecastChart({ weather }: ForecastChartProps) {
  const { hourly } = weather;

  // Get next 24 hours of data
  const next24Hours = hourly.time.slice(0, 24).map((time, index) => ({
    time: new Date(time),
    temperature: hourly.temperature_2m[index],
    humidity: hourly.relative_humidity_2m[index],
    windSpeed: hourly.wind_speed_10m[index],
    precipitation: hourly.precipitation_probability[index],
    weatherCode: hourly.weather_code[index],
  }));

  // Group by 4-hour intervals for display
  const intervals = [];
  for (let i = 0; i < next24Hours.length; i += 4) {
    const interval = next24Hours.slice(i, i + 4);
    const avgTemp = interval.reduce((sum, h) => sum + h.temperature, 0) / interval.length;
    const maxPrecip = Math.max(...interval.map(h => h.precipitation));

    intervals.push({
      timeLabel: interval[0].time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round(avgTemp),
      precipitation: Math.round(maxPrecip),
      weather: WeatherService.getWeatherDescription(interval[0].weatherCode),
    });
  }

  return (
    <Container
      header={
        <Header variant="h2" description="24-hour temperature and precipitation forecast">
          Hourly Forecast
        </Header>
      }
    >
      <div style={{ overflowX: 'auto' }}>
        <ColumnLayout columns={Math.min(intervals.length, 6)} variant="text-grid">
          {intervals.map((interval, index) => (
            <div key={index} style={{ textAlign: 'center', padding: '8px' }}>
              <Box variant="awsui-key-label">{interval.timeLabel}</Box>
              <SpaceBetween size="xs">
                <Box fontSize="heading-m" fontWeight="bold">
                  {interval.temperature}°C
                </Box>
                <Box variant="small" color="text-body-secondary">
                  {interval.weather}
                </Box>
                <Box variant="small">💧 {interval.precipitation}%</Box>
              </SpaceBetween>
            </div>
          ))}
        </ColumnLayout>
      </div>
    </Container>
  );
}
