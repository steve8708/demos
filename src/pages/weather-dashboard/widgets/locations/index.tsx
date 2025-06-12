// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Spinner from '@cloudscape-design/components/spinner';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Badge from '@cloudscape-design/components/badge';

import { WeatherAPI, DEFAULT_LOCATIONS } from '../../services/weather-api';
import { WeatherLocation, CurrentWeatherData } from '../interfaces';
import { WeatherWidgetConfig } from '../interfaces';

function LocationsHeader() {
  return (
    <Header variant="h2" description="Weather conditions across multiple locations">
      Location Overview
    </Header>
  );
}

interface LocationWeatherData extends WeatherLocation {
  weather?: CurrentWeatherData;
  loading: boolean;
  error?: string;
}

function LocationsWidget() {
  const [locationData, setLocationData] = useState<LocationWeatherData[]>(
    DEFAULT_LOCATIONS.map(location => ({ ...location, loading: true })),
  );

  useEffect(() => {
    const fetchAllLocations = async () => {
      const updatedData = await Promise.all(
        DEFAULT_LOCATIONS.map(async location => {
          try {
            const response = await WeatherAPI.getCurrentWeather(location);
            return {
              ...location,
              weather: response.current,
              loading: false,
            };
          } catch (error) {
            return {
              ...location,
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to fetch weather',
            };
          }
        }),
      );

      setLocationData(updatedData);
    };

    fetchAllLocations();

    // Refresh every 10 minutes
    const interval = setInterval(fetchAllLocations, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getTemperatureColor = (temp: number): 'blue' | 'green' | 'red' => {
    if (temp < 10) return 'blue';
    if (temp < 25) return 'green';
    return 'red';
  };

  return (
    <Table
      columnDefinitions={[
        {
          id: 'name',
          header: 'Location',
          cell: item => (
            <Box>
              <Box variant="strong">{item.name}</Box>
              <Box variant="small" color="text-status-inactive">
                {item.latitude.toFixed(2)}, {item.longitude.toFixed(2)}
              </Box>
            </Box>
          ),
          sortingField: 'name',
        },
        {
          id: 'weather',
          header: 'Conditions',
          cell: item => {
            if (item.loading) {
              return <Spinner size="normal" />;
            }

            if (item.error) {
              return <StatusIndicator type="error">Error</StatusIndicator>;
            }

            if (!item.weather) {
              return <StatusIndicator type="warning">No data</StatusIndicator>;
            }

            const icon = WeatherAPI.getWeatherIcon(item.weather.weatherCode, item.weather.isDay);
            const description = WeatherAPI.getWeatherDescription(item.weather.weatherCode);

            return (
              <Box>
                <span style={{ fontSize: '20px', marginRight: '8px' }}>{icon}</span>
                {description}
              </Box>
            );
          },
        },
        {
          id: 'temperature',
          header: 'Temperature',
          cell: item => {
            if (item.loading || item.error || !item.weather) {
              return '—';
            }

            return (
              <Badge color={getTemperatureColor(item.weather.temperature)}>
                {Math.round(item.weather.temperature)}°C
              </Badge>
            );
          },
        },
        {
          id: 'humidity',
          header: 'Humidity',
          cell: item => {
            if (item.loading || item.error || !item.weather) {
              return '—';
            }

            return `${item.weather.humidity}%`;
          },
        },
        {
          id: 'wind',
          header: 'Wind',
          cell: item => {
            if (item.loading || item.error || !item.weather) {
              return '—';
            }

            return `${Math.round(item.weather.windSpeed)} km/h`;
          },
        },
        {
          id: 'localTime',
          header: 'Local Time',
          cell: item => {
            const now = new Date();
            const localTime = new Date(now.toLocaleString('en-US', { timeZone: item.timezone }));

            return (
              <Box variant="small">
                {localTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: item.timezone,
                })}
              </Box>
            );
          },
        },
      ]}
      items={locationData}
      trackBy="name"
      sortingDisabled
      empty={
        <Box textAlign="center" color="inherit">
          <Box variant="p">No locations configured</Box>
        </Box>
      }
      header={<Header counter={`(${locationData.length})`}>Monitored Locations</Header>}
    />
  );
}

export const locations: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 6 },
  data: {
    icon: 'location',
    title: 'Location Overview',
    description: 'Weather summary for all monitored locations',
    header: LocationsHeader,
    content: LocationsWidget,
    staticMinHeight: 300,
  },
};
