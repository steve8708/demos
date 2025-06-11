// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { WeatherData, DailyForecast } from '../types';
import { getWeatherDescription, formatTemperature, formatWindSpeed } from '../api';

interface DailyForecastProps {
  data: WeatherData;
}

export function DailyForecastWidget({ data }: DailyForecastProps) {
  const { daily, daily_units } = data;

  // Transform data for the next 7 days
  const dailyForecasts: DailyForecast[] = daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code[index],
    temperatureMax: daily.temperature_2m_max[index],
    temperatureMin: daily.temperature_2m_min[index],
    precipitationSum: daily.precipitation_sum[index],
    precipitationProbability: daily.precipitation_probability_max[index],
    windSpeed: daily.wind_speed_10m_max[index],
    sunrise: daily.sunrise[index],
    sunset: daily.sunset[index],
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPrecipitationInfo = (sum: number, probability: number) => {
    if (sum > 0) {
      return (
        <SpaceBetween direction="horizontal" size="xs">
          <Badge color="blue">{sum.toFixed(1)}mm</Badge>
          <Box variant="small" color="text-body-secondary">
            {probability}%
          </Box>
        </SpaceBetween>
      );
    }
    if (probability > 30) {
      return <Badge color="grey">{probability}%</Badge>;
    }
    return <Box color="text-body-secondary">—</Box>;
  };

  return (
    <Container
      header={
        <Header variant="h2" description="7-day weather forecast">
          Weekly Forecast
        </Header>
      }
    >
      <Table
        columnDefinitions={[
          {
            id: 'date',
            header: 'Date',
            cell: item => formatDate(item.date),
            minWidth: 120,
          },
          {
            id: 'weather',
            header: 'Weather',
            cell: item => getWeatherDescription(item.weatherCode),
            minWidth: 140,
          },
          {
            id: 'temperature',
            header: 'Temperature',
            cell: item => (
              <SpaceBetween direction="horizontal" size="xs">
                <Box fontWeight="bold">{formatTemperature(item.temperatureMax, daily_units.temperature_2m_max)}</Box>
                <Box color="text-body-secondary">
                  {formatTemperature(item.temperatureMin, daily_units.temperature_2m_min)}
                </Box>
              </SpaceBetween>
            ),
            minWidth: 120,
          },
          {
            id: 'precipitation',
            header: 'Precipitation',
            cell: item => getPrecipitationInfo(item.precipitationSum, item.precipitationProbability),
            minWidth: 130,
          },
          {
            id: 'wind',
            header: 'Max Wind',
            cell: item => formatWindSpeed(item.windSpeed, daily_units.wind_speed_10m_max),
            minWidth: 100,
          },
          {
            id: 'sun',
            header: 'Sunrise / Sunset',
            cell: item => (
              <SpaceBetween direction="vertical" size="xxs">
                <Box variant="small">🌅 {formatTime(item.sunrise)}</Box>
                <Box variant="small">🌇 {formatTime(item.sunset)}</Box>
              </SpaceBetween>
            ),
            minWidth: 140,
          },
        ]}
        items={dailyForecasts}
        loadingText="Loading forecast..."
        sortingDisabled
        empty={
          <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
              No daily forecast data available
            </Box>
          </Box>
        }
        header={<Header>Next 7 days</Header>}
      />
    </Container>
  );
}
