// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { ForecastData } from '../types';
import styles from './weather-forecast-scroll.module.scss';

interface WeatherForecastProps {
  forecast: ForecastData;
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  const forecastItems = forecast.time.map((date, index) => ({
    date,
    maxTemp: forecast.temperature_2m_max[index],
    minTemp: forecast.temperature_2m_min[index],
    weatherCode: forecast.weather_code[index],
    precipitation: forecast.precipitation_sum[index],
    windSpeed: forecast.wind_speed_10m_max[index],
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getWeatherIcon = (code: number): string => {
    const weatherIcons: { [key: number]: string } = {
      0: '☀️', // Clear sky
      1: '🌤️', // Mainly clear
      2: '⛅', // Partly cloudy
      3: '☁️', // Overcast
      45: '🌫️', // Fog
      48: '🌫️', // Depositing rime fog
      51: '🌦️', // Light drizzle
      53: '🌦️', // Moderate drizzle
      55: '🌧️', // Dense drizzle
      61: '🌧️', // Slight rain
      63: '🌧️', // Moderate rain
      65: '⛈️', // Heavy rain
      71: '🌨️', // Slight snow
      73: '❄️', // Moderate snow
      75: '🌨️', // Heavy snow
      80: '🌦️', // Slight rain showers
      81: '⛈️', // Moderate rain showers
      82: '⛈️', // Violent rain showers
      95: '⛈️', // Thunderstorm
      96: '⛈️', // Thunderstorm with hail
      99: '⛈️', // Thunderstorm with heavy hail
    };

    return weatherIcons[code] || '🌡️';
  };

  const getWeatherDescription = (code: number) => {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail',
    };

    return weatherCodes[code] || `Weather code ${code}`;
  };

  return (
    <div className={styles['forecast-scroll-container']}>
      {forecastItems.map((item, index) => (
        <Container key={item.date} className={styles['forecast-card']}>
          <SpaceBetween size="s">
            <Box textAlign="center" variant="awsui-key-label">
              {formatDate(item.date)}
            </Box>

            <Box textAlign="center">
              <span className={styles['weather-icon']}>{getWeatherIcon(item.weatherCode)}</span>
            </Box>

            <Box textAlign="center">
              <SpaceBetween size="xxs">
                <div className={styles['temperature-main']}>{Math.round(item.maxTemp)}°C</div>
                <div className={styles['temperature-sub']}>{Math.round(item.minTemp)}°C</div>
              </SpaceBetween>
            </Box>

            <Box textAlign="center" variant="small">
              {getWeatherDescription(item.weatherCode)}
            </Box>

            <SpaceBetween size="xxs">
              <Box textAlign="center" variant="small" color="text-status-inactive">
                💧 {item.precipitation} mm
              </Box>
              <Box textAlign="center" variant="small" color="text-status-inactive">
                💨 {Math.round(item.windSpeed)} km/h
              </Box>
            </SpaceBetween>
          </SpaceBetween>
        </Container>
      ))}
    </div>
  );
}
