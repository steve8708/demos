// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import Link from '@cloudscape-design/components/link';
import Spinner from '@cloudscape-design/components/spinner';

import { useWeatherData } from '../../hooks/use-weather-data';
import { Coordinates, DailyForecastData, WidgetConfig } from '../interfaces';

interface TemperatureChartHeaderProps {
  isLoading?: boolean;
  error?: string | null;
}

function TemperatureChartHeader({ isLoading, error }: TemperatureChartHeaderProps) {
  return (
    <Header
      variant="h2"
      info={<Link variant="info">Info</Link>}
      description={
        isLoading
          ? 'Loading temperature data...'
          : error
            ? 'Error loading data'
            : 'Temperature forecast for the next 7 days'
      }
    >
      Temperature Forecast
    </Header>
  );
}

interface TemperatureChartWidgetProps {
  coordinates: Coordinates;
}

function TemperatureChartWidget({ coordinates }: TemperatureChartWidgetProps) {
  const { data: weatherData, isLoading, error } = useWeatherData(coordinates);

  if (isLoading) {
    return (
      <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
        <Spinner size="large" />
        <Box variant="p" padding={{ top: 'm' }}>
          Loading temperature data...
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert type="error" header="Error loading temperature data">
        {error}. Please try again or check your coordinates.
      </Alert>
    );
  }

  if (!weatherData || !weatherData.daily || weatherData.daily.length === 0) {
    return (
      <Alert type="warning" header="No temperature data available">
        Could not retrieve temperature information for this location. Please try another location or try again later.
      </Alert>
    );
  }

  // Format the temperature data for the chart
  const chartData = weatherData.daily.map((day: DailyForecastData) => {
    const date = new Date(day.date);
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return {
      x: formattedDate,
      y: day.temperatureMax,
      y2: day.temperatureMin,
    };
  });

  return (
    <LineChart
      series={[
        {
          title: 'High Temperature',
          type: 'line',
          data: chartData.map(point => ({ x: point.x, y: point.y })),
          valueFormatter: value => `${value.toFixed(1)}°C`,
          color: '#f90',
        },
        {
          title: 'Low Temperature',
          type: 'line',
          data: chartData.map(point => ({ x: point.x, y: point.y2 })),
          valueFormatter: value => `${value.toFixed(1)}°C`,
          color: '#16b',
        },
      ]}
      xDomain={chartData.map(point => point.x)}
      yDomain={[Math.min(...chartData.map(point => point.y2)) - 2, Math.max(...chartData.map(point => point.y)) + 2]}
      i18nStrings={{
        xTickFormatter: date => date,
        yTickFormatter: value => `${value.toFixed(0)}°C`,
      }}
      ariaLabel="Temperature forecast chart"
      height={300}
      hideFilter
      hideLegend={false}
      loadingText="Loading temperature data"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No temperature data available</b>
          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            No temperature data is available for this location.
          </Box>
        </Box>
      }
      noMatch={
        <Box textAlign="center" color="inherit">
          <b>No matching temperature data</b>
          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
            No temperature data matches the filter criteria.
          </Box>
        </Box>
      }
    />
  );
}

export function createTemperatureChartWidget(coordinates: Coordinates): WidgetConfig {
  const { isLoading, error } = useWeatherData(coordinates);

  return {
    definition: { defaultRowSpan: 3, defaultColumnSpan: 3 },
    data: {
      icon: 'lineChart',
      title: 'Temperature Chart',
      description: 'Temperature forecast chart',
      header: () => <TemperatureChartHeader isLoading={isLoading} error={error} />,
      content: () => <TemperatureChartWidget coordinates={coordinates} />,
    },
  };
}

export const temperatureChart = {
  definition: { defaultRowSpan: 3, defaultColumnSpan: 3 },
  data: {
    icon: 'lineChart',
    title: 'Temperature Chart',
    description: 'Temperature forecast chart',
    header: TemperatureChartHeader,
    content: TemperatureChartWidget,
  },
};
