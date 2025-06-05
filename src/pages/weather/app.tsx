// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect, useCallback } from 'react';

import Alert from '@cloudscape-design/components/alert';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Navigation } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { LocationSelector } from './components/location-selector';
import { WeatherWidget } from './components/weather-widget';
import { WeatherLocation, OpenMeteoResponse, WeatherDisplayData, WeatherError, WEATHER_CONDITIONS } from './types';

const DEFAULT_LOCATION: WeatherLocation = {
  id: 'vancouver',
  name: 'Vancouver',
  latitude: 49.2827,
  longitude: -123.1207,
  country: 'CA',
  admin1: 'British Columbia',
};

export function App() {
  const [currentLocation, setCurrentLocation] = useState<WeatherLocation>(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState<WeatherDisplayData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<WeatherError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeatherData = useCallback(async (location: WeatherLocation) => {
    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = 'https://api.open-meteo.com/v1/forecast';
      const currentParams = new URLSearchParams({
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'is_day',
          'precipitation',
          'rain',
          'showers',
          'snowfall',
          'weather_code',
          'cloud_cover',
          'pressure_msl',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m',
        ].join(','),
        hourly: [
          'temperature_2m',
          'precipitation_probability',
          'precipitation',
          'rain',
          'showers',
          'snowfall',
          'weather_code',
          'pressure_msl',
          'cloud_cover',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m',
          'relative_humidity_2m',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'apparent_temperature_max',
          'apparent_temperature_min',
          'sunrise',
          'sunset',
          'uv_index_max',
          'precipitation_sum',
          'rain_sum',
          'showers_sum',
          'snowfall_sum',
          'precipitation_probability_max',
          'wind_speed_10m_max',
          'wind_gusts_10m_max',
          'wind_direction_10m_dominant',
        ].join(','),
        timezone: 'auto',
        forecast_days: '7',
      });

      const response = await fetch(`${baseUrl}?${currentParams}`);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: OpenMeteoResponse = await response.json();

      // Transform API data to display format
      const transformedData: WeatherDisplayData = {
        current: {
          temperature: data.current.temperature_2m,
          condition: data.current.weather_code.toString(),
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          pressure: data.current.pressure_msl,
          visibility: 0, // Not available in current response
          uvIndex: 0, // Not available in current response
          precipitation: data.current.precipitation,
          time: data.current.time,
        },
        forecast: data.daily
          ? data.daily.time.map((date, index) => ({
              date,
              maxTemp: data.daily!.temperature_2m_max[index],
              minTemp: data.daily!.temperature_2m_min[index],
              condition: data.daily!.weather_code[index].toString(),
              precipitationProbability: data.daily!.precipitation_probability_max[index] || 0,
              windSpeed: data.daily!.wind_speed_10m_max[index],
            }))
          : [],
        hourlyForecast: data.hourly
          ? data.hourly.time.map((time, index) => ({
              time,
              temperature: data.hourly!.temperature_2m[index],
              precipitation: data.hourly!.precipitation[index],
              humidity: data.hourly!.relative_humidity_2m[index],
              windSpeed: data.hourly!.wind_speed_10m[index],
            }))
          : [],
      };

      setWeatherData(transformedData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError({
        error: true,
        reason: err instanceof Error ? err.message : 'Failed to fetch weather data',
      });
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData(currentLocation);
  }, [currentLocation, fetchWeatherData]);

  const handleLocationChange = useCallback((location: WeatherLocation) => {
    setCurrentLocation(location);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchWeatherData(currentLocation);
  }, [currentLocation, fetchWeatherData]);

  return (
    <CustomAppLayout
      contentType="dashboard"
      breadcrumbs={
        <BreadcrumbGroup
          items={[{ text: 'Weather Dashboard', href: '#/weather' }]}
          expandAriaLabel="Show path"
          ariaLabel="Breadcrumbs"
        />
      }
      navigation={<Navigation activeHref="#/weather" />}
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button iconName="refresh" onClick={handleRefresh} loading={isLoading}>
                    Refresh
                  </Button>
                </SpaceBetween>
              }
              description={lastUpdated ? <span>Last updated: {lastUpdated.toLocaleString()}</span> : undefined}
            >
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            {error && (
              <Alert
                statusIconAriaLabel="Error"
                type="error"
                header="Weather data unavailable"
                action={
                  <Button onClick={handleRefresh} iconName="refresh">
                    Retry
                  </Button>
                }
              >
                {error.reason}
              </Alert>
            )}

            {/* Location Selector at the top */}
            <Container>
              <LocationSelector
                currentLocation={currentLocation}
                onLocationChange={handleLocationChange}
                isLoading={isLoading}
              />
            </Container>

            {/* Weather data displayed vertically below */}
            {weatherData && (
              <WeatherWidget data={weatherData} locationName={currentLocation.name} isLoading={isLoading} />
            )}
            {!weatherData && !error && !isLoading && (
              <Container>
                <Alert statusIconAriaLabel="Info" type="info" header="Welcome to Weather Dashboard">
                  Select a location to view current weather conditions and forecasts. Weather data is provided by
                  Open-Meteo, a free weather API service.
                </Alert>
              </Container>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
      toolsHide
      navigationOpen={false}
    />
  );
}
