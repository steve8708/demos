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
import Button from '@cloudscape-design/components/button';

import { WeatherCard } from './weather-card';
import { WeatherForecast } from './weather-forecast';
import { LocationSelector } from './location-selector';
import { getCurrentWeather, getWeatherForecast } from '../utils/weather-api';
import { getCurrentWeatherSimple } from '../utils/weather-api-simple';
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
  const [debugInfo, setDebugInfo] = useState<string>('');

  const fetchWeatherData = async (location: WeatherLocation) => {
    setLoading(true);
    setError(null);
    setDebugInfo(`Fetching data for ${location.name} (${location.latitude}, ${location.longitude})`);

    try {
      // First try the detailed API
      console.log('Attempting detailed API call...');
      setDebugInfo('Trying detailed API format...');

      const [currentData, forecastData] = await Promise.all([
        getCurrentWeather(location.latitude, location.longitude),
        getWeatherForecast(location.latitude, location.longitude),
      ]);

      setCurrentWeather(currentData);
      setForecast(forecastData);
      setDebugInfo('Success with detailed API!');
    } catch (detailedError) {
      console.error('Detailed API failed, trying simple format:', detailedError);
      setDebugInfo('Detailed API failed, trying simple format...');

      try {
        // Fallback to simple API
        const [currentData, forecastData] = await Promise.all([
          getCurrentWeatherSimple(location.latitude, location.longitude),
          getWeatherForecast(location.latitude, location.longitude),
        ]);

        setCurrentWeather(currentData);
        setForecast(forecastData);
        setDebugInfo('Success with simple API!');
      } catch (simpleError) {
        console.error('Both API formats failed:', simpleError);
        setError(
          `Failed to fetch weather data: ${simpleError instanceof Error ? simpleError.message : 'Unknown error'}`,
        );
        setDebugInfo(
          `Both API formats failed. Last error: ${simpleError instanceof Error ? simpleError.message : 'Unknown error'}`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const testApiDirectly = async () => {
    setDebugInfo('Testing API directly...');

    try {
      // Test the exact URL in browser
      const testUrl = `https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current_weather=true`;
      setDebugInfo(`Testing URL: ${testUrl}`);

      const response = await fetch(testUrl);
      const data = await response.json();

      console.log('Direct test result:', data);
      setDebugInfo(`Direct test successful! Data: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Direct test failed:', error);
      setDebugInfo(`Direct test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            {debugInfo && (
              <Box variant="small" color="text-status-inactive">
                {debugInfo}
              </Box>
            )}
          </SpaceBetween>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <SpaceBetween size="m">
          <Alert
            statusIconAriaLabel="Error"
            type="error"
            header="Unable to load weather data"
            action={
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => fetchWeatherData(selectedLocation)}>Retry</Button>
                <Button onClick={testApiDirectly}>Test API</Button>
              </SpaceBetween>
            }
          >
            {error}
          </Alert>

          {debugInfo && (
            <Alert type="info" header="Debug Information">
              <Box variant="code">{debugInfo}</Box>
            </Alert>
          )}

          <Alert type="info" header="Troubleshooting">
            <Box variant="p">This error might be caused by:</Box>
            <Box variant="ul">
              <li>Network connectivity issues</li>
              <li>CORS restrictions in the browser</li>
              <li>Open Meteo API being temporarily unavailable</li>
              <li>Incorrect API endpoint or parameters</li>
            </Box>
            <Box variant="p">Try the "Test API" button to check if the API is accessible directly.</Box>
          </Alert>
        </SpaceBetween>
      </Container>
    );
  }

  return (
    <SpaceBetween size="l">
      <Container>
        <SpaceBetween size="m">
          <Header variant="h2">Location</Header>
          <LocationSelector selectedLocation={selectedLocation} onLocationChange={handleLocationChange} />
          {debugInfo && (
            <Box variant="small" color="text-status-success">
              Status: {debugInfo}
            </Box>
          )}
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
                emoji="🌡️"
              />
              <WeatherCard
                title="Humidity"
                value={`${currentWeather.humidity}%`}
                description="Relative humidity"
                emoji="💧"
              />
              <WeatherCard
                title="Wind Speed"
                value={`${currentWeather.wind_speed} km/h`}
                description={`Direction: ${currentWeather.wind_direction}°`}
                emoji="💨"
              />
              <WeatherCard
                title="Current Weather"
                value={currentWeather.weather_code.toString()}
                description="WMO Weather interpretation"
                weatherCode={currentWeather.weather_code}
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
