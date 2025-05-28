// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import Icon from '@cloudscape-design/components/icon';

import { WeatherData, getWeatherDescription } from '../weather-api';

interface HourlyForecastProps {
  weatherData: WeatherData;
}

interface HourlyItem {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

export function HourlyForecast({ weatherData }: HourlyForecastProps) {
  const { hourly } = weatherData;

  const hourlyItems: HourlyItem[] = hourly.time.map((time, index) => ({
    time,
    temperature: hourly.temperature[index],
    humidity: hourly.humidity[index],
    windSpeed: hourly.windSpeed[index],
    weatherCode: hourly.weatherCode[index],
  }));

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  return (
    <Container
      header={
        <Header variant="h2" description="Detailed hourly weather forecast for the next 24 hours">
          24-Hour Forecast
        </Header>
      }
    >
      <Table
        columnDefinitions={[
          {
            id: 'time',
            header: 'Time',
            cell: (item: HourlyItem) => (
              <Box variant="span" fontWeight="bold">
                {formatTime(item.time)}
              </Box>
            ),
            width: 120,
          },
          {
            id: 'weather',
            header: 'Conditions',
            cell: (item: HourlyItem) => {
              const weather = getWeatherDescription(item.weatherCode);
              return (
                <Badge color="blue">
                  <Icon name={weather.icon} /> {weather.description}
                </Badge>
              );
            },
            width: 200,
          },
          {
            id: 'temperature',
            header: 'Temperature',
            cell: (item: HourlyItem) => (
              <Box variant="span" color="text-status-success" fontWeight="bold">
                {item.temperature}°C
              </Box>
            ),
            width: 100,
          },
          {
            id: 'humidity',
            header: 'Humidity',
            cell: (item: HourlyItem) => `${item.humidity}%`,
            width: 100,
          },
          {
            id: 'windSpeed',
            header: 'Wind Speed',
            cell: (item: HourlyItem) => `${item.windSpeed} km/h`,
            width: 120,
          },
        ]}
        items={hourlyItems}
        loadingText="Loading forecast"
        trackBy="time"
        empty={
          <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
              No forecast data available
            </Box>
            <Box variant="p" padding={{ bottom: 's' }} color="inherit">
              Unable to load hourly forecast data.
            </Box>
          </Box>
        }
        variant="embedded"
      />
    </Container>
  );
}
