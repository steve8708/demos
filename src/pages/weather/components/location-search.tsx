// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useCallback, useEffect, useState } from 'react';

import Autosuggest from '@cloudscape-design/components/autosuggest';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { LocationData, WeatherService } from '../weather-service';

interface LocationSearchProps {
  onLocationSelect: (location: LocationData) => void;
  loading?: boolean;
}

export function LocationSearch({ onLocationSelect, loading }: LocationSearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const loadSuggestions = useCallback(async (value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const locations = await WeatherService.searchLocations(value);
      setSuggestions(locations);
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadSuggestions(searchValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, loadSuggestions]);

  const handleLocationSelect = (location: LocationData) => {
    setSearchValue(`${location.name}, ${location.country}`);
    setSuggestions([]);
    onLocationSelect(location);
  };

  const handleCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const location: LocationData = {
            name: 'Current Location',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            country: '',
          };
          setSearchValue('Current Location');
          onLocationSelect(location);
        },
        error => {
          console.error('Error getting current location:', error);
        },
      );
    }
  };

  return (
    <Container
      header={
        <Header variant="h2" description="Search for a location to view its weather forecast">
          Location Search
        </Header>
      }
    >
      <Form>
        <SpaceBetween direction="vertical" size="m">
          <FormField label="Search for a city or location">
            <Autosuggest
              onChange={({ detail }) => setSearchValue(detail.value)}
              value={searchValue}
              options={suggestions.map(location => ({
                value: `${location.name}, ${location.country}`,
                label: location.admin1
                  ? `${location.name}, ${location.admin1}, ${location.country}`
                  : `${location.name}, ${location.country}`,
                description: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
              }))}
              onSelect={({ detail }) => {
                const selectedLocation = suggestions.find(
                  location => `${location.name}, ${location.country}` === detail.value,
                );
                if (selectedLocation) {
                  handleLocationSelect(selectedLocation);
                }
              }}
              placeholder="Enter city name..."
              statusType={suggestionsLoading ? 'loading' : 'finished'}
              loadingText="Searching locations..."
              empty="No locations found"
              ariaLabel="Search for locations"
            />
          </FormField>

          <Box textAlign="center">
            <Button onClick={handleCurrentLocation} iconName="location" disabled={loading}>
              Use Current Location
            </Button>
          </Box>
        </SpaceBetween>
      </Form>
    </Container>
  );
}
