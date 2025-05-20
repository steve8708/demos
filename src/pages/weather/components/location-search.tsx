// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import Autosuggest from '@cloudscape-design/components/autosuggest';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Location, searchLocations } from './weather-utils';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  loading: boolean;
}

export default function LocationSearch({ onLocationSelect, loading }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [selectedOption, setSelectedOption] = useState<Location | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        const results = await searchLocations(searchQuery);
        setSuggestions(results);
        setIsSearching(false);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = () => {
    if (selectedOption) {
      onLocationSelect(selectedOption);
    }
  };

  return (
    <Container header={<Header variant="h2">Search Location</Header>}>
      <SpaceBetween size="m">
        <FormField label="Location" description="Enter a city, town, or other location">
          <Autosuggest
            value={searchQuery}
            onChange={({ detail }) => setSearchQuery(detail.value)}
            options={suggestions.map(location => ({
              value: location.name,
              label: `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}, ${location.country}`,
              data: location,
            }))}
            onSelect={({ detail }) => {
              setSearchQuery(detail.value);
              // Find the matching location from our suggestions and set it as selected
              const selectedLocation = suggestions.find(
                location =>
                  location.name === detail.value ||
                  `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}, ${location.country}` ===
                    detail.value,
              );
              setSelectedOption(selectedLocation || null);
            }}
            statusType={isSearching ? 'loading' : 'finished'}
            placeholder="Enter location (min. 2 characters)"
            empty="No locations found"
            loadingText="Loading locations..."
            errorText="Error loading locations"
            ariaLabel="Location search"
            enteredTextLabel={value => `Search for "${value}"`}
          />
        </FormField>
        <Button variant="primary" onClick={handleSearch} disabled={!selectedOption || loading} loading={loading}>
          Get Weather
        </Button>
      </SpaceBetween>
    </Container>
  );
}
