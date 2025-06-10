// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Grid from '@cloudscape-design/components/grid';

import { WeatherApiResponse, LocationData } from '../types';
import {
  CurrentWeatherWidget,
  DailyForecastWidget,
  HourlyForecastWidget,
  WeatherStatsWidget,
  TemperatureTrendWidget,
} from './index';

interface WeatherDashboardContentProps {
  weatherData: WeatherApiResponse | null;
  location: LocationData;
  loading: boolean;
}

export function WeatherDashboardContent({ weatherData, location, loading }: WeatherDashboardContentProps) {
  return (
    <Grid
      gridDefinition={[
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 12, m: 12, default: 12 } },
        { colspan: { l: 8, m: 8, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
      ]}
    >
      <CurrentWeatherWidget
        currentWeather={weatherData?.current_weather || null}
        location={location}
        loading={loading}
      />

      <WeatherStatsWidget
        currentWeather={weatherData?.current_weather || null}
        hourlyData={weatherData?.hourly || null}
        loading={loading}
      />

      <DailyForecastWidget dailyData={weatherData?.daily || null} loading={loading} />

      <HourlyForecastWidget hourlyData={weatherData?.hourly || null} loading={loading} />

      <TemperatureTrendWidget
        hourlyData={weatherData?.hourly || null}
        dailyData={weatherData?.daily || null}
        loading={loading}
      />
    </Grid>
  );
}
