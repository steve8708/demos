// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Box from '@cloudscape-design/components/box';

import { WeatherResponse } from '../types';
import { formatWindDirection } from '../api';

interface WeatherDetailsProps {
  weatherData: WeatherResponse;
}

export function WeatherDetails({ weatherData }: WeatherDetailsProps) {
  const { current, current_units, daily, daily_units } = weatherData;

  const todayIndex = 0;
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <ColumnLayout columns={2}>
      <Container header={<Header variant="h3">Detailed Conditions</Header>}>
        <KeyValuePairs
          columns={1}
          items={[
            {
              label: 'Real Feel',
              value: `${Math.round(current.apparent_temperature)}${current_units.apparent_temperature}`,
            },
            {
              label: 'Wind',
              value: `${current.wind_speed_10m}${current_units.wind_speed_10m} ${formatWindDirection(current.wind_direction_10m)}`,
            },
            {
              label: 'Wind Gusts',
              value: `${current.wind_gusts_10m}${current_units.wind_gusts_10m}`,
            },
            {
              label: 'Humidity',
              value: `${current.relative_humidity_2m}${current_units.relative_humidity_2m}`,
            },
            {
              label: 'Pressure',
              value: `${Math.round(current.pressure_msl)} ${current_units.pressure_msl}`,
            },
            {
              label: 'Surface Pressure',
              value: `${Math.round(current.surface_pressure)} ${current_units.surface_pressure}`,
            },
            {
              label: 'Cloud Cover',
              value: `${current.cloud_cover}${current_units.cloud_cover}`,
            },
            {
              label: 'Visibility',
              value: current.is_day ? 'Day' : 'Night',
            },
          ]}
        />
      </Container>

      <Container header={<Header variant="h3">Today's Summary</Header>}>
        <KeyValuePairs
          columns={1}
          items={[
            {
              label: 'High / Low',
              value: `${Math.round(daily.temperature_2m_max[todayIndex])}${daily_units.temperature_2m_max} / ${Math.round(daily.temperature_2m_min[todayIndex])}${daily_units.temperature_2m_min}`,
            },
            {
              label: 'Sunrise',
              value: formatTime(daily.sunrise[todayIndex]),
            },
            {
              label: 'Sunset',
              value: formatTime(daily.sunset[todayIndex]),
            },
            {
              label: 'Precipitation',
              value: `${daily.precipitation_sum[todayIndex]}${daily_units.precipitation_sum}`,
            },
            {
              label: 'Rain',
              value: `${daily.rain_sum[todayIndex]}${daily_units.rain_sum}`,
            },
            {
              label: 'Snow',
              value: `${daily.snowfall_sum[todayIndex]}${daily_units.snowfall_sum}`,
            },
            {
              label: 'UV Index',
              value: `${daily.uv_index_max[todayIndex]}`,
            },
            {
              label: 'Max Wind Speed',
              value: `${daily.wind_speed_10m_max[todayIndex]}${daily_units.wind_speed_10m_max} ${formatWindDirection(daily.wind_direction_10m_dominant[todayIndex])}`,
            },
          ]}
        />
      </Container>
    </ColumnLayout>
  );
}
