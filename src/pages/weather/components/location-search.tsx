// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useMemo } from 'react';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Alert from '@cloudscape-design/components/alert';
import { WeatherLocation, GeocodeResult } from '../types';
import { WeatherApiService } from '../services/weather-api';

interface LocationSearchProps {
  onLocationSelect: (location: WeatherLocation) => void;
  isLoading?: boolean;
}

export function LocationSearch({ onLocationSelect, isLoading }: LocationSearchProps) {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<Array<{ value: string; label: string; location: WeatherLocation }>>([]);
  const [status, setStatus] = useState<'finished' | 'loading' | 'error'>('finished');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoadItems = async (query: string) => {
    setStatus('loading');
    setErrorMessage(null);

    try {
      const results = await WeatherApiService.searchLocations(query);
      const suggestions = results.map((result: GeocodeResult) => ({
        value: result.name,
        label: `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}, ${result.country}`,
        location: {
          latitude: result.latitude,
          longitude: result.longitude,
          city: result.name,
          country: result.country,
        },
      }));
      setOptions(suggestions);
      setStatus('finished');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to search locations');
    }
  };

  const handleSelect = (selectedOption: { location: WeatherLocation }) => {
    onLocationSelect(selectedOption.location);
    setValue(selectedOption.label || selectedOption.value);
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await WeatherApiService.getCurrentPosition();
      const locationName = await WeatherApiService.getReverseGeocode(location.latitude, location.longitude);
      setValue(locationName);
      onLocationSelect({
        ...location,
        city: locationName.split(',')[0],
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to get current location');
    }
  };

  const errorAlert = useMemo(() => {
    if (!errorMessage) return null;
    return (
      <Alert type="error" dismissible onDismiss={() => setErrorMessage(null)}>
        {errorMessage}
      </Alert>
    );
  }, [errorMessage]);

  return (
    <SpaceBetween size="s">
      {errorAlert}
      <SpaceBetween direction="horizontal" size="s">
        <Autosuggest
          onChange={({ detail }) => setValue(detail.value)}
          onLoadItems={({ detail }) => handleLoadItems(detail.filteringText)}
          onSelect={({ detail }) => handleSelect(detail.selectedOption as any)}
          value={value}
          options={options}
          statusType={status}
          placeholder="Search for a city or location"
          ariaLabel="Location search"
          enteredTextLabel={value => `Use: "${value}"`}
          empty="No locations found"
          loadingText="Searching locations..."
          errorText="Error loading locations"
          recoveryText="Retry"
          disabled={isLoading}
        />
        <Button
          onClick={handleUseCurrentLocation}
          iconName="location"
          disabled={isLoading}
          ariaLabel="Use current location"
        >
          Use current location
        </Button>
      </SpaceBetween>
    </SpaceBetween>
  );
}
