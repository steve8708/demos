// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import Spinner from '@cloudscape-design/components/spinner';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

import { WeatherCard } from './weather-card';
import { WeatherForecast } from './weather-forecast';
import { LocationSelector } from './location-selector';
import { getCurrentWeather, getWeatherForecast } from '../utils/weather-api';
import { WeatherData, ForecastData, WeatherLocation } from '../types';

export function WeatherDashboard() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation>({
    name: 'Seattle, WA',
    latitude: 47.6062,
    longitude: -122.3321,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (location: WeatherLocation) => {
    setLoading(true);
    setError(null);

    try {
      const [currentData, forecastData] = await Promise.all([
        getCurrentWeather(location.latitude, location.longitude),
        getWeatherForecast(location.latitude, location.longitude),
      ]);

      setCurrentWeather(currentData);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedLocation);
  }, [selectedLocation]);

  const handleLocationChange = (location: WeatherLocation) => {
    setSelectedLocation(location);
  };

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" padding="xl">
          <SpaceBetween size="m">
            <Spinner size="large" />
            <Box variant="h3">Loading weather data...</Box>
          </SpaceBetween>
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
          action={<button onClick={() => fetchWeatherData(selectedLocation)}>Retry</button>}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <SpaceBetween size="l">
      <Container>
        <SpaceBetween size="m">
          <Header variant="h2">Location</Header>
          <LocationSelector selectedLocation={selectedLocation} onLocationChange={handleLocationChange} />
        </SpaceBetween>
      </Container>

      {currentWeather && (
        <Container>
          <SpaceBetween size="m">
            <Header variant="h2">Current Weather</Header>
            <Grid
              gridDefinition={[
                { colspan: { default: 12, xs: 12, s: 6, m: 6, l: 4, xl: 3 } },
                { colspan: { default: 12, xs: 12, s: 6, m: 6, l: 4, xl: 3 } },
                { colspan: { default: 12, xs: 12, s: 6, m: 6, l: 4, xl: 3 } },
                { colspan: { default: 12, xs: 12, s: 6, m: 6, l: 4, xl: 3 } },
              ]}
            >
              <WeatherCard
                title="Temperature"
                value={`${currentWeather.temperature}°C`}
                description={`Feels like ${currentWeather.apparent_temperature}°C`}
                icon="status-positive"
              />
              <WeatherCard
                title="Humidity"
                value={`${currentWeather.humidity}%`}
                description="Relative humidity"
                icon="status-info"
              />
              <WeatherCard
                title="Wind Speed"
                value={`${currentWeather.wind_speed} km/h`}
                description={`Direction: ${currentWeather.wind_direction}°`}
                icon="status-warning"
              />
              <WeatherCard
                title="Weather Code"
                value={currentWeather.weather_code.toString()}
                description="WMO Weather interpretation"
                icon="status-pending"
              />
            </Grid>
          </SpaceBetween>
        </Container>
      )}

      {forecast && (
        <Container>
          <SpaceBetween size="m">
            <Header variant="h2" description="7-day weather forecast">
              Weather Forecast
            </Header>
            <WeatherForecast forecast={forecast} />
          </SpaceBetween>
        </Container>
      )}
    </SpaceBetween>
  );
}
