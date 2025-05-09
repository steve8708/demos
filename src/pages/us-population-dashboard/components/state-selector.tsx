// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import Multiselect from '@cloudscape-design/components/multiselect';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';

import dataProvider from '../data-provider';

interface StateSelectorProps {
  onYearChange: (year: number) => void;
  onStatesChange: (states: string[]) => void;
  selectedStates: string[];
  selectedYear: number | null;
}

export function StateSelector({ onYearChange, onStatesChange, selectedStates, selectedYear }: StateSelectorProps) {
  const [years, setYears] = useState<number[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const availableYears = await dataProvider.getAvailableYears();
        const availableStates = await dataProvider.getAvailableStates();

        setYears(availableYears);
        setStates(availableStates);

        // Set initial year if none selected
        if (!selectedYear && availableYears.length > 0) {
          onYearChange(availableYears[0]);
        }

        setLoading(false);
      } catch (err) {
        setError('Error loading filter options');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [onYearChange, selectedYear]);

  if (loading) {
    return (
      <Container header={<Header variant="h2">Filters</Header>}>
        <SpaceBetween size="m">
          <ProgressBar
            label="Loading filter options"
            description="Please wait while we load the available filter options"
            value={-1}
          />
        </SpaceBetween>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Filters</Header>}>
        <Box color="text-status-error">{error}</Box>
      </Container>
    );
  }

  return (
    <Container header={<Header variant="h2">Data Filters</Header>}>
      <SpaceBetween size="m">
        <FormField label="Year" description="Select a year to view population data">
          <Select
            selectedOption={selectedYear ? { label: selectedYear.toString(), value: selectedYear.toString() } : null}
            onChange={({ detail }) => {
              if (detail.selectedOption) {
                onYearChange(parseInt(detail.selectedOption.value as string));
              }
            }}
            options={years.map(year => ({ label: year.toString(), value: year.toString() }))}
            placeholder="Select a year"
            empty="No years available"
          />
        </FormField>

        <FormField label="States" description="Select states to compare (for comparison charts)">
          <Multiselect
            selectedOptions={selectedStates.map(state => ({ label: state, value: state }))}
            onChange={({ detail }) => {
              onStatesChange(detail.selectedOptions.map(option => option.value as string));
            }}
            options={states.map(state => ({ label: state, value: state }))}
            placeholder="Select states"
            deselectAriaLabel={option => `Remove ${option.label}`}
            filteringType="auto"
            empty="No states available"
          />
        </FormField>
      </SpaceBetween>
    </Container>
  );
}
