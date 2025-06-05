// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { HourlyWeather } from '../types';

interface HourlyWeatherChartProps {
  hourlyWeather: HourlyWeather;
}

export function HourlyWeatherChart({ hourlyWeather }: HourlyWeatherChartProps) {
  // Get the next 24 hours of data
  const next24Hours = hourlyWeather.time.slice(0, 24).map((time, index) => ({
    time,
    temperature: Math.round(hourlyWeather.temperature_2m[index]),
    humidity: Math.round(hourlyWeather.relative_humidity_2m[index]),
    precipitation: Math.round(hourlyWeather.precipitation[index] * 10) / 10,
    pressure: Math.round(hourlyWeather.pressure_msl[index]),
    windSpeed: Math.round(hourlyWeather.wind_speed_10m[index]),
    windDirection: Math.round(hourlyWeather.wind_direction_10m[index]),
  }));

  // Calculate statistics for the next 24 hours
  const temperatures = next24Hours.map(h => h.temperature);
  const maxTemp = Math.max(...temperatures);
  const minTemp = Math.min(...temperatures);
  const avgTemp = Math.round(temperatures.reduce((a, b) => a + b, 0) / temperatures.length);

  const totalPrecipitation = next24Hours.reduce((sum, h) => sum + h.precipitation, 0);
  const avgWindSpeed = Math.round(next24Hours.reduce((sum, h) => sum + h.windSpeed, 0) / next24Hours.length);
  const avgHumidity = Math.round(next24Hours.reduce((sum, h) => sum + h.humidity, 0) / next24Hours.length);

  const formatHour = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    });
  };

  return (
    <Container
      header={
        <Header variant="h2" description="Temperature and conditions for the next 24 hours">
          Hourly Weather Details
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
          <KeyValuePairs
            columns={1}
            items={[
              {
                label: 'Average Temperature',
                value: `${avgTemp}°C`,
              },
              {
                label: 'Temperature Range',
                value: `${minTemp}°C - ${maxTemp}°C`,
              },
              {
                label: 'Total Precipitation',
                value: `${totalPrecipitation.toFixed(1)} mm`,
              },
            ]}
          />
          <KeyValuePairs
            columns={1}
            items={[
              {
                label: 'Average Wind Speed',
                value: `${avgWindSpeed} km/h`,
              },
              {
                label: 'Average Humidity',
                value: `${avgHumidity}%`,
              },
              {
                label: 'Data Points',
                value: `${next24Hours.length} hours`,
              },
            ]}
          />
        </Grid>

        <Box>
          <Header variant="h3" description="Hourly breakdown for the next 24 hours">
            Temperature Timeline
          </Header>
          <Box margin={{ top: 'm' }}>
            <Grid gridDefinition={Array.from({ length: Math.min(12, next24Hours.length) }, () => ({ colspan: 1 }))}>
              {next24Hours.slice(0, 12).map((hour, index) => (
                <Box key={hour.time} textAlign="center" padding={{ vertical: 's' }}>
                  <Box fontSize="body-s" color="text-body-secondary">
                    {formatHour(hour.time)}
                  </Box>
                  <Box fontWeight="bold" fontSize="heading-s" color="text-status-info">
                    {hour.temperature}°
                  </Box>
                  <Box fontSize="body-s" color="text-body-secondary">
                    {hour.precipitation > 0 ? `${hour.precipitation}mm` : ''}
                  </Box>
                </Box>
              ))}
            </Grid>
          </Box>
        </Box>

        {next24Hours.length > 12 && (
          <Box>
            <Grid
              gridDefinition={Array.from({ length: Math.min(12, next24Hours.length - 12) }, () => ({ colspan: 1 }))}
            >
              {next24Hours.slice(12, 24).map((hour, index) => (
                <Box key={hour.time} textAlign="center" padding={{ vertical: 's' }}>
                  <Box fontSize="body-s" color="text-body-secondary">
                    {formatHour(hour.time)}
                  </Box>
                  <Box fontWeight="bold" fontSize="heading-s" color="text-status-info">
                    {hour.temperature}°
                  </Box>
                  <Box fontSize="body-s" color="text-body-secondary">
                    {hour.precipitation > 0 ? `${hour.precipitation}mm` : ''}
                  </Box>
                </Box>
              ))}
            </Grid>
          </Box>
        )}
      </SpaceBetween>
    </Container>
  );
}
