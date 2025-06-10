// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import Icon from '@cloudscape-design/components/icon';
import Grid from '@cloudscape-design/components/grid';

import { DailyWeather, WEATHER_CODES } from '../../types';
import { WeatherService } from '../../weather-service';

interface DailyForecastWidgetProps {
  dailyData: DailyWeather | null;
  loading: boolean;
}

export function DailyForecastWidget({ dailyData, loading }: DailyForecastWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            Loading forecast...
          </Box>
        </Box>
      </Container>
    );
  }

  if (!dailyData || !dailyData.time || dailyData.time.length === 0) {
    return (
      <Container header={<Header variant="h2">7-Day Forecast</Header>}>
        <Box textAlign="center" padding="xl">
          <Icon name="status-warning" size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            Forecast data unavailable
          </Box>
        </Box>
      </Container>
    );
  }

  const forecastDays = dailyData.time.slice(0, 7).map((date, index) => {
    const weatherCode = dailyData.weathercode[index];
    const weatherInfo = WEATHER_CODES[weatherCode] || { description: 'Unknown', icon: 'status-info' };

    return {
      date,
      maxTemp: dailyData.temperature_2m_max[index],
      minTemp: dailyData.temperature_2m_min[index],
      precipitation: dailyData.precipitation_sum[index],
      windSpeed: dailyData.windspeed_10m_max[index],
      weatherCode,
      description: weatherInfo.description,
    };
  });

  return (
    <Container
      header={
        <Header variant="h2" description="Daily weather forecast for the next 7 days">
          7-Day Forecast
        </Header>
      }
    >
      <SpaceBetween size="s">
        {forecastDays.map((day, index) => (
          <div
            key={day.date}
            style={{
              padding: '12px 16px',
              border: '1px solid var(--color-border-divider-default)',
              borderRadius: '8px',
              backgroundColor: index === 0 ? 'var(--color-background-container-content)' : 'transparent',
            }}
          >
            <Grid
              gridDefinition={[
                { colspan: { default: 3, s: 6 } },
                { colspan: { default: 3, s: 6 } },
                { colspan: { default: 2, s: 4 } },
                { colspan: { default: 2, s: 4 } },
                { colspan: { default: 2, s: 4 } },
              ]}
            >
              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">{index === 0 ? 'Today' : WeatherService.formatDate(day.date)}</Box>
                <Box variant="small" color="text-body-secondary">
                  {day.description}
                </Box>
              </SpaceBetween>

              <SpaceBetween size="xs" direction="horizontal">
                <SpaceBetween size="xxs">
                  <Box variant="awsui-key-label">High</Box>
                  <Box variant="h4">{WeatherService.formatTemperature(day.maxTemp)}</Box>
                </SpaceBetween>
                <SpaceBetween size="xxs">
                  <Box variant="awsui-key-label">Low</Box>
                  <Box variant="h4" color="text-body-secondary">
                    {WeatherService.formatTemperature(day.minTemp)}
                  </Box>
                </SpaceBetween>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Precipitation</Box>
                <Box variant="small">{day.precipitation?.toFixed(1) || '0.0'} mm</Box>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Wind</Box>
                <Box variant="small">{WeatherService.formatWindSpeed(day.windSpeed)}</Box>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="awsui-key-label">Code</Box>
                <Box variant="small" color="text-body-secondary">
                  {day.weatherCode}
                </Box>
              </SpaceBetween>
            </Grid>
          </div>
        ))}
      </SpaceBetween>
    </Container>
  );
}
