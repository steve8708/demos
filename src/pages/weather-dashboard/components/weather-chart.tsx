// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { formatTime, HourlyWeather } from '../api';

interface WeatherChartProps {
  hourlyWeather?: HourlyWeather;
  isLoading: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  precipitationUnit: 'mm' | 'inch';
}

export function WeatherChart({ hourlyWeather, isLoading, temperatureUnit, precipitationUnit }: WeatherChartProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '48h' | '7d'>('24h');

  if (isLoading) {
    return (
      <Container header={<Header variant="h2">Weather Charts</Header>}>
        <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
          <StatusIndicator type="loading">Loading chart data</StatusIndicator>
        </Box>
      </Container>
    );
  }

  if (!hourlyWeather) {
    return (
      <Container header={<Header variant="h2">Weather Charts</Header>}>
        <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
          <Box variant="p">No chart data available. Please select a location.</Box>
        </Box>
      </Container>
    );
  }

  // Determine how many hours to display based on the selected time range
  const hoursToShow = timeRange === '24h' ? 24 : timeRange === '48h' ? 48 : 168; // 7 days = 168 hours

  // Prepare temperature data for the chart
  const temperatureData = hourlyWeather.time.slice(0, hoursToShow).map((time, index) => ({
    x: formatChartTime(time, timeRange),
    y: hourlyWeather.temperature_2m[index],
  }));

  // Prepare precipitation data for the chart
  const precipitationData =
    hourlyWeather.precipitation &&
    hourlyWeather.time.slice(0, hoursToShow).map((time, index) => ({
      x: formatChartTime(time, timeRange),
      y: hourlyWeather.precipitation?.[index] || 0,
    }));

  // Prepare precipitation probability data for the chart
  const precipitationProbData =
    hourlyWeather.precipitation_probability &&
    hourlyWeather.time.slice(0, hoursToShow).map((time, index) => ({
      x: formatChartTime(time, timeRange),
      y: hourlyWeather.precipitation_probability?.[index] || 0,
    }));

  const tempUnit = temperatureUnit === 'celsius' ? '°C' : '°F';
  const precipUnit = precipitationUnit === 'mm' ? 'mm' : 'in';

  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <SegmentedControl
                selectedId={timeRange}
                onChange={({ detail }) => setTimeRange(detail.selectedId as '24h' | '48h' | '7d')}
                options={[
                  { id: '24h', text: '24 hours' },
                  { id: '48h', text: '48 hours' },
                  { id: '7d', text: '7 days' },
                ]}
              />
            </SpaceBetween>
          }
        >
          Weather Charts
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={1}>
          <LineChart
            series={[
              {
                title: `Temperature (${tempUnit})`,
                type: 'line',
                data: temperatureData,
                valueFormatter: value => `${value}${tempUnit}`,
              },
            ]}
            xScaleType="categorical"
            yDomain={[
              Math.min(...hourlyWeather.temperature_2m.slice(0, hoursToShow)) - 5,
              Math.max(...hourlyWeather.temperature_2m.slice(0, hoursToShow)) + 5,
            ]}
            i18nStrings={{
              filterLabel: 'Filter displayed data',
              filterPlaceholder: 'Filter data',
              filterSelectedAriaLabel: 'selected',
              legendAriaLabel: 'Legend',
              chartAriaRoleDescription: 'line chart',
              xAxisAriaRoleDescription: 'x axis',
              yAxisAriaRoleDescription: 'y axis',
              yTickFormatter: value => `${value}${tempUnit}`,
            }}
            ariaLabel="Temperature chart"
            height={300}
            hideFilter
            hideLegend
            xTitle="Time"
            yTitle={`Temperature (${tempUnit})`}
            empty={
              <Box textAlign="center" color="inherit">
                <b>No data available</b>
                <Box variant="p" color="inherit">
                  There is no temperature data available for the selected time range.
                </Box>
              </Box>
            }
          />
        </ColumnLayout>

        {precipitationData && precipitationProbData && (
          <ColumnLayout columns={2}>
            <LineChart
              series={[
                {
                  title: `Precipitation (${precipUnit})`,
                  type: 'bar',
                  data: precipitationData,
                  valueFormatter: value => `${value}${precipUnit}`,
                },
              ]}
              xScaleType="categorical"
              yDomain={[0, Math.max(...(hourlyWeather.precipitation?.slice(0, hoursToShow) || [0])) + 1]}
              i18nStrings={{
                filterLabel: 'Filter displayed data',
                filterPlaceholder: 'Filter data',
                filterSelectedAriaLabel: 'selected',
                legendAriaLabel: 'Legend',
                chartAriaRoleDescription: 'bar chart',
                xAxisAriaRoleDescription: 'x axis',
                yAxisAriaRoleDescription: 'y axis',
                yTickFormatter: value => `${value}${precipUnit}`,
              }}
              ariaLabel="Precipitation chart"
              height={300}
              hideFilter
              hideLegend
              xTitle="Time"
              yTitle={`Precipitation (${precipUnit})`}
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No data available</b>
                  <Box variant="p" color="inherit">
                    There is no precipitation data available for the selected time range.
                  </Box>
                </Box>
              }
            />

            <LineChart
              series={[
                {
                  title: 'Precipitation Probability (%)',
                  type: 'bar',
                  data: precipitationProbData,
                  valueFormatter: value => `${value}%`,
                },
              ]}
              xScaleType="categorical"
              yDomain={[0, 100]}
              i18nStrings={{
                filterLabel: 'Filter displayed data',
                filterPlaceholder: 'Filter data',
                filterSelectedAriaLabel: 'selected',
                legendAriaLabel: 'Legend',
                chartAriaRoleDescription: 'bar chart',
                xAxisAriaRoleDescription: 'x axis',
                yAxisAriaRoleDescription: 'y axis',
                yTickFormatter: value => `${value}%`,
              }}
              ariaLabel="Precipitation probability chart"
              height={300}
              hideFilter
              hideLegend
              xTitle="Time"
              yTitle="Precipitation Probability (%)"
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No data available</b>
                  <Box variant="p" color="inherit">
                    There is no precipitation probability data available for the selected time range.
                  </Box>
                </Box>
              }
            />
          </ColumnLayout>
        )}
      </SpaceBetween>
    </Container>
  );
}

// Format time for chart display based on the selected time range
function formatChartTime(timeString: string, timeRange: '24h' | '48h' | '7d'): string {
  const date = new Date(timeString);

  if (timeRange === '24h' || timeRange === '48h') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true });
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', hour: '2-digit', hour12: true });
  }
}
