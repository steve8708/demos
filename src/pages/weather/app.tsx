// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect, useRef } from 'react';
import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Alert from '@cloudscape-design/components/alert';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Grid from '@cloudscape-design/components/grid';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { WeatherCard } from './components/weather-card';
import { HourlyForecast } from './components/hourly-forecast';
import { DailyForecast } from './components/daily-forecast';
import { LocationSearch } from './components/location-search';
import { WeatherHelpContent } from './components/weather-help-content';
import { WeatherData, LocationData, fetchWeatherData, getCurrentLocation } from './weather-api';
export function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <WeatherHelpContent />);
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
    appLayout.current?.focusToolsClose();
  };

  const loadWeatherData = async (targetLocation: LocationData) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(targetLocation.latitude, targetLocation.longitude);
      setWeatherData(data);
      setLocation(targetLocation);
    } catch (err) {
      setError('Failed to load weather data. Please try again later.');
      console.error('Weather data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (location) {
      loadWeatherData(location);
    }
  };

  const handleLocationChange = (newLocation: LocationData) => {
    loadWeatherData(newLocation);
  };

  useEffect(() => {
    const initializeWeather = async () => {
      try {
        const currentLocation = await getCurrentLocation();
        await loadWeatherData(currentLocation);
      } catch (err) {
        setError('Failed to initialize weather dashboard. Please try refreshing the page.');
        setIsLoading(false);
        console.error('Weather initialization error:', err);
      }
    };

    initializeWeather();
  }, []);

  return (
    <HelpPanelProvider value={handleToolsContentChange}>
      <CustomAppLayout
        ref={appLayout}
        content={
          <ContentLayout
            header={
              <SpaceBetween size="m">
                <Header
                  variant="h1"
                  description="Real-time weather conditions and forecasts"
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button
                        variant="normal"
                        iconName="refresh"
                        onClick={handleRefresh}
                        loading={isLoading}
                        disabled={!location}
                      >
                        Refresh
                      </Button>
                      <Button
                        variant="primary"
                        iconName="status-info"
                        onClick={() => handleToolsContentChange(<WeatherHelpContent />)}
                      >
                        About
                      </Button>
                    </SpaceBetween>
                  }
                >
                  Weather Dashboard
                </Header>

                {error && (
                  <Alert
                    type="error"
                    dismissible
                    onDismiss={() => setError(null)}
                    action={
                      <Button variant="primary" onClick={handleRefresh}>
                        Retry
                      </Button>
                    }
                  >
                    {error}
                  </Alert>
                )}
              </SpaceBetween>
            }
          >
            <SpaceBetween size="l">
              {location && (
                <LocationSearch
                  currentLocation={location}
                  onLocationChange={handleLocationChange}
                  isLoading={isLoading}
                />
              )}

              {weatherData && location && !isLoading && (
                <>
                  <WeatherCard weatherData={weatherData} location={location} />

                  <DailyForecast weatherData={weatherData} />

                  <HourlyForecast weatherData={weatherData} />
                </>
              )}

              {isLoading && !error && (
                <div className="weather-loading-state">
                  <SpaceBetween size="m" alignItems="center">
                    <Header variant="h2">Loading weather data...</Header>
                  </SpaceBetween>
                </div>
              )}
            </SpaceBetween>
          </ContentLayout>
        }
        breadcrumbs={<Breadcrumbs items={[{ text: 'Weather Dashboard', href: '#/weather' }]} />}
        navigationHide
        tools={toolsContent}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
      />
    </HelpPanelProvider>
  );
}
