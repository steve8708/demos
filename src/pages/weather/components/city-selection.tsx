// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';
import FormField from '@cloudscape-design/components/form-field';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Alert from '@cloudscape-design/components/alert';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { searchCities } from '../utils/api';
import { City } from '../utils/types';

interface CitySelectionProps {
  onCitySelected: (city: City) => void;
}

export function CitySelection({ onCitySelected }: CitySelectionProps) {
  const [value, setValue] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [status, setStatus] = useState<'pending' | 'loading' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = async (event: { detail: { value: string } }) => {
    const newValue = event.detail.value;
    setValue(newValue);

    if (newValue.length < 3) {
      setCities([]);
      setStatus('pending');
      return;
    }

    setStatus('loading');
    try {
      const results = await searchCities(newValue);
      setCities(results);
      setStatus('success');
      setErrorMessage('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load city data');
      setCities([]);
    }
  };

  const handleSelect = (event: { detail: { value: string } }) => {
    const selectedCity = cities.find(city => `${city.name}, ${city.country}` === event.detail.value);
    if (selectedCity) {
      onCitySelected(selectedCity);
    }
  };

  return (
    <SpaceBetween size="m">
      <FormField
        label="Search for a city"
        description="Enter a city name to view weather data"
        constraintText="Minimum 3 characters required"
      >
        <Autosuggest
          value={value}
          onChange={handleChange}
          onSelect={handleSelect}
          statusType={status === 'loading' ? 'loading' : undefined}
          options={cities.map(city => ({
            value: `${city.name}, ${city.country}`,
            label: `${city.name}, ${city.country}`,
            description: city.admin1 ? `${city.admin1}` : undefined,
          }))}
          placeholder="Enter a city name (e.g., London)"
          empty={
            value.length >= 3 && status === 'success' && cities.length === 0 ? (
              <StatusIndicator type="warning">No cities found. Try a different search term.</StatusIndicator>
            ) : value.length < 3 ? (
              'Type at least 3 characters to search for cities'
            ) : (
              'No matches found'
            )
          }
          ariaLabel="Search for cities"
          enteredTextLabel={value => `Search for "${value}"`}
        />
      </FormField>

      {status === 'error' && (
        <Alert type="error" header="Error occurred">
          {errorMessage}
        </Alert>
      )}
    </SpaceBetween>
  );
}
