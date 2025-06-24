// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WeatherData } from '../types';
import { formatTemperature, formatDate } from '../utils';
import { getWeatherDescription, getWeatherEmoji } from '../services/weather-api';

interface DailyForecastTableProps {
  weatherData: WeatherData;
}

interface DailyForecastItem {
  date: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
}

export function DailyForecastTable({ weatherData }: DailyForecastTableProps) {
  const { daily } = weatherData;

  const dailyData: DailyForecastItem[] = daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code[index],
    maxTemp: daily.temperature_2m_max[index],
    minTemp: daily.temperature_2m_min[index],
    precipitation: daily.precipitation_sum[index],
    windSpeed: daily.wind_speed_10m_max[index],
  }));

  return (
    <Container
      header={
        <Header variant="h2" counter={`(${dailyData.length})`} description="7-day weather forecast">
          Daily Forecast
        </Header>
      }
    >
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '16px',
          padding: '8px',
          scrollbarWidth: 'thin',
        }}
      >
        {dailyData.map((item, index) => (
          <div
            key={item.date}
            style={{
              minWidth: '120px',
              textAlign: 'center',
              padding: '16px',
              border: '1px solid var(--color-border-divider-default)',
              borderRadius: '8px',
              backgroundColor: index === 0 ? 'var(--color-background-container-content)' : 'transparent',
            }}
          >
            <SpaceBetween size="xs">
              <Box variant="small" fontWeight="bold" color={index === 0 ? 'text-status-info' : 'inherit'}>
                {index === 0 ? 'Today' : formatDate(item.date)}
              </Box>

              <div style={{ fontSize: '48px', lineHeight: '1' }}>{getWeatherEmoji(item.weatherCode, true)}</div>

              <Box variant="small" textAlign="center">
                {getWeatherDescription(item.weatherCode, true)}
              </Box>

              <SpaceBetween size="xxs">
                <Box fontWeight="bold" fontSize="body-m">
                  {formatTemperature(item.maxTemp)}
                </Box>
                <Box color="text-body-secondary" fontSize="body-s">
                  {formatTemperature(item.minTemp)}
                </Box>
              </SpaceBetween>
            </SpaceBetween>
          </div>
        ))}
      </div>
    </Container>
  );
}
