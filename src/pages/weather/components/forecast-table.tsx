// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import Tabs from '@cloudscape-design/components/tabs';

import { WeatherData, WeatherService } from '../weather-service';

interface ForecastTableProps {
  weather: WeatherData;
}

export function ForecastTable({ weather }: ForecastTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hourlyData = weather.hourly.slice(0, 24);

  return (
    <Container header={<Header variant="h2">Weather Forecast</Header>}>
      <Tabs
        tabs={[
          {
            label: 'Hourly (24h)',
            id: 'hourly',
            content: (
              <Table
                columnDefinitions={[
                  {
                    id: 'time',
                    header: 'Time',
                    cell: item => formatTime(item.time),
                    sortingField: 'time',
                  },
                  {
                    id: 'weather',
                    header: 'Weather',
                    cell: item => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2em' }}>{WeatherService.getWeatherIcon(item.weatherCode)}</span>
                        <span>{WeatherService.getWeatherDescription(item.weatherCode)}</span>
                      </div>
                    ),
                  },
                  {
                    id: 'temperature',
                    header: 'Temperature',
                    cell: item => `${item.temperature}°C`,
                    sortingField: 'temperature',
                  },
                  {
                    id: 'humidity',
                    header: 'Humidity',
                    cell: item => `${item.humidity}%`,
                    sortingField: 'humidity',
                  },
                  {
                    id: 'precipitation',
                    header: 'Precipitation',
                    cell: item => `${item.precipitation} mm`,
                    sortingField: 'precipitation',
                  },
                ]}
                items={hourlyData}
                loadingText="Loading forecast"
                trackBy="time"
                empty="No forecast data available"
                sortingDisabled={false}
              />
            ),
          },
          {
            label: 'Daily (7 days)',
            id: 'daily',
            content: (
              <div
                style={{
                  overflowX: 'auto',
                  padding: '8px 0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    minWidth: 'max-content',
                    paddingBottom: '8px',
                  }}
                >
                  {weather.daily.map((day, index) => (
                    <div
                      key={day.date}
                      style={{
                        minWidth: '160px',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        backgroundColor: '#fafafa',
                        textAlign: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <SpaceBetween size="xs">
                        <Box variant="h4" fontWeight="bold">
                          {index === 0 ? 'Today' : formatDate(day.date)}
                        </Box>

                        <Box fontSize="heading-xl">{WeatherService.getWeatherIcon(day.weatherCode)}</Box>

                        <Box fontSize="body-s" color="text-status-info">
                          {WeatherService.getWeatherDescription(day.weatherCode)}
                        </Box>

                        <SpaceBetween size="xxs">
                          <Box fontSize="heading-s" fontWeight="bold">
                            {day.temperatureMax}°C
                          </Box>
                          <Box fontSize="body-s" color="text-body-secondary">
                            {day.temperatureMin}°C
                          </Box>
                        </SpaceBetween>

                        {day.precipitationSum > 0 && (
                          <Box fontSize="body-s" color="text-status-info">
                            💧 {day.precipitationSum} mm
                          </Box>
                        )}
                      </SpaceBetween>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
        ]}
      />
    </Container>
  );
}
