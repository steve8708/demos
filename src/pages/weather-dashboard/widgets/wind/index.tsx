// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Spinner from '@cloudscape-design/components/spinner';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { WeatherAPI, DEFAULT_LOCATIONS } from '../../services/weather-api';
import { CurrentWeatherData } from '../interfaces';
import { WeatherWidgetConfig } from '../interfaces';

function WindHeader() {
  return (
    <Header variant="h2" description="Wind speed and direction">
      Wind Conditions
    </Header>
  );
}

function WindWidget() {
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await WeatherAPI.getCurrentWeather(DEFAULT_LOCATIONS[0]);
        setWeatherData(response.current);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wind data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" padding="l">
        <Spinner size="large" />
        <Box variant="p" margin={{ top: 's' }}>
          Loading wind data...
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" padding="l">
        <StatusIndicator type="error">{error}</StatusIndicator>
      </Box>
    );
  }

  if (!weatherData) {
    return (
      <Box textAlign="center" padding="l">
        <StatusIndicator type="warning">No wind data available</StatusIndicator>
      </Box>
    );
  }

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

  const getWindStrength = (speed: number): { description: string; emoji: string } => {
    if (speed < 5) return { description: 'Calm', emoji: '🍃' };
    if (speed < 15) return { description: 'Light breeze', emoji: '💨' };
    if (speed < 25) return { description: 'Moderate wind', emoji: '🌬️' };
    if (speed < 40) return { description: 'Strong wind', emoji: '💨' };
    return { description: 'Very strong wind', emoji: '🌪️' };
  };

  const windDirection = getWindDirection(weatherData.windDirection);
  const windStrength = getWindStrength(weatherData.windSpeed);

  // Create a simple wind direction arrow
  const arrowRotation = weatherData.windDirection;

  return (
    <Box>
      <Box textAlign="center" margin={{ bottom: 'l' }}>
        <Box fontSize="display-l" margin={{ bottom: 'xs' }}>
          {windStrength.emoji}
        </Box>
        <Box fontSize="heading-xl" margin={{ bottom: 'xs' }}>
          {Math.round(weatherData.windSpeed)} km/h
        </Box>
        <Box variant="p" color="text-status-inactive">
          {windStrength.description}
        </Box>
      </Box>

      <Box textAlign="center" margin={{ bottom: 'l' }}>
        <div
          style={{
            display: 'inline-block',
            fontSize: '24px',
            transform: `rotate(${arrowRotation}deg)`,
            transition: 'transform 0.3s ease',
          }}
        >
          ↑
        </div>
        <Box variant="small" margin={{ top: 'xs' }}>
          {windDirection} ({weatherData.windDirection}°)
        </Box>
      </Box>

      <KeyValuePairs
        columns={2}
        items={[
          {
            label: 'Direction',
            value: `${windDirection}`,
          },
          {
            label: 'Degrees',
            value: `${weatherData.windDirection}°`,
          },
          {
            label: 'Speed',
            value: `${Math.round(weatherData.windSpeed)} km/h`,
          },
          {
            label: 'Condition',
            value: windStrength.description,
          },
        ]}
      />
    </Box>
  );
}

export const wind: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
  data: {
    icon: 'arrow-right',
    title: 'Wind Conditions',
    description: 'Current wind speed and direction',
    header: WindHeader,
    content: WindWidget,
    staticMinHeight: 200,
  },
};
