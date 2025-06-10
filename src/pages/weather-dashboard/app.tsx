// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState, useEffect } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Select from '@cloudscape-design/components/select';
import Alert from '@cloudscape-design/components/alert';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { Breadcrumbs, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { WeatherDashboardHeader, WeatherDashboardContent } from './components';
import { WeatherService } from './weather-service';
import { DEFAULT_LOCATIONS, LocationData, WeatherApiResponse } from './types';

import '@cloudscape-design/global-styles/dark-mode-utils.css';

export function App() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(DEFAULT_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const locationOptions = DEFAULT_LOCATIONS.map(location => ({
    label: `${location.name}, ${location.country}`,
    value: location.name,
    description: `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
  }));

  const fetchWeatherData = async (location: LocationData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await WeatherService.getCompleteWeatherData(location);
      setWeatherData(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedLocation);
  }, [selectedLocation]);

  const handleLocationChange = (detail: any) => {
    const location = DEFAULT_LOCATIONS.find(loc => loc.name === detail.selectedOption.value);
    if (location) {
      setSelectedLocation(location);
    }
  };

  const handleRefresh = () => {
    fetchWeatherData(selectedLocation);
  };

  const headerActions = (
    <SpaceBetween direction="horizontal" size="s">
      <Select
        selectedOption={locationOptions.find(opt => opt.value === selectedLocation.name) || null}
        onChange={({ detail }) => handleLocationChange(detail)}
        options={locationOptions}
        placeholder="Select location"
        loadingText="Loading locations"
        statusType={loading ? 'loading' : 'finished'}
      />
      <Button variant="normal" iconName="refresh" onClick={handleRefresh} loading={loading}>
        Refresh
      </Button>
    </SpaceBetween>
  );

  const statusInfo = lastUpdate && (
    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-body-secondary)' }}>
      <StatusIndicator type={error ? 'error' : 'success'}>
        {error ? 'Error loading data' : `Last updated: ${lastUpdate.toLocaleTimeString()}`}
      </StatusIndicator>
    </div>
  );

  return (
    <CustomAppLayout
      ref={appLayout}
      content={
        <SpaceBetween size="m">
          <WeatherDashboardHeader actions={headerActions} location={selectedLocation} statusInfo={statusInfo} />
          {error && (
            <Alert type="error" header="Weather data unavailable">
              {error}. Please try refreshing the data or selecting a different location.
            </Alert>
          )}
          <WeatherDashboardContent weatherData={weatherData} location={selectedLocation} loading={loading} />
        </SpaceBetween>
      }
      breadcrumbs={<Breadcrumbs items={[{ text: 'Weather Dashboard', href: '#/weather-dashboard' }]} />}
      navigationHide={true}
      toolsHide={true}
      notifications={<Notifications />}
    />
  );
}
