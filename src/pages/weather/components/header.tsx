// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { ExternalLinkGroup, InfoLink, useHelpPanel } from '../../commons';
import { CitySearch } from './city-search';
import { Coordinates } from '../widgets/interfaces';

interface WeatherDashboardHeaderProps {
  actions?: React.ReactNode;
  coordinates: Coordinates;
  onCoordinatesChange: (coordinates: Coordinates) => void;
}

function WeatherHelpPanelContent() {
  return (
    <div>
      <h1>Weather Dashboard Help</h1>
      <p>This dashboard shows weather data from the Open Meteo API.</p>
      <h3>How to use</h3>
      <ul>
        <li>View current weather conditions and forecasts</li>
        <li>Search for any city to view its weather information</li>
        <li>Refresh weather data using the refresh button</li>
      </ul>
      <h3>About Open Meteo</h3>
      <p>Open-Meteo is an open-source weather API that provides free weather data without requiring an API key.</p>
      <ExternalLinkGroup
        variant="container"
        header="Resources"
        items={[
          {
            text: 'Open Meteo API Documentation',
            href: 'https://open-meteo.com/en/docs',
            external: true,
          },
          {
            text: 'Open Meteo Geocoding API',
            href: 'https://open-meteo.com/en/docs/geocoding-api',
            external: true,
          },
          {
            text: 'Cloudscape Documentation',
            href: 'https://cloudscape.design/',
            external: true,
          },
        ]}
      />
    </div>
  );
}

export function WeatherDashboardMainInfo() {
  return (
    <SpaceBetween size="l">
      <WeatherHelpPanelContent />
    </SpaceBetween>
  );
}

export function WeatherDashboardHeader({ actions, coordinates, onCoordinatesChange }: WeatherDashboardHeaderProps) {
  const loadHelpPanelContent = useHelpPanel();

  return (
    <Container
      header={
        <Header
          variant="h1"
          actions={actions}
          info={
            <InfoLink
              onFollow={() =>
                loadHelpPanelContent(
                  <SpaceBetween size="l">
                    <WeatherHelpPanelContent />
                  </SpaceBetween>,
                )
              }
              ariaLabel="Information about the weather dashboard"
            />
          }
          description="View current weather conditions and forecasts for your selected location."
        >
          Weather Dashboard - {coordinates.name}
        </Header>
      }
    >
      <ColumnLayout columns={2} variant="text-grid">
        <SpaceBetween size="l">
          <Box variant="p">
            This dashboard displays weather data from the Open Meteo API for your specified location. Search for any
            city to view its current weather conditions and forecast.
          </Box>
          <Box variant="p" fontSize="body-s">
            Currently showing weather for: <strong>{coordinates.name}</strong> ({coordinates.latitude.toFixed(4)},{' '}
            {coordinates.longitude.toFixed(4)})
          </Box>
        </SpaceBetween>
        <SpaceBetween size="m">
          <CitySearch onCitySelect={onCoordinatesChange} defaultValue={coordinates.name} />
        </SpaceBetween>
      </ColumnLayout>
    </Container>
  );
}
