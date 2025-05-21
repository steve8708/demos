// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Cards from '@cloudscape-design/components/cards';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { DailyWeather, formatDate, formatTime, getWeatherInfo } from '../api';

interface DailyForecastProps {
  dailyWeather?: DailyWeather;
  isLoading: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  precipitationUnit: 'mm' | 'inch';
}

interface DailyForecastItem {
  date: string;
  weathercode: number;
  temperature_max: number;
  temperature_min: number;
  sunrise: string;
  sunset: string;
  precipitation_sum?: number;
  precipitation_probability?: number;
}

export function DailyForecast({ dailyWeather, isLoading, temperatureUnit, precipitationUnit }: DailyForecastProps) {
  if (isLoading) {
    return (
      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
          <StatusIndicator type="loading">Loading forecast data</StatusIndicator>
        </Box>
      </Container>
    );
  }

  if (!dailyWeather) {
    return (
      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
          <Box variant="p">No forecast data available. Please select a location.</Box>
        </Box>
      </Container>
    );
  }

  const forecastItems: DailyForecastItem[] = dailyWeather.time.map((date, index) => ({
    date,
    weathercode: dailyWeather.weathercode[index],
    temperature_max: dailyWeather.temperature_2m_max[index],
    temperature_min: dailyWeather.temperature_2m_min[index],
    sunrise: dailyWeather.sunrise[index],
    sunset: dailyWeather.sunset[index],
    precipitation_sum: dailyWeather.precipitation_sum?.[index],
    precipitation_probability: dailyWeather.precipitation_probability_max?.[index],
  }));

  const tempUnit = temperatureUnit === 'celsius' ? '°C' : '°F';
  const precipUnit = precipitationUnit === 'mm' ? 'mm' : 'in';

  return (
    <Container header={<Header variant="h2">7-Day Forecast</Header>}>
      <Cards
        cardDefinition={{
          header: item => <Box variant="h3">{formatDate(item.date)}</Box>,
          sections: [
            {
              id: 'weather',
              content: item => {
                const weatherInfo = getWeatherInfo(item.weathercode);
                return (
                  <SpaceBetween size="s">
                    <Box textAlign="center">
                      <Icon
                        name={weatherInfo.icon as 'sun' | 'cloud' | 'rain' | 'snow' | 'lightning' | 'question'}
                        size="large"
                      />
                      <Box variant="p">{weatherInfo.label}</Box>
                    </Box>
                    <Box textAlign="center">
                      <Box variant="h3">
                        {item.temperature_max}
                        {tempUnit} / {item.temperature_min}
                        {tempUnit}
                      </Box>
                      <Box variant="small">High / Low</Box>
                    </Box>
                  </SpaceBetween>
                );
              },
            },
            {
              id: 'details',
              header: 'Details',
              content: item => (
                <SpaceBetween size="s">
                  <div>
                    <Box variant="awsui-key-label">Sunrise / Sunset</Box>
                    <Box variant="p">
                      {formatTime(item.sunrise)} / {formatTime(item.sunset)}
                    </Box>
                  </div>
                  {item.precipitation_sum !== undefined && (
                    <div>
                      <Box variant="awsui-key-label">Precipitation</Box>
                      <Box variant="p">
                        {item.precipitation_sum} {precipUnit}
                      </Box>
                    </div>
                  )}
                  {item.precipitation_probability !== undefined && (
                    <div>
                      <Box variant="awsui-key-label">Chance of Precipitation</Box>
                      <Box variant="p">{item.precipitation_probability}%</Box>
                    </div>
                  )}
                </SpaceBetween>
              ),
            },
          ],
        }}
        cardsPerRow={[
          { cards: 1, minWidth: 0 },
          { cards: 2, minWidth: 400 },
          { cards: 3, minWidth: 600 },
          { cards: 4, minWidth: 900 },
          { cards: 7, minWidth: 1200 },
        ]}
        items={forecastItems}
        loadingText="Loading forecast items"
        trackBy="date"
        visibleSections={['weather', 'details']}
        empty={
          <Box textAlign="center" color="inherit">
            <Box padding={{ bottom: 's' }} variant="p" color="inherit">
              <b>No forecast data</b>
            </Box>
            <Box variant="p" color="inherit">
              Select a location to view forecast data.
            </Box>
          </Box>
        }
      />
    </Container>
  );
}
