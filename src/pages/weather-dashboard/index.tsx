// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Button from '@cloudscape-design/components/button';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Alert from '@cloudscape-design/components/alert';

import { WeatherLocation, WeatherApiResponse, DEFAULT_LOCATIONS } from './types';
import { fetchWeatherData } from './api';
import { LocationSelector } from './components/location-selector';
import { CurrentWeatherWidget } from './components/current-weather-widget';
import { HourlyForecastWidget } from './components/hourly-forecast-widget';
import { WeeklyForecastWidget } from './components/weekly-forecast-widget';
import { WeatherStatsWidget } from './components/weather-stats-widget';

export default function WeatherDashboard() {
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(DEFAULT_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadWeatherData = async (location: WeatherLocation) => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (location: WeatherLocation) => {
    setSelectedLocation(location);
    loadWeatherData(location);
  };

  const handleRefresh = () => {
    if (selectedLocation) {
      loadWeatherData(selectedLocation);
    }
  };

  // Load initial data
  useEffect(() => {
    if (selectedLocation) {
      loadWeatherData(selectedLocation);
    }
  }, []);

  return (
    <AppLayout
      navigationHide
      toolsHide
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Home', href: '/' },
            { text: 'Weather Dashboard', href: '/weather-dashboard' },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description="Real-time weather information and forecasts powered by Open-Meteo API"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button iconName="refresh" onClick={handleRefresh} loading={loading} ariaLabel="Refresh weather data">
                    Refresh
                  </Button>
                  {lastUpdated && (
                    <StatusIndicator type="success">Last updated: {lastUpdated.toLocaleTimeString()}</StatusIndicator>
                  )}
                </SpaceBetween>
              }
            >
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Grid gridDefinition={[{ colspan: { default: 12, xs: 12, s: 12, m: 6, l: 4, xl: 3 } }]}>
              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationChange={handleLocationChange}
                loading={loading}
              />
            </Grid>

            {error && (
              <Alert
                statusIconAriaLabel="Error"
                type="error"
                header="Weather Data Error"
                action={<Button onClick={handleRefresh}>Retry</Button>}
              >
                {error}
              </Alert>
            )}

            <Grid
              gridDefinition={[
                { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 6, xl: 6 } },
                { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 6, xl: 6 } },
              ]}
            >
              <CurrentWeatherWidget
                data={weatherData}
                loading={loading}
                error={error}
                locationName={selectedLocation?.name || 'Unknown Location'}
              />
              <WeatherStatsWidget data={weatherData} loading={loading} error={error} />
            </Grid>

            <HourlyForecastWidget data={weatherData} loading={loading} error={error} />

            <WeeklyForecastWidget data={weatherData} loading={loading} error={error} />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
