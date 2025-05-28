// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import Flashbar, { FlashbarProps } from '@cloudscape-design/components/flashbar';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Navigation } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { ForecastTable } from './components/forecast-table';
import { LocationSearch } from './components/location-search';
import { WeatherCard } from './components/weather-card';
import { LocationData, WeatherData, WeatherService } from './weather-service';

export function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<FlashbarProps.MessageDefinition[]>([]);

  const handleLocationSelect = async (location: LocationData) => {
    setLoading(true);
    setSelectedLocation(location);

    try {
      const weather = await WeatherService.getCurrentWeather(location.latitude, location.longitude);
      setWeatherData(weather);

      // Show success notification
      setNotifications([
        {
          type: 'success',
          content: `Weather data loaded for ${location.name}`,
          dismissible: true,
          onDismiss: () => setNotifications([]),
          id: 'weather-success',
        },
      ]);
    } catch (error) {
      console.error('Error fetching weather:', error);

      // Show error notification
      setNotifications([
        {
          type: 'error',
          content: 'Failed to fetch weather data. Please try again.',
          dismissible: true,
          onDismiss: () => setNotifications([]),
          id: 'weather-error',
        },
      ]);

      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedLocation) {
      handleLocationSelect(selectedLocation);
    }
  };

  const getLocationDisplayName = (location: LocationData) => {
    if (location.name === 'Current Location') {
      return 'Current Location';
    }
    return location.admin1
      ? `${location.name}, ${location.admin1}, ${location.country}`
      : `${location.name}, ${location.country}`;
  };

  return (
    <CustomAppLayout
      content={
        <SpaceBetween size="l">
          <Header
            variant="h1"
            description="Real-time weather data and forecasts powered by Open Meteo API"
            actions={
              weatherData && (
                <Button onClick={handleRefresh} loading={loading} iconName="refresh">
                  Refresh
                </Button>
              )
            }
          >
            Weather Dashboard
          </Header>

          <LocationSearch onLocationSelect={handleLocationSelect} loading={loading} />

          {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading weather data...</div>}

          {weatherData && selectedLocation && (
            <SpaceBetween size="l">
              <WeatherCard weather={weatherData} locationName={getLocationDisplayName(selectedLocation)} />
              <ForecastTable weather={weatherData} />
            </SpaceBetween>
          )}
        </SpaceBetween>
      }
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Home', href: '/' },
            { text: 'Weather Dashboard', href: '/weather' },
          ]}
          expandAriaLabel="Show path"
          ariaLabel="Breadcrumbs"
        />
      }
      notifications={<Flashbar items={notifications} stackItems={true} />}
      navigation={<Navigation activeHref="/weather" />}
      navigationOpen={false}
      toolsHide={true}
    />
  );
}
