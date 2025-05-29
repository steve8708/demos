// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

interface WeatherHeaderProps {
  actions?: React.ReactNode;
}

export function WeatherHeader({ actions }: WeatherHeaderProps) {
  return (
    <Header variant="h1" actions={actions} description="Real-time weather data and forecasts powered by Open-Meteo API">
      Weather Dashboard
    </Header>
  );
}

export function WeatherMainInfo() {
  return (
    <Box margin={{ bottom: 'l' }}>
      <SpaceBetween size="l">
        <div>
          <Box variant="h2">Weather Dashboard</Box>
          <Box variant="p">
            This dashboard provides comprehensive weather information including current conditions, hourly forecasts,
            and 7-day outlook. Data is powered by the Open-Meteo API, providing accurate and up-to-date weather
            information.
          </Box>
        </div>

        <div>
          <Box variant="h3">Features</Box>
          <Box variant="p">
            <ul>
              <li>Real-time current weather conditions</li>
              <li>24-hour hourly forecast</li>
              <li>7-day daily forecast</li>
              <li>Location search and selection</li>
              <li>Detailed weather metrics and charts</li>
            </ul>
          </Box>
        </div>

        <div>
          <Box variant="h3">Data Source</Box>
          <Box variant="p">
            Weather data is provided by{' '}
            <Link external href="https://open-meteo.com/">
              Open-Meteo
            </Link>
            , an open-source weather API offering free access to global weather data.
          </Box>
        </div>

        <div>
          <Box variant="h3">Usage</Box>
          <Box variant="p">
            Use the location selector to search for different cities and view their weather conditions. The dashboard
            automatically updates with current data and provides detailed forecasts to help with planning and
            decision-making.
          </Box>
        </div>
      </SpaceBetween>
    </Box>
  );
}
