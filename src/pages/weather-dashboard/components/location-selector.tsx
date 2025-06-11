// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Select from '@cloudscape-design/components/select';
import FormField from '@cloudscape-design/components/form-field';
import { LocationData } from '../types';

interface LocationSelectorProps {
  locations: LocationData[];
  selectedLocation: LocationData;
  onLocationChange: (location: LocationData) => void;
  loading?: boolean;
}

export function LocationSelector({
  locations,
  selectedLocation,
  onLocationChange,
  loading = false,
}: LocationSelectorProps) {
  const options = locations.map(location => ({
    label: `${location.city}, ${location.country}`,
    value: `${location.latitude},${location.longitude}`,
    description: `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`,
    tags: [location.country],
  }));

  const selectedOption = options.find(
    option => option.value === `${selectedLocation.latitude},${selectedLocation.longitude}`,
  );

  return (
    <FormField label="Location" description="Select a location to view weather data">
      <Select
        selectedOption={selectedOption || null}
        onChange={({ detail }) => {
          if (detail.selectedOption?.value) {
            const [lat, lng] = detail.selectedOption.value.split(',').map(Number);
            const location = locations.find(loc => loc.latitude === lat && loc.longitude === lng);
            if (location) {
              onLocationChange(location);
            }
          }
        }}
        options={options}
        loadingText="Loading locations..."
        statusType={loading ? 'loading' : 'finished'}
        placeholder="Choose a location"
        expandToViewport={true}
        filteringType="auto"
      />
    </FormField>
  );
}
