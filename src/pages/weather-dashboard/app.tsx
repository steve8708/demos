// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useState } from 'react';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { LocationSearch } from './components/location-search';
import { WeatherWidget, WeatherError, WeatherLoading } from './components/weather-widget';
import { useWeatherData, DEFAULT_LOCATIONS } from './hooks/use-weather-data';
import { WeatherLocation } from './types';

export function WeatherDashboardApp() {
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(null);
  const { weatherData, loading, error, fetchWeatherData } = useWeatherData();

  // Load default location on mount
  useEffect(() => {
    if (!selectedLocation) {
      const defaultLocation = DEFAULT_LOCATIONS[0]; // New York as default
      setSelectedLocation(defaultLocation);
    }
  }, [selectedLocation]);

  // Fetch weather data when location changes
  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation.latitude, selectedLocation.longitude);
    }
  }, [selectedLocation, fetchWeatherData]);

  const handleLocationSelect = (location: WeatherLocation) => {
    setSelectedLocation(location);
  };

  const handleRefresh = () => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation.latitude, selectedLocation.longitude);
    }
  };

  return (
    <CustomAppLayout
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description="Real-time weather data and forecasts powered by Open Meteo API"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button
                    iconName="refresh"
                    onClick={handleRefresh}
                    disabled={loading || !selectedLocation}
                    loading={loading}
                  >
                    Refresh
                  </Button>
                  <Button variant="primary" iconName="external" href="https://open-meteo.com" target="_blank">
                    Open Meteo API
                  </Button>
                </SpaceBetween>
              }
            >
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            <LocationSearch onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />

            {selectedLocation && (
              <>
                {loading && <WeatherLoading location={selectedLocation} />}
                {error && !loading && <WeatherError error={error} onRetry={handleRefresh} />}
                {weatherData && !loading && !error && (
                  <WeatherWidget weatherData={weatherData} location={selectedLocation} />
                )}
              </>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Home', href: '/' },
            { text: 'Weather Dashboard', href: '/weather-dashboard' },
          ]}
          expandAriaLabel="Show path"
          ariaLabel="Breadcrumbs"
        />
      }
      notifications={<Notifications />}
      navigationHide
      toolsHide
    />
  );
}
