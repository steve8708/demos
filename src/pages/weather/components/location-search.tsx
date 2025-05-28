// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useCallback } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { LocationData, searchLocations, getCurrentLocation } from '../weather-api';

interface LocationSearchProps {
  currentLocation: LocationData;
  onLocationChange: (location: LocationData) => void;
  isLoading: boolean;
}

export function LocationSearch({ currentLocation, onLocationChange, isLoading }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setSearchError('No locations found for your search.');
      }
    } catch (error) {
      setSearchError('Failed to search locations. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleCurrentLocation = useCallback(async () => {
    try {
      const location = await getCurrentLocation();
      onLocationChange(location);
    } catch (error) {
      setSearchError('Failed to get current location. Please search manually.');
    }
  }, [onLocationChange]);

  const handleLocationSelect = useCallback(
    (location: LocationData) => {
      onLocationChange(location);
      setSearchResults([]);
      setSearchQuery('');
    },
    [onLocationChange],
  );

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Search for a city or use your current location"
          actions={
            <Button variant="normal" iconName="status-info" onClick={handleCurrentLocation} disabled={isLoading}>
              Use Current Location
            </Button>
          }
        >
          Location Settings
        </Header>
      }
    >
      <SpaceBetween size="m">
        <Box variant="p">
          <StatusIndicator type="info">
            <Icon name="status-info" /> Currently showing weather for{' '}
            <strong>
              {currentLocation.name}
              {currentLocation.country ? `, ${currentLocation.country}` : ''}
            </strong>
          </StatusIndicator>
        </Box>

        <SpaceBetween direction="horizontal" size="xs">
          <Input
            value={searchQuery}
            onChange={({ detail }) => setSearchQuery(detail.value)}
            placeholder="Search for a city..."
            onKeyDown={event => {
              if (event.detail.key === 'Enter') {
                handleSearch();
              }
            }}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            onClick={handleSearch}
            loading={isSearching}
            disabled={isLoading || !searchQuery.trim()}
          >
            Search
          </Button>
        </SpaceBetween>

        {searchError && (
          <Box color="text-status-error">
            <Icon name="status-negative" /> {searchError}
          </Box>
        )}

        {searchResults.length > 0 && (
          <div className="location-search-results">
            <Box variant="h4" margin={{ bottom: 'xs' }}>
              Search Results
            </Box>
            <SpaceBetween size="xs">
              {searchResults.map((location, index) => (
                <Button
                  key={`${location.name}-${location.latitude}-${index}`}
                  variant="link"
                  onClick={() => handleLocationSelect(location)}
                  disabled={isLoading}
                >
                  <Icon name="status-info" /> {location.name}
                  {location.country ? `, ${location.country}` : ''}
                </Button>
              ))}
            </SpaceBetween>
          </div>
        )}
      </SpaceBetween>
    </Container>
  );
}
