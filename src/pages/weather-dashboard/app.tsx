// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Flashbar from '@cloudscape-design/components/flashbar';
import Button from '@cloudscape-design/components/button';
import { WeatherData, LocationData, WeatherService } from './weather-api';
import { CurrentWeather } from './components/current-weather';
import { ForecastChart } from './components/forecast-chart';
import { DailyForecast } from './components/daily-forecast';
import { LocationSearch } from './components/location-search';

export function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeatherData = async (location: LocationData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await WeatherService.getCurrentWeather(location.latitude, location.longitude);
      setWeatherData(data);
      setCurrentLocation(location);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (currentLocation) {
      fetchWeatherData(currentLocation);
    }
  };

  // Load default location on mount
  useEffect(() => {
    const defaultLocation = WeatherService.getDefaultLocations()[0]; // New York
    fetchWeatherData(defaultLocation);
  }, []);

  const flashbarItems = error
    ? [
        {
          type: 'error' as const,
          content: error,
          dismissible: true,
          onDismiss: () => setError(null),
        },
      ]
    : [];

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <SpaceBetween size="m">
              <Header
                variant="h1"
                description="Real-time weather data powered by Open Meteo API"
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button
                      iconName="refresh"
                      onClick={handleRefresh}
                      disabled={loading || !currentLocation}
                      loading={loading}
                    >
                      Refresh
                    </Button>
                    <Button iconName="external" iconAlign="right" href="https://open-meteo.com" target="_blank">
                      Open Meteo API
                    </Button>
                  </SpaceBetween>
                }
              >
                Weather Dashboard
              </Header>

              {flashbarItems.length > 0 && <Flashbar items={flashbarItems} />}

              {lastUpdated && (
                <Box variant="small" color="text-body-secondary">
                  Last updated: {lastUpdated.toLocaleString()}
                </Box>
              )}
            </SpaceBetween>
          }
        >
          <SpaceBetween size="l">
            <LocationSearch onLocationSelect={fetchWeatherData} currentLocation={currentLocation} loading={loading} />

            {weatherData && currentLocation && (
              <>
                <Grid gridDefinition={[{ colspan: { default: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } }]}>
                  <CurrentWeather
                    weather={weatherData}
                    location={`${currentLocation.name}, ${currentLocation.country}`}
                  />
                </Grid>

                <ForecastChart weather={weatherData} />

                <DailyForecast weather={weatherData} />
              </>
            )}

            {loading && !weatherData && (
              <Box textAlign="center" padding="xxl">
                <Box variant="h3">Loading weather data...</Box>
              </Box>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
