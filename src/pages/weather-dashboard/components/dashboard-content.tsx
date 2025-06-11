// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect, useCallback } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Alert from '@cloudscape-design/components/alert';

import { WeatherData, LocationData } from '../types';
import { fetchWeatherData, DEFAULT_LOCATIONS } from '../api';
import { DashboardHeader } from './dashboard-header';
import { LocationSelector } from './location-selector';
import { TemperatureToggle } from './temperature-toggle';
import { CurrentWeather } from './current-weather';
import { DailyForecastWidget } from './daily-forecast';
import { HourlyForecastWidget } from './hourly-forecast';
import { TemperatureChart } from './temperature-chart';
import { PrecipitationChart } from './precipitation-chart';

/**
 * Main dashboard content component that manages weather data state and renders all weather widgets.
 * Handles location selection, temperature unit preferences, data loading, error states, and UI layout.
 *
 * @returns {JSX.Element} The complete weather dashboard content with all widgets and controls
 */
export function DashboardContent() {
  /** Currently selected location for weather data */
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(DEFAULT_LOCATIONS[0]);
  /** Weather data fetched from the API, null when not loaded */
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  /** Loading state indicator for API requests */
  const [loading, setLoading] = useState(false);
  /** Error message from failed API requests, null when no error */
  const [error, setError] = useState<string | null>(null);
  /** Temperature unit preference - true for Fahrenheit, false for Celsius */
  const [useFahrenheit, setUseFahrenheit] = useState(false);

  /**
   * Loads weather data for a specific location from the Open-Meteo API.
   * Manages loading states and error handling during the fetch process.
   *
   * @param {LocationData} location - The location object containing latitude, longitude, and display info
   * @returns {Promise<void>} Promise that resolves when data loading is complete
   */
  const loadWeatherData = useCallback(async (location: LocationData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weather data';
      setError(errorMessage);
      console.error('Weather data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handles location change events from the location selector component.
   * Updates the selected location state and triggers a new data fetch.
   *
   * @param {LocationData} location - The newly selected location
   */
  const handleLocationChange = useCallback(
    (location: LocationData) => {
      setSelectedLocation(location);
      loadWeatherData(location);
    },
    [loadWeatherData],
  );

  /**
   * Handles refresh button clicks to reload weather data for the current location.
   * Useful for getting the latest weather information.
   */
  const handleRefresh = useCallback(() => {
    loadWeatherData(selectedLocation);
  }, [loadWeatherData, selectedLocation]);

  // Load initial data when component mounts or selected location changes
  useEffect(() => {
    loadWeatherData(selectedLocation);
  }, [loadWeatherData, selectedLocation]);

  /**
   * Renders the main dashboard content based on current state.
   * Shows loading indicators, error messages, or the complete weather dashboard.
   *
   * @returns {JSX.Element} Content to display in the main dashboard area
   */
  const renderContent = () => {
    if (loading && !weatherData) {
      return (
        <Box textAlign="center" padding="xxl">
          <StatusIndicator type="loading">Loading weather data...</StatusIndicator>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert
          statusIconAriaLabel="Error"
          type="error"
          header="Failed to load weather data"
          action={<button onClick={handleRefresh}>Retry</button>}
        >
          {error}
        </Alert>
      );
    }

    if (!weatherData) {
      return (
        <Box textAlign="center" padding="xxl">
          <StatusIndicator type="stopped">No weather data available</StatusIndicator>
        </Box>
      );
    }

    return (
      <SpaceBetween size="l">
        {/* Control panel with location selector and temperature unit toggle */}
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xs: 12, s: 6, m: 4, l: 4, xl: 3 } },
            { colspan: { default: 12, xs: 12, s: 6, m: 4, l: 4, xl: 3 } },
          ]}
        >
          <LocationSelector
            locations={DEFAULT_LOCATIONS}
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
            loading={loading}
          />
          <TemperatureToggle useFahrenheit={useFahrenheit} onChange={setUseFahrenheit} />
        </Grid>

        {/* Current weather conditions display */}
        <CurrentWeather data={weatherData} location={selectedLocation} useFahrenheit={useFahrenheit} />

        {/* 7-day forecast with horizontal scroll */}
        <DailyForecastWidget data={weatherData} useFahrenheit={useFahrenheit} />

        {/* Charts section with temperature trends and precipitation */}
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
            { colspan: { default: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
          ]}
        >
          <TemperatureChart data={weatherData} useFahrenheit={useFahrenheit} />
          <PrecipitationChart data={weatherData} />
        </Grid>

        {/* 24-hour detailed forecast table */}
        <HourlyForecastWidget data={weatherData} useFahrenheit={useFahrenheit} />
      </SpaceBetween>
    );
  };

  return (
    <SpaceBetween size="l">
      {/* Dashboard header with location info and refresh controls */}
      <DashboardHeader location={selectedLocation} onRefresh={handleRefresh} loading={loading} />

      {/* Main dashboard content area */}
      {renderContent()}
    </SpaceBetween>
  );
}
