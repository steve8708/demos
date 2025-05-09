// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { CurrentWeather, Location, getWeatherIcon, getWeatherLabel } from '../utils/types';
import { formatDate, formatTime } from '../utils/api';

interface CurrentWeatherPanelProps {
  current: CurrentWeather;
  location: Location;
}

export function CurrentWeatherPanel({ current, location }: CurrentWeatherPanelProps) {
  const weatherIcon = getWeatherIcon(current.weatherCode);
  const weatherCondition = getWeatherLabel(current.weatherCode);
  const localTime = formatTime(current.time);
  const localDate = formatDate(current.time);

  return (
    <Container
      header={
        <Header variant="h2" description={`Last updated: ${localTime}, ${localDate}`}>
          Current weather
        </Header>
      }
    >
      <Grid
        gridDefinition={[
          { colspan: { xl: 4, l: 4, m: 4, s: 12, default: 12 } },
          { colspan: { xl: 8, l: 8, m: 8, s: 12, default: 12 } },
        ]}
      >
        {/* Main temperature and condition display */}
        <div
          className="temperature-display"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <SpaceBetween size="xs">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box fontSize="display-l" fontWeight="bold" margin={{ right: 'xs' }}>
                {Math.round(current.temperature)}°C
              </Box>
              <Box fontSize="heading-xl" color="text-body-secondary">
                <Icon name={weatherIcon} size="big" />
              </Box>
            </div>
            <Box fontSize="heading-s" textAlign="center">
              {weatherCondition}
            </Box>
          </SpaceBetween>
        </div>

        {/* Weather details in a clean grid layout */}
        <Grid
          gridDefinition={[
            { colspan: { l: 6, m: 6, default: 6 } },
            { colspan: { l: 6, m: 6, default: 6 } },
            { colspan: { l: 6, m: 6, default: 6 } },
            { colspan: { l: 6, m: 6, default: 6 } },
          ]}
        >
          <WeatherDetailItem
            label="Wind"
            value={`${current.windSpeed} km/h`}
            icon="arrow-up"
            iconRotation={current.windDirection}
          />
          <WeatherDetailItem label="Wind direction" value={`${current.windDirection}°`} />
          <WeatherDetailItem label="Humidity" value={`${current.humidity}%`} icon="status-positive" />
          <WeatherDetailItem
            label="Precipitation"
            value={`${current.precipitation} mm`}
            icon={current.precipitation > 0 ? 'cloud-rain' : 'cloud'}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

interface WeatherDetailItemProps {
  label: string;
  value: string;
  icon?: string;
  iconRotation?: number;
}

function WeatherDetailItem({ label, value, icon, iconRotation }: WeatherDetailItemProps) {
  return (
    <div style={{ padding: '8px 0' }}>
      <Box variant="awsui-key-label">{label}</Box>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon && (
          <Icon
            name={icon}
            style={
              iconRotation ? { transform: `rotate(${iconRotation}deg)`, marginRight: '4px' } : { marginRight: '4px' }
            }
          />
        )}
        <Box variant="awsui-value-large">{value}</Box>
      </div>
    </div>
  );
}
