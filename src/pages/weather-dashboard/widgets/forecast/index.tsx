// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import Spinner from '@cloudscape-design/components/spinner';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Cards from '@cloudscape-design/components/cards';

import { WeatherAPI, DEFAULT_LOCATIONS } from '../../services/weather-api';
import { WeatherAPIResponse } from '../interfaces';
import { WeatherWidgetConfig } from '../interfaces';

function ForecastHeader() {
  return (
    <Header variant="h2" description="7-day weather forecast">
      Weekly Forecast
    </Header>
  );
}

function ForecastWidget() {
  const [forecastData, setForecastData] = useState<WeatherAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await WeatherAPI.getCurrentWeather(DEFAULT_LOCATIONS[0]); // New York
        setForecastData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch forecast data');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();

    // Refresh every 30 minutes
    const interval = setInterval(fetchForecast, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" padding="l">
        <Spinner size="large" />
        <Box variant="p" margin={{ top: 's' }}>
          Loading forecast...
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

  if (!forecastData) {
    return (
      <Box textAlign="center" padding="l">
        <StatusIndicator type="warning">No forecast data available</StatusIndicator>
      </Box>
    );
  }

  const dailyForecasts = forecastData.daily.time.map((date, index) => {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    const weatherIcon = WeatherAPI.getWeatherIcon(forecastData.daily.weatherCode[index], true);

    return {
      id: date,
      day: dayName,
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: weatherIcon,
      maxTemp: Math.round(forecastData.daily.temperatureMax[index]),
      minTemp: Math.round(forecastData.daily.temperatureMin[index]),
      precipitation: Math.round(forecastData.daily.precipitation[index]),
      windSpeed: Math.round(forecastData.daily.windSpeedMax[index]),
    };
  });

  return (
    <Cards
      cardsPerRow={[
        { cards: 1, minWidth: 0 },
        { cards: 2, minWidth: 400 },
        { cards: 3, minWidth: 600 },
        { cards: 4, minWidth: 800 },
      ]}
      cardDefinition={{
        header: item => (
          <Box>
            <Box variant="h3">{item.day}</Box>
            <Box variant="small" color="text-status-inactive">
              {item.date}
            </Box>
          </Box>
        ),
        sections: [
          {
            id: 'weather',
            content: item => (
              <Box textAlign="center">
                <Box fontSize="heading-l" margin={{ bottom: 'xs' }}>
                  {item.icon}
                </Box>
                <Box variant="p">
                  <strong>{item.maxTemp}°</strong> / {item.minTemp}°
                </Box>
              </Box>
            ),
          },
          {
            id: 'details',
            content: item => (
              <Box variant="small">
                <div>Rain: {item.precipitation}mm</div>
                <div>Wind: {item.windSpeed} km/h</div>
              </Box>
            ),
          },
        ],
      }}
      items={dailyForecasts}
      trackBy="id"
      empty={
        <Box textAlign="center" color="inherit">
          <Box variant="p">No forecast data available</Box>
        </Box>
      }
    />
  );
}

export const forecast: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 3, defaultColumnSpan: 2 },
  data: {
    icon: 'calendar',
    title: 'Weather Forecast',
    description: '7-day weather outlook',
    header: ForecastHeader,
    content: ForecastWidget,
    staticMinHeight: 300,
  },
};
