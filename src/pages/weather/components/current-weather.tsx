// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import {
  CurrentWeather as CurrentWeatherType,
  getWeatherInfo,
  formatTemperature,
  getWindDirection,
} from './weather-utils';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  location: string;
}

export default function CurrentWeather({ data, location }: CurrentWeatherProps) {
  const weather = getWeatherInfo(data.weather_code);
  const date = new Date(data.time);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Container header={<Header variant="h2">Current Weather</Header>}>
      <div className="current-weather">
        <div className="current-weather-header">
          <h3>{location}</h3>
          <p>
            {formattedDate} at {formattedTime}
          </p>
        </div>

        <ColumnLayout columns={3} variant="text-grid">
          <div className="weather-main-info">
            <span className="weather-icon">{weather.icon}</span>
            <Box variant="h1" padding="n">
              {formatTemperature(data.temperature_2m)}
            </Box>
            <StatusIndicator type="info">{weather.description}</StatusIndicator>
          </div>

          <div className="weather-details">
            <h4>Details</h4>
            <ul className="weather-details-list">
              <li>
                <span>Feels like:</span>
                <span>{formatTemperature(data.apparent_temperature)}</span>
              </li>
              <li>
                <span>Humidity:</span>
                <span>{data.relative_humidity_2m}%</span>
              </li>
              <li>
                <span>Precipitation:</span>
                <span>{data.precipitation} mm</span>
              </li>
            </ul>
          </div>

          <div className="weather-wind">
            <h4>Wind</h4>
            <div className="wind-info">
              <div className="wind-speed">
                <span>{data.wind_speed_10m} km/h</span>
              </div>
              <div className="wind-direction">
                <span>
                  Direction: {getWindDirection(data.wind_direction_10m)} ({data.wind_direction_10m}°)
                </span>
              </div>
            </div>
          </div>
        </ColumnLayout>
      </div>
    </Container>
  );
}
