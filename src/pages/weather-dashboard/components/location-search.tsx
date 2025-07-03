// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Select from '@cloudscape-design/components/select';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import { LocationData, WeatherService } from '../weather-api';

interface LocationSearchProps {
  onLocationSelect: (location: LocationData) => void;
  currentLocation?: LocationData;
  loading?: boolean;
}

export function LocationSearch({ onLocationSelect, currentLocation, loading }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ label: string; value: string } | null>(null);
  const [searching, setSearching] = useState(false);

  const defaultLocations = WeatherService.getDefaultLocations();

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await WeatherService.searchLocations(query);
      setSearchResults(results.slice(0, 10));
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = () => {
    searchLocations(searchQuery);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLocationSelect = () => {
    if (!selectedLocation) return;

    const location = searchResults.find(result => `${result.name}, ${result.country}` === selectedLocation.value);

    if (location) {
      onLocationSelect(location);
    }
  };

  const handleDefaultLocationSelect = (location: LocationData) => {
    onLocationSelect(location);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchLocations(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchOptions = searchResults.map(result => ({
    label: `${result.name}, ${result.country}${result.admin1 ? `, ${result.admin1}` : ''}`,
    value: `${result.name}, ${result.country}`,
  }));

  return (
    <Container
      header={
        <Header variant="h2" description="Search for a city or select from popular locations">
          Weather Location
        </Header>
      }
    >
      <SpaceBetween size="l">
        {currentLocation && (
          <Box>
            <Box variant="awsui-key-label">Current Location</Box>
            <Box variant="strong">
              {currentLocation.name}, {currentLocation.country}
            </Box>
          </Box>
        )}

        <ColumnLayout columns={2}>
          <SpaceBetween size="s">
            <Box variant="h3">Search Locations</Box>
            <Input
              value={searchQuery}
              onChange={({ detail }) => setSearchQuery(detail.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter city name..."
              disabled={loading}
            />

            {searchOptions.length > 0 && (
              <Select
                selectedOption={selectedLocation}
                onChange={({ detail }) => setSelectedLocation(detail.selectedOption)}
                options={searchOptions}
                placeholder="Select from search results"
                loadingText={searching ? 'Searching...' : undefined}
                disabled={loading}
              />
            )}

            <Button
              onClick={handleLocationSelect}
              disabled={!selectedLocation || loading}
              loading={loading}
              variant="primary"
            >
              Get Weather
            </Button>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h3">Popular Locations</Box>
            <SpaceBetween size="xs">
              {defaultLocations.map(location => (
                <Button
                  key={`${location.name}-${location.country}`}
                  onClick={() => handleDefaultLocationSelect(location)}
                  disabled={loading}
                  variant="normal"
                  size="small"
                >
                  {location.name}
                </Button>
              ))}
            </SpaceBetween>
          </SpaceBetween>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}
