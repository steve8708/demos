// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import Grid from '@cloudscape-design/components/grid';
import Container from '@cloudscape-design/components/container';

import { WeatherData } from './types';
import { fetchWeatherData } from './services/weather-api';
import { LocationSearch } from './components/location-search';
import { CurrentWeatherCard } from './components/current-weather-card';
import { HourlyForecastChart } from './components/hourly-forecast-chart';
import { DailyForecastTable } from './components/daily-forecast-table';

export function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeather = async (latitude: number, longitude: number, name: string) => {
    try {
      setLoading(true);
      setError('');
      setLocationName(name);

      const data = await fetchWeatherData(latitude, longitude);
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (weatherData && locationName) {
      // Use the current location's coordinates for refresh
      fetchWeather(weatherData.latitude, weatherData.longitude, locationName);
    }
  };

  useEffect(() => {
    // Load default location (New York) on component mount
    fetchWeather(40.7128, -74.006, 'New York, NY');
  }, []);

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button
                    onClick={handleRefresh}
                    iconName="refresh"
                    disabled={loading || !weatherData}
                    loading={loading}
                  >
                    Refresh
                  </Button>
                </SpaceBetween>
              }
              description="Real-time weather data and forecasts powered by Open-Meteo API"
            >
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            {/* Location Search */}
            <Container>
              <Box variant="h2" margin={{ bottom: 's' }}>
                Location
              </Box>
              <LocationSearch onLocationSelect={fetchWeather} loading={loading} />
              {lastUpdated && (
                <Box variant="small" color="text-body-secondary" margin={{ top: 's' }}>
                  Last updated: {lastUpdated.toLocaleString()}
                </Box>
              )}
            </Container>

            {/* Error State */}
            {error && (
              <Alert
                type="error"
                statusIconAriaLabel="Error"
                action={
                  <Button onClick={() => setError('')} variant="link">
                    Dismiss
                  </Button>
                }
              >
                {error}
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <Container>
                <Box textAlign="center" padding={{ vertical: 'xl' }}>
                  <SpaceBetween size="m" alignItems="center">
                    <Spinner size="large" />
                    <Box variant="h3">Loading weather data...</Box>
                  </SpaceBetween>
                </Box>
              </Container>
            )}

            {/* Weather Data */}
            {weatherData && !loading && (
              <SpaceBetween size="l">
                {/* Current Weather */}
                <CurrentWeatherCard weatherData={weatherData} locationName={locationName} />

                {/* Charts and Tables Grid */}
                <Grid
                  gridDefinition={[
                    { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 6, xl: 6 } },
                    { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 6, xl: 6 } },
                  ]}
                >
                  <HourlyForecastChart weatherData={weatherData} />
                  <DailyForecastTable weatherData={weatherData} />
                </Grid>
              </SpaceBetween>
            )}

            {/* Empty State */}
            {!weatherData && !loading && !error && (
              <Container>
                <Box textAlign="center" color="inherit" margin={{ top: 'xxl', bottom: 'xxl' }}>
                  <Box variant="h3" padding={{ bottom: 'xs' }}>
                    Welcome to Weather Dashboard
                  </Box>
                  <Box variant="p" padding={{ bottom: 'm' }}>
                    Search for a location to view current weather conditions and forecasts
                  </Box>
                </Box>
              </Container>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
