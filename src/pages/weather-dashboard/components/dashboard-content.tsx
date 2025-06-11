// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect, useCallback } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Alert from '@cloudscape-design/components/alert';

import { WeatherData, LocationData } from '../types';
import { fetchWeatherData, DEFAULT_LOCATIONS } from '../api';
import { DashboardHeader } from './dashboard-header';
import { LocationSelector } from './location-selector';
import { CurrentWeather } from './current-weather';
import { HourlyForecastWidget } from './hourly-forecast';
import { DailyForecastWidget } from './daily-forecast';

export function DashboardContent() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(DEFAULT_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeatherData = useCallback(async (location: LocationData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weather data';
      setError(errorMessage);
      console.error('Weather data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLocationChange = useCallback(
    (location: LocationData) => {
      setSelectedLocation(location);
      loadWeatherData(location);
    },
    [loadWeatherData],
  );

  const handleRefresh = useCallback(() => {
    loadWeatherData(selectedLocation);
  }, [loadWeatherData, selectedLocation]);

  // Load initial data
  useEffect(() => {
    loadWeatherData(selectedLocation);
  }, [loadWeatherData, selectedLocation]);

  const renderContent = () => {
    if (loading && !weatherData) {
      return (
        <Box textAlign="center" padding="xxl">
          <StatusIndicator type="loading">Loading weather data...</StatusIndicator>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert
          statusIconAriaLabel="Error"
          type="error"
          header="Failed to load weather data"
          action={<button onClick={handleRefresh}>Retry</button>}
        >
          {error}
        </Alert>
      );
    }

    if (!weatherData) {
      return (
        <Box textAlign="center" padding="xxl">
          <StatusIndicator type="stopped">No weather data available</StatusIndicator>
        </Box>
      );
    }

    return (
      <SpaceBetween size="l">
        <Grid gridDefinition={[{ colspan: { default: 12, xs: 12, s: 6, m: 4, l: 4, xl: 3 } }]}>
          <LocationSelector
            locations={DEFAULT_LOCATIONS}
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
            loading={loading}
          />
        </Grid>

        <CurrentWeather data={weatherData} location={selectedLocation} />

        <HourlyForecastWidget data={weatherData} />

        <DailyForecastWidget data={weatherData} />
      </SpaceBetween>
    );
  };

  return (
    <SpaceBetween size="l">
      <DashboardHeader location={selectedLocation} onRefresh={handleRefresh} loading={loading} />

      {renderContent()}
    </SpaceBetween>
  );
}
