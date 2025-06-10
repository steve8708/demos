// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { format, parseISO } from 'date-fns';

import { DailyWeather } from '../types';

interface WeatherForecastProps {
  forecast: DailyWeather;
}

const weatherEmojis: Record<number, string> = {
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
  65: '⛈️', // Heavy rain
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

const weatherDescriptions: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Moderate rain showers',
  82: 'Heavy rain showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Heavy thunderstorm',
};

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  const formatTemperature = (temp: number) => `${Math.round(temp)}°`;
  const formatPrecipitation = (precipitation: number) => `${precipitation}mm`;

  const forecastDays = forecast.time.slice(0, 7).map((date, index) => {
    const weatherCode = forecast.weathercode[index];
    const emoji = weatherEmojis[weatherCode] || '❓';
    const description = weatherDescriptions[weatherCode] || 'Unknown';
    const parsedDate = parseISO(date);
    const isToday = index === 0;

    return {
      date: parsedDate,
      dayName: isToday ? 'Today' : format(parsedDate, 'EEE'),
      shortDate: format(parsedDate, 'MMM dd'),
      maxTemp: forecast.temperature_2m_max[index],
      minTemp: forecast.temperature_2m_min[index],
      precipitation: forecast.precipitation_sum[index],
      weatherCode,
      emoji,
      description,
      isToday,
    };
  });

  return (
    <Container
      header={
        <Header variant="h2" description="Swipe or scroll horizontally to see the full 7-day forecast">
          Weather Forecast
        </Header>
      }
    >
      <div
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: '8px',
          marginBottom: '-8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '16px',
            minWidth: 'fit-content',
            paddingBottom: '8px',
          }}
        >
          {forecastDays.map((day, index) => (
            <div
              key={index}
              style={{
                minWidth: '140px',
                maxWidth: '140px',
                backgroundColor: day.isToday
                  ? 'var(--color-background-control-checked)'
                  : 'var(--color-background-container-content)',
                border: day.isToday
                  ? '2px solid var(--color-border-control-checked)'
                  : '1px solid var(--color-border-divider-default)',
                borderRadius: '12px',
                padding: '16px 12px',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                if (!day.isToday) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background-control-default)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={e => {
                if (!day.isToday) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-background-container-content)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }
              }}
            >
              <SpaceBetween size="s">
                <Box>
                  <Box variant={day.isToday ? 'h4' : 'span'} fontWeight={day.isToday ? 'bold' : 'normal'}>
                    {day.dayName}
                  </Box>
                  <Box variant="small" color="text-body-secondary" margin={{ top: 'xxxs' }}>
                    {day.shortDate}
                  </Box>
                </Box>

                <Box textAlign="center">
                  <div
                    style={{
                      fontSize: '32px',
                      lineHeight: '1',
                      margin: '8px 0',
                    }}
                  >
                    {day.emoji}
                  </div>
                  <Box variant="small" color="text-body-secondary">
                    {day.description}
                  </Box>
                </Box>

                <SpaceBetween size="xs">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box variant="span" fontWeight="bold" fontSize="body-m">
                      {formatTemperature(day.maxTemp)}
                    </Box>
                    <Box variant="span" color="text-body-secondary" fontSize="body-s">
                      {formatTemperature(day.minTemp)}
                    </Box>
                  </div>

                  {day.precipitation > 0 && (
                    <Box textAlign="center">
                      <Box variant="small" color="text-status-info">
                        💧 {formatPrecipitation(day.precipitation)}
                      </Box>
                    </Box>
                  )}
                </SpaceBetween>
              </SpaceBetween>
            </div>
          ))}
        </div>
      </div>

      <Box variant="small" color="text-body-secondary" margin={{ top: 's' }} textAlign="center">
        Scroll horizontally to see all days
      </Box>
    </Container>
  );
}
