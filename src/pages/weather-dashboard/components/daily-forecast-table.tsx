// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';

import { WeatherData } from '../types';
import { formatTemperature, formatWindSpeed, formatPrecipitation, formatDate } from '../utils';
import { getWeatherDescription, getWeatherIcon } from '../services/weather-api';

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

  const columnDefinitions = [
    {
      id: 'date',
      header: 'Date',
      cell: (item: DailyForecastItem) => <Box fontWeight="bold">{formatDate(item.date)}</Box>,
      sortingField: 'date',
      isRowHeader: true,
    },
    {
      id: 'weather',
      header: 'Weather',
      cell: (item: DailyForecastItem) => (
        <SpaceBetween direction="horizontal" size="xs" alignItems="center">
          <Icon name={getWeatherIcon(item.weatherCode, true)} />
          <Box>{getWeatherDescription(item.weatherCode, true)}</Box>
        </SpaceBetween>
      ),
    },
    {
      id: 'temperature',
      header: 'Temperature',
      cell: (item: DailyForecastItem) => (
        <SpaceBetween direction="horizontal" size="xs">
          <Box fontWeight="bold">{formatTemperature(item.maxTemp)}</Box>
          <Box color="text-body-secondary">/</Box>
          <Box color="text-body-secondary">{formatTemperature(item.minTemp)}</Box>
        </SpaceBetween>
      ),
      sortingField: 'maxTemp',
    },
    {
      id: 'precipitation',
      header: 'Precipitation',
      cell: (item: DailyForecastItem) => formatPrecipitation(item.precipitation),
      sortingField: 'precipitation',
    },
    {
      id: 'wind',
      header: 'Max Wind Speed',
      cell: (item: DailyForecastItem) => formatWindSpeed(item.windSpeed),
      sortingField: 'windSpeed',
    },
  ];

  return (
    <Container
      header={
        <Header variant="h2" counter={`(${dailyData.length})`} description="7-day weather forecast">
          Daily Forecast
        </Header>
      }
    >
      <Table
        columnDefinitions={columnDefinitions}
        items={dailyData}
        trackBy="date"
        ariaLabels={{
          itemSelectionLabel: (data, row) => `Select forecast for ${formatDate(row.date)}`,
          allItemsSelectionLabel: () => 'Select all forecasts',
          selectionGroupLabel: 'Daily forecast selection',
        }}
        empty={
          <Box textAlign="center" color="inherit" margin={{ top: 'xxl', bottom: 'xxl' }}>
            <Box variant="h3" padding={{ bottom: 'xs' }}>
              No forecast data available
            </Box>
            <Box variant="p">Daily forecast data could not be loaded</Box>
          </Box>
        }
        loading={false}
        loadingText="Loading daily forecast..."
        variant="embedded"
      />
    </Container>
  );
}
