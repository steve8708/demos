// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';

import { ExternalLinkGroup, InfoLink, useHelpPanel } from '../../commons';

interface Coordinates {
  latitude: number;
  longitude: number;
  name: string;
}

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
        <li>Change location by entering new coordinates</li>
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
  const [latitude, setLatitude] = React.useState(coordinates.latitude.toString());
  const [longitude, setLongitude] = React.useState(coordinates.longitude.toString());
  const [locationName, setLocationName] = React.useState(coordinates.name);

  const handleLocationUpdate = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      onCoordinatesChange({
        latitude: lat,
        longitude: lng,
        name: locationName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });
    }
  };

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
            This dashboard displays weather data from the Open Meteo API for your specified location. Enter new
            coordinates or update the location name to view weather information for different areas.
          </Box>
        </SpaceBetween>
        <Form
          actions={
            <Button onClick={handleLocationUpdate} variant="primary">
              Update Location
            </Button>
          }
        >
          <SpaceBetween direction="horizontal" size="m">
            <FormField label="Latitude">
              <Input
                value={latitude}
                onChange={event => setLatitude(event.detail.value)}
                placeholder="Enter latitude (e.g., 47.6062)"
              />
            </FormField>
            <FormField label="Longitude">
              <Input
                value={longitude}
                onChange={event => setLongitude(event.detail.value)}
                placeholder="Enter longitude (e.g., -122.3321)"
              />
            </FormField>
            <FormField label="Location Name">
              <Input
                value={locationName}
                onChange={event => setLocationName(event.detail.value)}
                placeholder="Enter location name (e.g., Seattle, WA)"
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </ColumnLayout>
    </Container>
  );
}
