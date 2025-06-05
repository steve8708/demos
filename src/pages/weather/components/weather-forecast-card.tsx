// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import { DailyWeather, WEATHER_CODE_DESCRIPTIONS } from '../types';
import styles from './weather-forecast.module.scss';

interface WeatherForecastCardProps {
  dailyWeather: DailyWeather;
}

interface ForecastDay {
  date: string;
  dayName: string;
  shortDay: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
}

// Weather code to emoji mapping
const WEATHER_EMOJIS: Record<number, string> = {
  0: '☀️', // Clear sky
  1: '🌤️', // Mainly clear
  2: '⛅', // Partly cloudy
  3: '☁️', // Overcast
  45: '🌫️', // Fog
  48: '🌫️', // Depositing rime fog
  51: '🌦️', // Light drizzle
  53: '🌦️', // Moderate drizzle
  55: '🌧️', // Dense drizzle
  56: '🌧️', // Light freezing drizzle
  57: '🌧️', // Dense freezing drizzle
  61: '🌦️', // Slight rain
  63: '🌧️', // Moderate rain
  65: '🌧️', // Heavy rain
  66: '🌨️', // Light freezing rain
  67: '🌨️', // Heavy freezing rain
  71: '🌨️', // Slight snow fall
  73: '❄️', // Moderate snow fall
  75: '❄️', // Heavy snow fall
  77: '❄️', // Snow grains
  80: '🌦️', // Slight rain showers
  81: '🌧️', // Moderate rain showers
  82: '⛈️', // Violent rain showers
  85: '🌨️', // Slight snow showers
  86: '❄️', // Heavy snow showers
  95: '⛈️', // Thunderstorm
  96: '⛈️', // Thunderstorm with slight hail
  99: '⛈️', // Thunderstorm with heavy hail
};

export function WeatherForecastCard({ dailyWeather }: WeatherForecastCardProps) {
  const forecastDays: ForecastDay[] = dailyWeather.time.map((date, index) => {
    const dateObj = new Date(date);
    const today = new Date();
    const isToday = dateObj.toDateString() === today.toDateString();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = dateObj.toDateString() === tomorrow.toDateString();

    let dayName;
    if (isToday) {
      dayName = 'Today';
    } else if (isTomorrow) {
      dayName = 'Tomorrow';
    } else {
      dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    }

    return {
      date,
      dayName,
      shortDay: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      maxTemp: Math.round(dailyWeather.temperature_2m_max[index]),
      minTemp: Math.round(dailyWeather.temperature_2m_min[index]),
      precipitation: Math.round(dailyWeather.precipitation_sum[index] * 10) / 10,
      windSpeed: Math.round(dailyWeather.wind_speed_10m_max[index]),
      weatherCode: dailyWeather.weathercode[index],
    };
  });

  return (
    <Container
      header={
        <Header variant="h2" description="7-day weather forecast">
          Weather Forecast
        </Header>
      }
    >
      <div className={styles['forecast-container']}>
        {forecastDays.map((day, index) => {
          const weatherEmoji = WEATHER_EMOJIS[day.weatherCode] || '❓';
          const weatherInfo = WEATHER_CODE_DESCRIPTIONS[day.weatherCode] || {
            description: 'Unknown',
            icon: 'help',
          };
          const isToday = index === 0;

          return (
            <div key={day.date} className={`${styles['weather-tile']} ${isToday ? styles.today : ''}`}>
              {/* Day Label */}
              <Box
                fontSize="heading-s"
                fontWeight={isToday ? 'bold' : 'normal'}
                color={isToday ? 'text-status-info' : 'text-body-secondary'}
                margin={{ bottom: 'xs' }}
              >
                {day.dayName}
              </Box>

              {/* Date */}
              <Box fontSize="body-s" color="text-body-secondary" margin={{ bottom: 'm' }}>
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Box>

              {/* Weather Emoji */}
              <div className={styles['weather-emoji']} title={weatherInfo.description}>
                {weatherEmoji}
              </div>

              {/* Weather Description */}
              <Box fontSize="body-m" color="text-body-secondary" margin={{ bottom: 'm' }}>
                {weatherInfo.description}
              </Box>

              {/* Temperature */}
              <Box margin={{ bottom: 'm' }}>
                <Box display="inline" fontWeight="bold" fontSize="display-l" color="text-status-error">
                  {day.maxTemp}°
                </Box>
                <Box display="inline" margin={{ horizontal: 'xs' }} color="text-body-secondary">
                  /
                </Box>
                <Box display="inline" fontSize="heading-m" color="text-status-info">
                  {day.minTemp}°
                </Box>
              </Box>

              {/* Precipitation Badge */}
              {day.precipitation > 0 && (
                <Box margin={{ bottom: 'xs' }}>
                  <Badge color={day.precipitation > 5 ? 'red' : day.precipitation > 1 ? 'blue' : 'grey'}>
                    💧 {day.precipitation}mm
                  </Badge>
                </Box>
              )}

              {/* Wind Speed */}
              <Box fontSize="body-s" color="text-body-secondary">
                🌬️ {day.windSpeed} km/h
              </Box>
            </div>
          );
        })}
      </div>

      {/* Scroll Hint */}
      <Box fontSize="body-s" color="text-body-secondary" textAlign="center" margin={{ top: 'm' }}>
        ← Scroll horizontally to see all days →
      </Box>
    </Container>
  );
}
