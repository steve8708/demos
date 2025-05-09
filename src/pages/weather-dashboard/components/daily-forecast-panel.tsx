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
          const precipProb = day.precipitationProbabilityMax;
          const hasPrecipitation = day.precipitationSum > 0;

          return (
            <div key={index} style={{ textAlign: 'center', padding: '8px 0' }}>
              <SpaceBetween size="xxs">
                {/* Day label */}
                <Box fontWeight="bold" fontSize="heading-s">
                  {index === 0 ? 'Today' : formatDate(day.date)}
                </Box>

                {/* Weather icon */}
                <Box textAlign="center" fontSize="display-l">
                  <Icon name={weatherIcon} size="big" />
                </Box>

                {/* Weather condition */}
                <Box textAlign="center" fontWeight="normal" fontSize="body-s" color="text-body-secondary">
                  {weatherCondition}
                </Box>

                {/* Temperature range */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Box fontWeight="bold" fontSize="heading-m">
                    {Math.round(day.temperatureMax)}°
                  </Box>
                  <Box color="text-body-secondary">{Math.round(day.temperatureMin)}°</Box>
                </div>

                {/* Precipitation info */}
                <Box
                  textAlign="center"
                  fontSize="body-s"
                  color={hasPrecipitation ? 'text-status-info' : 'text-body-secondary'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    {hasPrecipitation && <Icon name="cloud-rain" size="small" />}
                    {hasPrecipitation ? `${day.precipitationSum} mm` : 'No rain'}
                  </div>
                  <div>{precipProb > 0 ? `${precipProb}% chance` : '0% chance'}</div>
                </Box>

                {/* Sun times */}
                <Box textAlign="center" fontSize="body-s" color="text-body-secondary">
                  <SpaceBetween size="xxxs">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Icon name="sun" size="small" />
                      <span>{formatTime(day.sunrise)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Icon name="moon-filled" size="small" />
                      <span>{formatTime(day.sunset)}</span>
                    </div>
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
