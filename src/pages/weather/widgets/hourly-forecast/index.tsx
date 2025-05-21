// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { IconCloud, IconCloudRain, IconDroplet, IconSnowflake, IconSun, IconSunHigh } from '@tabler/icons-react';

import { useWeatherContext } from '../../context/weather-context';
import { formatTemperature, formatTime, getWeatherDescription, formatPercentage } from '../../utils/helpers';
import { WEATHER_CODES } from '../../utils/constants';
import { WeatherWidgetConfig } from '../interfaces';

import * as styles from '../base-widget/styles.module.scss';

function HourlyForecastHeader() {
  return <Header>Hourly Forecast</Header>;
}

function getWeatherIcon(code: number, size = 24) {
  const iconInfo = WEATHER_CODES[code as keyof typeof WEATHER_CODES];

  switch (iconInfo?.icon) {
    case 'sun':
      return <IconSun size={size} />;
    case 'cloud-sun':
      return <IconSunHigh size={size} />;
    case 'cloud':
      return <IconCloud size={size} />;
    case 'cloud-rain':
    case 'cloud-drizzle':
      return <IconCloudRain size={size} />;
    case 'snowflake':
      return <IconSnowflake size={size} />;
    default:
      return <IconCloud size={size} />;
  }
}

function HourlyForecastContent() {
  const { weatherData, units, loading } = useWeatherContext();

  if (loading || !weatherData) {
    return (
      <Box textAlign="center" padding={{ vertical: 'xxl' }}>
        <StatusIndicator type="loading">Loading hourly forecast data</StatusIndicator>
      </Box>
    );
  }

  const { hourly } = weatherData;

  // Get hourly forecast data for the next 24 hours
  const times = hourly.time.slice(0, 24);
  const temps = hourly.temperature_2m.slice(0, 24);
  const weatherCodes = hourly.weather_code.slice(0, 24);
  const precipProbs = hourly.precipitation_probability.slice(0, 24);
  const isDay = hourly.is_day.slice(0, 24);

  return (
    <SpaceBetween size="m">
      <ColumnLayout columns={8}>
        {times.slice(0, 8).map((time: string, index: number) => (
          <div key={index} className={styles.hourlyItem}>
            <div className={styles.hourlyTime}>{formatTime(time)}</div>
            <div className={styles.hourlyIcon}>{getWeatherIcon(weatherCodes[index], 28)}</div>
            <div>{formatTemperature(temps[index], units)}</div>
            <div>
              <IconDroplet size={14} style={{ marginRight: '2px' }} />
              {formatPercentage(precipProbs[index])}
            </div>
          </div>
        ))}
      </ColumnLayout>

      <ColumnLayout columns={8}>
        {times.slice(8, 16).map((time: string, index: number) => {
          const actualIndex = index + 8;
          return (
            <div key={actualIndex} className={styles.hourlyItem}>
              <div className={styles.hourlyTime}>{formatTime(time)}</div>
              <div className={styles.hourlyIcon}>{getWeatherIcon(weatherCodes[actualIndex], 28)}</div>
              <div>{formatTemperature(temps[actualIndex], units)}</div>
              <div>
                <IconDroplet size={14} style={{ marginRight: '2px' }} />
                {formatPercentage(precipProbs[actualIndex])}
              </div>
            </div>
          );
        })}
      </ColumnLayout>

      <ColumnLayout columns={8}>
        {times.slice(16, 24).map((time: string, index: number) => {
          const actualIndex = index + 16;
          return (
            <div key={actualIndex} className={styles.hourlyItem}>
              <div className={styles.hourlyTime}>{formatTime(time)}</div>
              <div className={styles.hourlyIcon}>{getWeatherIcon(weatherCodes[actualIndex], 28)}</div>
              <div>{formatTemperature(temps[actualIndex], units)}</div>
              <div>
                <IconDroplet size={14} style={{ marginRight: '2px' }} />
                {formatPercentage(precipProbs[actualIndex])}
              </div>
            </div>
          );
        })}
      </ColumnLayout>
    </SpaceBetween>
  );
}

export const hourlyForecast: WeatherWidgetConfig = {
  data: {
    title: 'Hourly Forecast',
    description: '24-hour weather forecast',
    header: HourlyForecastHeader,
    content: HourlyForecastContent,
  },
};
