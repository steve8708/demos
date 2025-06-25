// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Badge from '@cloudscape-design/components/badge';

import { WeatherResponse, SelectedLocation } from '../types';
import { getWeatherDescription, getWeatherIcon, formatTemperature, formatWindDirection } from '../api';

interface CurrentWeatherProps {
  location: SelectedLocation;
  weatherData: WeatherResponse;
}

export function CurrentWeather({ location, weatherData }: CurrentWeatherProps) {
  const { current, current_units } = weatherData;
  const weatherIcon = getWeatherIcon(current.weather_code, current.is_day === 1);
  const weatherDescription = getWeatherDescription(current.weather_code);

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  return (
    <Container
      header={
        <Header variant="h2">
          Current Weather
          <Box variant="small" color="text-body-secondary" margin={{ left: 'xs' }}>
            Last updated: {formatTime(current.time)}
          </Box>
        </Header>
      }
    >
      <ColumnLayout columns={2} variant="text-grid">
        <div>
          <Box variant="h1" textAlign="center" margin={{ bottom: 'm' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{weatherIcon}</div>
            <div>{formatTemperature(current.temperature_2m, current_units.temperature_2m)}</div>
          </Box>
          <Box textAlign="center" variant="h3" color="text-body-secondary">
            {weatherDescription}
          </Box>
          <Box textAlign="center" margin={{ top: 's' }}>
            <Badge color={current.is_day ? 'blue' : 'grey'}>{current.is_day ? 'Day' : 'Night'}</Badge>
          </Box>
        </div>

        <div>
          <KeyValuePairs
            columns={1}
            items={[
              {
                label: 'Location',
                value: `${location.name}, ${location.admin1 ? `${location.admin1}, ` : ''}${location.country}`,
              },
              {
                label: 'Feels like',
                value: formatTemperature(current.apparent_temperature, current_units.apparent_temperature),
              },
              {
                label: 'Humidity',
                value: `${current.relative_humidity_2m}${current_units.relative_humidity_2m}`,
              },
              {
                label: 'Precipitation',
                value: `${current.precipitation}${current_units.precipitation}`,
              },
              {
                label: 'Wind',
                value: `${current.wind_speed_10m}${current_units.wind_speed_10m} ${formatWindDirection(current.wind_direction_10m)}`,
              },
              {
                label: 'Wind gusts',
                value: `${current.wind_gusts_10m}${current_units.wind_gusts_10m}`,
              },
              {
                label: 'Pressure',
                value: `${Math.round(current.pressure_msl)}${current_units.pressure_msl}`,
              },
              {
                label: 'Cloud cover',
                value: `${current.cloud_cover}${current_units.cloud_cover}`,
              },
            ]}
          />
        </div>
      </ColumnLayout>
    </Container>
  );
}
