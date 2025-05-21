// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { IconClock, IconDroplet, IconTemperature, IconWind } from '@tabler/icons-react';

import { useWeatherContext } from '../../context/weather-context';
import {
  formatTemperature,
  formatWindSpeed,
  getWeatherDescription,
  degreesToDirection,
  formatPercentage,
} from '../../utils/helpers';
import { WeatherWidgetConfig } from '../interfaces';

import * as styles from '../base-widget/styles.module.scss';

function CurrentWeatherHeader() {
  return <Header>Current Weather</Header>;
}

function CurrentWeatherContent() {
  const { weatherData, units, loading } = useWeatherContext();

  if (loading || !weatherData) {
    return (
      <Box textAlign="center" padding={{ vertical: 'xxl' }}>
        <StatusIndicator type="loading">Loading current weather data</StatusIndicator>
      </Box>
    );
  }

  const { current, current_units } = weatherData;

  // Basic current weather data
  const temperature = current.temperature_2m;
  const apparentTemperature = current.apparent_temperature;
  const humidity = current.relative_humidity_2m;
  const weatherCode = current.weather_code;
  const windSpeed = current.wind_speed_10m;
  const windDirection = current.wind_direction_10m;
  const windGust = current.wind_gusts_10m;
  const precipitation = current.precipitation;
  const cloudCover = current.cloud_cover;
  const pressure = current.pressure_msl;

  const weatherDesc = getWeatherDescription(weatherCode);
  const windDirectionText = degreesToDirection(windDirection);

  return (
    <SpaceBetween size="l">
      <ColumnLayout columns={2} variant="text-grid">
        <div>
          <SpaceBetween size="xs">
            <Box fontSize="display-l" fontWeight="bold">
              {formatTemperature(temperature, units)}
            </Box>
            <Box color="text-status-info" fontSize="heading-m">
              Feels like {formatTemperature(apparentTemperature, units)}
            </Box>
            <Box fontSize="heading-s">{weatherDesc}</Box>
          </SpaceBetween>
        </div>

        <SpaceBetween size="s">
          <div className={styles.weatherDetail}>
            <IconDroplet className={styles.weatherDetailIcon} size={18} />
            <span className={styles.weatherDetailLabel}>Humidity:</span>
            <span>{formatPercentage(humidity)}</span>
          </div>

          <div className={styles.weatherDetail}>
            <IconWind className={styles.weatherDetailIcon} size={18} />
            <span className={styles.weatherDetailLabel}>Wind:</span>
            <span>
              {formatWindSpeed(windSpeed, units)} {windDirectionText}
              {windGust > windSpeed && ` (gusts: ${formatWindSpeed(windGust, units)})`}
            </span>
          </div>

          <div className={styles.weatherDetail}>
            <IconTemperature className={styles.weatherDetailIcon} size={18} />
            <span className={styles.weatherDetailLabel}>Pressure:</span>
            <span>{pressure} hPa</span>
          </div>

          <div className={styles.weatherDetail}>
            <IconClock className={styles.weatherDetailIcon} size={18} />
            <span className={styles.weatherDetailLabel}>Last updated:</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </SpaceBetween>
      </ColumnLayout>
    </SpaceBetween>
  );
}

export const currentWeather: WeatherWidgetConfig = {
  data: {
    title: 'Current Weather',
    description: 'Current weather conditions',
    header: CurrentWeatherHeader,
    content: CurrentWeatherContent,
  },
};
