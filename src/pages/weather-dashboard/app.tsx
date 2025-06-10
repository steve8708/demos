// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';

import { WeatherService } from './weather-service';
import { WeatherData, Coordinates } from './types';
import { LocationSearch } from './components/location-search';
import { WeatherWidget } from './components/weather-widget';
import { WeatherForecast } from './components/weather-forecast';

export function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinates | null>(null);

  // Load default location (London) on component mount
  useEffect(() => {
    const defaultCoordinates = { latitude: 51.5074, longitude: -0.1278 };
    handleLocationSelect(defaultCoordinates, 'London, United Kingdom');
  }, []);

  const handleLocationSelect = async (coordinates: Coordinates, locationDisplayName: string) => {
    setLoading(true);
    setError(null);
    setCurrentCoordinates(coordinates);
    setLocationName(locationDisplayName);

    try {
      const data = await WeatherService.getCurrentWeatherAndForecast(coordinates);
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (currentCoordinates) {
      handleLocationSelect(currentCoordinates, locationName);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Container>
          <Box textAlign="center" padding="xl">
            <StatusIndicator type="loading">Loading weather data...</StatusIndicator>
          </Box>
        </Container>
      );
    }

    if (error) {
      return (
        <Container>
          <Alert
            type="error"
            header="Failed to load weather data"
            action={
              <Button iconName="refresh" onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Container>
      );
    }

    if (!weatherData) {
      return (
        <Container>
          <Box textAlign="center" padding="xl" color="text-body-secondary">
            <Box variant="h3" padding={{ bottom: 's' }}>
              No weather data available
            </Box>
            <Box variant="p">Please search for a location to view weather information.</Box>
          </Box>
        </Container>
      );
    }

    return (
      <SpaceBetween size="l">
        <WeatherWidget
          weather={weatherData.current_weather}
          locationName={locationName}
          timezone={weatherData.timezone_abbreviation}
        />
        <WeatherForecast forecast={weatherData.daily} />
      </SpaceBetween>
    );
  };

  return (
    <AppLayout
      navigationHide
      toolsHide
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Home', href: '#/' },
            { text: 'Weather Dashboard', href: '#/weather-dashboard' },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      content={
        <ContentLayout
          header={
            <SpaceBetween size="m">
              <Header
                variant="h1"
                description="Real-time weather information and 7-day forecast powered by Open Meteo API"
                actions={
                  <Button iconName="refresh" onClick={handleRefresh} disabled={loading || !currentCoordinates}>
                    Refresh
                  </Button>
                }
              >
                Weather Dashboard
              </Header>

              <Container>
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  currentLocationName={locationName}
                  loading={loading}
                />
              </Container>
            </SpaceBetween>
          }
        >
          <SpaceBetween size="l">
            {renderContent()}

            <Container>
              <Box variant="h3" padding={{ bottom: 's' }}>
                About this dashboard
              </Box>
              <Box variant="p" color="text-body-secondary">
                This weather dashboard uses the free Open Meteo API to provide current weather conditions and 7-day
                forecasts for locations worldwide. The API provides accurate meteorological data without requiring an
                API key, making it perfect for demonstrations and development.
              </Box>
              <Box variant="p" color="text-body-secondary" padding={{ top: 's' }}>
                Data includes temperature, precipitation, wind speed and direction, and weather conditions. All data is
                sourced from reliable weather models and updated regularly.
              </Box>
            </Container>
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
