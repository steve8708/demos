// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useMemo } from 'react';

import Autosuggest from '@cloudscape-design/components/autosuggest';
import FormField from '@cloudscape-design/components/form-field';
import { OptionDefinition } from '@cloudscape-design/components/internal/components/option/interfaces';

import { Location, LocationSearchResult } from '../types';
import { searchLocations } from '../hooks/use-weather-data';

interface LocationSelectorProps {
  selectedLocation: Location;
  onLocationChange: (location: Location) => void;
}

export function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  const [value, setValue] = useState(selectedLocation.name);
  const [options, setOptions] = useState<OptionDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOptions = useMemo(
    () => async (filterText: string) => {
      setLoading(true);
      try {
        const results = await searchLocations(filterText);
        const mappedOptions: OptionDefinition[] = results.map((result: LocationSearchResult) => ({
          value: `${result.latitude},${result.longitude}`,
          label: result.name,
          description: [result.admin1, result.country].filter(Boolean).join(', '),
          tags: [result.country],
          data: result,
        }));
        setOptions(mappedOptions);
      } catch (error) {
        console.error('Error loading location options:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleSelect = ({ detail }: { detail: { value: string; selectedOption: OptionDefinition } }) => {
    const locationData = detail.selectedOption.data as LocationSearchResult;
    if (locationData) {
      const newLocation: Location = {
        name: locationData.name,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timezone: 'auto',
        country: locationData.country,
        admin1: locationData.admin1,
      };
      onLocationChange(newLocation);
      setValue(locationData.name);
    }
  };

  return (
    <FormField label="Location" description="Search for a city to view its weather">
      <Autosuggest
        onChange={({ detail }) => setValue(detail.value)}
        onSelect={handleSelect}
        onLoadItems={({ detail }) => loadOptions(detail.filteringText)}
        value={value}
        options={options}
        loadingText="Searching locations..."
        placeholder="Enter city name"
        statusType={loading ? 'loading' : 'finished'}
        ariaLabel="Location search"
        enteredTextLabel={value => `Use "${value}"`}
      />
    </FormField>
  );
}
