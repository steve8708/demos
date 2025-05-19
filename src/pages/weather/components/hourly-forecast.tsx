// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';

import { HourlyForecastData } from '../utils/types';
import { getWeatherIconComponent } from '../utils/weather-icons';

interface HourlyForecastProps {
  data: HourlyForecastData[];
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  // Display only next 24 hours (24 data points)
  const hours = data.slice(0, 24);

  return (
    <div className="hourly-forecast">
      <SpaceBetween size="l">
        <div className="hourly-forecast-scroll">
          <ColumnLayout columns={hours.length > 6 ? 8 : hours.length} variant="text-grid">
            {hours.map((hour, index) => {
              const WeatherIcon = getWeatherIconComponent(hour.weatherCode);
              const hourTime = new Date(hour.time).getHours();
              const formattedHour =
                hourTime === 0
                  ? '12 AM'
                  : hourTime === 12
                    ? '12 PM'
                    : hourTime > 12
                      ? `${hourTime - 12} PM`
                      : `${hourTime} AM`;

              return (
                <div key={index} className="hourly-item">
                  <Box textAlign="center">
                    <SpaceBetween size="xs">
                      <Box variant="h4">{formattedHour}</Box>
                      <Box>
                        <WeatherIcon size={32} />
                      </Box>
                      <Box variant="h3">{Math.round(hour.temperature)}°</Box>
                      <Box variant="p">{Math.round(hour.precipitation * 100) / 100} mm</Box>
                      <Box variant="p">{Math.round(hour.windSpeed)} km/h</Box>
                    </SpaceBetween>
                  </Box>
                </div>
              );
            })}
          </ColumnLayout>
        </div>
      </SpaceBetween>
    </div>
  );
}
