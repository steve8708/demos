// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect, useRef } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Container from '@cloudscape-design/components/container';

import { Location, Coordinates } from '../types';
import { WeatherService } from '../weather-service';

interface LocationSearchProps {
  onLocationSelect: (coordinates: Coordinates, locationName: string) => void;
  currentLocationName?: string;
  loading?: boolean;
}

export function LocationSearch({ onLocationSelect, currentLocationName, loading }: LocationSearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [geoLocationLoading, setGeoLocationLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchValue.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
        setSearchError(null);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!searchValue || searchValue.length < 2) return;

    setSearchLoading(true);
    setSearchError(null);

    try {
      const locations = await WeatherService.searchLocations(searchValue);
      setSearchResults(locations);
      setShowResults(true);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Search failed');
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location.coordinates, `${location.name}, ${location.country}`);
    setSearchValue('');
    setShowResults(false);
    setSearchResults([]);
    setSearchError(null);
  };

  const handleCurrentLocation = async () => {
    setGeoLocationLoading(true);
    setSearchError(null);
    try {
      const coordinates = await WeatherService.getCurrentLocation();
      onLocationSelect(coordinates, 'Current Location');
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Failed to get current location');
    } finally {
      setGeoLocationLoading(false);
    }
  };

  const handleInputFocus = () => {
    if (searchValue.length >= 2 && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const renderSearchResults = () => {
    if (!showResults) return null;

    return (
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid var(--color-border-control-default)',
          borderRadius: '4px',
          backgroundColor: 'var(--color-background-container-content)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Container>
          {searchLoading ? (
            <Box padding="s">
              <StatusIndicator type="loading">Searching locations...</StatusIndicator>
            </Box>
          ) : searchError ? (
            <Box padding="s">
              <StatusIndicator type="error">{searchError}</StatusIndicator>
            </Box>
          ) : searchResults.length === 0 ? (
            <Box padding="s">
              <Box variant="span" color="text-body-secondary">
                No locations found
              </Box>
            </Box>
          ) : (
            <Box>
              {searchResults.map((location, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'background-color 0.15s ease',
                  }}
                  onClick={() => handleLocationSelect(location)}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    (e.target as HTMLElement).style.backgroundColor = 'var(--color-background-control-default)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                  data-testid={`location-${index}`}
                >
                  <Box variant="span" fontWeight="bold">
                    {location.name}
                  </Box>
                  <Box variant="span" color="text-body-secondary" margin={{ left: 'xs' }}>
                    {location.country}
                  </Box>
                </div>
              ))}
            </Box>
          )}
        </Container>
      </div>
    );
  };

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="s">
        <div style={{ flex: 1, position: 'relative' }} ref={inputRef}>
          <FormField label="Search for a city">
            <Input
              value={searchValue}
              onChange={({ detail }) => setSearchValue(detail.value)}
              onFocus={handleInputFocus}
              placeholder="Enter city name..."
              ariaLabel="Search for a city"
              disabled={loading}
            />
            {renderSearchResults()}
          </FormField>
        </div>
        <div style={{ alignSelf: 'end' }}>
          <Button
            variant="normal"
            iconName="status-positive"
            onClick={handleCurrentLocation}
            loading={geoLocationLoading}
            disabled={loading}
          >
            Use current location
          </Button>
        </div>
      </SpaceBetween>

      {currentLocationName && (
        <Box>
          <Box variant="span" color="text-body-secondary">
            Current location: {currentLocationName}
          </Box>
        </Box>
      )}

      {searchError && !showResults && (
        <Box>
          <StatusIndicator type="error">{searchError}</StatusIndicator>
        </Box>
      )}
    </SpaceBetween>
  );
}
