// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Table from '@cloudscape-design/components/table';

import { WeatherData, WeatherLocation, WEATHER_CODES } from '../types';

interface WeatherWidgetProps {
  weatherData: WeatherData;
  location: WeatherLocation;
}

interface ForecastItem {
  day: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
}

export function WeatherWidget({ weatherData, location }: WeatherWidgetProps) {
  const { current, daily } = weatherData;

  // Prepare forecast data for table
  const forecastData: ForecastItem[] = daily
    ? daily.time.map((time, index) => ({
        day: new Date(time).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        }),
        weatherCode: daily.weather_code[index],
        maxTemp: daily.temperature_2m_max[index],
        minTemp: daily.temperature_2m_min[index],
        precipitation: daily.precipitation_sum[index],
        windSpeed: daily.wind_speed_10m_max[index],
      }))
    : [];

  const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;
  const formatWind = (speed: number, direction?: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const directionText = direction !== undefined ? directions[Math.round(direction / 45) % 8] : '';
    return `${Math.round(speed)} km/h ${directionText}`.trim();
  };

  const getWeatherIcon = (code: number) => {
    const weather = WEATHER_CODES[code] || WEATHER_CODES[0];
    return weather.icon;
  };

  const getWeatherDescription = (code: number) => {
    const weather = WEATHER_CODES[code] || WEATHER_CODES[0];
    return weather.description;
  };

  return (
    <SpaceBetween size="l">
      {/* Current Weather */}
      {current && (
        <Container
          header={
            <Header variant="h2" description={`Current conditions for ${location.name}, ${location.country}`}>
              Current Weather
            </Header>
          }
        >
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <SpaceBetween size="m">
                <Box variant="h1" fontSize="display-l">
                  {formatTemperature(current.temperature_2m)}
                </Box>
                <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                  <Icon name={getWeatherIcon(current.weather_code)} />
                  <Box variant="h3">{getWeatherDescription(current.weather_code)}</Box>
                </SpaceBetween>
                <Box variant="small" color="text-body-secondary">
                  Feels like {formatTemperature(current.apparent_temperature)}
                </Box>
              </SpaceBetween>
            </div>
            <div>
              <KeyValuePairs
                columns={1}
                items={[
                  {
                    label: 'Humidity',
                    value: `${current.relative_humidity_2m}%`,
                  },
                  {
                    label: 'Wind',
                    value: formatWind(current.wind_speed_10m, current.wind_direction_10m),
                  },
                  {
                    label: 'Precipitation',
                    value: `${current.precipitation} mm`,
                  },
                  {
                    label: 'Last updated',
                    value: new Date(current.time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZoneName: 'short',
                    }),
                  },
                ]}
              />
            </div>
          </ColumnLayout>
        </Container>
      )}

      {/* 7-Day Forecast */}
      {daily && forecastData.length > 0 && (
        <Container
          header={
            <Header variant="h2" description="Extended weather forecast">
              7-Day Forecast
            </Header>
          }
        >
          <Table
            columnDefinitions={[
              {
                id: 'day',
                header: 'Day',
                cell: (item: ForecastItem) => item.day,
                width: 150,
              },
              {
                id: 'weather',
                header: 'Weather',
                cell: (item: ForecastItem) => (
                  <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                    <Icon name={getWeatherIcon(item.weatherCode)} />
                    <Box>{getWeatherDescription(item.weatherCode)}</Box>
                  </SpaceBetween>
                ),
                width: 200,
              },
              {
                id: 'temperature',
                header: 'Temperature',
                cell: (item: ForecastItem) => (
                  <SpaceBetween size="xs" direction="horizontal">
                    <Box variant="strong">{formatTemperature(item.maxTemp)}</Box>
                    <Box color="text-body-secondary">{formatTemperature(item.minTemp)}</Box>
                  </SpaceBetween>
                ),
                width: 120,
              },
              {
                id: 'precipitation',
                header: 'Rain',
                cell: (item: ForecastItem) => `${item.precipitation} mm`,
                width: 80,
              },
              {
                id: 'wind',
                header: 'Wind',
                cell: (item: ForecastItem) => formatWind(item.windSpeed),
                width: 100,
              },
            ]}
            items={forecastData}
            loadingText="Loading forecast"
            trackBy="day"
            empty={
              <Box textAlign="center" color="inherit">
                <Box variant="strong" textAlign="center" color="inherit">
                  No forecast data available
                </Box>
              </Box>
            }
            variant="borderless"
          />
        </Container>
      )}
    </SpaceBetween>
  );
}

interface WeatherErrorProps {
  error: string;
  onRetry?: () => void;
}

export function WeatherError({ error, onRetry }: WeatherErrorProps) {
  return (
    <Container>
      <Box textAlign="center">
        <SpaceBetween size="m">
          <StatusIndicator type="error">Weather data unavailable</StatusIndicator>
          <Box variant="p">{error}</Box>
          {onRetry && (
            <Box>
              <Box display="inline-block">
                <Icon name="refresh" />
              </Box>
              <Box display="inline-block" margin={{ left: 'xs' }}>
                <button
                  onClick={onRetry}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Try again
                </button>
              </Box>
            </Box>
          )}
        </SpaceBetween>
      </Box>
    </Container>
  );
}

interface WeatherLoadingProps {
  location?: WeatherLocation;
}

export function WeatherLoading({ location }: WeatherLoadingProps) {
  return (
    <Container>
      <Box textAlign="center">
        <SpaceBetween size="m">
          <StatusIndicator type="loading">Loading weather data</StatusIndicator>
          {location && (
            <Box variant="p">
              Fetching current conditions for {location.name}, {location.country}...
            </Box>
          )}
        </SpaceBetween>
      </Box>
    </Container>
  );
}
