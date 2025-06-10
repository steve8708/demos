// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Popover from '@cloudscape-design/components/popover';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

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

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchValue.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchValue]);

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
  };

  const handleCurrentLocation = async () => {
    setGeoLocationLoading(true);
    try {
      const coordinates = await WeatherService.getCurrentLocation();
      onLocationSelect(coordinates, 'Current Location');
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Failed to get current location');
    } finally {
      setGeoLocationLoading(false);
    }
  };

  const renderSearchResults = () => {
    if (searchLoading) {
      return (
        <Box padding="s">
          <StatusIndicator type="loading">Searching locations...</StatusIndicator>
        </Box>
      );
    }

    if (searchError) {
      return (
        <Box padding="s">
          <StatusIndicator type="error">{searchError}</StatusIndicator>
        </Box>
      );
    }

    if (searchResults.length === 0) {
      return (
        <Box padding="s">
          <Box variant="span" color="text-body-secondary">
            No locations found
          </Box>
        </Box>
      );
    }

    return (
      <Box>
        {searchResults.map((location, index) => (
          <Box
            key={index}
            padding="s"
            onClick={() => handleLocationSelect(location)}
            className="clickable-location-item"
            data-testid={`location-${index}`}
          >
            <Box variant="span" fontWeight="bold">
              {location.name}
            </Box>
            <Box variant="span" color="text-body-secondary" margin={{ left: 'xs' }}>
              {location.country}
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="s">
        <Box flex="1">
          <FormField label="Search for a city">
            <Popover
              dismissButton={false}
              position="bottom-left"
              size="large"
              triggerType="custom"
              content={renderSearchResults()}
              renderWithPortal={true}
            >
              <Input
                value={searchValue}
                onChange={({ detail }) => setSearchValue(detail.value)}
                placeholder="Enter city name..."
                ariaLabel="Search for a city"
                disabled={loading}
              />
            </Popover>
          </FormField>
        </Box>
        <Box alignSelf="end">
          <Button
            variant="normal"
            iconName="status-positive"
            onClick={handleCurrentLocation}
            loading={geoLocationLoading}
            disabled={loading}
          >
            Use current location
          </Button>
        </Box>
      </SpaceBetween>

      {currentLocationName && (
        <Box>
          <Box variant="span" color="text-body-secondary">
            Current location: {currentLocationName}
          </Box>
        </Box>
      )}

      <style jsx>{`
        .clickable-location-item {
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.15s ease;
        }

        .clickable-location-item:hover {
          background-color: var(--color-background-control-default);
        }
      `}</style>
    </SpaceBetween>
  );
}
