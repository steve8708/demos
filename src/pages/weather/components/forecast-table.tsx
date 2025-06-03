// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WeatherData, WEATHER_CODES } from '../types';
import { formatTemperature, formatWindSpeed, formatDate } from '../utils/weather-api';

interface ForecastCardsProps {
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

export function ForecastCards({ weatherData }: ForecastCardsProps) {
  const forecastData: ForecastDay[] = weatherData.daily.time.map((date, index) => ({
    date,
    formattedDate: formatDate(date),
    tempMax: weatherData.daily.temperature_2m_max[index],
    tempMin: weatherData.daily.temperature_2m_min[index],
    weatherCode: weatherData.daily.weather_code[index],
    precipitation: weatherData.daily.precipitation_sum[index],
    windSpeed: weatherData.daily.wind_speed_10m_max[index],
  }));

  if (forecastData.length === 0) {
    return (
      <Container
        header={
          <Header variant="h2" description="7-day weather forecast">
            Weekly Forecast
          </Header>
        }
      >
        <div className="forecast-empty-state">
          <span>No forecast data available</span>
        </div>
      </Container>
    );
  }

  return (
    <Container
      header={
        <Header variant="h2" description="Scroll horizontally to view more days">
          Weekly Forecast
        </Header>
      }
    >
      <div className="forecast-scroll-container">
        <div className="forecast-cards-wrapper">
          {forecastData.map(day => {
            const weatherCode = WEATHER_CODES[day.weatherCode] || { description: 'Unknown', icon: '❓' };

            return (
              <div key={day.date} className="forecast-card">
                <SpaceBetween direction="vertical" size="s">
                  <Box variant="h4" textAlign="center" color="text-body-secondary">
                    {day.formattedDate}
                  </Box>

                  <div className="forecast-icon-section">
                    <Box fontSize="heading-xl" textAlign="center">
                      {weatherCode.icon}
                    </Box>
                  </div>

                  <Box variant="small" textAlign="center">
                    {weatherCode.description}
                  </Box>

                  <div className="forecast-temperatures">
                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                      <Box variant="h4" className="temperature-high">
                        {formatTemperature(day.tempMax)}
                      </Box>
                      <Box variant="small" color="text-body-secondary">
                        /
                      </Box>
                      <Box variant="h4" className="temperature-low">
                        {formatTemperature(day.tempMin)}
                      </Box>
                    </SpaceBetween>
                  </div>

                  <SpaceBetween direction="vertical" size="xxs">
                    <div className="forecast-detail-item">
                      <Box variant="small" color="text-body-secondary">
                        💧 {day.precipitation.toFixed(1)} mm
                      </Box>
                    </div>

                    <div className="forecast-detail-item">
                      <Box variant="small" color="text-body-secondary">
                        💨 {formatWindSpeed(day.windSpeed)}
                      </Box>
                    </div>
                  </SpaceBetween>
                </SpaceBetween>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
