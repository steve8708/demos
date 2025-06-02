// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { ForecastData } from '../types';

interface WeatherForecastProps {
  forecast: ForecastData;
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  const forecastItems = forecast.time.map((date, index) => ({
    date,
    maxTemp: forecast.temperature_2m_max[index],
    minTemp: forecast.temperature_2m_min[index],
    weatherCode: forecast.weather_code[index],
    precipitation: forecast.precipitation_sum[index],
    windSpeed: forecast.wind_speed_10m_max[index],
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getWeatherDescription = (code: number) => {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail',
    };

    return weatherCodes[code] || `Weather code ${code}`;
  };

  return (
    <Table
      columnDefinitions={[
        {
          id: 'date',
          header: 'Date',
          cell: item => <Box variant="awsui-key-label">{formatDate(item.date)}</Box>,
        },
        {
          id: 'weather',
          header: 'Weather',
          cell: item => (
            <SpaceBetween size="xs">
              <Box>{getWeatherDescription(item.weatherCode)}</Box>
              <Box variant="small" color="text-status-inactive">
                Code: {item.weatherCode}
              </Box>
            </SpaceBetween>
          ),
        },
        {
          id: 'temperature',
          header: 'Temperature',
          cell: item => (
            <SpaceBetween size="xs">
              <Box>
                <strong>{item.maxTemp}°C</strong> / {item.minTemp}°C
              </Box>
              <Box variant="small" color="text-status-inactive">
                High / Low
              </Box>
            </SpaceBetween>
          ),
        },
        {
          id: 'precipitation',
          header: 'Precipitation',
          cell: item => `${item.precipitation} mm`,
        },
        {
          id: 'wind',
          header: 'Max Wind Speed',
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
  );
}
