// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { IconMoonStars, IconSun, IconSunset } from '@tabler/icons-react';

import { useWeatherContext } from '../../context/weather-context';
import { formatTime } from '../../utils/helpers';
import { WeatherWidgetConfig } from '../interfaces';

function SunMoonHeader() {
  return <Header>Sun & Moon</Header>;
}

function SunMoonContent() {
  const { weatherData, loading } = useWeatherContext();

  if (loading || !weatherData) {
    return (
      <Box textAlign="center" padding={{ vertical: 'xxl' }}>
        <StatusIndicator type="loading">Loading sun and moon data</StatusIndicator>
      </Box>
    );
  }

  const { daily, current } = weatherData;

  // Get sun and daylight information
  const sunrise = daily.sunrise[0];
  const sunset = daily.sunset[0];
  const daylightHours = Math.floor(daily.daylight_duration[0] / 3600);
  const daylightMinutes = Math.floor((daily.daylight_duration[0] % 3600) / 60);
  const sunshineHours = Math.floor(daily.sunshine_duration[0] / 3600);
  const sunshineMinutes = Math.floor((daily.sunshine_duration[0] % 3600) / 60);
  const isDay = current.is_day === 1;

  return (
    <SpaceBetween size="l">
      <Box textAlign="center" fontSize="heading-m">
        {isDay ? (
          <span>
            <IconSun size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Day Time
          </span>
        ) : (
          <span>
            <IconMoonStars size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Night Time
          </span>
        )}
      </Box>

      <ColumnLayout columns={2} variant="text-grid">
        <SpaceBetween size="s">
          <Box fontSize="heading-s">Sunrise</Box>
          <Box fontSize="heading-l">
            <IconSun size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {formatTime(sunrise)}
          </Box>
        </SpaceBetween>

        <SpaceBetween size="s">
          <Box fontSize="heading-s">Sunset</Box>
          <Box fontSize="heading-l">
            <IconSunset size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {formatTime(sunset)}
          </Box>
        </SpaceBetween>
      </ColumnLayout>

      <SpaceBetween size="s">
        <Box fontSize="heading-s">Day Length</Box>
        <Box fontSize="body-m">
          {daylightHours} hours {daylightMinutes} minutes
        </Box>
      </SpaceBetween>

      <SpaceBetween size="s">
        <Box fontSize="heading-s">Sunshine Duration</Box>
        <Box fontSize="body-m">
          {sunshineHours} hours {sunshineMinutes} minutes
        </Box>
      </SpaceBetween>
    </SpaceBetween>
  );
}

export const sunAndMoon: WeatherWidgetConfig = {
  data: {
    title: 'Sun & Moon',
    description: 'Sun and moon information',
    header: SunMoonHeader,
    content: SunMoonContent,
  },
};
