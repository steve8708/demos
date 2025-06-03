// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';

import { WeatherData, WEATHER_CODES } from '../types';
import { formatTemperature, formatWindSpeed, formatDate } from '../utils/weather-api';

interface ForecastTableProps {
  weatherData: WeatherData;
}

interface ForecastDay {
  date: string;
  formattedDate: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitation: number;
  windSpeed: number;
}

export function ForecastTable({ weatherData }: ForecastTableProps) {
  const forecastData: ForecastDay[] = weatherData.daily.time.map((date, index) => ({
    date,
    formattedDate: formatDate(date),
    tempMax: weatherData.daily.temperature_2m_max[index],
    tempMin: weatherData.daily.temperature_2m_min[index],
    weatherCode: weatherData.daily.weather_code[index],
    precipitation: weatherData.daily.precipitation_sum[index],
    windSpeed: weatherData.daily.wind_speed_10m_max[index],
  }));

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
            id: 'date',
            header: 'Date',
            cell: (item: ForecastDay) => item.formattedDate,
            sortingField: 'date',
            width: 120,
          },
          {
            id: 'conditions',
            header: 'Conditions',
            cell: (item: ForecastDay) => {
              const weatherCode = WEATHER_CODES[item.weatherCode] || { description: 'Unknown', icon: '❓' };
              return (
                <div className="forecast-conditions">
                  <span className="weather-icon" style={{ marginRight: '8px' }}>
                    {weatherCode.icon}
                  </span>
                  {weatherCode.description}
                </div>
              );
            },
            width: 200,
          },
          {
            id: 'tempHigh',
            header: 'High',
            cell: (item: ForecastDay) => <span className="temperature-high">{formatTemperature(item.tempMax)}</span>,
            sortingField: 'tempMax',
            width: 80,
          },
          {
            id: 'tempLow',
            header: 'Low',
            cell: (item: ForecastDay) => <span className="temperature-low">{formatTemperature(item.tempMin)}</span>,
            sortingField: 'tempMin',
            width: 80,
          },
          {
            id: 'precipitation',
            header: 'Precipitation',
            cell: (item: ForecastDay) => `${item.precipitation.toFixed(1)} mm`,
            sortingField: 'precipitation',
            width: 120,
          },
          {
            id: 'windSpeed',
            header: 'Max Wind',
            cell: (item: ForecastDay) => formatWindSpeed(item.windSpeed),
            sortingField: 'windSpeed',
            width: 100,
          },
        ]}
        items={forecastData}
        loadingText="Loading forecast data"
        sortingDisabled={false}
        variant="embedded"
        empty={
          <div className="forecast-empty-state">
            <span>No forecast data available</span>
          </div>
        }
      />
    </Container>
  );
}
