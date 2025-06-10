// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import Icon from '@cloudscape-design/components/icon';

import { CurrentWeather, HourlyWeather } from '../../types';
import { WeatherService } from '../../weather-service';

interface WeatherStatsWidgetProps {
  currentWeather: CurrentWeather | null;
  hourlyData: HourlyWeather | null;
  loading: boolean;
}

export function WeatherStatsWidget({ currentWeather, hourlyData, loading }: WeatherStatsWidgetProps) {
  if (loading) {
    return (
      <Container header={<Header variant="h2">Weather Statistics</Header>}>
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            Loading statistics...
          </Box>
        </Box>
      </Container>
    );
  }

  if (!currentWeather || !hourlyData) {
    return (
      <Container header={<Header variant="h2">Weather Statistics</Header>}>
        <Box textAlign="center" padding="xl">
          <Icon name="status-warning" size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            Statistics unavailable
          </Box>
        </Box>
      </Container>
    );
  }

  // Calculate today's stats from hourly data
  const today = new Date().toISOString().split('T')[0];
  const todayIndices = hourlyData.time
    .map((time, index) => (time.startsWith(today) ? index : -1))
    .filter(index => index !== -1);

  const todayTemps = todayIndices.map(i => hourlyData.temperature_2m[i]).filter(temp => temp !== undefined);
  const todayHumidity = todayIndices
    .map(i => hourlyData.relative_humidity_2m[i])
    .filter(humidity => humidity !== undefined);
  const todayPrecipitation = todayIndices.map(i => hourlyData.precipitation[i]).filter(precip => precip !== undefined);

  const maxTemp = todayTemps.length > 0 ? Math.max(...todayTemps) : currentWeather.temperature;
  const minTemp = todayTemps.length > 0 ? Math.min(...todayTemps) : currentWeather.temperature;
  const avgHumidity =
    todayHumidity.length > 0 ? Math.round(todayHumidity.reduce((a, b) => a + b, 0) / todayHumidity.length) : 0;
  const totalPrecipitation = todayPrecipitation.reduce((a, b) => a + b, 0);

  const statsItems = [
    {
      label: 'Current Temperature',
      value: WeatherService.formatTemperature(currentWeather.temperature),
    },
    {
      label: "Today's High",
      value: WeatherService.formatTemperature(maxTemp),
    },
    {
      label: "Today's Low",
      value: WeatherService.formatTemperature(minTemp),
    },
    {
      label: 'Wind Speed',
      value: WeatherService.formatWindSpeed(currentWeather.windspeed),
    },
    {
      label: 'Average Humidity',
      value: `${avgHumidity}%`,
    },
    {
      label: 'Precipitation Today',
      value: `${totalPrecipitation.toFixed(1)} mm`,
    },
  ];

  return (
    <Container
      header={
        <Header variant="h2" description="Key weather metrics for today">
          Weather Statistics
        </Header>
      }
    >
      <KeyValuePairs columns={2} items={statsItems} />
    </Container>
  );
}
