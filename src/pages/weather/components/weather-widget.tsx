// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
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
    emoji: '❓',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Box fontSize="display-s">{currentCondition.emoji}</Box>
                  <StatusIndicator type={currentCondition.icon as any}>{currentCondition.description}</StatusIndicator>
                </div>
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

      {/* 7-Day Forecast with Horizontal Scroll */}
      <Container
        header={
          <Header variant="h2" counter={`(${forecast.length})`}>
            7-day forecast
          </Header>
        }
      >
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '16px',
            padding: '8px',
            scrollbarWidth: 'thin',
          }}
        >
          {forecast.map((day, index) => {
            const condition = WEATHER_CONDITIONS[parseInt(day.condition)] || {
              description: 'Unknown',
              icon: 'status-info',
              emoji: '❓',
            };

            const isToday = index === 0;

            return (
              <div
                key={day.date}
                style={{
                  minWidth: '140px',
                  padding: '16px',
                  border: '1px solid var(--awsui-color-border-divider-default)',
                  borderRadius: '8px',
                  backgroundColor: isToday
                    ? 'var(--awsui-color-background-container-content)'
                    : 'var(--awsui-color-background-container-header)',
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                <SpaceBetween size="xs">
                  <Box variant="h3" fontSize="body-s" fontWeight="bold">
                    {isToday ? 'Today' : formatDate(day.date)}
                  </Box>

                  <div style={{ fontSize: '32px', lineHeight: '1' }}>{condition.emoji}</div>

                  <Box variant="small" color="text-body-secondary">
                    {condition.description}
                  </Box>

                  <SpaceBetween size="xxs">
                    <Box fontSize="body-m" fontWeight="bold">
                      {formatTemperature(day.maxTemp)}
                    </Box>
                    <Box fontSize="body-s" color="text-body-secondary">
                      {formatTemperature(day.minTemp)}
                    </Box>
                  </SpaceBetween>

                  <SpaceBetween size="xxs">
                    <Box fontSize="body-s" color="text-body-secondary">
                      Rain: {day.precipitationProbability}%
                    </Box>
                    <Box fontSize="body-s" color="text-body-secondary">
                      Wind: {day.windSpeed} km/h
                    </Box>
                  </SpaceBetween>
                </SpaceBetween>
              </div>
            );
          })}
        </div>
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
