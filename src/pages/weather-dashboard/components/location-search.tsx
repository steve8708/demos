// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Cards from '@cloudscape-design/components/cards';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { WeatherLocation } from '../types';
import { useLocationSearch, DEFAULT_LOCATIONS } from '../hooks/use-weather-data';

interface LocationSearchProps {
  onLocationSelect: (location: WeatherLocation) => void;
  selectedLocation: WeatherLocation | null;
}

export function LocationSearch({ onLocationSelect, selectedLocation }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { locations, loading, error, searchLocations, clearLocations } = useLocationSearch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchLocations(searchQuery);
      } else {
        clearLocations();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchLocations, clearLocations]);

  const displayLocations = searchQuery ? locations : DEFAULT_LOCATIONS;

  return (
    <Container
      header={
        <Header variant="h2" description="Search for a city or select from popular locations">
          Location
        </Header>
      }
    >
      <SpaceBetween size="m">
        <Input
          value={searchQuery}
          onChange={({ detail }) => setSearchQuery(detail.value)}
          placeholder="Search for a city (e.g., San Francisco, Berlin, Mumbai)"
          clearAriaLabel="Clear search"
          type="search"
        />

        {error && <StatusIndicator type="error">{error}</StatusIndicator>}

        {loading && <StatusIndicator type="loading">Searching locations...</StatusIndicator>}

        {displayLocations.length > 0 && (
          <Cards
            ariaLabels={{
              itemSelectionLabel: (e, n) => `Select ${n.name}`,
              selectionGroupLabel: 'Location selection',
            }}
            cardDefinition={{
              header: item => (
                <Box variant="h3">
                  {item.name}
                  {selectedLocation?.id === item.id && (
                    <Box display="inline" margin={{ left: 'xs' }}>
                      <StatusIndicator type="success">Selected</StatusIndicator>
                    </Box>
                  )}
                </Box>
              ),
              sections: [
                {
                  id: 'details',
                  content: item => (
                    <SpaceBetween size="xs">
                      <Box variant="small">
                        {item.admin1 && `${item.admin1}, `}
                        {item.country}
                      </Box>
                      <Box variant="small" color="text-body-secondary">
                        {item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}°
                      </Box>
                    </SpaceBetween>
                  ),
                },
                {
                  id: 'actions',
                  content: item => (
                    <Button
                      variant={selectedLocation?.id === item.id ? 'normal' : 'primary'}
                      onClick={() => onLocationSelect(item)}
                      disabled={selectedLocation?.id === item.id}
                    >
                      {selectedLocation?.id === item.id ? 'Selected' : 'Select location'}
                    </Button>
                  ),
                },
              ],
            }}
            cardsPerRow={[
              { cards: 1, minWidth: 0 },
              { cards: 2, minWidth: 600 },
              { cards: 3, minWidth: 900 },
            ]}
            items={displayLocations}
            loadingText="Loading locations"
            trackBy="id"
            visibleSections={['details', 'actions']}
            empty={
              <Box textAlign="center" color="inherit">
                <Box variant="strong" textAlign="center" color="inherit">
                  {searchQuery ? 'No locations found' : 'No popular locations available'}
                </Box>
                <Box variant="p" padding={{ bottom: 's' }} color="inherit">
                  {searchQuery
                    ? 'Try a different search term or check your spelling'
                    : 'Try searching for a specific city name'}
                </Box>
              </Box>
            }
            header={
              <Header
                counter={`(${displayLocations.length})`}
                description={searchQuery ? 'Search results' : 'Popular locations'}
              >
                {searchQuery ? 'Found locations' : 'Quick select'}
              </Header>
            }
          />
        )}
      </SpaceBetween>
    </Container>
  );
}
