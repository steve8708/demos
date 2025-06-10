// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import LineChart from '@cloudscape-design/components/line-chart';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { WeatherData, WeatherLocation, WEATHER_CODES } from '../types';
import styles from '../styles.module.scss';

interface WeatherWidgetProps {
  weatherData: WeatherData;
  location: WeatherLocation;
}

interface ForecastDay {
  day: string;
  date: string;
  weatherCode: number;
  emoji: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
}

export function WeatherWidget({ weatherData, location }: WeatherWidgetProps) {
  const { current, daily, hourly } = weatherData;

  // Prepare forecast data
  const forecastData: ForecastDay[] = daily
    ? daily.time.map((time, index) => {
        const date = new Date(time);
        const weather = WEATHER_CODES[daily.weather_code[index]] || WEATHER_CODES[0];
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weatherCode: daily.weather_code[index],
          emoji: weather.emoji,
          maxTemp: daily.temperature_2m_max[index],
          minTemp: daily.temperature_2m_min[index],
          precipitation: daily.precipitation_sum[index],
          windSpeed: daily.wind_speed_10m_max[index],
        };
      })
    : [];

  // Prepare chart data for next 48 hours
  const chartData = hourly
    ? hourly.time.slice(0, 48).map((time, index) => ({
        x: new Date(time),
        temperature: hourly.temperature_2m[index],
        humidity: hourly.relative_humidity_2m[index],
        precipitation: hourly.precipitation_probability[index],
        windSpeed: hourly.wind_speed_10m[index],
      }))
    : [];

  const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;
  const formatWind = (speed: number, direction?: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const directionText = direction !== undefined ? directions[Math.round(direction / 45) % 8] : '';
    return `${Math.round(speed)} km/h ${directionText}`.trim();
  };

  const getWeatherIcon = (code: number) => {
    const weather = WEATHER_CODES[code] || WEATHER_CODES[0];
    return weather.iconName;
  };

  const getWeatherDescription = (code: number) => {
    const weather = WEATHER_CODES[code] || WEATHER_CODES[0];
    return weather.description;
  };

  const getWeatherEmoji = (code: number) => {
    const weather = WEATHER_CODES[code] || WEATHER_CODES[0];
    return weather.emoji;
  };

  return (
    <SpaceBetween size="l">
      {/* Current Weather */}
      {current && (
        <Container
          header={
            <Header variant="h2" description={`Current conditions for ${location.name}, ${location.country}`}>
              Current Weather
            </Header>
          }
        >
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <SpaceBetween size="m">
                <Box variant="h1" fontSize="display-l">
                  {formatTemperature(current.temperature_2m)}
                </Box>
                <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                  <Box fontSize="heading-xl">{getWeatherEmoji(current.weather_code)}</Box>
                  <Icon name={getWeatherIcon(current.weather_code)} />
                  <Box variant="h3">{getWeatherDescription(current.weather_code)}</Box>
                </SpaceBetween>
                <Box variant="small" color="text-body-secondary">
                  Feels like {formatTemperature(current.apparent_temperature)}
                </Box>
              </SpaceBetween>
            </div>
            <div>
              <KeyValuePairs
                columns={1}
                items={[
                  {
                    label: 'Humidity',
                    value: `${current.relative_humidity_2m}%`,
                  },
                  {
                    label: 'Wind',
                    value: formatWind(current.wind_speed_10m, current.wind_direction_10m),
                  },
                  {
                    label: 'Precipitation',
                    value: `${current.precipitation} mm`,
                  },
                  {
                    label: 'Last updated',
                    value: new Date(current.time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZoneName: 'short',
                    }),
                  },
                ]}
              />
            </div>
          </ColumnLayout>
        </Container>
      )}

      {/* 7-Day Forecast - Horizontal Scroll */}
      {forecastData.length > 0 && (
        <Container
          header={
            <Header variant="h2" description="Swipe or scroll horizontally to see all days">
              7-Day Forecast
            </Header>
          }
        >
          <div className={styles['forecast-scroll']}>
            {forecastData.map((day, index) => (
              <div key={index} className={`${styles['forecast-card']} ${index === 0 ? styles.today : ''}`}>
                <SpaceBetween size="xs">
                  <Box variant="strong" color={index === 0 ? 'text-status-info' : 'inherit'}>
                    {index === 0 ? 'Today' : day.day}
                  </Box>
                  <Box variant="small" color="text-body-secondary">
                    {day.date}
                  </Box>
                  <div className={styles['emoji-large']}>{day.emoji}</div>
                  <Box variant="small" color="text-body-secondary">
                    {getWeatherDescription(day.weatherCode)}
                  </Box>
                  <SpaceBetween size="xxs">
                    <Box variant="strong">{formatTemperature(day.maxTemp)}</Box>
                    <Box variant="small" color="text-body-secondary">
                      {formatTemperature(day.minTemp)}
                    </Box>
                  </SpaceBetween>
                  {day.precipitation > 0 && (
                    <Box variant="small" color="text-status-info" className={styles['weather-metric']}>
                      <span>💧</span>
                      <span>{day.precipitation}mm</span>
                    </Box>
                  )}
                  <Box variant="small" color="text-body-secondary" className={styles['weather-metric']}>
                    <span>💨</span>
                    <span>{Math.round(day.windSpeed)} km/h</span>
                  </Box>
                </SpaceBetween>
              </div>
            ))}
          </div>
        </Container>
      )}

      {/* Weather Charts */}
      {chartData.length > 0 && (
        <ColumnLayout columns={2}>
          {/* Temperature and Humidity Chart */}
          <Container
            header={
              <Header variant="h3" description="48-hour temperature and humidity forecast">
                Temperature & Humidity Trends
              </Header>
            }
          >
            <LineChart
              series={[
                {
                  title: 'Temperature (°C)',
                  type: 'line',
                  data: chartData.map(d => ({ x: d.x, y: d.temperature })),
                  color: '#ff6b6b',
                },
                {
                  title: 'Humidity (%)',
                  type: 'line',
                  data: chartData.map(d => ({ x: d.x, y: d.humidity })),
                  color: '#4ecdc4',
                  yAxis: 'right',
                },
              ]}
              xDomain={[chartData[0]?.x, chartData[chartData.length - 1]?.x]}
              yDomain={[
                Math.min(...chartData.map(d => d.temperature)) - 5,
                Math.max(...chartData.map(d => d.temperature)) + 5,
              ]}
              yScaleType="linear"
              xScaleType="time"
              xTitle="Time"
              yTitle="Temperature (°C)"
              height={300}
              hideFilter
              hideLegend={false}
              statusType="finished"
              empty={
                <Box textAlign="center" color="inherit">
                  <Box variant="strong" textAlign="center" color="inherit">
                    No chart data available
                  </Box>
                </Box>
              }
              ariaLabel="Temperature and humidity chart"
              ariaDescription="Chart showing temperature and humidity trends for the next 48 hours"
            />
          </Container>

          {/* Precipitation and Wind Chart */}
          <Container
            header={
              <Header variant="h3" description="48-hour precipitation probability and wind speed">
                Precipitation & Wind Trends
              </Header>
            }
          >
            <LineChart
              series={[
                {
                  title: 'Precipitation (%)',
                  type: 'line',
                  data: chartData.map(d => ({ x: d.x, y: d.precipitation })),
                  color: '#45b7d1',
                },
                {
                  title: 'Wind Speed (km/h)',
                  type: 'line',
                  data: chartData.map(d => ({ x: d.x, y: d.windSpeed })),
                  color: '#96ceb4',
                  yAxis: 'right',
                },
              ]}
              xDomain={[chartData[0]?.x, chartData[chartData.length - 1]?.x]}
              yDomain={[0, 100]}
              yScaleType="linear"
              xScaleType="time"
              xTitle="Time"
              yTitle="Precipitation Probability (%)"
              height={300}
              hideFilter
              hideLegend={false}
              statusType="finished"
              empty={
                <Box textAlign="center" color="inherit">
                  <Box variant="strong" textAlign="center" color="inherit">
                    No chart data available
                  </Box>
                </Box>
              }
              ariaLabel="Precipitation and wind chart"
              ariaDescription="Chart showing precipitation probability and wind speed for the next 48 hours"
            />
          </Container>
        </ColumnLayout>
      )}
    </SpaceBetween>
  );
}

interface WeatherErrorProps {
  error: string;
  onRetry?: () => void;
}

export function WeatherError({ error, onRetry }: WeatherErrorProps) {
  return (
    <Container>
      <Box textAlign="center">
        <SpaceBetween size="m">
          <StatusIndicator type="error">Weather data unavailable</StatusIndicator>
          <Box variant="p">{error}</Box>
          {onRetry && (
            <Box>
              <Box display="inline-block">
                <Icon name="refresh" />
              </Box>
              <Box display="inline-block" margin={{ left: 'xs' }}>
                <button
                  onClick={onRetry}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Try again
                </button>
              </Box>
            </Box>
          )}
        </SpaceBetween>
      </Box>
    </Container>
  );
}

interface WeatherLoadingProps {
  location?: WeatherLocation;
}

export function WeatherLoading({ location }: WeatherLoadingProps) {
  return (
    <Container>
      <Box textAlign="center">
        <SpaceBetween size="m">
          <StatusIndicator type="loading">Loading weather data</StatusIndicator>
          {location && (
            <Box variant="p">
              Fetching current conditions for {location.name}, {location.country}...
            </Box>
          )}
        </SpaceBetween>
      </Box>
    </Container>
  );
}
