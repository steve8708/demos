// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useCallback } from 'react';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Alert from '@cloudscape-design/components/alert';

import { GeocodingResult } from '../types';
import { searchLocations } from '../services/weather-api';
import { getCurrentLocation } from '../utils';
import { debounce } from '../utils';

interface LocationSearchProps {
  onLocationSelect: (latitude: number, longitude: number, name: string) => void;
  loading?: boolean;
}

export function LocationSearch({ onLocationSelect, loading = false }: LocationSearchProps) {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<{ value: string; data: GeocodingResult }[]>([]);
  const [status, setStatus] = useState<'loading' | 'finished' | 'error'>('finished');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const debouncedSearch = useCallback(
    debounce(async (searchText: string) => {
      if (!searchText.trim()) {
        setOptions([]);
        setStatus('finished');
        return;
      }

      try {
        setStatus('loading');
        setErrorMessage('');
        const results = await searchLocations(searchText);

        setOptions(
          results.map(result => ({
            value: `${result.name}, ${result.country}${result.admin1 ? `, ${result.admin1}` : ''}`,
            data: result,
          })),
        );
        setStatus('finished');
      } catch (error) {
        console.error('Error searching locations:', error);
        setErrorMessage('Failed to search locations. Please try again.');
        setStatus('error');
        setOptions([]);
      }
    }, 300),
    [],
  );

  const handleChange = ({ detail }: { detail: { value: string } }) => {
    setValue(detail.value);
    debouncedSearch(detail.value);
  };

  const handleSelect = ({ detail }: { detail: { value: string } }) => {
    const option = options.find(opt => opt.value === detail.value);
    if (option) {
      setValue(detail.value);
      onLocationSelect(option.data.latitude, option.data.longitude, option.data.name);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setErrorMessage('');
      const position = await getCurrentLocation();
      setValue('Current Location');
      onLocationSelect(position.latitude, position.longitude, 'Current Location');
    } catch (error) {
      console.error('Error getting current location:', error);
      setErrorMessage('Unable to access your location. Please ensure location access is enabled.');
    }
  };

  return (
    <SpaceBetween size="s">
      <SpaceBetween direction="horizontal" size="s">
        <Autosuggest
          onChange={handleChange}
          onSelect={handleSelect}
          value={value}
          options={options}
          placeholder="Search for a city or location..."
          ariaLabel="Location search"
          statusType={status}
          loadingText="Searching locations..."
          errorText="Error loading locations"
          recoveryText="Retry"
          finishedText={
            options.length > 0 ? `${options.length} locations found` : value.trim() ? 'No locations found' : ''
          }
          empty="Start typing to search for locations"
          disabled={loading}
        />
        <Button
          onClick={handleUseCurrentLocation}
          iconName="location"
          variant="normal"
          disabled={loading}
          ariaLabel="Use current location"
        >
          Current Location
        </Button>
      </SpaceBetween>

      {errorMessage && (
        <Alert type="error" statusIconAriaLabel="Error">
          {errorMessage}
        </Alert>
      )}
    </SpaceBetween>
  );
}
