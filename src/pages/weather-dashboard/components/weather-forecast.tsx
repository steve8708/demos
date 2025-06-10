// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';
import { format, parseISO } from 'date-fns';

import { DailyWeather, weatherCodes } from '../types';

interface WeatherForecastProps {
  forecast: DailyWeather;
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;
  const formatPrecipitation = (precipitation: number) => `${precipitation} mm`;

  const forecastDays = forecast.time.slice(0, 7).map((date, index) => {
    const weatherInfo = weatherCodes[forecast.weathercode[index]] || { description: 'Unknown', icon: 'cloud' };
    const parsedDate = parseISO(date);

    return {
      date: parsedDate,
      dayName: format(parsedDate, 'EEEE'),
      shortDate: format(parsedDate, 'MMM dd'),
      maxTemp: forecast.temperature_2m_max[index],
      minTemp: forecast.temperature_2m_min[index],
      precipitation: forecast.precipitation_sum[index],
      weatherCode: forecast.weathercode[index],
      weatherInfo,
    };
  });

  return (
    <Container
      header={
        <Header variant="h2" description="7-day weather forecast">
          Weather Forecast
        </Header>
      }
    >
      <ColumnLayout columns={{ default: 1, s: 2, m: 3, l: 4 }}>
        {forecastDays.map((day, index) => (
          <Container key={index} variant="embedded">
            <SpaceBetween size="s">
              <Box>
                <Box variant="h4">{day.dayName}</Box>
                <Box variant="small" color="text-body-secondary">
                  {day.shortDate}
                </Box>
              </Box>

              <Box textAlign="center">
                <Icon name={day.weatherInfo.icon as any} size="large" />
                <Box variant="small" margin={{ top: 'xs' }}>
                  {day.weatherInfo.description}
                </Box>
              </Box>

              <ColumnLayout columns={1}>
                <Box>
                  <Box variant="awsui-key-label">High</Box>
                  <Box variant="span" fontWeight="bold" color="text-status-success">
                    {formatTemperature(day.maxTemp)}
                  </Box>
                </Box>
                <Box>
                  <Box variant="awsui-key-label">Low</Box>
                  <Box variant="span" color="text-body-secondary">
                    {formatTemperature(day.minTemp)}
                  </Box>
                </Box>
                <Box>
                  <Box variant="awsui-key-label">Precipitation</Box>
                  <Box variant="span">{formatPrecipitation(day.precipitation)}</Box>
                </Box>
              </ColumnLayout>
            </SpaceBetween>
          </Container>
        ))}
      </ColumnLayout>
    </Container>
  );
}
