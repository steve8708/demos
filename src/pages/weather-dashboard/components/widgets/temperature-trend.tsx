// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import Icon from '@cloudscape-design/components/icon';
import LineChart from '@cloudscape-design/components/line-chart';
import SegmentedControl from '@cloudscape-design/components/segmented-control';

import { HourlyWeather, DailyWeather } from '../../types';

interface TemperatureTrendWidgetProps {
  hourlyData: HourlyWeather | null;
  dailyData: DailyWeather | null;
  loading: boolean;
}

export function TemperatureTrendWidget({ hourlyData, dailyData, loading }: TemperatureTrendWidgetProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('hourly');

  if (loading) {
    return (
      <Container header={<Header variant="h2">Temperature Trends</Header>}>
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            Loading temperature data...
          </Box>
        </Box>
      </Container>
    );
  }

  if (!hourlyData && !dailyData) {
    return (
      <Container header={<Header variant="h2">Temperature Trends</Header>}>
        <Box textAlign="center" padding="xl">
          <Icon name="status-warning" size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            Temperature data unavailable
          </Box>
        </Box>
      </Container>
    );
  }

  const getHourlyChartData = () => {
    if (!hourlyData || !hourlyData.time || hourlyData.time.length === 0) return [];

    // Show next 48 hours
    const hours = Math.min(48, hourlyData.time.length);
    return hourlyData.time.slice(0, hours).map((timeString, index) => ({
      x: new Date(timeString),
      y: Math.round(hourlyData.temperature_2m[index] * 10) / 10,
    }));
  };

  const getDailyChartData = () => {
    if (!dailyData || !dailyData.time || dailyData.time.length === 0) return { maxData: [], minData: [] };

    const maxData = dailyData.time.map((dateString, index) => ({
      x: new Date(dateString),
      y: Math.round(dailyData.temperature_2m_max[index] * 10) / 10,
    }));

    const minData = dailyData.time.map((dateString, index) => ({
      x: new Date(dateString),
      y: Math.round(dailyData.temperature_2m_min[index] * 10) / 10,
    }));

    return { maxData, minData };
  };

  const hourlyData_chart = getHourlyChartData();
  const dailyData_chart = getDailyChartData();

  const hourlyDomain =
    hourlyData_chart.length > 0
      ? [hourlyData_chart[0].x, hourlyData_chart[hourlyData_chart.length - 1].x]
      : [new Date(), new Date()];

  const dailyDomain =
    dailyData_chart.maxData.length > 0
      ? [dailyData_chart.maxData[0].x, dailyData_chart.maxData[dailyData_chart.maxData.length - 1].x]
      : [new Date(), new Date()];

  const series =
    selectedTimeframe === 'hourly'
      ? [
          {
            title: 'Temperature',
            type: 'line' as const,
            data: hourlyData_chart,
            valueFormatter: (value: number) => `${value}°C`,
          },
        ]
      : [
          {
            title: 'Daily High',
            type: 'line' as const,
            data: dailyData_chart.maxData,
            valueFormatter: (value: number) => `${value}°C`,
          },
          {
            title: 'Daily Low',
            type: 'line' as const,
            data: dailyData_chart.minData,
            valueFormatter: (value: number) => `${value}°C`,
          },
        ];

  const xDomain = selectedTimeframe === 'hourly' ? hourlyDomain : dailyDomain;

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Temperature changes over time"
          actions={
            <SegmentedControl
              selectedId={selectedTimeframe}
              onChange={({ detail }) => setSelectedTimeframe(detail.selectedId)}
              options={[
                { id: 'hourly', text: 'Hourly (48h)' },
                { id: 'daily', text: 'Daily (7d)' },
              ]}
            />
          }
        >
          Temperature Trends
        </Header>
      }
    >
      {(selectedTimeframe === 'hourly' && hourlyData_chart.length === 0) ||
      (selectedTimeframe === 'daily' && dailyData_chart.maxData.length === 0) ? (
        <Box textAlign="center" padding="xl">
          <Icon name="status-warning" size="large" />
          <Box variant="p" margin={{ top: 's' }}>
            No {selectedTimeframe} temperature data available
          </Box>
        </Box>
      ) : (
        <LineChart
          series={series}
          xDomain={xDomain}
          xScaleType="time"
          xTitle="Time"
          yTitle="Temperature (°C)"
          height={300}
          hideFilter
          hideLegend={false}
          ariaLabel={`${selectedTimeframe === 'hourly' ? 'Hourly' : 'Daily'} temperature chart`}
          ariaDescription={`Line chart showing temperature ${selectedTimeframe === 'hourly' ? 'for the next 48 hours' : 'highs and lows for the next 7 days'}`}
          i18nStrings={{
            filterLabel: 'Filter displayed data',
            filterPlaceholder: 'Filter data',
            filterSelectedAriaLabel: 'selected',
            legendAriaLabel: 'Legend',
            chartAriaRoleDescription: 'line chart',
            xTickFormatter: e =>
              selectedTimeframe === 'hourly'
                ? new Date(e).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                : new Date(e).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            yTickFormatter: e => `${e}°C`,
          }}
          detailPopoverSeriesContent={({ series, y }) => ({
            key: series.title,
            value: `${y}°C`,
          })}
        />
      )}
    </Container>
  );
}
