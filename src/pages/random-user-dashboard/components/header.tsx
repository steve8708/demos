// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Select, { SelectProps } from '@cloudscape-design/components/select';
import FormField from '@cloudscape-design/components/form-field';

import { RandomUserFilter } from '../types';

interface DashboardHeaderProps {
  onRefresh: () => void;
  loading: boolean;
  filter: RandomUserFilter;
  onFilterChange: (filter: RandomUserFilter) => void;
}

export function DashboardHeader({ onRefresh, loading, filter, onFilterChange }: DashboardHeaderProps) {
  return (
    <Header
      variant="h1"
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button onClick={onRefresh} loading={loading}>
            Refresh users
          </Button>
        </SpaceBetween>
      }
      counter={filter.resultsCount ? `(${filter.resultsCount})` : undefined}
      description="View and manage random user profiles from randomuser.me API."
    >
      Random Users Dashboard
    </Header>
  );
}

export function DashboardFilters({
  filter,
  onFilterChange,
}: {
  filter: RandomUserFilter;
  onFilterChange: (filter: RandomUserFilter) => void;
}) {
  const genderOptions: SelectProps.Option[] = [
    { value: '', label: 'All genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const nationalityOptions: SelectProps.Option[] = [
    { value: '', label: 'All nationalities' },
    { value: 'us', label: 'United States' },
    { value: 'gb', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'br', label: 'Brazil' },
    { value: 'ch', label: 'Switzerland' },
    { value: 'nl', label: 'Netherlands' },
    { value: 'no', label: 'Norway' },
  ];

  const resultCountOptions: SelectProps.Option[] = [
    { value: '10', label: '10 users' },
    { value: '25', label: '25 users' },
    { value: '50', label: '50 users' },
    { value: '100', label: '100 users' },
  ];

  return (
    <Box padding="s">
      <SpaceBetween direction="horizontal" size="l">
        <FormField label="Gender">
          <Select
            selectedOption={genderOptions.find(option => option.value === filter.gender) || genderOptions[0]}
            onChange={({ detail }) => onFilterChange({ ...filter, gender: detail.selectedOption.value || undefined })}
            options={genderOptions}
          />
        </FormField>

        <FormField label="Nationality">
          <Select
            selectedOption={
              nationalityOptions.find(option => option.value === filter.nationality) || nationalityOptions[0]
            }
            onChange={({ detail }) =>
              onFilterChange({ ...filter, nationality: detail.selectedOption.value || undefined })
            }
            options={nationalityOptions}
          />
        </FormField>

        <FormField label="Results count">
          <Select
            selectedOption={
              resultCountOptions.find(option => option.value === String(filter.resultsCount)) || resultCountOptions[1]
            }
            onChange={({ detail }) =>
              onFilterChange({
                ...filter,
                resultsCount: detail.selectedOption.value ? parseInt(detail.selectedOption.value, 10) : 25,
              })
            }
            options={resultCountOptions}
          />
        </FormField>
      </SpaceBetween>
    </Box>
  );
}

export function DashboardMainInfo() {
  return (
    <div>
      <Box variant="h2">Random Users Dashboard</Box>
      <p>
        This dashboard demonstrates integration with the RandomUser.me API to display user profiles in a table view.
      </p>
      <h3>Features:</h3>
      <ul>
        <li>Browse users in a sortable, filterable table</li>
        <li>Filter users by gender and nationality</li>
        <li>Refresh data to get new random users</li>
        <li>Select a user to view detailed information</li>
        <li>Search for specific users with the text filter</li>
      </ul>
      <h3>API Information:</h3>
      <p>
        This demo uses the RandomUser.me API, a free open-source API for generating random user data. No API key is
        required, but usage limitations apply.
      </p>
      <p>
        <a href="https://randomuser.me/" target="_blank" rel="noopener noreferrer">
          Visit RandomUser.me for more information
        </a>
      </p>
    </div>
  );
}
