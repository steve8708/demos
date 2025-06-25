// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';

import { WeatherResponse } from '../types';
import { getWeatherDescription, getWeatherIcon, formatTemperature, formatWindDirection } from '../api';

interface WeatherForecastProps {
  weatherData: WeatherResponse;
}

export function WeatherForecast({ weatherData }: WeatherForecastProps) {
  const { daily, daily_units } = weatherData;

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
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <Container header={<Header variant="h2">7-Day Forecast</Header>}>
      <ColumnLayout columns={7} variant="text-grid">
        {daily.time.map((date, index) => {
          const weatherIcon = getWeatherIcon(daily.weather_code[index], true);
          const weatherDescription = getWeatherDescription(daily.weather_code[index]);

          return (
            <Box key={date} textAlign="center" padding={{ vertical: 'm' }}>
              <Box variant="h4" margin={{ bottom: 's' }}>
                {formatDate(date)}
              </Box>

              <Box fontSize="display-l" margin={{ bottom: 's' }}>
                {weatherIcon}
              </Box>

              <Box variant="small" color="text-body-secondary" margin={{ bottom: 's' }}>
                {weatherDescription}
              </Box>

              <Box margin={{ bottom: 's' }}>
                <Box variant="span" fontWeight="bold">
                  {formatTemperature(daily.temperature_2m_max[index], daily_units.temperature_2m_max)}
                </Box>
                <Box variant="span" color="text-body-secondary" margin={{ left: 'xxs' }}>
                  / {formatTemperature(daily.temperature_2m_min[index], daily_units.temperature_2m_min)}
                </Box>
              </Box>

              <Box variant="small" color="text-body-secondary" margin={{ bottom: 'xs' }}>
                <div>
                  💧 {daily.precipitation_sum[index]}
                  {daily_units.precipitation_sum}
                </div>
                <div>
                  💨 {daily.wind_speed_10m_max[index]}
                  {daily_units.wind_speed_10m_max}
                </div>
                <div>☀️ UV {daily.uv_index_max[index]}</div>
              </Box>

              <Box variant="small" color="text-body-secondary">
                <div>🌅 {formatTime(daily.sunrise[index])}</div>
                <div>🌅 {formatTime(daily.sunset[index])}</div>
              </Box>
            </Box>
          );
        })}
      </ColumnLayout>
    </Container>
  );
}
