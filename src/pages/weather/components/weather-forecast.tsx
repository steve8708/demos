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

  return (
    <div className="daily-forecast">
      <SpaceBetween size="s">
        {data.map((day, index) => {
          const WeatherIcon = getWeatherIconComponent(day.weatherCode);
          const formattedDay = index === 0 ? 'Today' : formatDay(day.date);

          return (
            <Box key={index}>
              <ColumnLayout columns={4} variant="text-grid">
                <Box variant="h4">{formattedDay}</Box>
                <Box display="flex" alignItems="center">
                  <WeatherIcon size={24} />
                </Box>
                <Box variant="h4">
                  {Math.round(day.temperatureMax)}° / {Math.round(day.temperatureMin)}°
                </Box>
                <Box variant="p">{Math.round(day.precipitationSum * 10) / 10} mm</Box>
              </ColumnLayout>
            </Box>
          );
        })}
      </SpaceBetween>
    </div>
  );
}
