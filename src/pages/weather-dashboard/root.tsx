// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useRef, useState, useEffect } from 'react';
import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import ContentLayout from '@cloudscape-design/components/content-layout';

import { Breadcrumbs, Navigation, Notifications } from '../commons/common-components';
import { CustomAppLayout } from '../commons/common-components';
import {
  LocationSearchComponent,
  CurrentWeatherCard,
  HourlyForecastComponent,
  DailyForecastComponent,
  WeatherLoadingState,
  WeatherErrorState,
} from './weather-components';
import { WeatherLocation, WeatherResponse } from './weather-types';

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const fetchWeatherData = async (location: WeatherLocation) => {
    setLoading(true);
    setError(null);
    setSelectedLocation(location);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto`,
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      // Transform the current weather data to match our interface
      const transformedData: WeatherResponse = {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        timezone_abbreviation: data.timezone_abbreviation,
        current: {
          temperature: data.current.temperature_2m || 0,
          weather_code: data.current.weather_code || 0,
          wind_speed: data.current.wind_speed_10m || 0,
          wind_direction: data.current.wind_direction_10m || 0,
          humidity: data.current.relative_humidity_2m || 0,
          pressure: data.current.surface_pressure || 1013,
          visibility: 10, // Open Meteo doesn't provide visibility, using default
          uv_index: 3, // Open Meteo doesn't provide current UV index, using default
          time: data.current.time || new Date().toISOString(),
        },
        hourly: {
          time: data.hourly.time || [],
          temperature_2m: data.hourly.temperature_2m || [],
          precipitation_probability: data.hourly.precipitation_probability || [],
          weather_code: data.hourly.weather_code || [],
          wind_speed_10m: data.hourly.wind_speed_10m || [],
        },
        daily: {
          time: data.daily.time || [],
          weather_code: data.daily.weather_code || [],
          temperature_2m_max: data.daily.temperature_2m_max || [],
          temperature_2m_min: data.daily.temperature_2m_min || [],
          precipitation_probability_max: data.daily.precipitation_probability_max || [],
          wind_speed_10m_max: data.daily.wind_speed_10m_max || [],
          uv_index_max: data.daily.uv_index_max || [],
        },
      };

      setWeatherData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: WeatherLocation) => {
    fetchWeatherData(location);
  };

  const handleRetry = () => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation);
    }
  };

  // Load default location (London) on component mount
  useEffect(() => {
    const defaultLocation: WeatherLocation = {
      id: 2643743,
      name: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      country: 'United Kingdom',
      admin1: 'England',
    };
    fetchWeatherData(defaultLocation);
  }, []);

  const toolsContent = (
    <SpaceBetween size="l">
      <Box variant="h3">Weather Dashboard</Box>
      <Box variant="p">
        This dashboard displays current weather conditions and forecasts using the Open Meteo API. Search for any city
        worldwide to get detailed weather information.
      </Box>
      <Box variant="h4">Features:</Box>
      <Box variant="ul">
        <li>Current weather conditions</li>
        <li>24-hour hourly forecast</li>
        <li>7-day daily forecast</li>
        <li>Global city search</li>
        <li>Real-time weather data</li>
      </Box>
      <Box variant="p" color="text-body-secondary">
        Weather data provided by Open Meteo API
      </Box>
    </SpaceBetween>
  );

  return (
    <CustomAppLayout
      ref={appLayout}
      navigation={<Navigation activeHref="#/weather-dashboard" />}
      notifications={<Notifications />}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { text: 'Home', href: '#/' },
            { text: 'Weather Dashboard', href: '#/weather-dashboard' },
          ]}
        />
      }
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              actions={
                <Button
                  variant="primary"
                  iconName="refresh"
                  onClick={handleRetry}
                  disabled={!selectedLocation || loading}
                >
                  Refresh
                </Button>
              }
              info={
                <Button
                  variant="icon"
                  iconName="status-info"
                  onClick={() => {
                    setToolsOpen(true);
                    appLayout.current?.focusToolsClose();
                  }}
                />
              }
            >
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            <LocationSearchComponent onLocationSelect={handleLocationSelect} loading={loading} />

            {error && <WeatherErrorState error={error} onRetry={handleRetry} />}

            {loading && <WeatherLoadingState />}

            {weatherData && selectedLocation && !loading && (
              <SpaceBetween size="l">
                <CurrentWeatherCard
                  weather={weatherData.current}
                  location={selectedLocation}
                  timezone={weatherData.timezone}
                />

                <HourlyForecastComponent hourly={weatherData.hourly} timezone={weatherData.timezone} />

                <DailyForecastComponent daily={weatherData.daily} timezone={weatherData.timezone} />
              </SpaceBetween>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
      tools={toolsContent}
      toolsOpen={toolsOpen}
      onToolsChange={({ detail }) => setToolsOpen(detail.open)}
    />
  );
}
