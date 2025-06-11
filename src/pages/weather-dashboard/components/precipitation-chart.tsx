// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import { WeatherData } from '../types';

interface PrecipitationChartProps {
  data: WeatherData;
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
  const { hourly, hourly_units } = data;

  // Get next 12 hours of precipitation data
  const precipitationData = hourly.time.slice(0, 12).map((time, index) => ({
    x: new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    y: hourly.precipitation[index] || 0,
  }));

  const chartData = [
    {
      title: 'Precipitation',
      type: 'bar' as const,
      data: precipitationData,
      color: '#0073bb',
    },
  ];

  return (
    <Container
      header={
        <Header variant="h2" description="12-hour precipitation forecast">
          Precipitation Forecast
        </Header>
      }
    >
      <BarChart
        series={chartData}
        xTitle="Time"
        yTitle={`Precipitation (${hourly_units.precipitation})`}
        height={300}
        i18nStrings={{
          filterLabel: 'Filter',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          detailPopoverDismissAriaLabel: 'Dismiss',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'bar chart',
          yTickFormatter: value => `${value.toFixed(1)}${hourly_units.precipitation}`,
        }}
        ariaLabel="Precipitation forecast for next 12 hours"
        ariaDescription="Bar chart showing expected precipitation amounts over the next 12 hours"
        empty={
          <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
              No precipitation data available
            </Box>
          </Box>
        }
      />
    </Container>
  );
}
