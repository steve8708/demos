// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import LineChart from '@cloudscape-design/components/line-chart';
import Button from '@cloudscape-design/components/button';

import { useWeatherContext } from '../../context/weather-context';
import { prepareChartData, formatTime } from '../../utils/helpers';
import { WeatherWidgetConfig } from '../interfaces';

function TemperatureChartHeader() {
  return (
    <Header
      actions={
        <Button iconName="external" iconAlign="right" href="https://open-meteo.com/" target="_blank">
          View detailed charts
        </Button>
      }
    >
      Temperature Forecast
    </Header>
  );
}

function TemperatureChartContent() {
  const { weatherData, units, loading } = useWeatherContext();

  if (loading || !weatherData) {
    return (
      <Box textAlign="center" padding={{ vertical: 'xxl' }}>
        <StatusIndicator type="loading">Loading temperature chart data</StatusIndicator>
      </Box>
    );
  }

  const { hourly } = weatherData;

  // Prepare data for the line chart
  const times = hourly.time.slice(0, 24);
  const temps = hourly.temperature_2m.slice(0, 24);
  const apparentTemps = hourly.apparent_temperature.slice(0, 24);

  const tempData = times.map((time: string, i: number) => ({
    x: formatTime(time),
    y: Math.round(temps[i]),
  }));

  const apparentTempData = times.map((time: string, i: number) => ({
    x: formatTime(time),
    y: Math.round(apparentTemps[i]),
  }));

  return (
    <LineChart
      series={[
        {
          title: 'Temperature',
          type: 'line',
          data: tempData,
          valueFormatter: (value: number) => `${value}${units === 'metric' ? '°C' : '°F'}`,
          color: 'blue',
        },
        {
          title: 'Feels like',
          type: 'line',
          data: apparentTempData,
          valueFormatter: (value: number) => `${value}${units === 'metric' ? '°C' : '°F'}`,
          color: 'orange',
        },
      ]}
      xDomain={times.slice(0, 24).map((time: string) => formatTime(time))}
      yDomain={undefined}
      i18nStrings={{
        xTickFormatter: (value: string) => value,
        yTickFormatter: (value: number) => `${value}${units === 'metric' ? '°C' : '°F'}`,
      }}
      ariaLabel="Temperature forecast chart"
      height={300}
      hideFilter
      hideLegend={false}
      horizontalBars={false}
      statusType="finished"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No data available</b>
          <Box variant="p" color="inherit">
            There is no data available for the selected time period.
          </Box>
        </Box>
      }
      noMatch={
        <Box textAlign="center" color="inherit">
          <b>No matching data</b>
          <Box variant="p" color="inherit">
            There is no matching data for the selected filters.
          </Box>
        </Box>
      }
    />
  );
}

export const temperatureChart: WeatherWidgetConfig = {
  data: {
    title: 'Temperature Chart',
    description: 'Temperature forecast chart',
    header: TemperatureChartHeader,
    content: TemperatureChartContent,
  },
};
