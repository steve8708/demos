// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import LineChart from '@cloudscape-design/components/line-chart';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';

import { WeatherData, WEATHER_CODES } from '../types';
import { formatTemperature, formatWindSpeed, formatWindDirection, formatTime, formatDate } from '../api';

interface WeatherWidgetProps {
  weather: WeatherData;
  locationName: string;
}

interface WeatherWidgetLoadingProps {
  title: string;
  height?: string;
}

function WeatherWidgetLoading({ title, height = '200px' }: WeatherWidgetLoadingProps) {
  return (
    <Container header={<Header variant="h2">{title}</Header>}>
      <Box textAlign="center" padding={{ vertical: 'xl' }}>
        <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size="large" />
        </div>
      </Box>
    </Container>
  );
}

export function CurrentWeatherWidget({ weather, locationName }: WeatherWidgetProps) {
  const weatherInfo = WEATHER_CODES[weather.current.weatherCode] || { label: 'Unknown', icon: '❓' };

  return (
    <Container
      header={
        <Header variant="h2" description={`Current conditions in ${locationName}`}>
          Current Weather
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={1}>
          <Box textAlign="center">
            <SpaceBetween size="s">
              <Box fontSize="heading-xl" fontWeight="bold">
                {weatherInfo.icon}
              </Box>
              <Box fontSize="display-l" fontWeight="bold">
                {formatTemperature(weather.current.temperature)}
              </Box>
              <Box fontSize="heading-s" color="text-status-info">
                {weatherInfo.label}
              </Box>
            </SpaceBetween>
          </Box>
        </ColumnLayout>

        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Wind</Box>
            <Box>
              {formatWindSpeed(weather.current.windSpeed)} {formatWindDirection(weather.current.windDirection)}
            </Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Humidity</Box>
            <Box>{weather.current.humidity}%</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Pressure</Box>
            <Box>{Math.round(weather.current.pressure)} hPa</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Visibility</Box>
            <Box>{Math.round(weather.current.visibility / 1000)} km</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">UV Index</Box>
            <Box>{weather.current.uvIndex}</Box>
          </div>
          <div>
            <Box variant="awsui-key-label">Updated</Box>
            <Box>{formatTime(weather.current.time, weather.timezone)}</Box>
          </div>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}

export function HourlyForecastWidget({ weather }: WeatherWidgetProps) {
  const next24Hours = weather.hourly.time.slice(0, 24).map((time, index) => ({
    time,
    temperature: weather.hourly.temperature[index],
    weatherCode: weather.hourly.weatherCode[index],
    precipitation: weather.hourly.precipitation[index],
    windSpeed: weather.hourly.windSpeed[index],
  }));

  const chartData = next24Hours.map((hour, index) => ({
    x: index,
    y: hour.temperature,
  }));

  return (
    <Container
      header={
        <Header variant="h2" description="Temperature trend for the next 24 hours">
          Hourly Forecast
        </Header>
      }
    >
      <LineChart
        series={[
          {
            title: 'Temperature',
            type: 'line',
            data: chartData,
            valueFormatter: value => formatTemperature(value),
          },
        ]}
        xDomain={[0, 23]}
        yTitle="Temperature (°C)"
        xTitle="Hours from now"
        height={200}
        hideFilter
        hideLegend
        xTickFormatter={value => {
          const hourIndex = Math.round(value);
          if (hourIndex >= 0 && hourIndex < next24Hours.length) {
            const time = new Date(next24Hours[hourIndex].time);
            return time.getHours().toString().padStart(2, '0') + ':00';
          }
          return '';
        }}
      />
    </Container>
  );
}

export function WeeklyForecastWidget({ weather }: WeatherWidgetProps) {
  const weeklyData = weather.daily.time.map((time, index) => {
    const weatherInfo = WEATHER_CODES[weather.daily.weatherCode[index]] || { label: 'Unknown', icon: '❓' };
    return {
      day: formatDate(time, weather.timezone),
      icon: weatherInfo.icon,
      condition: weatherInfo.label,
      high: formatTemperature(weather.daily.temperatureMax[index]),
      low: formatTemperature(weather.daily.temperatureMin[index]),
      precipitation: `${Math.round(weather.daily.precipitation[index])}%`,
      wind: formatWindSpeed(weather.daily.windSpeedMax[index]),
    };
  });

  return (
    <Container
      header={
        <Header variant="h2" description="7-day weather forecast">
          Weekly Forecast
        </Header>
      }
    >
      <Table
        columnDefinitions={[
          {
            id: 'day',
            header: 'Day',
            cell: item => item.day,
            isRowHeader: true,
          },
          {
            id: 'icon',
            header: '',
            cell: item => (
              <Box textAlign="center" fontSize="heading-m">
                {item.icon}
              </Box>
            ),
            width: 60,
          },
          {
            id: 'condition',
            header: 'Condition',
            cell: item => item.condition,
          },
          {
            id: 'high',
            header: 'High',
            cell: item => <Box fontWeight="bold">{item.high}</Box>,
          },
          {
            id: 'low',
            header: 'Low',
            cell: item => item.low,
          },
          {
            id: 'precipitation',
            header: 'Rain',
            cell: item => item.precipitation,
          },
          {
            id: 'wind',
            header: 'Wind',
            cell: item => item.wind,
          },
        ]}
        items={weeklyData}
        variant="borderless"
        wrapLines
      />
    </Container>
  );
}

export function WeatherAlertWidget({ error }: { error: string }) {
  return (
    <Alert type="error" header="Weather Data Error">
      {error}
    </Alert>
  );
}

export function WeatherLoadingWidgets() {
  return (
    <>
      <WeatherWidgetLoading title="Current Weather" height="300px" />
      <WeatherWidgetLoading title="Hourly Forecast" height="250px" />
      <WeatherWidgetLoading title="Weekly Forecast" height="400px" />
    </>
  );
}
