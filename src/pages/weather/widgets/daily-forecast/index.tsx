// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import {
  IconArrowDown,
  IconArrowUp,
  IconCloud,
  IconCloudRain,
  IconSnowflake,
  IconSun,
  IconSunHigh,
} from '@tabler/icons-react';

import { useWeatherContext } from '../../context/weather-context';
import {
  formatTemperature,
  formatDate,
  getWeatherDescription,
  formatPrecipitation,
  formatPercentage,
} from '../../utils/helpers';
import { WEATHER_CODES } from '../../utils/constants';
import { WeatherWidgetConfig } from '../interfaces';

import * as styles from '../base-widget/styles.module.scss';

function DailyForecastHeader() {
  return <Header>7-Day Forecast</Header>;
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

function DailyForecastContent() {
  const { weatherData, units, loading } = useWeatherContext();

  if (loading || !weatherData) {
    return (
      <Box textAlign="center" padding={{ vertical: 'xxl' }}>
        <StatusIndicator type="loading">Loading daily forecast data</StatusIndicator>
      </Box>
    );
  }

  const { daily } = weatherData;

  // Get daily forecast data
  const dates = daily.time;
  const maxTemps = daily.temperature_2m_max;
  const minTemps = daily.temperature_2m_min;
  const weatherCodes = daily.weather_code;
  const precipProbs = daily.precipitation_probability_max;
  const precipSums = daily.precipitation_sum;

  return (
    <SpaceBetween size="m">
      <ColumnLayout columns={7}>
        {dates.slice(0, 7).map((date: string, index: number) => (
          <div key={index} className={styles.forecastItem}>
            <div className={styles.forecastDay}>{index === 0 ? 'Today' : formatDate(date)}</div>
            <div className={styles.forecastIcon}>{getWeatherIcon(weatherCodes[index], 32)}</div>
            <div>{getWeatherDescription(weatherCodes[index])}</div>
            <div className={styles.forecastTemperature}>
              <IconArrowUp size={16} style={{ marginRight: '4px' }} />
              {formatTemperature(maxTemps[index], units)}
            </div>
            <div className={styles.forecastTemperature}>
              <IconArrowDown size={16} style={{ marginRight: '4px' }} />
              {formatTemperature(minTemps[index], units)}
            </div>
            <div>
              <IconCloudRain size={16} style={{ marginRight: '4px' }} />
              {formatPercentage(precipProbs[index])}
            </div>
            <div>{formatPrecipitation(precipSums[index], units)}</div>
          </div>
        ))}
      </ColumnLayout>
    </SpaceBetween>
  );
}

export const dailyForecast: WeatherWidgetConfig = {
  data: {
    title: 'Daily Forecast',
    description: '7-day weather forecast',
    header: DailyForecastHeader,
    content: DailyForecastContent,
  },
};
