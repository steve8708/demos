// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';

import { Navigation as CommonNavigation } from '../../commons';
import { PREDEFINED_LOCATIONS } from '../utils/constants';
import { useWeatherContext } from '../context/weather-context';

export function WeatherSideNavigation() {
  const { setLocation, fetchWeatherData } = useWeatherContext();

  const handleLocationSelect = (location: { name: string; latitude: number; longitude: number }) => {
    setLocation(location);
    fetchWeatherData(location);
  };

  return (
    <SpaceBetween size="m">
      <CommonNavigation activeHref="#/weather" header={<Box margin={{ vertical: 'xs' }}>Weather Dashboard</Box>} />

      <SpaceBetween size="s">
        <Box variant="h3">Popular Locations</Box>
        {PREDEFINED_LOCATIONS.map((location, index) => (
          <Link key={index} onFollow={() => handleLocationSelect(location)} href="#" variant="primary">
            {location.name}
          </Link>
        ))}
      </SpaceBetween>
    </SpaceBetween>
  );
}
