// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';

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
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data whenever location changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchWeatherData(location)
      .then(data => {
        if (isMounted) {
          setWeatherData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('Failed to fetch weather data:', err);
          setError('Failed to load weather data for this location');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [location.latitude, location.longitude]); // Re-fetch when coordinates change

  if (loading) {
    return <LoadingStatus resourceName="weather data" />;
  }

  if (error || !weatherData) {
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

  return (
    <Grid
      gridDefinition={[
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 8, m: 8, default: 12 } },
        { colspan: 12 },
      ]}
    >
      <CurrentWeatherPanel current={weatherData.current} location={weatherData.location} />
      <DailyForecastPanel forecast={weatherData.daily} />
      <HourlyForecastChart hourlyData={weatherData.hourly} />
    </Grid>
  );
}
