// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from 'react';
import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Box from '@cloudscape-design/components/box';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { DashboardContent } from './components/dashboard-content';

// Help panel content for the weather dashboard
const WeatherHelpContent = () => (
  <Box>
    <Box variant="h3">Weather Dashboard</Box>
    <Box variant="p">This dashboard displays real-time weather information and forecasts using the Open-Meteo API.</Box>
    <Box variant="h4">Features:</Box>
    <ul>
      <li>Current weather conditions</li>
      <li>24-hour hourly forecast</li>
      <li>7-day daily forecast</li>
      <li>Multiple location support</li>
    </ul>
    <Box variant="h4">Data Source:</Box>
    <Box variant="p">
      Weather data is provided by Open-Meteo, a free and open-source weather API that offers accurate and
      high-resolution weather forecasts globally. No API key is required for this demo.
    </Box>
    <Box variant="h4">Location Selection:</Box>
    <Box variant="p">
      Choose from predefined locations or the default location (Berlin, Germany) to view weather data for different
      cities around the world.
    </Box>
  </Box>
);

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <WeatherHelpContent />);

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
  };

  return (
    <HelpPanelProvider value={handleToolsContentChange}>
      <CustomAppLayout
        content={<DashboardContent />}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { text: 'Home', href: '/' },
              { text: 'Weather Dashboard', href: '/weather-dashboard' },
            ]}
          />
        }
        tools={toolsContent}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
        navigationHide={true}
      />
    </HelpPanelProvider>
  );
}
