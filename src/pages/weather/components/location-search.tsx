// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useCallback } from 'react';

import Autosuggest from '@cloudscape-design/components/autosuggest';
import Box from '@cloudscape-design/components/box';
import FormField from '@cloudscape-design/components/form-field';

import { LocationData } from '../types';
import { searchLocations, getLocationDisplayName } from '../utils/weather-api';

interface LocationSearchProps {
  onLocationSelect: (location: LocationData) => void;
  value?: string;
  loading?: boolean;
}

export function LocationSearch({ onLocationSelect, value = '', loading = false }: LocationSearchProps) {
  const [searchValue, setSearchValue] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string>('');

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setSearchLoading(true);
    setSearchError('');

    try {
      const locations = await searchLocations(query);
      setSuggestions(locations);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Failed to search locations');
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSelect = (option: { selectedOption: { value?: string; detail?: LocationData } }) => {
    if (option.selectedOption.detail) {
      onLocationSelect(option.selectedOption.detail);
      setSearchValue(getLocationDisplayName(option.selectedOption.detail));
      setSuggestions([]);
    }
  };

  const suggestionOptions = suggestions.map(location => ({
    value: getLocationDisplayName(location),
    detail: location,
    description: location.country,
  }));

  return (
    <FormField
      label="Search Location"
      description="Search for a city or location to get weather information"
      errorText={searchError}
    >
      <Autosuggest
        onChange={({ detail }) => {
          setSearchValue(detail.value);
          handleSearch(detail.value);
        }}
        onSelect={({ detail }) => handleSelect(detail.selectedOption)}
        value={searchValue}
        options={suggestionOptions}
        placeholder="Enter city name (e.g., London, New York, Tokyo)"
        empty={
          searchValue.trim() && !searchLoading && suggestions.length === 0 && !searchError ? (
            <Box textAlign="center" color="text-body-secondary">
              No locations found
            </Box>
          ) : undefined
        }
        loadingText="Searching locations..."
        statusType={searchError ? 'error' : searchLoading ? 'loading' : 'finished'}
        disabled={loading}
        ariaLabel="Location search"
        enteredTextLabel={value => `Search for "${value}"`}
      />
    </FormField>
  );
}
