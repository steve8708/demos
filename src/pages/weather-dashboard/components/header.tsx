// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import HelpPanel from '@cloudscape-design/components/help-panel';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

interface WeatherHeaderProps {
  actions?: React.ReactNode;
}

export function WeatherHeader({ actions }: WeatherHeaderProps) {
  return (
    <Header variant="h1" actions={actions} description="Real-time weather data powered by Open-Meteo API">
      Weather Dashboard
    </Header>
  );
}

export function WeatherMainInfo() {
  return (
    <HelpPanel
      header={<h2>Weather Dashboard</h2>}
      footer={
        <>
          <h3>
            Learn more{' '}
            <span role="img" aria-label="Icon external Link">
              ↗
            </span>
          </h3>
          <ul>
            <li>
              <Link external href="https://open-meteo.com/">
                Open-Meteo API
              </Link>
            </li>
            <li>
              <Link external href="https://cloudscape.design/">
                Cloudscape Design System
              </Link>
            </li>
          </ul>
        </>
      }
    >
      <Box variant="p">
        This weather dashboard displays real-time and forecast weather data using the Open-Meteo API. The dashboard
        shows current conditions, temperature trends, precipitation forecasts, and more for multiple locations.
      </Box>
      <SpaceBetween size="l">
        <Box variant="h3">Features</Box>
        <ul>
          <li>Current weather conditions with live updates</li>
          <li>7-day weather forecast with detailed charts</li>
          <li>Temperature and precipitation trends</li>
          <li>Wind speed and humidity monitoring</li>
          <li>Weather alerts and warnings</li>
          <li>Multiple location tracking</li>
        </ul>
      </SpaceBetween>
    </HelpPanel>
  );
}
