// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useCallback } from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WeatherLocation } from '../types';

interface LocationSelectorProps {
  currentLocation: WeatherLocation;
  onLocationChange: (location: WeatherLocation) => void;
  isLoading?: boolean;
}

const POPULAR_LOCATIONS: WeatherLocation[] = [
  { id: 'new-york', name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'US', admin1: 'New York' },
  { id: 'london', name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'GB', admin1: 'England' },
  { id: 'tokyo', name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'JP', admin1: 'Tokyo' },
  { id: 'paris', name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'FR', admin1: 'Île-de-France' },
  { id: 'sydney', name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'AU', admin1: 'New South Wales' },
  { id: 'berlin', name: 'Berlin', latitude: 52.52, longitude: 13.405, country: 'DE', admin1: 'Berlin' },
  {
    id: 'vancouver',
    name: 'Vancouver',
    latitude: 49.2827,
    longitude: -123.1207,
    country: 'CA',
    admin1: 'British Columbia',
  },
  { id: 'singapore', name: 'Singapore', latitude: 1.3521, longitude: 103.8198, country: 'SG', admin1: 'Singapore' },
  { id: 'dubai', name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'AE', admin1: 'Dubai' },
  { id: 'sao-paulo', name: 'São Paulo', latitude: -23.5558, longitude: -46.6396, country: 'BR', admin1: 'São Paulo' },
];

export function LocationSelector({ currentLocation, onLocationChange, isLoading }: LocationSelectorProps) {
  const [customLatitude, setCustomLatitude] = useState('');
  const [customLongitude, setCustomLongitude] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(currentLocation.id);

  const handlePopularLocationChange = useCallback(
    (detail: { selectedOption: { value?: string } }) => {
      const locationId = detail.selectedOption.value;
      if (locationId) {
        const location = POPULAR_LOCATIONS.find(loc => loc.id === locationId);
        if (location) {
          setSelectedLocationId(locationId);
          onLocationChange(location);
        }
      }
    },
    [onLocationChange],
  );

  const handleCustomLocationSubmit = useCallback(() => {
    const lat = parseFloat(customLatitude);
    const lng = parseFloat(customLongitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return;
    }

    const customLocation: WeatherLocation = {
      id: `custom-${lat}-${lng}`,
      name: `Custom Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
      latitude: lat,
      longitude: lng,
    };

    setSelectedLocationId(customLocation.id);
    onLocationChange(customLocation);
  }, [customLatitude, customLongitude, onLocationChange]);

  const handleGetCurrentLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const currentLocationData: WeatherLocation = {
            id: `current-${latitude}-${longitude}`,
            name: `Current Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
            latitude,
            longitude,
          };
          setSelectedLocationId(currentLocationData.id);
          onLocationChange(currentLocationData);
        },
        error => {
          console.error('Error getting current location:', error);
        },
      );
    }
  }, [onLocationChange]);

  const isValidCoordinates = () => {
    const lat = parseFloat(customLatitude);
    const lng = parseFloat(customLongitude);
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  return (
    <SpaceBetween size="m">
      <Box variant="h3">Select Location</Box>

      <FormField label="Popular locations">
        <Select
          selectedOption={{
            label: currentLocation.name,
            value: selectedLocationId,
          }}
          onChange={({ detail }) => handlePopularLocationChange(detail)}
          options={POPULAR_LOCATIONS.map(location => ({
            label: `${location.name}, ${location.country}`,
            value: location.id,
          }))}
          disabled={isLoading}
          placeholder="Choose a popular location"
        />
      </FormField>

      <SpaceBetween size="s">
        <Box variant="h4">Custom coordinates</Box>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
          <FormField label="Latitude (-90 to 90)">
            <Input
              value={customLatitude}
              onChange={({ detail }) => setCustomLatitude(detail.value)}
              placeholder="e.g., 40.7128"
              disabled={isLoading}
              type="number"
            />
          </FormField>

          <FormField label="Longitude (-180 to 180)">
            <Input
              value={customLongitude}
              onChange={({ detail }) => setCustomLongitude(detail.value)}
              placeholder="e.g., -74.0060"
              disabled={isLoading}
              type="number"
            />
          </FormField>

          <Button onClick={handleCustomLocationSubmit} disabled={!isValidCoordinates() || isLoading} variant="primary">
            Use coordinates
          </Button>
        </div>
      </SpaceBetween>

      <Button onClick={handleGetCurrentLocation} disabled={isLoading} iconName="location">
        Use current location
      </Button>
    </SpaceBetween>
  );
}
