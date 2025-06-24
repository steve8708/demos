// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Icon from '@cloudscape-design/components/icon';

import { WeatherData } from '../types';
import {
  formatTemperature,
  formatWindSpeed,
  formatWindDirection,
  formatHumidity,
  formatPrecipitation,
  formatDateTime,
} from '../utils';
import { getWeatherDescription, getWeatherIcon } from '../services/weather-api';

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
  locationName: string;
}

export function CurrentWeatherCard({ weatherData, locationName }: CurrentWeatherCardProps) {
  const { current } = weatherData;

  const weatherDescription = getWeatherDescription(current.weather_code, current.is_day);
  const weatherIcon = getWeatherIcon(current.weather_code, current.is_day);

  return (
    <Container header={<Header variant="h2">Current Weather</Header>}>
      <SpaceBetween size="l">
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xs: 12, s: 6, m: 6, l: 6, xl: 6 } },
            { colspan: { default: 12, xs: 12, s: 6, m: 6, l: 6, xl: 6 } },
          ]}
        >
          <SpaceBetween size="m">
            <Box variant="h3" color="text-label">
              {locationName}
            </Box>
            <SpaceBetween direction="horizontal" size="s" alignItems="center">
              <Icon name={weatherIcon} size="large" />
              <Box fontSize="heading-xl" fontWeight="bold">
                {formatTemperature(current.temperature_2m)}
              </Box>
            </SpaceBetween>
            <Box variant="p" color="text-body-secondary">
              {weatherDescription}
            </Box>
            <Box variant="small" color="text-body-secondary">
              Feels like {formatTemperature(current.apparent_temperature)}
            </Box>
            <Box variant="small" color="text-body-secondary">
              Last updated: {formatDateTime(current.time)}
            </Box>
          </SpaceBetween>

          <KeyValuePairs
            columns={1}
            items={[
              {
                label: 'Wind Speed',
                value: formatWindSpeed(current.wind_speed_10m),
              },
              {
                label: 'Wind Direction',
                value: `${formatWindDirection(current.wind_direction_10m)} (${Math.round(current.wind_direction_10m)}°)`,
              },
              {
                label: 'Humidity',
                value: formatHumidity(current.relative_humidity_2m),
              },
              {
                label: 'Precipitation',
                value: formatPrecipitation(current.precipitation),
              },
            ]}
          />
        </Grid>
      </SpaceBetween>
    </Container>
  );
}
