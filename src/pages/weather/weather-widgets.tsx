// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import LineChart from '@cloudscape-design/components/line-chart';
import { WeatherData, WeatherAPI } from './weather-api';

interface CurrentWeatherProps {
  data: WeatherData;
  locationName: string;
}

export function CurrentWeatherWidget({ data, locationName }: CurrentWeatherProps) {
  const { current } = data;

  return (
    <Container
      header={
        <Header variant="h2" description={`Current conditions for ${locationName}`}>
          Current Weather
        </Header>
      }
    >
      <ColumnLayout columns={3} variant="text-grid">
        <div>
          <Box variant="h3" margin={{ bottom: 'xs' }}>
            Temperature
          </Box>
          <Box fontSize="display-l" fontWeight="bold">
            {WeatherAPI.formatTemperature(current.temperature_2m)}
          </Box>
          <Box variant="small" color="text-status-info">
            Feels like {WeatherAPI.formatTemperature(current.apparent_temperature)}
          </Box>
        </div>

        <div>
          <Box variant="h3" margin={{ bottom: 'xs' }}>
            Conditions
          </Box>
          <Box fontSize="body-m" fontWeight="bold">
            {WeatherAPI.getWeatherDescription(current.weather_code)}
          </Box>
          <Box variant="small" color="text-status-info">
            Cloud cover: {current.cloud_cover}%
          </Box>
        </div>

        <div>
          <Box variant="h3" margin={{ bottom: 'xs' }}>
            Wind
          </Box>
          <Box fontSize="body-m" fontWeight="bold">
            {WeatherAPI.formatWindSpeed(current.wind_speed_10m)}
          </Box>
          <Box variant="small" color="text-status-info">
            {WeatherAPI.formatWindDirection(current.wind_direction_10m)} direction
          </Box>
        </div>
      </ColumnLayout>

      <Box margin={{ top: 'l' }}>
        <KeyValuePairs
          columns={4}
          items={[
            {
              label: 'Humidity',
              value: WeatherAPI.formatHumidity(current.relative_humidity_2m),
            },
            {
              label: 'Pressure',
              value: WeatherAPI.formatPressure(current.pressure_msl),
            },
            {
              label: 'Precipitation',
              value: WeatherAPI.formatPrecipitation(current.precipitation),
            },
            {
              label: 'Wind Gusts',
              value: WeatherAPI.formatWindSpeed(current.wind_gusts_10m),
            },
          ]}
        />
      </Box>
    </Container>
  );
}

interface DailyForecastProps {
  data: WeatherData;
}

// Weather emoji mapping function
function getWeatherEmoji(weatherCode: number): string {
  const emojiMap: { [key: number]: string } = {
    0: '☀️', // Clear sky
    1: '🌤️', // Mainly clear
    2: '⛅', // Partly cloudy
    3: '☁️', // Overcast
    45: '🌫️', // Fog
    48: '🌫️', // Depositing rime fog
    51: '🌦️', // Light drizzle
    53: '🌦️', // Moderate drizzle
    55: '🌧️', // Dense drizzle
    56: '🌨️', // Light freezing drizzle
    57: '🌨️', // Dense freezing drizzle
    61: '🌧️', // Slight rain
    63: '🌧️', // Moderate rain
    65: '🌧️', // Heavy rain
    66: '🌨️', // Light freezing rain
    67: '🌨️', // Heavy freezing rain
    71: '❄️', // Slight snow fall
    73: '❄️', // Moderate snow fall
    75: '🌨️', // Heavy snow fall
    77: '❄️', // Snow grains
    80: '🌦️', // Slight rain showers
    81: '🌧️', // Moderate rain showers
    82: '⛈️', // Violent rain showers
    85: '🌨️', // Slight snow showers
    86: '🌨️', // Heavy snow showers
    95: '⛈️', // Thunderstorm
    96: '⛈️', // Thunderstorm with slight hail
    99: '⛈️', // Thunderstorm with heavy hail
  };

  return emojiMap[weatherCode] || '🌥️';
}

export function DailyForecastWidget({ data }: DailyForecastProps) {
  const { daily } = data;

  const forecastItems = daily.time.slice(0, 7).map((date, index) => {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      day: index === 0 ? 'Today' : dayName,
      date: monthDay,
      high: WeatherAPI.formatTemperature(daily.temperature_2m_max[index]),
      low: WeatherAPI.formatTemperature(daily.temperature_2m_min[index]),
      conditions: WeatherAPI.getWeatherDescription(daily.weather_code[index]),
      precipitation: WeatherAPI.formatPrecipitation(daily.precipitation_sum[index]),
      wind: WeatherAPI.formatWindSpeed(daily.wind_speed_10m_max[index]),
      emoji: getWeatherEmoji(daily.weather_code[index]),
      weatherCode: daily.weather_code[index],
    };
  });

  return (
    <Container
      header={
        <Header variant="h2" description="7-day weather forecast">
          Daily Forecast
        </Header>
      }
    >
      <div className="daily-forecast-scroll">
        <div className="daily-forecast-container">
          {forecastItems.map((item, index) => (
            <div key={index} className="daily-forecast-card">
              <div className="forecast-day">
                <Box fontWeight="bold" fontSize="body-s">
                  {item.day}
                </Box>
                <Box variant="small" color="text-status-info">
                  {item.date}
                </Box>
              </div>

              <div className="forecast-icon">
                <Box fontSize="heading-l" textAlign="center">
                  {item.emoji}
                </Box>
              </div>

              <div className="forecast-temps">
                <Box fontWeight="bold" fontSize="body-m" textAlign="center">
                  {item.high}
                </Box>
                <Box variant="small" color="text-status-info" textAlign="center">
                  {item.low}
                </Box>
              </div>

              <div className="forecast-details">
                <Box variant="small" textAlign="center">
                  {item.conditions}
                </Box>
                <Box variant="small" color="text-status-info" textAlign="center">
                  {item.precipitation}
                </Box>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
interface HourlyChartProps {
  data: WeatherData;
}

export function HourlyTemperatureChart({ data }: HourlyChartProps) {
  const { hourly } = data;

  // Get next 24 hours of data
  const next24Hours = hourly.time.slice(0, 24).map((time, index) => ({
    x: new Date(time),
    y: hourly.temperature_2m[index],
  }));

  return (
    <Container
      header={
        <Header variant="h2" description="Temperature trend for the next 24 hours">
          Hourly Temperature
        </Header>
      }
    >
      <LineChart
        series={[
          {
            title: 'Temperature',
            type: 'line',
            data: next24Hours,
            valueFormatter: value => `${Math.round(value)}°C`,
          },
        ]}
        xDomain={[next24Hours[0]?.x, next24Hours[next24Hours.length - 1]?.x]}
        yDomain={[Math.min(...next24Hours.map(p => p.y)) - 2, Math.max(...next24Hours.map(p => p.y)) + 2]}
        xTitle="Time"
        yTitle="Temperature (°C)"
        height={300}
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          detailPopoverDismissAriaLabel: 'Dismiss',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'line chart',
          xTickFormatter: value =>
            value.toLocaleTimeString('en-US', {
              hour: 'numeric',
              hour12: true,
            }),
        }}
        ariaLabel="Hourly temperature chart"
        errorText="Error loading data."
        loadingText="Loading chart"
        recoveryText="Retry"
        xScaleType="time"
        emphasizeBaselineAxis={false}
      />
    </Container>
  );
}

export function HourlyPrecipitationChart({ data }: HourlyChartProps) {
  const { hourly } = data;

  // Get next 24 hours of precipitation data
  const next24Hours = hourly.time.slice(0, 24).map((time, index) => ({
    x: new Date(time),
    y: hourly.precipitation[index],
  }));

  return (
    <Container
      header={
        <Header variant="h2" description="Precipitation forecast for the next 24 hours">
          Hourly Precipitation
        </Header>
      }
    >
      <LineChart
        series={[
          {
            title: 'Precipitation',
            type: 'line',
            data: next24Hours,
            valueFormatter: value => `${value.toFixed(1)} mm`,
          },
        ]}
        xDomain={[next24Hours[0]?.x, next24Hours[next24Hours.length - 1]?.x]}
        yDomain={[0, Math.max(...next24Hours.map(p => p.y), 1)]}
        xTitle="Time"
        yTitle="Precipitation (mm)"
        height={300}
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          detailPopoverDismissAriaLabel: 'Dismiss',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'line chart',
          xTickFormatter: value =>
            value.toLocaleTimeString('en-US', {
              hour: 'numeric',
              hour12: true,
            }),
        }}
        ariaLabel="Hourly precipitation chart"
        errorText="Error loading data."
        loadingText="Loading chart"
        recoveryText="Retry"
        xScaleType="time"
        emphasizeBaselineAxis={false}
      />
    </Container>
  );
}

interface WeatherSummaryProps {
  data: WeatherData;
  locationName: string;
}

export function WeatherSummaryWidget({ data, locationName }: WeatherSummaryProps) {
  const { current, daily } = data;

  const todayHigh = daily.temperature_2m_max[0];
  const todayLow = daily.temperature_2m_min[0];
  const todayPrecipitation = daily.precipitation_sum[0];

  return (
    <Container
      header={
        <Header variant="h2" description={`Weather summary for ${locationName}`}>
          Today's Summary
        </Header>
      }
    >
      <SpaceBetween size="m">
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3" margin={{ bottom: 'xs' }}>
              Temperature Range
            </Box>
            <Box fontSize="display-s" fontWeight="bold">
              {WeatherAPI.formatTemperature(todayHigh)} / {WeatherAPI.formatTemperature(todayLow)}
            </Box>
            <Box variant="small" color="text-status-info">
              Current: {WeatherAPI.formatTemperature(current.temperature_2m)}
            </Box>
          </div>

          <div>
            <Box variant="h3" margin={{ bottom: 'xs' }}>
              Precipitation
            </Box>
            <Box fontSize="display-s" fontWeight="bold">
              {WeatherAPI.formatPrecipitation(todayPrecipitation)}
            </Box>
            <Box variant="small" color="text-status-info">
              Expected for today
            </Box>
          </div>
        </ColumnLayout>

        <Box>
          <Box variant="h3" margin={{ bottom: 'xs' }}>
            Current Conditions
          </Box>
          <Box fontSize="body-l">
            {WeatherAPI.getWeatherDescription(current.weather_code)} with{' '}
            {WeatherAPI.formatWindSpeed(current.wind_speed_10m)} winds from the{' '}
            {WeatherAPI.formatWindDirection(current.wind_direction_10m)}. Humidity at{' '}
            {WeatherAPI.formatHumidity(current.relative_humidity_2m)} and pressure at{' '}
            {WeatherAPI.formatPressure(current.pressure_msl)}.
          </Box>
        </Box>
      </SpaceBetween>
    </Container>
  );
}
