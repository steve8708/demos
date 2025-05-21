// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Cards from '@cloudscape-design/components/cards';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { DailyForecast, WEATHER_CODES } from '../types';
import { formatDate, formatTemperature } from '../api';

interface ForecastProps {
  dailyForecast: DailyForecast;
}

export function Forecast({ dailyForecast }: ForecastProps) {
  // Skip today (index 0) as it's already shown in current weather
  const forecastDays = dailyForecast.time.slice(1, 6);

  const items = forecastDays.map((date, index) => {
    const forecastIndex = index + 1; // +1 because we skipped today
    const weatherCode = WEATHER_CODES[dailyForecast.weathercode[forecastIndex]] || WEATHER_CODES[0];
    const maxTemp = dailyForecast.temperature_2m_max[forecastIndex];
    const minTemp = dailyForecast.temperature_2m_min[forecastIndex];
    const precipProb = dailyForecast.precipitation_probability_max[forecastIndex];
    const precipSum = dailyForecast.precipitation_sum[forecastIndex];

    return {
      date,
      dayOfWeek: formatDate(date),
      weatherCode,
      maxTemp,
      minTemp,
      precipProb,
      precipSum,
    };
  });

  return (
    <Container
      header={
        <Header variant="h2" description="5-day forecast">
          Weather Forecast
        </Header>
      }
    >
      <Cards
        items={items}
        cardDefinition={{
          header: item => <Box variant="h3">{item.dayOfWeek}</Box>,
          sections: [
            {
              id: 'weather',
              content: item => (
                <SpaceBetween size="xs">
                  <Box textAlign="center" fontSize="display-l">
                    <Icon name={item.weatherCode.icon} size="big" />
                  </Box>
                  <Box textAlign="center">{item.weatherCode.description}</Box>
                </SpaceBetween>
              ),
            },
            {
              id: 'temperature',
              header: 'Temperature',
              content: item => (
                <SpaceBetween size="xs">
                  <Box>High: {formatTemperature(item.maxTemp)}</Box>
                  <Box>Low: {formatTemperature(item.minTemp)}</Box>
                </SpaceBetween>
              ),
            },
            {
              id: 'precipitation',
              header: 'Precipitation',
              content: item => (
                <SpaceBetween size="xs">
                  <Box>Chance: {item.precipProb}%</Box>
                  <Box>Amount: {item.precipSum} mm</Box>
                </SpaceBetween>
              ),
            },
          ],
        }}
        cardsPerRow={[
          { cards: 1, minWidth: 0 },
          { cards: 2, minWidth: 400 },
          { cards: 5, minWidth: 800 },
        ]}
      />
    </Container>
  );
}
