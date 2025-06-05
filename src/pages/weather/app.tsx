// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import SpaceBetween from '@cloudscape-design/components/space-between';
import HelpPanel from '@cloudscape-design/components/help-panel';
import Link from '@cloudscape-design/components/link';
import Box from '@cloudscape-design/components/box';

import { WeatherDashboard } from './components/weather-dashboard';
import { Notifications } from '../commons';

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <AppLayout
      navigationHide
      content={
        <ContentLayout
          header={
            <Header variant="h1" description="Real-time weather information and forecasts powered by Open-Meteo API">
              Weather Dashboard
            </Header>
          }
        >
          <WeatherDashboard />
        </ContentLayout>
      }
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Home', href: '/' },
            { text: 'Weather Dashboard', href: '/weather' },
          ]}
          expandAriaLabel="Show path"
          ariaLabel="Breadcrumbs"
        />
      }
      tools={
        <HelpPanel
          header={<h2>Weather Dashboard</h2>}
          footer={
            <Box>
              <h3>Weather data provided by</h3>
              <Link external href="https://open-meteo.com/">
                Open-Meteo API
              </Link>
            </Box>
          }
        >
          <SpaceBetween size="l">
            <Box>
              <Box variant="h3">Features</Box>
              <ul>
                <li>Current weather conditions</li>
                <li>24-hour temperature trends</li>
                <li>7-day weather forecast</li>
                <li>Location search and geolocation</li>
                <li>Detailed weather metrics</li>
              </ul>
            </Box>

            <Box>
              <Box variant="h3">How to use</Box>
              <ol>
                <li>Allow location access or search for a city</li>
                <li>View current weather conditions</li>
                <li>Check the hourly temperature chart</li>
                <li>Review the 7-day forecast table</li>
                <li>Use the refresh button to update data</li>
              </ol>
            </Box>

            <Box>
              <Box variant="h3">About the data</Box>
              <Box variant="p">
                Weather data is provided by Open-Meteo, a free weather API that offers accurate forecasts without
                requiring registration. Data includes temperature, humidity, wind speed, precipitation, and more.
              </Box>
            </Box>
          </SpaceBetween>
        </HelpPanel>
      }
      toolsOpen={toolsOpen}
      onToolsChange={({ detail }) => setToolsOpen(detail.open)}
      notifications={<Notifications />}
    />
  );
}
