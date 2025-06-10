// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Select from '@cloudscape-design/components/select';
import FormField from '@cloudscape-design/components/form-field';
import { WeatherLocation, DEFAULT_LOCATIONS } from '../types';

interface LocationSelectorProps {
  selectedLocation: WeatherLocation | null;
  onLocationChange: (location: WeatherLocation) => void;
  loading?: boolean;
}

export function LocationSelector({ selectedLocation, onLocationChange, loading = false }: LocationSelectorProps) {
  const options = DEFAULT_LOCATIONS.map(location => ({
    label: location.name,
    value: location.name,
    description: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
  }));

  const selectedOption = selectedLocation
    ? options.find(option => option.value === selectedLocation.name) || null
    : null;

  return (
    <FormField label="Location" description="Select a location to view weather data">
      <Select
        selectedOption={selectedOption}
        onChange={({ detail }) => {
          const location = DEFAULT_LOCATIONS.find(loc => loc.name === detail.selectedOption.value);
          if (location) {
            onLocationChange(location);
          }
        }}
        options={options}
        placeholder="Choose a location"
        loadingText="Loading locations..."
        statusType={loading ? 'loading' : 'finished'}
        empty="No locations available"
        filteringType="auto"
      />
    </FormField>
  );
}
