// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Link from '@cloudscape-design/components/link';
import Spinner from '@cloudscape-design/components/spinner';

import { useWeatherData } from '../../hooks/use-weather-data';
import { Coordinates, WidgetConfig } from '../interfaces';

interface LocationInfoHeaderProps {
  isLoading?: boolean;
  error?: string | null;
}

function LocationInfoHeader({ isLoading, error }: LocationInfoHeaderProps) {
  return (
    <Header
      variant="h2"
      info={<Link variant="info">Info</Link>}
      description={isLoading ? 'Loading location data...' : error ? 'Error loading data' : 'Location information'}
    >
      Location Information
    </Header>
  );
}

interface LocationInfoWidgetProps {
  coordinates: Coordinates;
}

function LocationInfoWidget({ coordinates }: LocationInfoWidgetProps) {
  const { data: weatherData, isLoading, error } = useWeatherData(coordinates);

  if (isLoading) {
    return (
      <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
        <Spinner size="large" />
        <Box variant="p" padding={{ top: 'm' }}>
          Loading location data...
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert type="error" header="Error loading location data">
        {error}. Please try again or check your coordinates.
      </Alert>
    );
  }

  if (!weatherData) {
    return (
      <Alert type="warning" header="No location data available">
        Could not retrieve location information. Please try another location or try again later.
      </Alert>
    );
  }

  // Format the sunrise and sunset times if available
  let sunrise = 'Not available';
  let sunset = 'Not available';

  if (weatherData.daily && weatherData.daily.length > 0) {
    const today = weatherData.daily[0];
    if (today.sunrise) {
      sunrise = new Date(today.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (today.sunset) {
      sunset = new Date(today.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  return (
    <KeyValuePairs
      items={[
        {
          label: 'Location',
          value: coordinates.name,
        },
        {
          label: 'Latitude',
          value: coordinates.latitude.toFixed(4),
        },
        {
          label: 'Longitude',
          value: coordinates.longitude.toFixed(4),
        },
        {
          label: 'Elevation',
          value: `${weatherData.elevation.toFixed(0)} m`,
        },
        {
          label: 'Timezone',
          value: weatherData.timezone,
        },
        {
          label: 'Sunrise',
          value: sunrise,
        },
        {
          label: 'Sunset',
          value: sunset,
        },
      ]}
    />
  );
}

export function createLocationInfoWidget(coordinates: Coordinates): WidgetConfig {
  const { isLoading, error } = useWeatherData(coordinates);

  return {
    definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
    data: {
      icon: 'status',
      title: 'Location Information',
      description: 'Information about the current location',
      header: () => <LocationInfoHeader isLoading={isLoading} error={error} />,
      content: () => <LocationInfoWidget coordinates={coordinates} />,
    },
  };
}

export const locationInfo = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
  data: {
    icon: 'status',
    title: 'Location Information',
    description: 'Information about the current location',
    header: LocationInfoHeader,
    content: LocationInfoWidget,
  },
};
