// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect, useRef } from 'react';

import Autosuggest from '@cloudscape-design/components/autosuggest';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WeatherLocation } from '../types';
import { searchLocation } from '../api';

interface LocationSelectorProps {
  onLocationSelect: (location: WeatherLocation) => void;
  isLoading: boolean;
}

export function LocationSelector({ onLocationSelect, isLoading }: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<WeatherLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [latitudeValue, setLatitudeValue] = useState('40.7128');
  const [longitudeValue, setLongitudeValue] = useState('-74.0060');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial location (New York City)
    const initialLocation: WeatherLocation = {
      latitude: 40.7128,
      longitude: -74.006,
      name: 'New York City, New York, United States',
    };
    onLocationSelect(initialLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setLocations([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchLocation(searchQuery);
        setLocations(results);
        setError('');
      } catch (err) {
        setError('Failed to search for locations. Please try again.');
        setLocations([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleLatitudeChange = (value: string) => {
    setLatitudeValue(value);
  };

  const handleLongitudeChange = (value: string) => {
    setLongitudeValue(value);
  };

  const handleCoordinatesSubmit = () => {
    const latitude = parseFloat(latitudeValue);
    const longitude = parseFloat(longitudeValue);

    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Please enter valid latitude and longitude values.');
      return;
    }

    if (latitude < -90 || latitude > 90) {
      setError('Latitude must be between -90 and 90 degrees.');
      return;
    }

    if (longitude < -180 || longitude > 180) {
      setError('Longitude must be between -180 and 180 degrees.');
      return;
    }

    setError('');
    onLocationSelect({ latitude, longitude });
  };

  return (
    <SpaceBetween size="m">
      <FormField label="Search location" description="Enter a city name or address" errorText={error || undefined}>
        <Autosuggest
          value={searchQuery}
          onChange={({ detail }) => setSearchQuery(detail.value)}
          options={locations.map(location => ({
            value: location.name || '',
            data: location,
          }))}
          onSelect={({ detail }) => {
            if (detail.selectedOption && detail.selectedOption.data) {
              onLocationSelect(detail.selectedOption.data);
              setSearchQuery(detail.selectedOption.value);
            }
          }}
          filteringType="manual"
          statusType={isSearching ? 'loading' : 'finished'}
          placeholder="Search for a location (e.g., New York, London)"
          empty="No locations found"
          loadingText="Searching locations..."
          ariaLabel="Search for a location"
          disabled={isLoading}
        />
      </FormField>

      <SpaceBetween size="m" direction="horizontal">
        <FormField label="Latitude" description="Between -90 and 90" constraintText="-90 to 90">
          <Input
            value={latitudeValue}
            onChange={({ detail }) => handleLatitudeChange(detail.value)}
            type="number"
            step="0.0001"
            min="-90"
            max="90"
            placeholder="40.7128"
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Longitude" description="Between -180 and 180" constraintText="-180 to 180">
          <Input
            value={longitudeValue}
            onChange={({ detail }) => handleLongitudeChange(detail.value)}
            type="number"
            step="0.0001"
            min="-180"
            max="180"
            placeholder="-74.0060"
            disabled={isLoading}
          />
        </FormField>

        <div style={{ alignSelf: 'flex-end' }}>
          <Button onClick={handleCoordinatesSubmit} disabled={isLoading}>
            Get Weather
          </Button>
        </div>
      </SpaceBetween>
    </SpaceBetween>
  );
}
