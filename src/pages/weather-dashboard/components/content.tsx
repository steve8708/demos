// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { fetchWeatherData, WeatherResponse } from '../api';
import { CurrentWeatherCard } from './current-weather';
import { DailyForecast } from './forecast';
import { LocationSelector } from './location-selector';
import { WeatherChart } from './weather-chart';

export function WeatherDashboardContent() {
  const [location, setLocation] = useState<{ name: string; latitude: number; longitude: number } | undefined>(
    undefined,
  );
  const [weatherData, setWeatherData] = useState<WeatherResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [units, setUnits] = useState({
    temperature: 'celsius' as 'celsius' | 'fahrenheit',
    windSpeed: 'kmh' as 'kmh' | 'mph',
    precipitation: 'mm' as 'mm' | 'inch',
  });

  // Fetch weather data when location or units change
  useEffect(() => {
    if (!location) {
      return;
    }

    console.log('Fetching weather data for location:', location);
    setLoading(true);
    setError(undefined);

    fetchWeatherData({
      latitude: location.latitude,
      longitude: location.longitude,
      temperatureUnit: units.temperature,
      windSpeedUnit: units.windSpeed === 'kmh' ? 'kmh' : 'mph',
      precipitationUnit: units.precipitation,
      timeZone: 'auto',
      forecastDays: 7,
    })
      .then(data => {
        console.log('Received weather data:', data);
        setWeatherData(data);
        setError(undefined);
      })
      .catch(err => {
        console.error('Error fetching weather data:', err);
        setError('Failed to fetch weather data. Please try again or select a different location.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location, units]);

  const handleLocationSelect = (selectedLocation: { name: string; latitude: number; longitude: number }) => {
    console.log('Location selected:', selectedLocation);
    setLocation(selectedLocation);
  };

  const handleUnitsChange = (newUnits: {
    temperature: 'celsius' | 'fahrenheit';
    windSpeed: 'kmh' | 'mph';
    precipitation: 'mm' | 'inch';
  }) => {
    setUnits(newUnits);
  };

  return (
    <SpaceBetween size="l">
      {error && (
        <Alert type="error" dismissible onDismiss={() => setError(undefined)}>
          {error}
        </Alert>
      )}

      <LocationSelector
        onLocationSelect={handleLocationSelect}
        onUnitsChange={handleUnitsChange}
        selectedLocation={location}
        units={units}
      />

      <Grid
        gridDefinition={[
          { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 12, xl: 12 } },
          { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 12, xl: 12 } },
          { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 12, xl: 12 } },
        ]}
      >
        <CurrentWeatherCard
          currentWeather={weatherData?.current}
          isLoading={loading}
          location={location}
          temperatureUnit={units.temperature}
          windSpeedUnit={units.windSpeed}
          precipitationUnit={units.precipitation}
        />

        <DailyForecast
          dailyWeather={weatherData?.daily}
          isLoading={loading}
          temperatureUnit={units.temperature}
          precipitationUnit={units.precipitation}
        />

        <WeatherChart
          hourlyWeather={weatherData?.hourly}
          isLoading={loading}
          temperatureUnit={units.temperature}
          precipitationUnit={units.precipitation}
        />
      </Grid>
    </SpaceBetween>
  );
}
