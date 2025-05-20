// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Breadcrumbs, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import LocationSearch from './components/location-search';
import CurrentWeather from './components/current-weather';
import WeatherForecast from './components/weather-forecast';
import { WeatherData, Location } from './components/weather-utils';

export function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const appLayout = React.useRef<AppLayoutProps.Ref>(null);

  const fetchWeatherData = async (location: Location) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch weather data from Open Meteo API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeatherData(data);
      setSelectedLocation(location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomAppLayout
      ref={appLayout}
      contentType="form"
      navigationHide
      content={
        <ContentLayout
          header={
            <Header variant="h1" description="Weather information powered by Open Meteo API">
              Weather Dashboard
            </Header>
          }
        >
          <SpaceBetween size="l">
            <LocationSearch onLocationSelect={fetchWeatherData} loading={loading} />

            {error && (
              <Container>
                <div className="weather-error-message">Error: {error}</div>
              </Container>
            )}

            {weatherData && selectedLocation && (
              <>
                <CurrentWeather data={weatherData.current} location={selectedLocation.name} />
                <WeatherForecast data={weatherData.daily} units={weatherData.daily_units} />
              </>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
      breadcrumbs={<Breadcrumbs items={[{ text: 'Weather Dashboard', href: '#/weather' }]} />}
      notifications={<Notifications />}
    />
  );
}
