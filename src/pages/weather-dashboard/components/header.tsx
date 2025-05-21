// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Header from '@cloudscape-design/components/header';
import { InfoLink, useHelpPanel } from '../../commons';
import { InfoContent } from './info-panel';

export function WeatherDashboardHeader() {
  const loadHelpPanelContent = useHelpPanel();

  return (
    <div>
      <Header
        variant="h1"
        info={
          <InfoLink data-testid="weather-dashboard-info-link" onFollow={() => loadHelpPanelContent(<InfoContent />)} />
        }
        actions={
          <Button
            href="https://open-meteo.com/en/docs"
            iconAlign="right"
            iconName="external"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Meteo Docs
          </Button>
        }
      >
        Weather Dashboard
      </Header>
      <ColumnLayout columns={2} variant="text-grid">
        <div>
          <Box variant="p">
            This dashboard displays weather information using the Open Meteo API. Search for a location or select from
            predefined options to view current weather conditions, daily forecasts, and hourly data. Data is provided by
            Open Meteo, a free and open source weather API.
          </Box>
        </div>
        <div>
          <Box variant="p">
            All charts and visualizations use Cloudscape Design System components to display the data in a consistent
            and accessible way. The data automatically refreshes when you select a new location.
          </Box>
        </div>
      </ColumnLayout>
    </div>
  );
}
