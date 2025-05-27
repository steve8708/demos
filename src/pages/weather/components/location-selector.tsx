// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';

import { WeatherLocation, POPULAR_LOCATIONS } from '../types';

interface LocationSelectorProps {
  selectedLocation: WeatherLocation;
  onLocationChange: (location: WeatherLocation) => void;
  loading?: boolean;
}

export function LocationSelector({ selectedLocation, onLocationChange, loading }: LocationSelectorProps) {
  const options = POPULAR_LOCATIONS.map(location => ({
    label: location.name,
    value: location.name,
    description: `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`,
  }));

  const selectedOption = options.find(option => option.value === selectedLocation.name);

  return (
    <Container
      header={
        <Header variant="h2" description="Select a location to view weather information">
          Location
        </Header>
      }
    >
      <SpaceBetween size="m">
        <Select
          selectedOption={selectedOption || null}
          onChange={({ detail }) => {
            const location = POPULAR_LOCATIONS.find(loc => loc.name === detail.selectedOption.value);
            if (location) {
              onLocationChange(location);
            }
          }}
          options={options}
          placeholder="Choose a location"
          disabled={loading}
          filteringType="auto"
          ariaLabel="Select weather location"
        />
      </SpaceBetween>
    </Container>
  );
}
