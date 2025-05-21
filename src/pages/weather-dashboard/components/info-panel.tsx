// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

export function InfoContent() {
  return (
    <SpaceBetween size="l">
      <Box variant="h2">Weather Dashboard Information</Box>
      <Box variant="p">
        This weather dashboard uses the Open Meteo API to display weather data for locations around the world. Open
        Meteo is a free and open source weather API that provides current weather data and forecasts.
      </Box>
      <Box variant="h3">Features</Box>
      <SpaceBetween size="m">
        <Box variant="p">
          <ul>
            <li>Location search with geocoding</li>
            <li>Current weather conditions display</li>
            <li>7-day forecast</li>
            <li>Hourly temperature and precipitation charts</li>
            <li>Customizable units (metric/imperial)</li>
          </ul>
        </Box>
      </SpaceBetween>
      <Box variant="h3">Resources</Box>
      <SpaceBetween size="m">
        <Box variant="p">
          <Link href="https://open-meteo.com/en/docs" external target="_blank" rel="noopener noreferrer">
            Open Meteo API Documentation
          </Link>
        </Box>
        <Box variant="p">
          <Link href="https://cloudscape.design" external target="_blank" rel="noopener noreferrer">
            Cloudscape Design System
          </Link>
        </Box>
      </SpaceBetween>
    </SpaceBetween>
  );
}
