// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import Spinner from '@cloudscape-design/components/spinner';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Location } from '../types';
import { useWeatherData } from '../hooks/use-weather-data';
import { CurrentWeatherWidget } from './current-weather';
import { ForecastWidget } from './forecast-widget';
import { LocationSelector } from './location-selector';

const DEFAULT_LOCATION: Location = {
  name: 'New York',
  latitude: 40.7128,
  longitude: -74.006,
  timezone: 'America/New_York',
  country: 'United States',
  admin1: 'New York',
};

export function WeatherDashboard() {
  const [selectedLocation, setSelectedLocation] = useState<Location>(DEFAULT_LOCATION);
  const { data, loading, error, refetch } = useWeatherData(selectedLocation);

  const handleLocationChange = (newLocation: Location) => {
    setSelectedLocation(newLocation);
  };

  if (loading && !data) {
    return (
      <Container>
        <Box textAlign="center" padding="xxl">
          <Spinner size="large" />
          <Box variant="p" margin={{ top: 'm' }}>
            Loading weather data...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert
          statusIconAriaLabel="Error"
          type="error"
          header="Unable to load weather data"
          action={{
            text: 'Retry',
            onClick: refetch,
          }}
        >
          {error.message}
        </Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <Box textAlign="center" color="inherit">
          <b>No weather data available</b>
          <Box variant="p" color="inherit">
            Unable to load weather information.
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h2" description="Search for a location to view its weather conditions">
            Location Settings
          </Header>
        }
      >
        <Grid gridDefinition={[{ colspan: { default: 12, s: 6, m: 4 } }]}>
          <LocationSelector selectedLocation={selectedLocation} onLocationChange={handleLocationChange} />
        </Grid>
      </Container>

      {loading && (
        <Alert type="info">
          <Spinner size="normal" /> Loading weather data for {selectedLocation.name}...
        </Alert>
      )}

      <CurrentWeatherWidget weather={data.current} location={data.location} />

      <ForecastWidget dailyForecast={data.daily} hourlyForecast={data.hourly} />
    </SpaceBetween>
  );
}
