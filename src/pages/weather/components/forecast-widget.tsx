// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Table from '@cloudscape-design/components/table';

import { DailyWeather, HourlyWeather, WEATHER_CONDITIONS } from '../types';

interface ForecastWidgetProps {
  dailyForecast: DailyWeather[];
  hourlyForecast: HourlyWeather[];
}

export function ForecastWidget({ dailyForecast, hourlyForecast }: ForecastWidgetProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  const getWindDirection = (degrees: number): string => {
    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const dailyColumns = [
    {
      id: 'date',
      header: 'Date',
      cell: (item: DailyWeather) => formatDate(item.date),
    },
    {
      id: 'condition',
      header: 'Condition',
      cell: (item: DailyWeather) => {
        const condition = WEATHER_CONDITIONS[item.weatherCode] || { description: 'Unknown', icon: 'status-info' };
        return <StatusIndicator type={condition.icon as any}>{condition.description}</StatusIndicator>;
      },
    },
    {
      id: 'temperature',
      header: 'Temperature',
      cell: (item: DailyWeather) => (
        <div>
          <Box variant="strong">{item.maxTemperature}°</Box> / {item.minTemperature}°
        </div>
      ),
    },
    {
      id: 'precipitation',
      header: 'Precipitation',
      cell: (item: DailyWeather) => `${item.precipitation} mm`,
    },
    {
      id: 'wind',
      header: 'Wind',
      cell: (item: DailyWeather) => `${item.windSpeed} km/h ${getWindDirection(item.windDirection)}`,
    },
    {
      id: 'uv',
      header: 'UV Index',
      cell: (item: DailyWeather) => Math.round(item.uvIndex * 10) / 10,
    },
  ];

  const hourlyColumns = [
    {
      id: 'time',
      header: 'Time',
      cell: (item: HourlyWeather) => formatTime(item.time),
    },
    {
      id: 'condition',
      header: 'Condition',
      cell: (item: HourlyWeather) => {
        const condition = WEATHER_CONDITIONS[item.weatherCode] || { description: 'Unknown', icon: 'status-info' };
        return <StatusIndicator type={condition.icon as any}>{condition.description}</StatusIndicator>;
      },
    },
    {
      id: 'temperature',
      header: 'Temperature',
      cell: (item: HourlyWeather) => `${item.temperature}°C`,
    },
    {
      id: 'precipitation',
      header: 'Precipitation',
      cell: (item: HourlyWeather) => `${item.precipitation} mm`,
    },
    {
      id: 'wind',
      header: 'Wind Speed',
      cell: (item: HourlyWeather) => `${item.windSpeed} km/h`,
    },
    {
      id: 'humidity',
      header: 'Humidity',
      cell: (item: HourlyWeather) => `${item.humidity}%`,
    },
  ];

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h2" description="7-day weather outlook">
            Daily Forecast
          </Header>
        }
      >
        <Table
          columnDefinitions={dailyColumns}
          items={dailyForecast}
          loadingText="Loading forecast..."
          trackBy="date"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No forecast data available</b>
              <Box variant="p" color="inherit">
                Unable to load daily forecast.
              </Box>
            </Box>
          }
        />
      </Container>

      <Container
        header={
          <Header variant="h2" description="Next 24 hours">
            Hourly Forecast
          </Header>
        }
      >
        <Table
          columnDefinitions={hourlyColumns}
          items={hourlyForecast}
          loadingText="Loading forecast..."
          trackBy="time"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No hourly data available</b>
              <Box variant="p" color="inherit">
                Unable to load hourly forecast.
              </Box>
            </Box>
          }
        />
      </Container>
    </SpaceBetween>
  );
}
