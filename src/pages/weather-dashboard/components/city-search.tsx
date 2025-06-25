// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useCallback } from 'react';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import Box from '@cloudscape-design/components/box';
import { DropdownStatusProps } from '@cloudscape-design/components/internal/components/dropdown-status';

import { searchCities } from '../api';
import { GeocodingResult, SelectedLocation } from '../types';

interface CitySearchProps {
  onLocationSelect: (location: SelectedLocation) => void;
  loading?: boolean;
}

export function CitySearch({ onLocationSelect, loading }: CitySearchProps) {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<Array<{ value: string; label: string; data: GeocodingResult }>>([]);
  const [status, setStatus] = useState<DropdownStatusProps.StatusType>('finished');

  const handleLoadItems = useCallback(async ({ detail }: { detail: { filteringText: string } }) => {
    const query = detail.filteringText.trim();

    if (query.length < 2) {
      setOptions([]);
      setStatus('finished');
      return;
    }

    setStatus('loading');

    try {
      const response = await searchCities(query);
      const results = response.results || [];

      const formattedOptions = results.map(result => ({
        value: `${result.name}, ${result.country}`,
        label: `${result.name}, ${result.admin1 ? `${result.admin1}, ` : ''}${result.country}`,
        data: result,
      }));

      setOptions(formattedOptions);
      setStatus('finished');
    } catch (error) {
      console.error('Error searching cities:', error);
      setOptions([]);
      setStatus('error');
    }
  }, []);

  const handleSelect = ({ detail }: { detail: { value: string } }) => {
    const selectedOption = options.find(option => option.value === detail.value);
    if (selectedOption) {
      const location: SelectedLocation = {
        name: selectedOption.data.name,
        latitude: selectedOption.data.latitude,
        longitude: selectedOption.data.longitude,
        country: selectedOption.data.country,
        admin1: selectedOption.data.admin1,
        timezone: selectedOption.data.timezone,
      };
      onLocationSelect(location);
      setValue(detail.value);
    }
  };

  return (
    <Box>
      <Autosuggest
        value={value}
        onChange={({ detail }) => setValue(detail.value)}
        onSelect={handleSelect}
        onLoadItems={handleLoadItems}
        options={options}
        statusType={status}
        placeholder="Search for a city..."
        loadingText="Searching cities..."
        finishedText={options.length === 0 && value.length >= 2 ? 'No cities found' : undefined}
        errorText="Error searching cities"
        empty="Start typing to search for cities"
        enteredTextLabel={value => `Use "${value}"`}
        ariaLabel="City search"
        disabled={loading}
      />
    </Box>
  );
}
