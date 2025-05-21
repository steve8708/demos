// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { ExternalLinkGroup } from '../../commons';

export function WeatherHelpPanel() {
  return (
    <SpaceBetween size="l">
      <Box variant="h2">Weather Dashboard</Box>

      <Box variant="p">
        This dashboard displays weather data from the Open Meteo API. You can view current conditions, hourly forecasts,
        daily forecasts, and various charts showing weather trends.
      </Box>

      <Box variant="h3">Changing Location</Box>
      <Box variant="p">
        You can change the location by clicking the "Change location" button in the header. Enter a location name and
        coordinates in the format "City Name (latitude, longitude)".
      </Box>

      <Box variant="h3">Units</Box>
      <Box variant="p">
        You can switch between metric (°C, km/h) and imperial (°F, mph) units using the radio buttons that appear when
        changing location.
      </Box>

      <Box variant="h3">Quick Location Selection</Box>
      <Box variant="p">You can quickly select from popular locations using the links in the side navigation panel.</Box>

      <ExternalLinkGroup
        header="Additional resources"
        items={[
          {
            href: 'https://open-meteo.com/',
            text: 'Open Meteo Website',
          },
          {
            href: 'https://open-meteo.com/en/docs',
            text: 'API Documentation',
          },
          {
            href: 'https://cloudscape.design/',
            text: 'Cloudscape Design System',
          },
        ]}
      />
    </SpaceBetween>
  );
}
