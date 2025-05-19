// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { InfoLink } from '../../commons/info-link';

export function WeatherDashboardHeader() {
  return (
    <SpaceBetween size="m">
      <Header
        variant="h1"
        info={
          <InfoLink
            onFollow={() => {
              /* Tools panel will open automatically */
            }}
            ariaLabel="Info about weather dashboard"
          />
        }
        description="Get current weather information and forecasts for any city around the world."
      >
        Weather Dashboard
      </Header>
    </SpaceBetween>
  );
}
