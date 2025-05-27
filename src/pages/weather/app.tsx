// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';

import AppLayout from '@cloudscape-design/components/app-layout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Alert from '@cloudscape-design/components/alert';

import { Navigation } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { LocationSelector } from './components/location-selector';
import {
  CurrentWeatherWidget,
  HourlyForecastWidget,
  WeeklyForecastWidget,
  WeatherAlertWidget,
  WeatherLoadingWidgets,
} from './components/weather-widgets';
import { WeatherData, WeatherLocation, POPULAR_LOCATIONS } from './types';
import { fetchWeatherData, WeatherApiError } from './api';

export function WeatherApp() {
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation>(POPULAR_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeatherData = async (location: WeatherLocation) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err) {
      if (err instanceof WeatherApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while loading weather data');
      }
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(selectedLocation);
  }, [selectedLocation]);

  const handleLocationChange = (location: WeatherLocation) => {
    setSelectedLocation(location);
  };

  const handleRetry = () => {
    loadWeatherData(selectedLocation);
  };

  const renderContent = () => {
    if (error) {
      return (
        <SpaceBetween size="m">
          <LocationSelector
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
            loading={loading}
          />
          <SpaceBetween size="m">
            <Alert type="error" header="Failed to load weather data">
              {error}
            </Alert>
            <Button onClick={handleRetry} variant="primary">
              Retry
            </Button>
          </SpaceBetween>
        </SpaceBetween>
      );
    }

    return (
      <SpaceBetween size="m">
        <LocationSelector
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          loading={loading}
        />

        {loading || !weatherData ? (
          <WeatherLoadingWidgets />
        ) : (
          <Grid
            gridDefinition={[
              { colspan: { default: 12, xs: 12, s: 6, m: 4, l: 4, xl: 4 } },
              { colspan: { default: 12, xs: 12, s: 6, m: 8, l: 8, xl: 8 } },
              { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 12, xl: 12 } },
            ]}
          >
            <CurrentWeatherWidget weather={weatherData} locationName={selectedLocation.name} />
            <HourlyForecastWidget weather={weatherData} locationName={selectedLocation.name} />
            <WeeklyForecastWidget weather={weatherData} locationName={selectedLocation.name} />
          </Grid>
        )}
      </SpaceBetween>
    );
  };

  return (
    <CustomAppLayout
      contentType="dashboard"
      navigationOpen={false}
      toolsHide={true}
      navigation={<Navigation activeHref="/weather" />}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Cloudscape Demos', href: '/' },
            { text: 'Weather Dashboard', href: '/weather' },
          ]}
          expandAriaLabel="Show path"
          ariaLabel="Breadcrumbs"
        />
      }
      content={
        <SpaceBetween size="l">
          <Header variant="h1" description="Real-time weather information and forecasts powered by Open Meteo API">
            Weather Dashboard
          </Header>
          {renderContent()}
        </SpaceBetween>
      }
    />
  );
}
