// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import { DailyWeather, WEATHER_CODE_DESCRIPTIONS } from '../types';

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
      <Box
        margin={{ vertical: 'm' }}
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'thin',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Box
          style={{
            display: 'flex',
            gap: '16px',
            paddingBottom: '8px',
            minWidth: 'fit-content',
          }}
        >
          {forecastDays.map((day, index) => {
            const weatherEmoji = WEATHER_EMOJIS[day.weatherCode] || '❓';
            const weatherInfo = WEATHER_CODE_DESCRIPTIONS[day.weatherCode] || {
              description: 'Unknown',
              icon: 'help',
            };

            return (
              <Box
                key={day.date}
                style={{
                  minWidth: '140px',
                  maxWidth: '140px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  backgroundColor: index === 0 ? '#f0f8ff' : '#ffffff',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                <Box
                  fontSize="body-s"
                  fontWeight={index === 0 ? 'bold' : 'normal'}
                  color={index === 0 ? 'text-status-info' : 'text-body-secondary'}
                  margin={{ bottom: 'xs' }}
                >
                  {day.dayName}
                </Box>

                <Box fontSize="body-s" color="text-body-secondary" margin={{ bottom: 's' }}>
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Box>

                <Box
                  style={{
                    fontSize: '48px',
                    lineHeight: '1',
                    margin: '12px 0',
                  }}
                  title={weatherInfo.description}
                >
                  {weatherEmoji}
                </Box>

                <Box fontSize="body-s" color="text-body-secondary" margin={{ bottom: 's' }}>
                  {weatherInfo.description}
                </Box>

                <Box margin={{ bottom: 's' }}>
                  <Box display="inline" fontWeight="bold" fontSize="heading-s" color="text-status-error">
                    {day.maxTemp}°
                  </Box>
                  <Box display="inline" margin={{ horizontal: 'xs' }} color="text-body-secondary">
                    /
                  </Box>
                  <Box display="inline" fontSize="body-m" color="text-status-info">
                    {day.minTemp}°
                  </Box>
                </Box>

                {day.precipitation > 0 && (
                  <Box margin={{ bottom: 'xs' }}>
                    <Badge color={day.precipitation > 5 ? 'red' : day.precipitation > 1 ? 'blue' : 'grey'}>
                      💧 {day.precipitation}mm
                    </Badge>
                  </Box>
                )}

                <Box fontSize="body-s" color="text-body-secondary">
                  🌬️ {day.windSpeed} km/h
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box fontSize="body-s" color="text-body-secondary" textAlign="center" margin={{ top: 's' }}>
        Scroll horizontally to see all days
      </Box>
    </Container>
  );
}
