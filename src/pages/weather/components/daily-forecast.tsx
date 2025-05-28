// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WeatherData, getWeatherDescription } from '../weather-api';

interface DailyForecastProps {
  weatherData: WeatherData;
}

interface DailyItem {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  windSpeed: number;
}

export function DailyForecast({ weatherData }: DailyForecastProps) {
  const { daily } = weatherData;

  const dailyItems: DailyItem[] = daily.time.map((date, index) => ({
    date,
    temperatureMax: daily.temperatureMax[index],
    temperatureMin: daily.temperatureMin[index],
    weatherCode: daily.weatherCode[index],
    windSpeed: daily.windSpeed[index],
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
  };

  return (
    <Container
      header={
        <Header variant="h2" description="7-day weather forecast with high and low temperatures">
          7-Day Forecast
        </Header>
      }
    >
      <div className="daily-forecast-scroll">
        {dailyItems.map((item, index) => {
          const weather = getWeatherDescription(item.weatherCode);
          return (
            <div key={item.date} className="daily-forecast-card">
              <SpaceBetween size="xs" alignItems="center">
                <Box variant="span" fontSize="body-s" fontWeight="bold" textAlign="center">
                  {formatShortDate(item.date)}
                </Box>

                <div className="weather-emoji" title={weather.description}>
                  {weather.emoji}
                </div>

                <SpaceBetween size="xxs" alignItems="center">
                  <Box variant="span" color="text-status-success" fontWeight="bold" textAlign="center">
                    {item.temperatureMax}°
                  </Box>
                  <Box variant="span" color="text-body-secondary" fontSize="body-s" textAlign="center">
                    {item.temperatureMin}°
                  </Box>
                </SpaceBetween>

                <Box variant="span" fontSize="body-s" color="text-status-inactive" textAlign="center">
                  {item.windSpeed} km/h
                </Box>
              </SpaceBetween>
            </div>
          );
        })}
      </div>

      {dailyItems.length === 0 && (
        <Box textAlign="center" color="inherit" padding="l">
          <Box variant="strong" textAlign="center" color="inherit">
            No forecast data available
          </Box>
          <Box variant="p" padding={{ bottom: 's' }} color="inherit">
            Unable to load daily forecast data.
          </Box>
        </Box>
      )}
    </Container>
  );
}
