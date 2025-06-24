// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import Box from '@cloudscape-design/components/box';

import { WeatherData } from '../types';
import { formatTemperature, formatTime, getNext24Hours, getTemperatureColor } from '../utils';

interface HourlyForecastChartProps {
  weatherData: WeatherData;
}

export function HourlyForecastChart({ weatherData }: HourlyForecastChartProps) {
  const { hourly } = weatherData;

  // Get next 24 hours of data
  const next24Hours = getNext24Hours(hourly.time);
  const temperatures = getNext24Hours(hourly.temperature_2m);
  const precipitation = getNext24Hours(hourly.precipitation);

  const temperatureData = next24Hours.map((time, index) => ({
    x: new Date(time),
    y: temperatures[index],
  }));

  const precipitationData = next24Hours.map((time, index) => ({
    x: new Date(time),
    y: precipitation[index],
  }));

  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);

  return (
    <Container
      header={
        <Header variant="h2" description="Temperature and precipitation forecast for the next 24 hours">
          Hourly Forecast
        </Header>
      }
    >
      <LineChart
        series={[
          {
            title: 'Temperature (°C)',
            type: 'line',
            data: temperatureData,
            color: getTemperatureColor((minTemp + maxTemp) / 2),
            valueFormatter: value => formatTemperature(value),
          },
          {
            title: 'Precipitation (mm)',
            type: 'line',
            data: precipitationData,
            color: '#0073e6',
            valueFormatter: value => `${value.toFixed(1)} mm`,
          },
        ]}
        xDomain={[new Date(next24Hours[0]), new Date(next24Hours[next24Hours.length - 1])]}
        yDomain={[Math.min(minTemp - 2, 0), Math.max(maxTemp + 2, Math.max(...precipitation) + 1)]}
        height={300}
        xTitle="Time"
        yTitle="Temperature (°C) / Precipitation (mm)"
        ariaLabel="Hourly weather forecast chart"
        ariaDescription="Chart showing temperature and precipitation forecast for the next 24 hours"
        xScaleType="time"
        statusType="finished"
        loadingText="Loading chart data..."
        errorText="Error loading chart"
        recoveryText="Retry"
        empty={
          <Box textAlign="center" color="inherit" margin={{ top: 'xxl', bottom: 'xxl' }}>
            <Box variant="h3" padding={{ bottom: 'xs' }}>
              No data available
            </Box>
            <Box variant="p">Chart data could not be loaded</Box>
          </Box>
        }
        legendTitle="Weather Data"
        i18nStrings={{
          xTickFormatter: value => formatTime(value.toISOString()),
          yTickFormatter: value => value.toString(),
        }}
      />
    </Container>
  );
}
