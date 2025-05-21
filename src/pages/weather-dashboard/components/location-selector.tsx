// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';

import Autosuggest from '@cloudscape-design/components/autosuggest';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import FormField from '@cloudscape-design/components/form-field';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { predefinedLocations, searchLocation } from '../api';

export interface LocationSelectorProps {
  onLocationSelect: (location: { name: string; latitude: number; longitude: number }) => void;
  onUnitsChange: (units: {
    temperature: 'celsius' | 'fahrenheit';
    windSpeed: 'kmh' | 'mph';
    precipitation: 'mm' | 'inch';
  }) => void;
  selectedLocation?: { name: string; latitude: number; longitude: number };
  units: { temperature: 'celsius' | 'fahrenheit'; windSpeed: 'kmh' | 'mph'; precipitation: 'mm' | 'inch' };
}

export function LocationSelector({ onLocationSelect, onUnitsChange, selectedLocation, units }: LocationSelectorProps) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<{ value: string; latitude: number; longitude: number }[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle location search
  useEffect(() => {
    const fetchLocations = async () => {
      if (value.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const locations = await searchLocation(value);
        setSuggestions(
          locations.map(location => ({
            value: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
          })),
        );
      } catch (error) {
        console.error('Error searching locations:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleSelect = (selectedOption: { value: string; latitude: number; longitude: number }) => {
    setValue(selectedOption.value);
    onLocationSelect({
      name: selectedOption.value,
      latitude: selectedOption.latitude,
      longitude: selectedOption.longitude,
    });
  };

  return (
    <Container header={<Header variant="h2">Location Settings</Header>}>
      <SpaceBetween size="l">
        <FormField label="Search location" description="Enter a city name, address, or landmark">
          <Autosuggest
            value={value}
            onChange={({ detail }) => setValue(detail.value)}
            onSelect={({ detail }) =>
              handleSelect(detail.option as { value: string; latitude: number; longitude: number })
            }
            options={suggestions}
            placeholder="Search for a location..."
            enteredTextLabel={value => `Search for "${value}"`}
            empty="No matches found"
            loadingText="Loading locations..."
            statusType={loading ? 'loading' : 'finished'}
            ariaLabel="Location search"
            virtualScroll
          />
        </FormField>

        <Box variant="h3">Predefined locations</Box>
        <Grid
          gridDefinition={[
            { colspan: { default: 6, xxs: 6, xs: 6, s: 4, m: 3, l: 2, xl: 2 } },
            { colspan: { default: 6, xxs: 6, xs: 6, s: 4, m: 3, l: 2, xl: 2 } },
            { colspan: { default: 6, xxs: 6, xs: 6, s: 4, m: 3, l: 2, xl: 2 } },
            { colspan: { default: 6, xxs: 6, xs: 6, s: 4, m: 3, l: 2, xl: 2 } },
            { colspan: { default: 6, xxs: 6, xs: 6, s: 4, m: 3, l: 2, xl: 2 } },
            { colspan: { default: 6, xxs: 6, xs: 6, s: 4, m: 3, l: 2, xl: 2 } },
          ]}
        >
          {predefinedLocations.slice(0, 6).map(location => (
            <Button
              key={location.name}
              onClick={() => onLocationSelect(location)}
              variant={selectedLocation?.name === location.name ? 'primary' : 'normal'}
              fullWidth
            >
              {location.name}
            </Button>
          ))}
        </Grid>

        <Box variant="h3">Units</Box>
        <ColumnLayout columns={3}>
          <FormField label="Temperature">
            <SegmentedControl
              selectedId={units.temperature}
              onChange={({ detail }) =>
                onUnitsChange({
                  ...units,
                  temperature: detail.selectedId as 'celsius' | 'fahrenheit',
                })
              }
              options={[
                { id: 'celsius', text: 'Celsius (°C)' },
                { id: 'fahrenheit', text: 'Fahrenheit (°F)' },
              ]}
            />
          </FormField>

          <FormField label="Wind speed">
            <SegmentedControl
              selectedId={units.windSpeed}
              onChange={({ detail }) =>
                onUnitsChange({
                  ...units,
                  windSpeed: detail.selectedId as 'kmh' | 'mph',
                })
              }
              options={[
                { id: 'kmh', text: 'km/h' },
                { id: 'mph', text: 'mph' },
              ]}
            />
          </FormField>

          <FormField label="Precipitation">
            <SegmentedControl
              selectedId={units.precipitation}
              onChange={({ detail }) =>
                onUnitsChange({
                  ...units,
                  precipitation: detail.selectedId as 'mm' | 'inch',
                })
              }
              options={[
                { id: 'mm', text: 'Millimeters' },
                { id: 'inch', text: 'Inches' },
              ]}
            />
          </FormField>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
}
