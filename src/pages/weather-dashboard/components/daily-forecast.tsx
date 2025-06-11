// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { WeatherData, DailyForecast } from '../types';
import { getWeatherDescription, getWeatherIcon, formatTemperature, formatWindSpeed } from '../api';

interface DailyForecastProps {
  data: WeatherData;
  useFahrenheit: boolean;
}

export function DailyForecastWidget({ data, useFahrenheit }: DailyForecastProps) {
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
      weekday: 'short',
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
        <SpaceBetween direction="vertical" size="xxs">
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
      <Box>
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '16px',
            paddingBottom: '8px',
            minHeight: '280px',
          }}
        >
          {dailyForecasts.map((forecast, index) => (
            <div
              key={index}
              style={{
                minWidth: '200px',
                maxWidth: '200px',
                border: '1px solid #e9ebed',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <SpaceBetween size="s" direction="vertical" alignItems="center">
                <Box variant="h4" fontWeight="bold">
                  {formatDate(forecast.date)}
                </Box>

                <Box fontSize="display-l" textAlign="center">
                  {getWeatherIcon(forecast.weatherCode)}
                </Box>

                <Box variant="small" color="text-body-secondary" textAlign="center">
                  {getWeatherDescription(forecast.weatherCode)}
                </Box>

                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                  <Box fontWeight="bold" fontSize="heading-m">
                    {formatTemperature(forecast.temperatureMax, daily_units.temperature_2m_max, useFahrenheit)}
                  </Box>
                  <Box color="text-body-secondary" fontSize="body-m">
                    {formatTemperature(forecast.temperatureMin, daily_units.temperature_2m_min, useFahrenheit)}
                  </Box>
                </SpaceBetween>

                <Box textAlign="center">
                  {getPrecipitationInfo(forecast.precipitationSum, forecast.precipitationProbability)}
                </Box>

                <Box variant="small" color="text-body-secondary" textAlign="center">
                  💨 {formatWindSpeed(forecast.windSpeed, daily_units.wind_speed_10m_max)}
                </Box>

                <SpaceBetween direction="vertical" size="xxs" alignItems="center">
                  <Box variant="small">🌅 {formatTime(forecast.sunrise)}</Box>
                  <Box variant="small">🌇 {formatTime(forecast.sunset)}</Box>
                </SpaceBetween>
              </SpaceBetween>
            </div>
          ))}
        </div>
      </Box>
    </Container>
  );
}
