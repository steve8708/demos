// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

import { LocationData } from '../types';

interface WeatherDashboardHeaderProps {
  actions?: React.ReactNode;
  location: LocationData;
  statusInfo?: React.ReactNode;
}

export function WeatherDashboardHeader({ actions, location, statusInfo }: WeatherDashboardHeaderProps) {
  return (
    <Header
      variant="h1"
      actions={actions}
      description={
        <SpaceBetween size="xs">
          <Box variant="p">Real-time weather information and forecasts powered by Open-Meteo API</Box>
          <Box variant="small">
            {location.name}, {location.country} • {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Box>
          {statusInfo}
        </SpaceBetween>
      }
    >
      Weather Dashboard
    </Header>
  );
}
