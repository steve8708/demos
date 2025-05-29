// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Table from '@cloudscape-design/components/table';

import { DailyWeather, HourlyWeather, WEATHER_CONDITIONS, getWeatherEmoji } from '../types';

interface ForecastWidgetProps {
  dailyForecast: DailyWeather[];
  hourlyForecast: HourlyWeather[];
}

export function ForecastWidget({ dailyForecast, hourlyForecast }: ForecastWidgetProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  const getWindDirection = (degrees: number): string => {
    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const hourlyColumns = [
    {
      id: 'time',
      header: 'Time',
      cell: (item: HourlyWeather) => formatTime(item.time),
    },
    {
      id: 'condition',
      header: 'Condition',
      cell: (item: HourlyWeather) => {
        const condition = WEATHER_CONDITIONS[item.weatherCode] || {
          description: 'Unknown',
          icon: 'status-info',
          emoji: '❓',
        };
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2em' }}>{condition.emoji}</span>
            <StatusIndicator type={condition.icon as any}>{condition.description}</StatusIndicator>
          </div>
        );
      },
    },
    {
      id: 'temperature',
      header: 'Temperature',
      cell: (item: HourlyWeather) => `${item.temperature}°C`,
    },
    {
      id: 'precipitation',
      header: 'Precipitation',
      cell: (item: HourlyWeather) => `${item.precipitation} mm`,
    },
    {
      id: 'wind',
      header: 'Wind Speed',
      cell: (item: HourlyWeather) => `${item.windSpeed} km/h`,
    },
    {
      id: 'humidity',
      header: 'Humidity',
      cell: (item: HourlyWeather) => `${item.humidity}%`,
    },
  ];

  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h2" description="7-day weather outlook">
            Daily Forecast
          </Header>
        }
      >
        <div className="daily-forecast-scroll">
          <Box variant="small" color="text-body-secondary" margin={{ bottom: 's' }}>
            Scroll horizontally to view all days →
          </Box>
          <div className="daily-forecast-container">
            {dailyForecast.map((day, index) => {
              const condition = WEATHER_CONDITIONS[day.weatherCode] || {
                description: 'Unknown',
                icon: 'status-info',
                emoji: '❓',
              };

              return (
                <div key={day.date} className="daily-forecast-card">
                  <div className="forecast-day">
                    <Box variant="h3" textAlign="center">
                      {formatDate(day.date)}
                    </Box>
                  </div>

                  <div className="forecast-icon">
                    <div className="weather-emoji">{condition.emoji}</div>
                    <Box variant="small" textAlign="center" color="text-body-secondary">
                      {condition.description}
                    </Box>
                  </div>

                  <div className="forecast-temperatures">
                    <div className="temperature-range">
                      <Box variant="strong" fontSize="body-l">
                        {day.maxTemperature}°
                      </Box>
                      <Box variant="span" color="text-body-secondary">
                        {day.minTemperature}°
                      </Box>
                    </div>
                  </div>

                  <div className="forecast-details">
                    <SpaceBetween size="xs">
                      {day.precipitation > 0 && (
                        <div className="detail-item">
                          <Box variant="small" color="text-body-secondary">
                            💧 {day.precipitation}mm
                          </Box>
                        </div>
                      )}
                      <div className="detail-item">
                        <Box variant="small" color="text-body-secondary">
                          💨 {day.windSpeed} km/h
                        </Box>
                      </div>
                      <div className="detail-item">
                        <Box variant="small" color="text-body-secondary">
                          ☀️ UV {Math.round(day.uvIndex * 10) / 10}
                        </Box>
                      </div>
                    </SpaceBetween>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Next 24 hours">
            Hourly Forecast
          </Header>
        }
      >
        <Table
          columnDefinitions={hourlyColumns}
          items={hourlyForecast}
          loadingText="Loading forecast..."
          trackBy="time"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No hourly data available</b>
              <Box variant="p" color="inherit">
                Unable to load hourly forecast.
              </Box>
            </Box>
          }
        />
      </Container>
    </SpaceBetween>
  );
}
