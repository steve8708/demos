// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import Button from '@cloudscape-design/components/button';

import { WeatherCard, WeatherMetricsGrid } from './weather-card';
import { LocationSearch } from './location-search';
import { WeatherData, WeatherLocation, WEATHER_CODES } from '../types';
import { WeatherApiService } from '../services/weather-api';
import { TestWeather } from '../test-weather';

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<WeatherLocation | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeatherData = async (newLocation: WeatherLocation) => {
    console.log('loadWeatherData called with:', newLocation);
    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling WeatherApiService.getWeatherData...');
      const data = await WeatherApiService.getWeatherData(newLocation);
      console.log('Weather data received:', data);
      setWeatherData(data);
      setLocation(newLocation);

      if (!newLocation.city) {
        console.log('Getting location name for coordinates...');
        const name = await WeatherApiService.getReverseGeocode(newLocation.latitude, newLocation.longitude);
        setLocationName(name);
      } else {
        setLocationName(newLocation.city + (newLocation.country ? `, ${newLocation.country}` : ''));
      }
      console.log('Weather data loading completed successfully');
    } catch (err) {
      console.error('Error in loadWeatherData:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weather data';
      setError(errorMessage);
      throw err; // Re-throw to be caught by the calling function
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectAPI = async () => {
    try {
      const testUrl =
        'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m&timezone=auto';
      console.log('Testing direct API call:', testUrl);
      const response = await fetch(testUrl);
      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error('Direct API test failed:', error);
      throw error;
    }
  };

  const initializeWithCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First test if the API is accessible at all
      console.log('Testing direct API access...');
      await testDirectAPI();
      console.log('Direct API test successful');

      // Try to get current location
      console.log('Attempting to get current location...');
      const currentLocation = await WeatherApiService.getCurrentPosition();
      console.log('Got current location:', currentLocation);
      await loadWeatherData(currentLocation);
    } catch (err) {
      console.warn('Geolocation failed, trying default location:', err);
      // Fallback to a default location (London, UK) when geolocation fails
      const defaultLocation: WeatherLocation = {
        latitude: 51.5074,
        longitude: -0.1278,
        city: 'London',
        country: 'United Kingdom',
      };

      try {
        console.log('Loading weather data for default location:', defaultLocation);
        await loadWeatherData(defaultLocation);
        setError('Unable to get your location. Showing weather for London. Please search for your city.');
      } catch (fallbackErr) {
        console.error('Fallback location also failed:', fallbackErr);
        setError(
          `Unable to load weather data: ${fallbackErr instanceof Error ? fallbackErr.message : 'Unknown error'}`,
        );
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    initializeWithCurrentLocation();
  }, []);

  const handleLocationSelect = (newLocation: WeatherLocation) => {
    loadWeatherData(newLocation);
  };

  const getWeatherDescription = (code: number) => {
    return WEATHER_CODES[code]?.description || 'Unknown';
  };

  const getWeatherIcon = (code: number) => {
    return WEATHER_CODES[code]?.icon || 'status-info';
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const hourlyChartData = weatherData
    ? weatherData.hourly.time.map((time, index) => ({
        x: new Date(time),
        y: weatherData.hourly.temperature[index],
      }))
    : [];

  const dailyTableItems = weatherData
    ? weatherData.daily.time.map((time, index) => ({
        date: formatDate(time),
        weather: getWeatherDescription(weatherData.daily.weatherCode[index]),
        tempMax: `${Math.round(weatherData.daily.temperatureMax[index])}°C`,
        tempMin: `${Math.round(weatherData.daily.temperatureMin[index])}°C`,
        precipitation: `${weatherData.daily.precipitation[index]}mm`,
        windSpeed: `${Math.round(weatherData.daily.windSpeedMax[index])}km/h`,
        uvIndex: weatherData.daily.uvIndexMax[index],
        weatherIcon: getWeatherIcon(weatherData.daily.weatherCode[index]),
      }))
    : [];

  if (error && !weatherData) {
    return (
      <SpaceBetween size="l">
        <LocationSearch onLocationSelect={handleLocationSelect} isLoading={isLoading} />
        <Alert type="error" header="Unable to load weather data">
          {error}
          <Box margin={{ top: 's' }}>
            <Button onClick={initializeWithCurrentLocation} loading={isLoading}>
              Try again
            </Button>
          </Box>
        </Alert>
      </SpaceBetween>
    );
  }

  return (
    <SpaceBetween size="l">
      <TestWeather />
      <LocationSearch onLocationSelect={handleLocationSelect} isLoading={isLoading} />

      {isLoading && !weatherData && (
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            Loading weather data...
          </Box>
        </Box>
      )}

      {error && weatherData && (
        <Alert type="warning" dismissible onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {weatherData && (
        <SpaceBetween size="l">
          {/* Current Weather Card */}
          <WeatherCard
            title={`Current Weather in ${locationName}`}
            icon="status-positive"
            actions={
              <Button onClick={() => location && loadWeatherData(location)} iconName="refresh" loading={isLoading}>
                Refresh
              </Button>
            }
          >
            <Grid gridDefinition={[{ colspan: { default: 12, s: 6 } }, { colspan: { default: 12, s: 6 } }]}>
              <SpaceBetween size="s">
                <Box fontSize="display-l">{Math.round(weatherData.current.temperature)}°C</Box>
                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                  <StatusIndicator type={getWeatherIcon(weatherData.current.weatherCode) as any}>
                    {getWeatherDescription(weatherData.current.weatherCode)}
                  </StatusIndicator>
                </SpaceBetween>
                <Box variant="small" color="text-body-secondary">
                  Last updated: {formatTime(weatherData.current.time)}
                </Box>
              </SpaceBetween>
              <WeatherMetricsGrid
                metrics={[
                  { label: 'Humidity', value: weatherData.current.humidity, unit: '%', icon: 'status-info' },
                  {
                    label: 'Wind Speed',
                    value: Math.round(weatherData.current.windSpeed),
                    unit: 'km/h',
                    icon: 'status-info',
                  },
                  {
                    label: 'Pressure',
                    value: Math.round(weatherData.current.pressure),
                    unit: 'hPa',
                    icon: 'status-info',
                  },
                  { label: 'UV Index', value: Math.round(weatherData.current.uvIndex), icon: 'status-warning' },
                ]}
              />
            </Grid>
          </WeatherCard>

          {/* Hourly Temperature Chart */}
          <WeatherCard title="24-Hour Temperature Trend" icon="status-info">
            <LineChart
              series={[
                {
                  title: 'Temperature',
                  type: 'line',
                  data: hourlyChartData,
                  valueFormatter: value => `${Math.round(value)}°C`,
                },
              ]}
              xDomain={[hourlyChartData[0]?.x, hourlyChartData[hourlyChartData.length - 1]?.x]}
              yDomain={[
                Math.min(...weatherData.hourly.temperature) - 2,
                Math.max(...weatherData.hourly.temperature) + 2,
              ]}
              xTitle="Time"
              yTitle="Temperature (°C)"
              height={300}
              hideFilter
              hideLegend
              statusType="finished"
              xScaleType="time"
            />
          </WeatherCard>

          {/* 7-Day Forecast */}
          <WeatherCard title="7-Day Forecast" icon="status-info">
            <Table
              columnDefinitions={[
                {
                  id: 'date',
                  header: 'Date',
                  cell: item => item.date,
                  sortingField: 'date',
                },
                {
                  id: 'weather',
                  header: 'Weather',
                  cell: item => (
                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                      <StatusIndicator type={item.weatherIcon as any} />
                      {item.weather}
                    </SpaceBetween>
                  ),
                },
                {
                  id: 'temperature',
                  header: 'Temperature',
                  cell: item => (
                    <SpaceBetween direction="horizontal" size="xs">
                      <Badge color="red">{item.tempMax}</Badge>
                      <Badge color="blue">{item.tempMin}</Badge>
                    </SpaceBetween>
                  ),
                },
                {
                  id: 'precipitation',
                  header: 'Precipitation',
                  cell: item => item.precipitation,
                },
                {
                  id: 'wind',
                  header: 'Wind',
                  cell: item => item.windSpeed,
                },
                {
                  id: 'uv',
                  header: 'UV Index',
                  cell: item => (
                    <Badge color={item.uvIndex > 7 ? 'red' : item.uvIndex > 5 ? 'blue' : 'green'}>{item.uvIndex}</Badge>
                  ),
                },
              ]}
              items={dailyTableItems}
              loadingText="Loading forecast"
              empty={
                <Box textAlign="center" color="inherit">
                  <Box variant="strong" textAlign="center" color="inherit">
                    No forecast data available
                  </Box>
                </Box>
              }
              header={<Header>Daily Forecast</Header>}
            />
          </WeatherCard>
        </SpaceBetween>
      )}
    </SpaceBetween>
  );
}
