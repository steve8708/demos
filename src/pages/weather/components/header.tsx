// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import SpaceBetween from '@cloudscape-design/components/space-between';
import FormField from '@cloudscape-design/components/form-field';
import RadioGroup from '@cloudscape-design/components/radio-group';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';

import { ExternalLinkGroup, InfoLink, useHelpPanel } from '../../commons';
import { useWeatherContext } from '../context/weather-context';
import { UNITS, DEFAULT_LOCATION } from '../utils/constants';

export function WeatherMainInfo() {
  const setHelpPanelContent = useHelpPanel('main');

  return (
    <SpaceBetween size="l">
      <Box variant="h3">Weather Dashboard</Box>

      <Box variant="p">
        This dashboard provides real-time weather data and forecasts powered by Open Meteo API.{' '}
        <InfoLink
          onFollow={() => setHelpPanelContent(<WeatherInformationHelpPanel />)}
          ariaLabel="Information about weather data source"
        />
      </Box>

      <Box variant="h3">Features</Box>
      <ColumnLayout columns={2} variant="text-grid">
        <SpaceBetween size="l">
          <div>
            <Box variant="h4">Current Weather</Box>
            <Box variant="p">Real-time weather conditions including temperature, humidity, and wind.</Box>
          </div>
          <div>
            <Box variant="h4">Hourly Forecast</Box>
            <Box variant="p">Hour-by-hour forecast for the next 24 hours.</Box>
          </div>
        </SpaceBetween>
        <SpaceBetween size="l">
          <div>
            <Box variant="h4">Daily Forecast</Box>
            <Box variant="p">7-day forecast showing daily high/low temperatures and conditions.</Box>
          </div>
          <div>
            <Box variant="h4">Weather Charts</Box>
            <Box variant="p">Visual representation of temperature and precipitation trends.</Box>
          </div>
        </SpaceBetween>
      </ColumnLayout>
    </SpaceBetween>
  );
}

export function WeatherInformationHelpPanel() {
  return (
    <SpaceBetween size="l">
      <Box variant="h2">About Weather Data</Box>
      <Box variant="p">
        This dashboard displays weather data provided by the Open Meteo API, a free and open-source weather forecasting
        service.
      </Box>
      <ExternalLinkGroup
        header="Additional resources"
        items={[
          {
            href: 'https://open-meteo.com/',
            text: 'Open Meteo Website',
          },
          {
            href: 'https://open-meteo.com/en/docs',
            text: 'API Documentation',
          },
        ]}
      />
    </SpaceBetween>
  );
}

export function WeatherHeader() {
  const { location, setLocation, units, setUnits, fetchWeatherData, loading } = useWeatherContext();

  const [locationInput, setLocationInput] = useState(
    `${location.name || ''} (${location.latitude}, ${location.longitude})`,
  );
  const [showLocationInput, setShowLocationInput] = useState(false);

  const handleLocationSearch = () => {
    if (locationInput) {
      // For simplicity in this demo, we extract coordinates from the input
      // In a real app, you'd use a geocoding service
      const coordsMatch = locationInput.match(/\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
      if (coordsMatch) {
        const newLocation = {
          name: locationInput.split('(')[0].trim() || 'Custom Location',
          latitude: parseFloat(coordsMatch[1]),
          longitude: parseFloat(coordsMatch[2]),
        };
        setLocation(newLocation);
        fetchWeatherData(newLocation);
        setShowLocationInput(false);
      } else {
        // Fallback to default location for demo purposes
        setLocation(DEFAULT_LOCATION);
        fetchWeatherData(DEFAULT_LOCATION);
        setShowLocationInput(false);
      }
    }
  };

  const handleUnitsChange = (event: { detail: { value: string } }) => {
    setUnits(event.detail.value as 'metric' | 'imperial');
  };

  return (
    <Container>
      <Header
        variant="h1"
        description={
          !showLocationInput &&
          `Current location: ${location.name || 'Unknown'} (${location.latitude}, ${location.longitude})`
        }
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            {showLocationInput ? (
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => setShowLocationInput(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleLocationSearch} disabled={loading}>
                  Search
                </Button>
              </SpaceBetween>
            ) : (
              <Button onClick={() => setShowLocationInput(true)} disabled={loading}>
                Change location
              </Button>
            )}
          </SpaceBetween>
        }
      >
        Weather Dashboard
      </Header>

      {showLocationInput && (
        <SpaceBetween size="l" direction="horizontal" alignItems="end">
          <FormField label="Location" description="Enter a location name with coordinates (latitude, longitude)">
            <Input
              value={locationInput}
              onChange={event => setLocationInput(event.detail.value)}
              placeholder="City Name (latitude, longitude)"
            />
          </FormField>

          <FormField label="Units">
            <RadioGroup
              items={[
                { value: 'metric', label: 'Metric (°C, km/h)' },
                { value: 'imperial', label: 'Imperial (°F, mph)' },
              ]}
              value={units}
              onChange={handleUnitsChange}
            />
          </FormField>
        </SpaceBetween>
      )}
    </Container>
  );
}
