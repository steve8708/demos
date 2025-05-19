// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { DailyForecastData } from '../utils/types';
import { getWeatherIconComponent } from '../utils/weather-icons';

interface WeatherForecastProps {
  data: DailyForecastData[];
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  // Format date to display day of week
  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  // Display only next 7 days (or less if fewer are available)
  const days = data.slice(0, 7);

  return (
    <div className="daily-forecast">
      {/* Horizontal layout for daily forecast items */}
      <ColumnLayout columns={days.length} variant="text-grid">
        {days.map((day, index) => {
          const WeatherIcon = getWeatherIconComponent(day.weatherCode);
          const formattedDay = index === 0 ? 'Today' : formatDay(day.date);

          return (
            <div key={index} className="daily-item">
              <Box textAlign="center">
                <SpaceBetween size="xs">
                  <Box variant="h4">{formattedDay}</Box>
                  <Box>
                    <WeatherIcon size={32} />
                  </Box>
                  <Box variant="h3">
                    {Math.round(day.temperatureMax)}° / {Math.round(day.temperatureMin)}°
                  </Box>
                  <Box variant="p">{Math.round(day.precipitationSum * 10) / 10} mm</Box>
                </SpaceBetween>
              </Box>
            </div>
          );
        })}
      </ColumnLayout>
    </div>
  );
}
