// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';
import Button from '@cloudscape-design/components/button';
import Flashbar from '@cloudscape-design/components/flashbar';
import Alert from '@cloudscape-design/components/alert';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import FormField from '@cloudscape-design/components/form-field';

import { WeatherLocation, WeatherApiResponse, PREDEFINED_LOCATIONS } from './types';
import { WeatherService } from './weather-service';
import { LocationSelector } from './components/location-selector';
import { CurrentWeatherCard } from './components/current-weather-card';
import { WeatherForecastCard } from './components/weather-forecast-card';
import { HourlyWeatherChart } from './components/hourly-weather-chart';

import '../../styles/base.scss';

export default function WeatherDashboard() {
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(PREDEFINED_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeatherData = async (location: WeatherLocation) => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      const data = await WeatherService.getCompleteWeatherData(location);
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation);
    }
  }, [selectedLocation]);

  const handleLocationChange = (location: WeatherLocation) => {
    setSelectedLocation(location);
  };

  const handleRefresh = () => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation);
    }
  };

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
                description="Real-time weather information and forecasts powered by Open Meteo API"
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button onClick={handleRefresh} loading={loading} iconName="refresh" disabled={!selectedLocation}>
                      Refresh
                    </Button>
                  </SpaceBetween>
                }
              >
                Weather Dashboard
              </Header>

              {error && (
                <Flashbar
                  items={[
                    {
                      type: 'error',
                      content: error,
                      dismissible: true,
                      onDismiss: () => setError(null),
                    },
                  ]}
                />
              )}
            </SpaceBetween>
          }
        >
          <SpaceBetween size="l">
            <Container header={<Header variant="h2">Location Settings</Header>}>
              <Grid gridDefinition={[{ colspan: { default: 12, xs: 12, s: 6, m: 4 } }]}>
                <FormField label="Select Location" description="Choose a city to view weather information">
                  <LocationSelector
                    selectedLocation={selectedLocation}
                    onLocationChange={handleLocationChange}
                    loading={loading}
                  />
                </FormField>
              </Grid>

              {lastUpdated && (
                <Box margin={{ top: 'm' }}>
                  <StatusIndicator type="success">Last updated: {lastUpdated.toLocaleString()}</StatusIndicator>
                </Box>
              )}
            </Container>

            {loading && !weatherData && (
              <Container>
                <Box textAlign="center" padding={{ vertical: 'xl' }}>
                  <StatusIndicator type="loading">Loading weather data...</StatusIndicator>
                </Box>
              </Container>
            )}

            {weatherData && selectedLocation && (
              <SpaceBetween size="l">
                {weatherData.current_weather && (
                  <CurrentWeatherCard location={selectedLocation} weather={weatherData.current_weather} />
                )}

                {weatherData.daily && <WeatherForecastCard dailyWeather={weatherData.daily} />}

                {weatherData.hourly && <HourlyWeatherChart hourlyWeather={weatherData.hourly} />}

                <Alert
                  type="info"
                  header="Data Source"
                  action={
                    <Button
                      variant="primary"
                      iconName="external"
                      onClick={() => window.open('https://open-meteo.com', '_blank')}
                    >
                      Visit Open Meteo
                    </Button>
                  }
                >
                  Weather data is provided by Open Meteo, a free and open-source weather API. Data is updated regularly
                  and includes current conditions, hourly forecasts, and 7-day forecasts.
                </Alert>
              </SpaceBetween>
            )}

            {!loading && !weatherData && !error && (
              <Container>
                <Box textAlign="center" padding={{ vertical: 'xl' }}>
                  <Box variant="h3" color="text-body-secondary">
                    Select a location to view weather data
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
