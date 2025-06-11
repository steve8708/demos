// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';
import { LocationData } from '../types';

interface DashboardHeaderProps {
  location: LocationData;
  onRefresh: () => void;
  loading?: boolean;
}

export function DashboardHeader({ location, onRefresh, loading = false }: DashboardHeaderProps) {
  return (
    <Header
      variant="h1"
      description={`Real-time weather data and forecasts powered by Open-Meteo API for ${location.city}, ${location.country}`}
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button iconName="refresh" loading={loading} onClick={onRefresh}>
            Refresh Data
          </Button>
          <Button variant="primary" iconName="external" iconAlign="right" href="https://open-meteo.com" target="_blank">
            Open-Meteo API
          </Button>
        </SpaceBetween>
      }
      info={
        <SpaceBetween direction="horizontal" size="xs">
          <Icon name="location" />
          <span>
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </span>
        </SpaceBetween>
      }
    >
      Weather Dashboard
    </Header>
  );
}
