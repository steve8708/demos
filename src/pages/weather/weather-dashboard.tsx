// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect, useCallback } from 'react';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Button from '@cloudscape-design/components/button';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import FormField from '@cloudscape-design/components/form-field';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import Flashbar from '@cloudscape-design/components/flashbar';

import { Navigation } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { WeatherAPI, WeatherData, LocationData } from './weather-api';
import {
  CurrentWeatherWidget,
  DailyForecastWidget,
  HourlyTemperatureChart,
  HourlyPrecipitationChart,
  WeatherSummaryWidget,
} from './weather-widgets';

interface WeatherDashboardState {
  weatherData: WeatherData | null;
  selectedLocation: LocationData | null;
  isLoading: boolean;
  error: string | null;
  searchValue: string;
  searchOptions: LocationData[];
  isSearching: boolean;
  lastUpdated: Date | null;
}

const DEFAULT_LOCATIONS: LocationData[] = [
  { latitude: 40.7128, longitude: -74.006, name: 'New York', country: 'United States' },
  { latitude: 51.5074, longitude: -0.1278, name: 'London', country: 'United Kingdom' },
  { latitude: 48.8566, longitude: 2.3522, name: 'Paris', country: 'France' },
  { latitude: 35.6762, longitude: 139.6503, name: 'Tokyo', country: 'Japan' },
  { latitude: -33.8688, longitude: 151.2093, name: 'Sydney', country: 'Australia' },
];

export function WeatherDashboard() {
  const [state, setState] = useState<WeatherDashboardState>({
    weatherData: null,
    selectedLocation: null,
    isLoading: false,
    error: null,
    searchValue: '',
    searchOptions: DEFAULT_LOCATIONS,
    isSearching: false,
    lastUpdated: null,
  });

  const loadWeatherData = useCallback(async (location: LocationData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const weatherData = await WeatherAPI.getWeatherData(location.latitude, location.longitude);
      setState(prev => ({
        ...prev,
        weatherData,
        selectedLocation: location,
        isLoading: false,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoading: false,
      }));
    }
  }, []);

  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, searchOptions: DEFAULT_LOCATIONS }));
      return;
    }

    setState(prev => ({ ...prev, isSearching: true }));

    try {
      const results = await WeatherAPI.searchLocations(query);
      setState(prev => ({
        ...prev,
        searchOptions: results.length > 0 ? results : DEFAULT_LOCATIONS,
        isSearching: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        searchOptions: DEFAULT_LOCATIONS,
        isSearching: false,
      }));
    }
  }, []);

  // Load default location on mount
  useEffect(() => {
    const defaultLocation = DEFAULT_LOCATIONS[0]; // New York
    loadWeatherData(defaultLocation);
  }, [loadWeatherData]);

  const handleLocationSelect = (option: { value?: string }) => {
    const location = state.searchOptions.find(loc => `${loc.name}, ${loc.country}` === option.value);

    if (location) {
      setState(prev => ({ ...prev, searchValue: option.value || '' }));
      loadWeatherData(location);
    }
  };

  const handleRefresh = () => {
    if (state.selectedLocation) {
      loadWeatherData(state.selectedLocation);
    }
  };

  const formatLocationName = (location: LocationData): string => {
    return location.admin1
      ? `${location.name}, ${location.admin1}, ${location.country}`
      : `${location.name}, ${location.country}`;
  };

  const renderLocationSearch = () => (
    <Container>
      <FormField label="Location" description="Search for a city to view weather data">
        <ColumnLayout columns={2}>
          <Autosuggest
            onChange={({ detail }) => {
              setState(prev => ({ ...prev, searchValue: detail.value }));
              searchLocations(detail.value);
            }}
            onSelect={handleLocationSelect}
            value={state.searchValue}
            options={state.searchOptions.map(location => ({
              value: formatLocationName(location),
              label: formatLocationName(location),
            }))}
            placeholder="Search for a city..."
            loadingText="Searching locations..."
            statusType={state.isSearching ? 'loading' : 'finished'}
            ariaLabel="Location search"
          />
          <Button onClick={handleRefresh} disabled={!state.selectedLocation || state.isLoading} iconName="refresh">
            Refresh Data
          </Button>
        </ColumnLayout>
      </FormField>
    </Container>
  );

  const renderLoadingState = () => (
    <Container>
      <Box textAlign="center" padding={{ vertical: 'xxl' }}>
        <Spinner size="large" />
        <Box variant="h3" margin={{ top: 'm' }}>
          Loading weather data...
        </Box>
      </Box>
    </Container>
  );

  const renderErrorState = () => (
    <Alert
      type="error"
      header="Error loading weather data"
      action={
        <Button onClick={handleRefresh} iconName="refresh">
          Try again
        </Button>
      }
    >
      {state.error}
    </Alert>
  );

  const renderWeatherDashboard = () => {
    if (!state.weatherData || !state.selectedLocation) return null;

    const locationDisplayName = formatLocationName(state.selectedLocation);

    return (
      <SpaceBetween size="l">
        <WeatherSummaryWidget data={state.weatherData} locationName={locationDisplayName} />

        <Grid
          gridDefinition={[
            { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 8, xl: 8 } },
            { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 4, xl: 4 } },
          ]}
        >
          <CurrentWeatherWidget data={state.weatherData} locationName={locationDisplayName} />
          <DailyForecastWidget data={state.weatherData} />
        </Grid>

        <Grid
          gridDefinition={[
            { colspan: { default: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
            { colspan: { default: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
          ]}
        >
          <HourlyTemperatureChart data={state.weatherData} />
          <HourlyPrecipitationChart data={state.weatherData} />
        </Grid>
      </SpaceBetween>
    );
  };

  const flashbarItems = [];
  if (state.lastUpdated) {
    flashbarItems.push({
      type: 'success' as const,
      content: `Weather data last updated at ${state.lastUpdated.toLocaleTimeString()}`,
      dismissible: true,
      id: 'last-updated',
    });
  }

  return (
    <CustomAppLayout
      navigationOpen={false}
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
      navigation={<Navigation activeHref="/weather" />}
      notifications={<Flashbar items={flashbarItems} />}
      content={
        <SpaceBetween size="l">
          <Header
            variant="h1"
            description="Real-time weather data and forecasts powered by Open Meteo API"
            actions={
              <Button
                onClick={handleRefresh}
                disabled={!state.selectedLocation || state.isLoading}
                iconName="refresh"
                loading={state.isLoading}
              >
                Refresh
              </Button>
            }
          >
            Weather Dashboard
          </Header>

          {renderLocationSearch()}

          {state.error && renderErrorState()}

          {state.isLoading && renderLoadingState()}

          {!state.isLoading && !state.error && renderWeatherDashboard()}
        </SpaceBetween>
      }
      toolsHide={true}
      contentType="dashboard"
    />
  );
}
