// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { useAsyncData } from '../../commons/use-async-data';
import { CurrentWeatherPanel } from './current-weather-panel';
import { DailyForecastPanel } from './daily-forecast-panel';
import { HourlyForecastChart } from './hourly-forecast-chart';
import { fetchWeatherData } from '../utils/api';
import { Location, WeatherData } from '../utils/types';
import { LoadingStatus } from './loading-status';

interface WeatherDashboardContentProps {
  location: Location;
}

export function WeatherDashboardContent({ location }: WeatherDashboardContentProps) {
  const [weatherData, loading] = useAsyncData<WeatherData>(async () => {
    try {
      const data = await fetchWeatherData(location);
      return [data];
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return [];
    }
  });

  if (loading) {
    return <LoadingStatus resourceName="weather data" />;
  }

  if (!weatherData || weatherData.length === 0) {
    return (
      <Alert type="error" header="Error loading weather data">
        <SpaceBetween size="m">
          <p>
            We couldn't load the weather data for the selected location. Please try again or select a different
            location.
          </p>
        </SpaceBetween>
      </Alert>
    );
  }

  const weather = weatherData[0];

  return (
    <Grid
      gridDefinition={[
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 8, m: 8, default: 12 } },
        { colspan: 12 },
      ]}
    >
      <CurrentWeatherPanel current={weather.current} location={weather.location} />
      <DailyForecastPanel forecast={weather.daily} />
      <HourlyForecastChart hourlyData={weather.hourly} />
    </Grid>
  );
}
