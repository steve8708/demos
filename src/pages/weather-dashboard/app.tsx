// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useCallback } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';

import { getWeatherData } from './api';
import { WeatherResponse, SelectedLocation } from './types';
import { CitySearch } from './components/city-search';
import { CurrentWeather } from './components/current-weather';
import { WeatherForecast } from './components/weather-forecast';
import { WeatherDetails } from './components/weather-details';

export function App() {
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationSelect = useCallback(async (location: SelectedLocation) => {
    setSelectedLocation(location);
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(location.latitude, location.longitude);
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
      setWeatherData(null);
    } finally {
      setLoading(false);
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
              description="Search for any city and get detailed weather information including current conditions and 7-day forecast."
            >
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Container>
              <Box variant="h2" margin={{ bottom: 'm' }}>
                Search Location
              </Box>
              <CitySearch onLocationSelect={handleLocationSelect} loading={loading} />
            </Container>

            {error && (
              <Alert type="error" dismissible onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}

            {loading && (
              <Container>
                <Box textAlign="center" padding="l">
                  <Spinner size="large" />
                  <Box variant="p" margin={{ top: 'm' }}>
                    Loading weather data...
                  </Box>
                </Box>
              </Container>
            )}

            {!loading && selectedLocation && weatherData && (
              <SpaceBetween size="l">
                <CurrentWeather location={selectedLocation} weatherData={weatherData} />
                <WeatherForecast weatherData={weatherData} />
                <WeatherDetails weatherData={weatherData} />
              </SpaceBetween>
            )}

            {!selectedLocation && !loading && (
              <Container>
                <Box textAlign="center" padding="xl" color="text-body-secondary">
                  <Box fontSize="display-l" margin={{ bottom: 'm' }}>
                    🌤️
                  </Box>
                  <Box variant="h2" margin={{ bottom: 's' }}>
                    Get Started
                  </Box>
                  <Box variant="p">
                    Search for a city above to view detailed weather information including current conditions, 7-day
                    forecast, and more.
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
