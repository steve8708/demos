// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import Spinner from '@cloudscape-design/components/spinner';
import Table from '@cloudscape-design/components/table';

import { useWeatherData } from '../../hooks/use-weather-data';
import { Coordinates, DailyForecastData, weatherCodeToDescription, WidgetConfig } from '../interfaces';

interface DailyForecastHeaderProps {
  isLoading?: boolean;
  error?: string | null;
}

function DailyForecastHeader({ isLoading, error }: DailyForecastHeaderProps) {
  return (
    <Header
      variant="h2"
      info={<Link variant="info">Info</Link>}
      description={isLoading ? 'Loading forecast data...' : error ? 'Error loading data' : '7-day weather forecast'}
    >
      Daily Forecast
    </Header>
  );
}

interface DailyForecastWidgetProps {
  coordinates: Coordinates;
}

function DailyForecastWidget({ coordinates }: DailyForecastWidgetProps) {
  const { data: weatherData, isLoading, error } = useWeatherData(coordinates);

  if (isLoading) {
    return (
      <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
        <Spinner size="large" />
        <Box variant="p" padding={{ top: 'm' }}>
          Loading forecast data...
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert type="error" header="Error loading forecast data">
        {error}. Please try again or check your coordinates.
      </Alert>
    );
  }

  if (!weatherData || !weatherData.daily || weatherData.daily.length === 0) {
    return (
      <Alert type="warning" header="No forecast data available">
        Could not retrieve forecast information for this location. Please try another location or try again later.
      </Alert>
    );
  }

  // Format the forecast data for the table
  const tableItems = weatherData.daily.map((day: DailyForecastData) => {
    const date = new Date(day.date);
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return {
      date: formattedDate,
      condition: weatherCodeToDescription[day.weatherCode] || 'Unknown',
      highTemp: `${day.temperatureMax.toFixed(1)}°C`,
      lowTemp: `${day.temperatureMin.toFixed(1)}°C`,
      precipitation: `${day.precipitationSum.toFixed(1)}mm`,
      precipitationProbability: `${day.precipitationProbabilityMax}%`,
    };
  });

  return (
    <Table
      columnDefinitions={[
        {
          id: 'date',
          header: 'Date',
          cell: item => item.date,
          sortingField: 'date',
        },
        {
          id: 'condition',
          header: 'Condition',
          cell: item => item.condition,
        },
        {
          id: 'highTemp',
          header: 'High',
          cell: item => item.highTemp,
        },
        {
          id: 'lowTemp',
          header: 'Low',
          cell: item => item.lowTemp,
        },
        {
          id: 'precipitation',
          header: 'Precip.',
          cell: item => item.precipitation,
        },
        {
          id: 'precipitationProbability',
          header: 'Chance',
          cell: item => item.precipitationProbability,
        },
      ]}
      items={tableItems}
      loadingText="Loading forecast data"
      trackBy="date"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No data available</b>
          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            No forecast data is available for this location.
          </Box>
        </Box>
      }
      header={<Header>7-Day Forecast</Header>}
    />
  );
}

export function createDailyForecastWidget(coordinates: Coordinates): WidgetConfig {
  const { isLoading, error } = useWeatherData(coordinates);

  return {
    definition: { defaultRowSpan: 3, defaultColumnSpan: 6 },
    data: {
      icon: 'list',
      title: 'Daily Forecast',
      description: '7-day weather forecast',
      header: () => <DailyForecastHeader isLoading={isLoading} error={error} />,
      content: () => <DailyForecastWidget coordinates={coordinates} />,
    },
  };
}

export const dailyForecast = {
  definition: { defaultRowSpan: 3, defaultColumnSpan: 6 },
  data: {
    icon: 'list',
    title: 'Daily Forecast',
    description: '7-day weather forecast',
    header: DailyForecastHeader,
    content: DailyForecastWidget,
  },
};
