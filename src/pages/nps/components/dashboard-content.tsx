// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { ParkOverview } from './park-overview';
import { AlertsWidget } from './alerts-widget';
import { WeatherWidget } from './weather-widget';
import { AmenitiesWidget } from './amenities-widget';
import { ImagesWidget } from './images-widget';
import { VisitorStatsWidget } from './visitor-stats-widget';
import { ActivitiesChartWidget } from './activities-chart-widget';
import { ClimateChartWidget } from './climate-chart-widget';
import { TrailDifficultyWidget } from './trail-difficulty-widget';

interface DashboardContentProps {
  parkCode: string;
  parkName: string;
}

export function DashboardContent({ parkCode, parkName }: DashboardContentProps) {
  return (
    <SpaceBetween size="l">
      <Box fontSize="heading-m" fontWeight="bold" textAlign="center">
        Dashboard for {parkName}
      </Box>

      <Grid
        gridDefinition={[
          { colspan: { l: 8, m: 8, default: 12 } },
          { colspan: { l: 4, m: 4, default: 12 } },
          { colspan: { l: 6, m: 6, default: 12 } },
          { colspan: { l: 6, m: 6, default: 12 } },
          { colspan: { l: 6, m: 6, default: 12 } },
          { colspan: { l: 6, m: 6, default: 12 } },
          { colspan: { l: 6, m: 6, default: 12 } },
          { colspan: { l: 6, m: 6, default: 12 } },
          { colspan: { l: 12, m: 12, default: 12 } },
        ]}
      >
        <ParkOverview parkCode={parkCode} />
        <WeatherWidget parkCode={parkCode} />
        <AlertsWidget parkCode={parkCode} />
        <AmenitiesWidget parkCode={parkCode} />
        <VisitorStatsWidget parkCode={parkCode} />
        <ActivitiesChartWidget parkCode={parkCode} />
        <ClimateChartWidget parkCode={parkCode} />
        <TrailDifficultyWidget parkCode={parkCode} />
        <ImagesWidget parkCode={parkCode} />
      </Grid>
    </SpaceBetween>
  );
}
