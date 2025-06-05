// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import LineChart from '@cloudscape-design/components/line-chart';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Table from '@cloudscape-design/components/table';

import { WeatherDisplayData, WEATHER_CONDITIONS } from '../types';

interface WeatherWidgetProps {
  data: WeatherDisplayData;
  locationName: string;
  isLoading?: boolean;
}

export function WeatherWidget({ data, locationName, isLoading }: WeatherWidgetProps) {
  if (isLoading) {
    return (
      <Container>
        <Box textAlign="center" padding="xxl">
          <StatusIndicator type="loading">Loading weather data...</StatusIndicator>
        </Box>
      </Container>
    );
  }

  const { current, forecast, hourlyForecast } = data;
  const currentCondition = WEATHER_CONDITIONS[parseInt(current.condition)] || {
    description: 'Unknown',
    icon: 'status-info',
  };

  const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;
  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Prepare chart data for hourly temperature
  const temperatureChartData = hourlyForecast.slice(0, 24).map(hour => ({
    x: new Date(hour.time),
    y: hour.temperature,
  }));

  // Prepare chart data for hourly precipitation
  const precipitationChartData = hourlyForecast.slice(0, 24).map(hour => ({
    x: new Date(hour.time),
    y: hour.precipitation,
  }));

  return (
    <SpaceBetween size="l">
      {/* Current Weather */}
      <Container header={<Header variant="h2">Current weather in {locationName}</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <SpaceBetween size="m">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Box fontSize="display-l" fontWeight="bold">
                  {formatTemperature(current.temperature)}
                </Box>
                <StatusIndicator type={currentCondition.icon as any}>{currentCondition.description}</StatusIndicator>
              </div>

              <Box variant="small" color="text-body-secondary">
                Last updated: {formatTime(current.time)}
              </Box>
            </SpaceBetween>
          </div>

          <KeyValuePairs
            columns={2}
            items={[
              { label: 'Humidity', value: `${current.humidity}%` },
              { label: 'Wind speed', value: `${current.windSpeed} km/h` },
              { label: 'Wind direction', value: `${current.windDirection}°` },
              { label: 'Pressure', value: `${current.pressure} hPa` },
              { label: 'Precipitation', value: `${current.precipitation} mm` },
              { label: 'UV Index', value: current.uvIndex?.toString() || 'N/A' },
            ]}
          />
        </ColumnLayout>
      </Container>

      {/* 24-Hour Temperature Chart */}
      <Container header={<Header variant="h2">24-Hour temperature trend</Header>}>
        <LineChart
          series={[
            {
              title: 'Temperature',
              type: 'line',
              data: temperatureChartData,
              valueFormatter: value => `${Math.round(value as number)}°C`,
            },
          ]}
          xDomain={[temperatureChartData[0]?.x, temperatureChartData[temperatureChartData.length - 1]?.x]}
          yTitle="Temperature (°C)"
          xTitle="Time"
          height={300}
          hideFilter
          hideLegend
          xScaleType="time"
        />
      </Container>

      {/* 24-Hour Precipitation Chart */}
      <Container header={<Header variant="h2">24-Hour precipitation</Header>}>
        <LineChart
          series={[
            {
              title: 'Precipitation',
              type: 'line',
              data: precipitationChartData,
              valueFormatter: value => `${(value as number).toFixed(1)} mm`,
            },
          ]}
          xDomain={[precipitationChartData[0]?.x, precipitationChartData[precipitationChartData.length - 1]?.x]}
          yTitle="Precipitation (mm)"
          xTitle="Time"
          height={300}
          hideFilter
          hideLegend
          xScaleType="time"
        />
      </Container>

      {/* 7-Day Forecast */}
      <Container
        header={
          <Header variant="h2" counter={`(${forecast.length})`}>
            7-day forecast
          </Header>
        }
      >
        <Table
          columnDefinitions={[
            {
              id: 'date',
              header: 'Date',
              cell: item => formatDate(item.date),
              sortingField: 'date',
            },
            {
              id: 'condition',
              header: 'Condition',
              cell: item => {
                const condition = WEATHER_CONDITIONS[parseInt(item.condition)] || {
                  description: 'Unknown',
                  icon: 'status-info',
                };
                return <StatusIndicator type={condition.icon as any}>{condition.description}</StatusIndicator>;
              },
            },
            {
              id: 'temperature',
              header: 'Temperature',
              cell: item => (
                <SpaceBetween direction="horizontal" size="xs">
                  <Badge color="blue">{formatTemperature(item.maxTemp)}</Badge>
                  <Box color="text-body-secondary">/</Box>
                  <Badge color="grey">{formatTemperature(item.minTemp)}</Badge>
                </SpaceBetween>
              ),
            },
            {
              id: 'precipitation',
              header: 'Rain chance',
              cell: item => `${item.precipitationProbability}%`,
            },
            {
              id: 'wind',
              header: 'Wind speed',
              cell: item => `${item.windSpeed} km/h`,
            },
          ]}
          items={forecast}
          loadingText="Loading forecast..."
          trackBy="date"
          variant="embedded"
        />
      </Container>

      {/* Hourly Details Table */}
      <Container
        header={
          <Header variant="h2" counter={`(${Math.min(hourlyForecast.length, 12)})`}>
            Hourly details (next 12 hours)
          </Header>
        }
      >
        <Table
          columnDefinitions={[
            {
              id: 'time',
              header: 'Time',
              cell: item => formatTime(item.time),
            },
            {
              id: 'temperature',
              header: 'Temperature',
              cell: item => formatTemperature(item.temperature),
            },
            {
              id: 'precipitation',
              header: 'Precipitation',
              cell: item => `${item.precipitation.toFixed(1)} mm`,
            },
            {
              id: 'humidity',
              header: 'Humidity',
              cell: item => `${item.humidity}%`,
            },
            {
              id: 'wind',
              header: 'Wind speed',
              cell: item => `${item.windSpeed} km/h`,
            },
          ]}
          items={hourlyForecast.slice(0, 12)}
          loadingText="Loading hourly data..."
          trackBy="time"
          variant="embedded"
        />
      </Container>
    </SpaceBetween>
  );
}
