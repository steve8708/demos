// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Badge from '@cloudscape-design/components/badge';
import { WeatherData, LocationData } from '../types';
import {
  getWeatherDescription,
  getWeatherIcon,
  formatTemperature,
  formatWindSpeed,
  formatWindDirection,
  formatHumidity,
  formatPressure,
} from '../api';

interface CurrentWeatherProps {
  data: WeatherData;
  location: LocationData;
  useFahrenheit: boolean;
}

export function CurrentWeather({ data, location, useFahrenheit }: CurrentWeatherProps) {
  const { current, current_units } = data;

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString();
  };

  const getDayNightBadge = (isDay: number) => {
    return isDay === 1 ? <Badge color="blue">☀️ Day</Badge> : <Badge color="grey">🌙 Night</Badge>;
  };

  return (
    <Container
      header={
        <Header
          variant="h2"
          description={`Current weather conditions for ${location.city}, ${location.country}`}
          info={getDayNightBadge(current.is_day)}
        >
          Current Weather
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Box textAlign="center">
          <SpaceBetween size="xs">
            <Box fontSize="display-l" fontWeight="bold">
              {formatTemperature(current.temperature_2m, current_units.temperature_2m, useFahrenheit)}
            </Box>
            <Box fontSize="display-l">{getWeatherIcon(current.weather_code)}</Box>
            <Box variant="h3" color="text-body-secondary">
              {getWeatherDescription(current.weather_code)}
            </Box>
            <Box variant="small" color="text-body-secondary">
              Feels like{' '}
              {formatTemperature(current.apparent_temperature, current_units.apparent_temperature, useFahrenheit)}
            </Box>
          </SpaceBetween>
        </Box>

        <KeyValuePairs
          columns={3}
          items={[
            {
              label: 'Humidity',
              value: formatHumidity(current.relative_humidity_2m),
            },
            {
              label: 'Wind',
              value: `${formatWindSpeed(current.wind_speed_10m, current_units.wind_speed_10m)} ${formatWindDirection(current.wind_direction_10m)}`,
            },
            {
              label: 'Pressure',
              value: formatPressure(current.pressure_msl, current_units.pressure_msl),
            },
            {
              label: 'Cloud Cover',
              value: `${current.cloud_cover}%`,
            },
            {
              label: 'Precipitation',
              value: current.precipitation > 0 ? `${current.precipitation}${current_units.precipitation}` : 'None',
            },
            {
              label: 'Wind Gusts',
              value: formatWindSpeed(current.wind_gusts_10m, current_units.wind_gusts_10m),
            },
          ]}
        />

        <Box variant="small" color="text-body-secondary" textAlign="center">
          Last updated: {formatDateTime(current.time)}
        </Box>
      </SpaceBetween>
    </Container>
  );
}
