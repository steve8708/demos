// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { DailyForecast, getWeatherIcon, getWeatherLabel } from '../utils/types';
import { formatDate, formatTime } from '../utils/api';

interface DailyForecastPanelProps {
  forecast: DailyForecast[];
}

export function DailyForecastPanel({ forecast }: DailyForecastPanelProps) {
  return (
    <Container header={<Header variant="h2">7-day forecast</Header>}>
      <ColumnLayout columns={forecast.length} variant="text-grid">
        {forecast.map((day, index) => {
          const weatherIcon = getWeatherIcon(day.weatherCode);
          const weatherCondition = getWeatherLabel(day.weatherCode);

          return (
            <div key={index}>
              <SpaceBetween size="xxs">
                <Box textAlign="center" fontWeight="bold">
                  {index === 0 ? 'Today' : formatDate(day.date)}
                </Box>
                <Box textAlign="center" fontSize="display-l">
                  <Icon name={weatherIcon} />
                </Box>
                <Box textAlign="center" fontWeight="normal" fontSize="body-s">
                  {weatherCondition}
                </Box>
                <div>
                  <Box textAlign="center" fontWeight="bold">
                    {Math.round(day.temperatureMax)}°
                  </Box>
                  <Box textAlign="center" color="text-body-secondary">
                    {Math.round(day.temperatureMin)}°
                  </Box>
                </div>
                <Box textAlign="center" fontSize="body-s">
                  <SpaceBetween size="xxxs">
                    <div>Precipitation: {day.precipitationSum} mm</div>
                    <div>Probability: {day.precipitationProbabilityMax}%</div>
                  </SpaceBetween>
                </Box>
                <Box textAlign="center" fontSize="body-s">
                  <SpaceBetween size="xxxs">
                    <div>Sunrise: {formatTime(day.sunrise)}</div>
                    <div>Sunset: {formatTime(day.sunset)}</div>
                  </SpaceBetween>
                </Box>
              </SpaceBetween>
            </div>
          );
        })}
      </ColumnLayout>
    </Container>
  );
}
