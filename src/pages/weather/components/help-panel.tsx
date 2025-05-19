// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { ExternalLinkGroup } from '../../commons/external-link-group';

export function WeatherHelpPanel() {
  return (
    <Box>
      <h2>Weather Dashboard</h2>
      <p>
        View current weather conditions and forecasts for cities around the world using data from the Open-Meteo API.
      </p>
      <h3>How to use this dashboard</h3>
      <SpaceBetween size="s">
        <p>
          Enter a city name in the search box to find your desired location. Select a city from the dropdown to see the
          current weather and forecasts for that location.
        </p>
        <p>
          The dashboard displays current temperature, humidity, wind speed, and other conditions. It also shows an
          hourly forecast for the next 24 hours and a daily forecast for the next 7 days.
        </p>
      </SpaceBetween>
      <h3>Learn more</h3>
      <ExternalLinkGroup
        items={[
          {
            href: 'https://open-meteo.com/en/docs',
            text: 'Open-Meteo API documentation',
          },
          {
            href: 'https://cloudscape.design',
            text: 'Cloudscape Design System',
          },
        ]}
      />
    </Box>
  );
}
