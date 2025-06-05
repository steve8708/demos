// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';
import Icon from '@cloudscape-design/components/icon';
import Box from '@cloudscape-design/components/box';
import { DailyWeather, WEATHER_CODE_DESCRIPTIONS } from '../types';

interface WeatherForecastCardProps {
  dailyWeather: DailyWeather;
}

interface ForecastDay {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
}

export function WeatherForecastCard({ dailyWeather }: WeatherForecastCardProps) {
  const forecastDays: ForecastDay[] = dailyWeather.time.map((date, index) => {
    const dateObj = new Date(date);
    return {
      date,
      dayName: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
      maxTemp: Math.round(dailyWeather.temperature_2m_max[index]),
      minTemp: Math.round(dailyWeather.temperature_2m_min[index]),
      precipitation: Math.round(dailyWeather.precipitation_sum[index] * 10) / 10,
      windSpeed: Math.round(dailyWeather.wind_speed_10m_max[index]),
      weatherCode: dailyWeather.weathercode[index],
    };
  });

  const columnDefinitions = [
    {
      id: 'day',
      header: 'Day',
      cell: (item: ForecastDay) => (
        <Box>
          <Box fontWeight="bold">{item.dayName}</Box>
          <Box fontSize="body-s" color="text-body-secondary">
            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Box>
        </Box>
      ),
      sortingField: 'date',
      width: 120,
    },
    {
      id: 'conditions',
      header: 'Conditions',
      cell: (item: ForecastDay) => {
        const weatherInfo = WEATHER_CODE_DESCRIPTIONS[item.weatherCode] || {
          description: 'Unknown',
          icon: 'help',
        };
        return (
          <Box>
            <Icon name={weatherInfo.icon as any} size="normal" />
            <Box display="inline" margin={{ left: 'xs' }}>
              {weatherInfo.description}
            </Box>
          </Box>
        );
      },
      width: 180,
    },
    {
      id: 'temperature',
      header: 'Temperature',
      cell: (item: ForecastDay) => (
        <Box>
          <Box display="inline" fontWeight="bold" color="text-status-error">
            {item.maxTemp}°
          </Box>
          <Box display="inline" margin={{ horizontal: 'xs' }} color="text-body-secondary">
            /
          </Box>
          <Box display="inline" color="text-status-info">
            {item.minTemp}°
          </Box>
        </Box>
      ),
      sortingField: 'maxTemp',
      width: 100,
    },
    {
      id: 'precipitation',
      header: 'Precipitation',
      cell: (item: ForecastDay) => (
        <Box>
          {item.precipitation > 0 ? (
            <Badge color={item.precipitation > 5 ? 'red' : item.precipitation > 1 ? 'blue' : 'grey'}>
              {item.precipitation} mm
            </Badge>
          ) : (
            <Box color="text-body-secondary">No rain</Box>
          )}
        </Box>
      ),
      sortingField: 'precipitation',
      width: 120,
    },
    {
      id: 'wind',
      header: 'Max Wind',
      cell: (item: ForecastDay) => `${item.windSpeed} km/h`,
      sortingField: 'windSpeed',
      width: 100,
    },
  ];

  return (
    <Container
      header={
        <Header variant="h2" description="7-day weather forecast">
          Weather Forecast
        </Header>
      }
    >
      <Table
        columnDefinitions={columnDefinitions}
        items={forecastDays}
        loadingText="Loading forecast"
        sortingDisabled={false}
        empty={
          <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
              No forecast data available
            </Box>
          </Box>
        }
        trackBy="date"
        variant="borderless"
      />
    </Container>
  );
}
