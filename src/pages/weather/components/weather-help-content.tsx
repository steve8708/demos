// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';

export function WeatherHelpContent() {
  return (
    <SpaceBetween size="m">
      <Box variant="h3">Weather Dashboard</Box>

      <Box variant="p">
        This weather dashboard provides real-time weather information and 7-day forecasts for various cities around the
        world.
      </Box>

      <Box variant="h4">Features</Box>
      <Box variant="ul">
        <li>Current weather conditions including temperature, humidity, and wind speed</li>
        <li>7-day weather forecast with daily high/low temperatures</li>
        <li>Multiple city locations to choose from</li>
        <li>Weather codes following WMO standards</li>
      </Box>

      <Box variant="h4">Data Source</Box>
      <Box variant="p">
        Weather data is provided by the{' '}
        <Link href="https://open-meteo.com/" external>
          Open Meteo API
        </Link>
        , which offers free weather forecasts without requiring an API key.
      </Box>

      <Box variant="h4">Weather Codes</Box>
      <Box variant="p">Weather codes follow the World Meteorological Organization (WMO) interpretation:</Box>
      <Box variant="ul">
        <li>0: Clear sky</li>
        <li>1-3: Mainly clear to overcast</li>
        <li>45-48: Fog</li>
        <li>51-55: Drizzle</li>
        <li>61-65: Rain</li>
        <li>71-75: Snow</li>
        <li>80-82: Rain showers</li>
        <li>95-99: Thunderstorm</li>
      </Box>

      <Box variant="h4">Usage</Box>
      <Box variant="p">
        Select a location from the dropdown to view weather information for that area. Use the refresh button to get the
        latest weather data.
      </Box>
    </SpaceBetween>
  );
}
