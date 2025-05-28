// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
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
              <Table
                columnDefinitions={[
                  {
                    id: 'date',
                    header: 'Date',
                    cell: item => formatDate(item.date),
                    sortingField: 'date',
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
                    id: 'temperatureMax',
                    header: 'High',
                    cell: item => `${item.temperatureMax}°C`,
                    sortingField: 'temperatureMax',
                  },
                  {
                    id: 'temperatureMin',
                    header: 'Low',
                    cell: item => `${item.temperatureMin}°C`,
                    sortingField: 'temperatureMin',
                  },
                  {
                    id: 'precipitation',
                    header: 'Precipitation',
                    cell: item => `${item.precipitationSum} mm`,
                    sortingField: 'precipitationSum',
                  },
                ]}
                items={weather.daily}
                loadingText="Loading forecast"
                trackBy="date"
                empty="No forecast data available"
                sortingDisabled={false}
              />
            ),
          },
        ]}
      />
    </Container>
  );
}
