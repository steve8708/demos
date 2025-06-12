// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useCallback } from 'react';

import Autosuggest from '@cloudscape-design/components/autosuggest';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import FormField from '@cloudscape-design/components/form-field';

import { WeatherAPI } from '../services/weather-api';
import { WeatherLocation } from '../widgets/interfaces';

interface LocationSearchProps {
  onLocationSelect: (location: WeatherLocation) => void;
  loading?: boolean;
}

export function LocationSearch({ onLocationSelect, loading = false }: LocationSearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const [searchOptions, setSearchOptions] = useState<{ value: string; location: WeatherLocation }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchOptions([]);
      return;
    }

    setSearchLoading(true);
    try {
      const locations = await WeatherAPI.searchLocations(query);
      const options = locations.map(location => ({
        value: location.name,
        location,
      }));
      setSearchOptions(options);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchOptions([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSelect = (option: { value: string; location: WeatherLocation }) => {
    setSelectedLocation(option.location);
    setSearchValue(option.value);
    setSearchOptions([]);
  };

  const handleViewWeather = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      setSearchValue('');
      setSelectedLocation(null);
    }
  };

  return (
    <SpaceBetween size="s" direction="horizontal">
      <FormField stretch>
        <Autosuggest
          onChange={({ detail }) => {
            setSearchValue(detail.value);
            handleSearch(detail.value);
          }}
          onSelect={({ detail }) => {
            const option = searchOptions.find(opt => opt.value === detail.value);
            if (option) {
              handleSelect(option);
            }
          }}
          value={searchValue}
          options={searchOptions.map(opt => ({ value: opt.value }))}
          loadingText="Searching locations..."
          statusType={searchLoading ? 'loading' : 'finished'}
          placeholder="Search for a city (e.g., San Francisco, London, Tokyo)"
          ariaLabel="Location search"
          enteredTextLabel={value => `Search for "${value}"`}
          empty="No locations found"
          finishedText={
            searchOptions.length > 0
              ? `${searchOptions.length} location${searchOptions.length === 1 ? '' : 's'} found`
              : undefined
          }
        />
      </FormField>
      <Button variant="primary" onClick={handleViewWeather} disabled={!selectedLocation || loading} loading={loading}>
        View Weather
      </Button>
    </SpaceBetween>
  );
}
