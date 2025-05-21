// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import AppLayout from '@cloudscape-design/components/app-layout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Flashbar, { FlashbarProps } from '@cloudscape-design/components/flashbar';
import Header from '@cloudscape-design/components/header';
import Spinner from '@cloudscape-design/components/spinner';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { fetchWeatherData } from './api';
import { CurrentWeather } from './components/current-weather';
import { Forecast } from './components/forecast';
import { LocationSelector } from './components/location-selector';
import { WeatherChart } from './components/weather-chart';
import { WeatherData, WeatherLocation } from './types';

export function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<WeatherLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FlashbarProps.MessageDefinition[]>([]);

  useEffect(() => {
    if (location) {
      loadWeatherData(location);
    }
  }, [location]);

  const loadWeatherData = async (location: WeatherLocation) => {
    setIsLoading(true);
    setErrors([]);

    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (error) {
      let errorMessage = 'Failed to fetch weather data. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setErrors([
        {
          type: 'error',
          content: errorMessage,
          dismissible: true,
          dismissLabel: 'Dismiss message',
          onDismiss: () => setErrors([]),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (newLocation: WeatherLocation) => {
    setLocation(newLocation);
  };

  const handleRefresh = () => {
    if (location) {
      loadWeatherData(location);
    }
  };

  return (
    <CustomAppLayout
      contentType="default"
      content={
        <ContentLayout
          header={
            <SpaceBetween size="m">
              <Header
                variant="h1"
                actions={
                  <Button onClick={handleRefresh} iconName="refresh" disabled={isLoading || !weatherData}>
                    Refresh
                  </Button>
                }
              >
                Weather Dashboard
              </Header>

              {errors.length > 0 && <Flashbar items={errors} />}

              <Container>
                <LocationSelector onLocationSelect={handleLocationSelect} isLoading={isLoading} />
              </Container>
            </SpaceBetween>
          }
        >
          {isLoading ? (
            <Container>
              <SpaceBetween size="m" alignItems="center">
                <Spinner size="large" />
                <div>Loading weather data...</div>
              </SpaceBetween>
            </Container>
          ) : weatherData ? (
            <SpaceBetween size="l">
              <CurrentWeather weatherData={weatherData} locationName={location?.name} />

              {weatherData.daily && <Forecast dailyForecast={weatherData.daily} />}

              {weatherData.hourly && <WeatherChart hourlyForecast={weatherData.hourly} />}
            </SpaceBetween>
          ) : null}
        </ContentLayout>
      }
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Cloudscape Demo', href: '/' },
            { text: 'Weather Dashboard', href: '/weather' },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      navigationHide={true}
      toolsHide={true}
    />
  );
}
