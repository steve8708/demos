// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import { WeatherApiResponse } from '../types';
import { formatTemperature, formatSpeed, formatPressure, formatPercentage } from '../api';

interface WeatherStatsWidgetProps {
  data: WeatherApiResponse | null;
  loading: boolean;
  error: string | null;
}

export function WeatherStatsWidget({ data, loading, error }: WeatherStatsWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">Weather Statistics</Header>}>
        <Box>Loading weather statistics...</Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Weather Statistics</Header>}>
        <StatusIndicator type="error">Error loading weather statistics: {error}</StatusIndicator>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container header={<Header variant="h2">Weather Statistics</Header>}>
        <Box>No weather statistics available</Box>
      </Container>
    );
  }

  // Calculate statistics from daily data
  const daily = data.daily;
  const current = data.current;

  // Find min/max temperatures for the week
  const weeklyTempMax = Math.max(...daily.temperature_2m_max);
  const weeklyTempMin = Math.min(...daily.temperature_2m_min);

  // Calculate total precipitation for the week
  const weeklyPrecipitation = daily.precipitation_sum.reduce((sum, precip) => sum + precip, 0);

  // Find max wind speed for the week
  const weeklyWindMax = Math.max(...daily.wind_speed_10m_max);

  // Calculate average UV index
  const averageUV = daily.uv_index_max.reduce((sum, uv) => sum + uv, 0) / daily.uv_index_max.length;

  // Count rainy days
  const rainyDays = daily.precipitation_sum.filter(precip => precip > 0.1).length;

  // Calculate average humidity from hourly data (first 24 hours)
  const avgHumidity = data.hourly.relative_humidity_2m.slice(0, 24).reduce((sum, humidity) => sum + humidity, 0) / 24;

  const statisticsItems = [
    {
      label: 'Current Temperature',
      value: formatTemperature(current.temperature_2m),
    },
    {
      label: 'Weekly High',
      value: formatTemperature(weeklyTempMax),
    },
    {
      label: 'Weekly Low',
      value: formatTemperature(weeklyTempMin),
    },
    {
      label: 'Current Pressure',
      value: formatPressure(current.pressure_msl),
    },
    {
      label: 'Current Wind',
      value: formatSpeed(current.wind_speed_10m),
    },
    {
      label: 'Weekly Max Wind',
      value: formatSpeed(weeklyWindMax),
    },
    {
      label: 'Average Humidity',
      value: formatPercentage(avgHumidity),
    },
    {
      label: 'Weekly Precipitation',
      value: `${weeklyPrecipitation.toFixed(1)} mm`,
    },
    {
      label: 'Rainy Days (7-day)',
      value: `${rainyDays} day${rainyDays !== 1 ? 's' : ''}`,
    },
    {
      label: 'Average UV Index',
      value: averageUV.toFixed(1),
    },
    {
      label: 'Cloud Cover',
      value: formatPercentage(current.cloud_cover),
    },
    {
      label: 'Day/Night',
      value: current.is_day ? 'Day' : 'Night',
    },
  ];

  return (
    <Container
      header={
        <Header variant="h2" description="Key weather metrics and statistics">
          Weather Statistics
        </Header>
      }
    >
      <KeyValuePairs columns={3} items={statisticsItems} />
    </Container>
  );
}
