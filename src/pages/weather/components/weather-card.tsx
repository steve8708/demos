// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';

interface WeatherCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: string;
  emoji?: string;
  weatherCode?: number;
}

export function WeatherCard({ title, value, description, icon = 'status-info', emoji, weatherCode }: WeatherCardProps) {
  const getWeatherEmoji = (code?: number): string => {
    if (!code) return '';

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

  const displayEmoji = emoji || getWeatherEmoji(weatherCode);

  return (
    <Container>
      <SpaceBetween size="s">
        <Box variant="awsui-key-label">{title}</Box>
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
          {displayEmoji ? (
            <span style={{ fontSize: '24px', lineHeight: 1 }}>{displayEmoji}</span>
          ) : (
            <Icon name={icon} />
          )}
          <Box variant="h3" margin="none">
            {value}
          </Box>
        </SpaceBetween>
        {description && (
          <Box variant="small" color="text-status-inactive">
            {description}
          </Box>
        )}
      </SpaceBetween>
    </Container>
  );
}
