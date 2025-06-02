// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

import { WeatherLocation } from '../types';

interface LocationSelectorProps {
  selectedLocation: WeatherLocation;
  onLocationChange: (location: WeatherLocation) => void;
}

const PREDEFINED_LOCATIONS: WeatherLocation[] = [
  { name: 'Seattle, WA', latitude: 47.6062, longitude: -122.3321 },
  { name: 'New York, NY', latitude: 40.7128, longitude: -74.006 },
  { name: 'Los Angeles, CA', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Chicago, IL', latitude: 41.8781, longitude: -87.6298 },
  { name: 'Miami, FL', latitude: 25.7617, longitude: -80.1918 },
  { name: 'Denver, CO', latitude: 39.7392, longitude: -104.9903 },
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Paris, France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093 },
];

export function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  const locationOptions = PREDEFINED_LOCATIONS.map(location => ({
    label: location.name,
    value: location.name,
    description: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
  }));

  const selectedOption = locationOptions.find(option => option.value === selectedLocation.name) || locationOptions[0];

  const handleSelectionChange = ({ detail }: { detail: { selectedOption: { value: string } } }) => {
    const location = PREDEFINED_LOCATIONS.find(loc => loc.name === detail.selectedOption.value);
    if (location) {
      onLocationChange(location);
    }
  };

  return (
    <SpaceBetween size="m">
      <Box variant="awsui-key-label">Select Location</Box>
      <Select
        selectedOption={selectedOption}
        onChange={handleSelectionChange}
        options={locationOptions}
        placeholder="Choose a location"
        expandToViewport
      />
      <Box variant="small" color="text-status-inactive">
        Current coordinates: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
      </Box>
    </SpaceBetween>
  );
}
