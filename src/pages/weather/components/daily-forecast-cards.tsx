// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';
import { WEATHER_CODES } from '../types';

interface DailyForecastItem {
  date: string;
  weather: string;
  tempMax: string;
  tempMin: string;
  precipitation: string;
  windSpeed: string;
  uvIndex: number;
  weatherCode: number;
}

interface DailyForecastCardsProps {
  items: DailyForecastItem[];
}

export function DailyForecastCards({ items }: DailyForecastCardsProps) {
  const getWeatherEmoji = (code: number) => {
    return WEATHER_CODES[code]?.emoji || '☁️';
  };

  const formatDate = (dateString: string, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';

    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getUVBadgeColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'green';
    if (uvIndex <= 5) return 'blue';
    if (uvIndex <= 7) return 'grey';
    if (uvIndex <= 10) return 'red';
    return 'red';
  };

  return (
    <Box padding={{ horizontal: 's' }}>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #f1f1f1',
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              minWidth: '180px',
              maxWidth: '180px',
              backgroundColor: '#fafafa',
              border: '1px solid #e1e4e8',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center' as const,
              flexShrink: 0,
            }}
          >
            <SpaceBetween size="s">
              {/* Date */}
              <Box variant="h3" fontSize="body-m" fontWeight="bold">
                {formatDate(item.date, index)}
              </Box>

              {/* Weather Icon and Description */}
              <SpaceBetween size="xs" alignItems="center">
                <Box fontSize="heading-xl">{getWeatherEmoji(item.weatherCode)}</Box>
                <Box variant="small" color="text-body-secondary" textAlign="center">
                  {item.weather}
                </Box>
              </SpaceBetween>

              {/* Temperature */}
              <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                <Badge color="red">{item.tempMax}</Badge>
                <Box variant="small" color="text-body-secondary">
                  /
                </Box>
                <Badge color="blue">{item.tempMin}</Badge>
              </SpaceBetween>

              {/* Additional Info */}
              <SpaceBetween size="xxs">
                <Box variant="small">
                  <Box variant="span" fontWeight="bold">
                    💧{' '}
                  </Box>
                  {item.precipitation}
                </Box>
                <Box variant="small">
                  <Box variant="span" fontWeight="bold">
                    💨{' '}
                  </Box>
                  {item.windSpeed}
                </Box>
                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                  <Box variant="small" fontWeight="bold">
                    ☀️ UV:
                  </Box>
                  <Badge color={getUVBadgeColor(item.uvIndex)}>{item.uvIndex}</Badge>
                </SpaceBetween>
              </SpaceBetween>
            </SpaceBetween>
          </div>
        ))}
      </div>
      <Box variant="small" color="text-body-secondary" margin={{ top: 'xs' }}>
        Scroll horizontally to see more days
      </Box>
    </Box>
  );
}
