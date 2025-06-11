// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import { WeatherData, HourlyForecast } from '../types';
import { getWeatherDescription, formatTemperature, formatWindSpeed, formatWindDirection, formatHumidity } from '../api';

interface HourlyForecastProps {
  data: WeatherData;
}

export function HourlyForecastWidget({ data }: HourlyForecastProps) {
  const { hourly, hourly_units } = data;

  // Transform data for the next 24 hours
  const hourlyForecasts: HourlyForecast[] = hourly.time.slice(0, 24).map((time, index) => ({
    time,
    temperature: hourly.temperature_2m[index],
    precipitation: hourly.precipitation[index],
    precipitationProbability: hourly.precipitation_probability[index],
    weatherCode: hourly.weather_code[index],
    windSpeed: hourly.wind_speed_10m[index],
    windDirection: hourly.wind_direction_10m[index],
    cloudCover: hourly.cloud_cover[index],
    humidity: hourly.relative_humidity_2m[index],
  }));

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPrecipitationBadge = (precipitation: number, probability: number) => {
    if (precipitation > 0) {
      return <Badge color="blue">{precipitation.toFixed(1)}mm</Badge>;
    }
    if (probability > 50) {
      return <Badge color="grey">{probability}%</Badge>;
    }
    return <Box color="text-body-secondary">—</Box>;
  };

  return (
    <Container
      header={
        <Header variant="h2" description="Hourly forecast for the next 24 hours">
          24-Hour Forecast
        </Header>
      }
    >
      <Table
        columnDefinitions={[
          {
            id: 'time',
            header: 'Time',
            cell: item => formatTime(item.time),
            minWidth: 80,
          },
          {
            id: 'temperature',
            header: 'Temperature',
            cell: item => formatTemperature(item.temperature, hourly_units.temperature_2m),
            minWidth: 100,
          },
          {
            id: 'weather',
            header: 'Weather',
            cell: item => getWeatherDescription(item.weatherCode),
            minWidth: 140,
          },
          {
            id: 'precipitation',
            header: 'Precipitation',
            cell: item => getPrecipitationBadge(item.precipitation, item.precipitationProbability),
            minWidth: 110,
          },
          {
            id: 'wind',
            header: 'Wind',
            cell: item =>
              `${formatWindSpeed(item.windSpeed, hourly_units.wind_speed_10m)} ${formatWindDirection(item.windDirection)}`,
            minWidth: 100,
          },
          {
            id: 'humidity',
            header: 'Humidity',
            cell: item => formatHumidity(item.humidity),
            minWidth: 90,
          },
          {
            id: 'cloudCover',
            header: 'Cloud Cover',
            cell: item => `${item.cloudCover}%`,
            minWidth: 100,
          },
        ]}
        items={hourlyForecasts}
        loadingText="Loading forecast..."
        sortingDisabled
        empty={
          <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
              No hourly data available
            </Box>
          </Box>
        }
        header={<Header>Next 24 hours</Header>}
      />
    </Container>
  );
}
