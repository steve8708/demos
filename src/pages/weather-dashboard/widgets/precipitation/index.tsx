// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Spinner from '@cloudscape-design/components/spinner';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { WeatherAPI } from '../../services/weather-api';
import { useWeatherContext } from '../../context/weather-context';
import { WeatherAPIResponse } from '../interfaces';
import { WeatherWidgetConfig } from '../interfaces';

function PrecipitationHeader() {
  return (
    <Header variant="h2" description="Rainfall and precipitation data">
      Precipitation
    </Header>
  );
}

function PrecipitationWidget() {
  const [weatherData, setWeatherData] = useState<WeatherAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLocation } = useWeatherContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await WeatherAPI.getCurrentWeather(currentLocation);
        setWeatherData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch precipitation data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentLocation]);

  if (loading) {
    return (
      <Box textAlign="center" padding="l">
        <Spinner size="large" />
        <Box variant="p" margin={{ top: 's' }}>
          Loading precipitation data...
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
        <StatusIndicator type="warning">No precipitation data available</StatusIndicator>
      </Box>
    );
  }

  const hourlyPrecipitation = weatherData.hourly.precipitation.slice(0, 24);
  const dailyPrecipitation = weatherData.daily.precipitation.slice(0, 7);

  const totalToday = hourlyPrecipitation.reduce((sum, val) => sum + val, 0);
  const totalWeek = dailyPrecipitation.reduce((sum, val) => sum + val, 0);
  const maxHourly = Math.max(...hourlyPrecipitation);
  const avgDaily = totalWeek / 7;

  const rainIcon = totalToday > 5 ? '🌧️' : totalToday > 1 ? '🌦️' : '☀️';

  return (
    <Box>
      <Box textAlign="center" margin={{ bottom: 'l' }}>
        <Box fontSize="display-l" margin={{ bottom: 'xs' }}>
          {rainIcon}
        </Box>
        <Box fontSize="heading-xl" margin={{ bottom: 'xs' }}>
          {totalToday.toFixed(1)}mm
        </Box>
        <Box variant="p" color="text-status-inactive">
          Today's rainfall
        </Box>
      </Box>

      <KeyValuePairs
        columns={2}
        items={[
          {
            label: 'This week',
            value: `${totalWeek.toFixed(1)}mm`,
          },
          {
            label: 'Daily average',
            value: `${avgDaily.toFixed(1)}mm`,
          },
          {
            label: 'Peak hour',
            value: `${maxHourly.toFixed(1)}mm`,
          },
          {
            label: 'Status',
            value: totalToday > 10 ? 'Heavy rain' : totalToday > 2 ? 'Light rain' : 'Dry',
          },
        ]}
      />
    </Box>
  );
}

export const precipitation: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
  data: {
    icon: 'notification',
    title: 'Precipitation',
    description: 'Rainfall and precipitation tracking',
    header: PrecipitationHeader,
    content: PrecipitationWidget,
    staticMinHeight: 200,
  },
};
