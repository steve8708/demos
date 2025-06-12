// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import Spinner from '@cloudscape-design/components/spinner';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { WeatherAPI, DEFAULT_LOCATIONS } from '../../services/weather-api';
import { WeatherAPIResponse } from '../interfaces';
import { WeatherWidgetConfig } from '../interfaces';

function TemperatureHeader() {
  return (
    <Header variant="h2" description="24-hour temperature trend">
      Temperature Trend
    </Header>
  );
}

function TemperatureWidget() {
  const [weatherData, setWeatherData] = useState<WeatherAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await WeatherAPI.getCurrentWeather(DEFAULT_LOCATIONS[0]); // New York
        setWeatherData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch temperature data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh every 30 minutes
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" padding="l">
        <Spinner size="large" />
        <Box variant="p" margin={{ top: 's' }}>
          Loading temperature data...
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
        <StatusIndicator type="warning">No temperature data available</StatusIndicator>
      </Box>
    );
  }

  const temperatures = weatherData.hourly.temperature;
  const times = weatherData.hourly.time;

  const maxTemp = Math.max(...temperatures);
  const minTemp = Math.min(...temperatures);
  const currentTemp = temperatures[0];

  // Create a simple ASCII-style chart
  const chartHeight = 100;
  const chartData = temperatures.slice(0, 12).map((temp, index) => {
    const hour = new Date(times[index]).getHours();
    const normalizedHeight = ((temp - minTemp) / (maxTemp - minTemp)) * chartHeight;
    return {
      hour: hour.toString().padStart(2, '0') + ':00',
      temp: Math.round(temp),
      height: normalizedHeight,
    };
  });

  return (
    <Box>
      <Box textAlign="center" margin={{ bottom: 'l' }}>
        <Box fontSize="heading-xl">{Math.round(currentTemp)}°C</Box>
        <Box variant="small" color="text-status-inactive">
          Range: {Math.round(minTemp)}° - {Math.round(maxTemp)}°C
        </Box>
      </Box>

      <Box>
        <Box variant="h3" margin={{ bottom: 's' }}>
          Next 12 Hours
        </Box>
        <div style={{ display: 'flex', alignItems: 'end', height: '120px', gap: '8px', overflow: 'auto' }}>
          {chartData.map((point, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '60px',
              }}
            >
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>{point.temp}°</div>
              <div
                style={{
                  width: '12px',
                  height: `${Math.max(point.height, 10)}px`,
                  backgroundColor: point.temp > currentTemp ? '#d91515' : '#1d8102',
                  borderRadius: '2px',
                  marginBottom: '4px',
                }}
              />
              <div style={{ fontSize: '10px', color: '#5f6b7a' }}>{point.hour}</div>
            </div>
          ))}
        </div>
      </Box>
    </Box>
  );
}

export const temperature: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 3 },
  data: {
    icon: 'trending-up',
    title: 'Temperature Trend',
    description: '24-hour temperature visualization',
    header: TemperatureHeader,
    content: TemperatureWidget,
    staticMinHeight: 200,
  },
};
