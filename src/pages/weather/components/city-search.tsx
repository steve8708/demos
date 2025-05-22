// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import FormField from '@cloudscape-design/components/form-field';
import Spinner from '@cloudscape-design/components/spinner';

import { Coordinates } from '../widgets/interfaces';

interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/province
  admin2?: string; // County/district
}

interface CitySearchProps {
  onCitySelect: (coordinates: Coordinates) => void;
  defaultValue?: string;
}

export function CitySearch({ onCitySelect, defaultValue = '' }: CitySearchProps) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce function to avoid making too many API calls while typing
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Function to fetch geocoding results
  const fetchGeocodeResults = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
      url.searchParams.append('name', searchTerm);
      url.searchParams.append('count', '10');
      url.searchParams.append('language', 'en');
      url.searchParams.append('format', 'json');

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Geocoding API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results) {
        setSuggestions(data.results);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Error fetching geocode results:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a debounced version of the fetch function
  const debouncedFetchGeocodeResults = React.useCallback(debounce(fetchGeocodeResults, 300), []);

  // Update suggestions when value changes
  useEffect(() => {
    debouncedFetchGeocodeResults(value);
  }, [value, debouncedFetchGeocodeResults]);

  // Format suggestion items for display
  const getSuggestionOption = (item: GeocodeResult) => {
    const location = [item.name];

    // Add admin1 (state/province) if available
    if (item.admin1 && item.admin1 !== item.name) {
      location.push(item.admin1);
    }

    // Add country
    location.push(item.country);

    return {
      value: item.id.toString(),
      label: location.join(', '),
      description: `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`,
      data: item,
    };
  };

  return (
    <FormField
      label="Search for a city"
      description="Type a city name to get weather information"
      constraintText="At least 2 characters required for search"
    >
      <Autosuggest
        value={value}
        onChange={({ detail }) => setValue(detail.value)}
        onSelect={({ detail }) => {
          setValue(detail.value);
          const selectedItem = suggestions.find(item => item.id.toString() === detail.value);
          if (selectedItem) {
            // Format location name
            const locationParts = [selectedItem.name];
            if (selectedItem.admin1 && selectedItem.admin1 !== selectedItem.name) {
              locationParts.push(selectedItem.admin1);
            }
            locationParts.push(selectedItem.country);

            onCitySelect({
              latitude: selectedItem.latitude,
              longitude: selectedItem.longitude,
              name: locationParts.join(', '),
            });
          }
        }}
        options={suggestions.map(getSuggestionOption)}
        loadingText="Searching for cities..."
        statusType={loading ? 'loading' : error ? 'error' : 'finished'}
        placeholder="Enter a city name (e.g., Seattle, New York, London)"
        empty={
          value.trim().length < 2 ? 'Type at least 2 characters to search' : 'No cities found matching your search'
        }
        errorText={error}
        ariaLabel="Search for a city"
        enteredTextLabel={value => `Use "${value}"`}
      />
      {loading && <Spinner size="normal" />}
      {error && (
        <Alert type="error" header="Error searching for cities">
          {error}. Please try again or enter coordinates manually.
        </Alert>
      )}
    </FormField>
  );
}
