// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';

import { LocationData, WeatherData } from './types';
import { fetchWeatherData, getLocationDisplayName } from './utils/weather-api';
import { LocationSearch } from './components/location-search';
import { WeatherCard } from './components/weather-card';
import { ForecastCards } from './components/forecast-table';

// Default location: London
const DEFAULT_LOCATION: LocationData = {
  id: 2643743,
  name: 'London',
  latitude: 51.5074,
  longitude: -0.1278,
  country: 'United Kingdom',
  admin1: 'England',
};

export default function WeatherDashboard() {
  const [currentLocation, setCurrentLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadWeatherData = async (location: LocationData) => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchWeatherData(location.latitude, location.longitude);
      setWeatherData(data);
      setCurrentLocation(location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    loadWeatherData(location);
  };

  const handleRefresh = () => {
    loadWeatherData(currentLocation);
  };

  useEffect(() => {
    loadWeatherData(DEFAULT_LOCATION);
  }, []);

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Real-time weather information and 7-day forecasts powered by Open Meteo"
          actions={
            <Button onClick={handleRefresh} loading={loading} iconName="refresh" disabled={loading}>
              Refresh
            </Button>
          }
        >
          Weather Dashboard
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        <Container>
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            value={getLocationDisplayName(currentLocation)}
            loading={loading}
          />
        </Container>

        {error && (
          <Alert
            type="error"
            header="Weather data unavailable"
            dismissible
            onDismiss={() => setError('')}
            action={
              <Button onClick={handleRefresh} variant="primary">
                Try again
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {loading && !weatherData && (
          <Container>
            <Box textAlign="center" padding="xxl">
              <Spinner size="large" />
              <Box variant="p" margin={{ top: 'm' }}>
                Loading weather data...
              </Box>
            </Box>
          </Container>
        )}

        {weatherData && (
          <SpaceBetween direction="vertical" size="l">
            <WeatherCard weatherData={weatherData} location={currentLocation} />
            <ForecastTable weatherData={weatherData} />
          </SpaceBetween>
        )}

        {!loading && !weatherData && !error && (
          <Container>
            <Box textAlign="center" padding="xxl">
              <Box variant="h3" margin={{ bottom: 'm' }}>
                No weather data available
              </Box>
              <Box variant="p" color="text-body-secondary">
                Please search for a location to view weather information.
              </Box>
            </Box>
          </Container>
        )}
      </SpaceBetween>
    </ContentLayout>
  );
}
