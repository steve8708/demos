// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import Icon from '@cloudscape-design/components/icon';
import Table from '@cloudscape-design/components/table';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';

import { HourlyWeather, WEATHER_CODES } from '../../types';
import { WeatherService } from '../../weather-service';

interface HourlyForecastWidgetProps {
  hourlyData: HourlyWeather | null;
  loading: boolean;
}

export function HourlyForecastWidget({ hourlyData, loading }: HourlyForecastWidgetProps) {
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <Container header={<Header variant="h2">Hourly Forecast</Header>}>
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            Loading hourly forecast...
          </Box>
        </Box>
      </Container>
    );
  }

  if (!hourlyData || !hourlyData.time || hourlyData.time.length === 0) {
    return (
      <Container header={<Header variant="h2">Hourly Forecast</Header>}>
        <Box textAlign="center" padding="xl">
          <Icon name="status-warning" size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            Hourly forecast unavailable
          </Box>
        </Box>
      </Container>
    );
  }

  // Show next 24 hours by default, or all if showAll is true
  const hoursToShow = showAll ? hourlyData.time.length : Math.min(24, hourlyData.time.length);
  const currentTime = new Date();

  const hourlyItems = hourlyData.time.slice(0, hoursToShow).map((timeString, index) => {
    const time = new Date(timeString);
    const isCurrentHour = Math.abs(time.getTime() - currentTime.getTime()) < 60 * 60 * 1000; // Within 1 hour
    const weatherCode = hourlyData.weathercode[index];
    const weatherInfo = WEATHER_CODES[weatherCode] || { description: 'Unknown' };

    return {
      time: timeString,
      hour: WeatherService.formatTime(timeString),
      date: WeatherService.formatDate(timeString),
      temperature: hourlyData.temperature_2m[index],
      humidity: hourlyData.relative_humidity_2m[index],
      precipitation: hourlyData.precipitation[index],
      windSpeed: hourlyData.windspeed_10m[index],
      weatherCode,
      description: weatherInfo.description,
      isCurrentHour,
    };
  });

  const columnDefinitions = [
    {
      id: 'time',
      header: 'Time',
      cell: (item: (typeof hourlyItems)[0]) => (
        <SpaceBetween size="xs">
          <Box variant={item.isCurrentHour ? 'strong' : 'span'}>{item.hour}</Box>
          <Box variant="small" color="text-body-secondary">
            {item.date}
          </Box>
        </SpaceBetween>
      ),
      sortingField: 'time',
      width: 120,
    },
    {
      id: 'temperature',
      header: 'Temperature',
      cell: (item: (typeof hourlyItems)[0]) => (
        <Box variant={item.isCurrentHour ? 'strong' : 'span'}>{WeatherService.formatTemperature(item.temperature)}</Box>
      ),
      sortingField: 'temperature',
      width: 120,
    },
    {
      id: 'weather',
      header: 'Conditions',
      cell: (item: (typeof hourlyItems)[0]) => (
        <SpaceBetween size="xs">
          <Box variant="small">{item.description}</Box>
          <Box variant="small" color="text-body-secondary">
            Code: {item.weatherCode}
          </Box>
        </SpaceBetween>
      ),
      width: 140,
    },
    {
      id: 'humidity',
      header: 'Humidity',
      cell: (item: (typeof hourlyItems)[0]) => `${Math.round(item.humidity)}%`,
      sortingField: 'humidity',
      width: 100,
    },
    {
      id: 'precipitation',
      header: 'Rain',
      cell: (item: (typeof hourlyItems)[0]) => `${item.precipitation.toFixed(1)} mm`,
      sortingField: 'precipitation',
      width: 100,
    },
    {
      id: 'wind',
      header: 'Wind',
      cell: (item: (typeof hourlyItems)[0]) => WeatherService.formatWindSpeed(item.windSpeed),
      sortingField: 'windSpeed',
      width: 100,
    },
  ];

  return (
    <Container
      header={
        <Header
          variant="h2"
          description={`Hourly weather forecast - showing ${hoursToShow} hours`}
          actions={
            <Button variant="normal" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show 24h' : 'Show All'}
            </Button>
          }
        >
          Hourly Forecast
        </Header>
      }
    >
      <Table
        columnDefinitions={columnDefinitions}
        items={hourlyItems}
        loadingText="Loading forecast"
        trackBy="time"
        variant="borderless"
        stripedRows
        resizableColumns
        sortingDisabled
        empty={
          <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
              No hourly data available
            </Box>
          </Box>
        }
      />
    </Container>
  );
}
