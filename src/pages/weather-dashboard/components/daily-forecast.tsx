// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import { WeatherData, WeatherService } from '../weather-api';

interface DailyForecastProps {
  weather: WeatherData;
}

export function DailyForecast({ weather }: DailyForecastProps) {
  const { daily } = weather;

  const forecastItems = daily.time.map((date, index) => ({
    date: new Date(date),
    maxTemp: Math.round(daily.temperature_2m_max[index]),
    minTemp: Math.round(daily.temperature_2m_min[index]),
    precipitation: Math.round(daily.precipitation_sum[index] * 10) / 10,
    windSpeed: Math.round(daily.wind_speed_10m_max[index]),
    weather: WeatherService.getWeatherDescription(daily.weather_code[index]),
    weatherCode: daily.weather_code[index],
  }));

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return 'red';
    if (temp >= 20) return 'green';
    if (temp >= 10) return 'blue';
    return 'grey';
  };

  const getPrecipitationBadge = (precipitation: number) => {
    if (precipitation === 0) return <Badge color="grey">No rain</Badge>;
    if (precipitation < 2) return <Badge color="blue">Light</Badge>;
    if (precipitation < 10) return <Badge color="green">Moderate</Badge>;
    return <Badge color="red">Heavy</Badge>;
  };

  return (
    <Container
      header={
        <Header variant="h2" description="7-day weather forecast">
          Daily Forecast
        </Header>
      }
    >
      <Table
        columnDefinitions={[
          {
            id: 'date',
            header: 'Date',
            cell: item => (
              <div>
                <Box variant="strong">{item.date.toLocaleDateString([], { weekday: 'short' })}</Box>
                <Box variant="small" color="text-body-secondary">
                  {item.date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </Box>
              </div>
            ),
            sortingField: 'date',
            isRowHeader: true,
          },
          {
            id: 'weather',
            header: 'Conditions',
            cell: item => <Box variant="span">{item.weather}</Box>,
          },
          {
            id: 'temperature',
            header: 'Temperature',
            cell: item => (
              <div>
                <Badge color={getTemperatureColor(item.maxTemp)}>{item.maxTemp}°C</Badge>
                {' / '}
                <Badge color={getTemperatureColor(item.minTemp)}>{item.minTemp}°C</Badge>
              </div>
            ),
          },
          {
            id: 'precipitation',
            header: 'Precipitation',
            cell: item => (
              <div>
                {getPrecipitationBadge(item.precipitation)}
                <Box variant="small" color="text-body-secondary">
                  {item.precipitation} mm
                </Box>
              </div>
            ),
          },
          {
            id: 'wind',
            header: 'Max Wind',
            cell: item => `${item.windSpeed} km/h`,
          },
        ]}
        items={forecastItems}
        loadingText="Loading forecast"
        trackBy="date"
        empty={
          <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
              No forecast data available
            </Box>
          </Box>
        }
        variant="borderless"
      />
    </Container>
  );
}
