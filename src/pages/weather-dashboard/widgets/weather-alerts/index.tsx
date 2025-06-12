// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Alert from '@cloudscape-design/components/alert';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WeatherAPI } from '../../services/weather-api';
import { useWeatherContext } from '../../context/weather-context';
import { WeatherAPIResponse } from '../interfaces';
import { WeatherWidgetConfig } from '../interfaces';

function WeatherAlertsHeader() {
  return (
    <Header variant="h2" description="Weather warnings and alerts">
      Weather Alerts
    </Header>
  );
}

interface WeatherAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

function WeatherAlertsWidget() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLocation } = useWeatherContext();

  useEffect(() => {
    const fetchAndAnalyzeWeather = async () => {
      try {
        setLoading(true);
        const response = await WeatherAPI.getCurrentWeather(currentLocation);

        // Generate alerts based on weather conditions
        const generatedAlerts: WeatherAlert[] = [];
        const current = response.current;
        const hourly = response.hourly;

        // High wind alert
        if (current.windSpeed > 30) {
          generatedAlerts.push({
            id: 'wind-alert',
            type: 'warning',
            title: 'High Wind Warning',
            message: `Wind speeds of ${Math.round(current.windSpeed)} km/h detected. Exercise caution when outdoors.`,
            timestamp: new Date().toISOString(),
          });
        }

        // Heavy precipitation alert
        const totalPrecipitation = hourly.precipitation.slice(0, 6).reduce((sum, val) => sum + val, 0);
        if (totalPrecipitation > 10) {
          generatedAlerts.push({
            id: 'rain-alert',
            type: 'warning',
            title: 'Heavy Rain Alert',
            message: `${totalPrecipitation.toFixed(1)}mm of rain expected in the next 6 hours. Flooding possible in low-lying areas.`,
            timestamp: new Date().toISOString(),
          });
        }

        // Extreme temperature alert
        if (current.temperature > 35) {
          generatedAlerts.push({
            id: 'heat-alert',
            type: 'error',
            title: 'Heat Warning',
            message: `Extreme heat of ${Math.round(current.temperature)}°C. Stay hydrated and avoid prolonged sun exposure.`,
            timestamp: new Date().toISOString(),
          });
        } else if (current.temperature < -10) {
          generatedAlerts.push({
            id: 'cold-alert',
            type: 'error',
            title: 'Extreme Cold Warning',
            message: `Dangerous cold temperature of ${Math.round(current.temperature)}°C. Dress warmly and limit outdoor exposure.`,
            timestamp: new Date().toISOString(),
          });
        }

        // UV Index alert
        if (current.uvIndex > 8) {
          generatedAlerts.push({
            id: 'uv-alert',
            type: 'warning',
            title: 'High UV Index',
            message: `UV Index of ${current.uvIndex}. Use sunscreen and protective clothing when outdoors.`,
            timestamp: new Date().toISOString(),
          });
        }

        // Low visibility alert (if available)
        if (current.visibility < 1000) {
          generatedAlerts.push({
            id: 'visibility-alert',
            type: 'warning',
            title: 'Low Visibility',
            message: `Visibility reduced to ${current.visibility}m due to weather conditions. Drive carefully.`,
            timestamp: new Date().toISOString(),
          });
        }

        // Good weather info
        if (generatedAlerts.length === 0) {
          generatedAlerts.push({
            id: 'good-weather',
            type: 'info',
            title: 'Fair Weather',
            message: 'Current weather conditions are pleasant with no active warnings.',
            timestamp: new Date().toISOString(),
          });
        }

        setAlerts(generatedAlerts);
      } catch (err) {
        setAlerts([
          {
            id: 'error-alert',
            type: 'error',
            title: 'Weather Data Unavailable',
            message: 'Unable to retrieve current weather data for alerts.',
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyzeWeather();

    // Refresh every 15 minutes
    const interval = setInterval(fetchAndAnalyzeWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentLocation]);

  if (loading) {
    return (
      <Box textAlign="center" padding="l">
        <StatusIndicator type="loading">Checking for weather alerts...</StatusIndicator>
      </Box>
    );
  }

  return (
    <SpaceBetween size="s">
      {alerts.map(alert => (
        <Alert key={alert.id} type={alert.type} header={alert.title} dismissible>
          {alert.message}
          <Box variant="small" margin={{ top: 's' }} color="text-status-inactive">
            {new Date(alert.timestamp).toLocaleString()}
          </Box>
        </Alert>
      ))}

      {alerts.length === 0 && (
        <Box textAlign="center" padding="l">
          <StatusIndicator type="success">No active weather alerts</StatusIndicator>
        </Box>
      )}
    </SpaceBetween>
  );
}

export const weatherAlerts: WeatherWidgetConfig = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
  data: {
    icon: 'notification',
    title: 'Weather Alerts',
    description: 'Active weather warnings and advisories',
    header: WeatherAlertsHeader,
    content: WeatherAlertsWidget,
    staticMinHeight: 200,
  },
};
