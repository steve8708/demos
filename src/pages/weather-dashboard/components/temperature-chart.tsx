// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import Box from '@cloudscape-design/components/box';
import { WeatherData } from '../types';
import { formatTemperature, celsiusToFahrenheit } from '../api';

interface TemperatureChartProps {
  data: WeatherData;
  useFahrenheit: boolean;
}

export function TemperatureChart({ data, useFahrenheit }: TemperatureChartProps) {
  const { hourly, hourly_units } = data;

  // Get next 24 hours of temperature data
  const temperatureData = hourly.time.slice(0, 24).map((time, index) => {
    const temperature = hourly.temperature_2m[index];
    const convertedTemp = useFahrenheit ? celsiusToFahrenheit(temperature) : temperature;

    return {
      x: new Date(time).getTime(),
      y: convertedTemp,
    };
  });

  const chartData = [
    {
      title: 'Temperature',
      type: 'line' as const,
      data: temperatureData,
      color: '#0073bb',
    },
  ];

  const unit = useFahrenheit ? '°F' : hourly_units.temperature_2m;

  return (
    <Container
      header={
        <Header variant="h2" description="24-hour temperature trend">
          Temperature Trend
        </Header>
      }
    >
      <LineChart
        series={chartData}
        xDomain={[temperatureData[0]?.x, temperatureData[temperatureData.length - 1]?.x]}
        yDomain={[Math.min(...temperatureData.map(d => d.y)) - 2, Math.max(...temperatureData.map(d => d.y)) + 2]}
        xTitle="Time"
        yTitle={`Temperature (${unit})`}
        height={300}
        xScaleType="time"
        i18nStrings={{
          filterLabel: 'Filter',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          detailPopoverDismissAriaLabel: 'Dismiss',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'line chart',
          xTickFormatter: value =>
            new Date(value).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          yTickFormatter: value => `${Math.round(value)}${unit}`,
        }}
        ariaLabel="Temperature trend over 24 hours"
        ariaDescription="Line chart showing temperature changes over the next 24 hours"
        empty={
          <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
              No temperature data available
            </Box>
          </Box>
        }
      />
    </Container>
  );
}
