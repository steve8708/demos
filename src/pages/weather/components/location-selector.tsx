// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Select from '@cloudscape-design/components/select';
import { WeatherLocation, PREDEFINED_LOCATIONS } from '../types';

interface LocationSelectorProps {
  selectedLocation: WeatherLocation | null;
  onLocationChange: (location: WeatherLocation) => void;
  loading?: boolean;
}

export function LocationSelector({ selectedLocation, onLocationChange, loading }: LocationSelectorProps) {
  const options = PREDEFINED_LOCATIONS.map(location => ({
    label: `${location.name}${location.country ? `, ${location.country}` : ''}`,
    value: location.name,
    description: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
  }));

  return (
    <Select
      selectedOption={
        selectedLocation
          ? {
              label: `${selectedLocation.name}${selectedLocation.country ? `, ${selectedLocation.country}` : ''}`,
              value: selectedLocation.name,
            }
          : null
      }
      onChange={({ detail }) => {
        const location = PREDEFINED_LOCATIONS.find(loc => loc.name === detail.selectedOption.value);
        if (location) {
          onLocationChange(location);
        }
      }}
      options={options}
      placeholder="Choose a location"
      ariaLabel="Select weather location"
      disabled={loading}
      expandToViewport={true}
    />
  );
}
