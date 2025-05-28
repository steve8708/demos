// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import Icon from '@cloudscape-design/components/icon';
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

  return (
    <Container
      header={
        <Header variant="h2" description="7-day weather forecast with high and low temperatures">
          7-Day Forecast
        </Header>
      }
    >
      <Cards
        cardDefinition={{
          header: (item: DailyItem) => (
            <Box variant="h3" fontWeight="bold">
              {formatDate(item.date)}
            </Box>
          ),
          sections: [
            {
              id: 'weather',
              content: (item: DailyItem) => {
                const weather = getWeatherDescription(item.weatherCode);
                return (
                  <SpaceBetween size="xs">
                    <Badge color="blue">
                      <Icon name={weather.icon} /> {weather.description}
                    </Badge>
                  </SpaceBetween>
                );
              },
            },
            {
              id: 'temperature',
              content: (item: DailyItem) => (
                <SpaceBetween direction="horizontal" size="xs">
                  <Box variant="span">
                    <Box variant="small" color="text-status-inactive">
                      High:{' '}
                    </Box>
                    <Box variant="span" color="text-status-success" fontWeight="bold">
                      {item.temperatureMax}°C
                    </Box>
                  </Box>
                  <Box variant="span">
                    <Box variant="small" color="text-status-inactive">
                      Low:{' '}
                    </Box>
                    <Box variant="span" color="text-body-secondary" fontWeight="bold">
                      {item.temperatureMin}°C
                    </Box>
                  </Box>
                </SpaceBetween>
              ),
            },
            {
              id: 'wind',
              content: (item: DailyItem) => (
                <Box variant="small">
                  <Icon name="arrow-right" /> Wind: {item.windSpeed} km/h
                </Box>
              ),
            },
          ],
        }}
        cardsPerRow={[
          { cards: 1, minWidth: 0 },
          { cards: 2, minWidth: 600 },
          { cards: 3, minWidth: 900 },
          { cards: 4, minWidth: 1200 },
        ]}
        items={dailyItems}
        loadingText="Loading forecast"
        trackBy="date"
        empty={
          <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
              No forecast data available
            </Box>
            <Box variant="p" padding={{ bottom: 's' }} color="inherit">
              Unable to load daily forecast data.
            </Box>
          </Box>
        }
      />
    </Container>
  );
}
