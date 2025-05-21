// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Link from '@cloudscape-design/components/link';

import { useWeatherContext } from '../../context/weather-context';
import { WeatherWidgetConfig } from '../interfaces';

function WeatherMapHeader() {
  return <Header>Weather Map</Header>;
}

function WeatherMapContent() {
  const { location, loading } = useWeatherContext();

  if (loading) {
    return (
      <Box textAlign="center" padding={{ vertical: 'xxl' }}>
        <StatusIndicator type="loading">Loading weather map</StatusIndicator>
      </Box>
    );
  }

  // Generate a static map URL using Open Street Map
  const mapWidth = 400;
  const mapHeight = 300;
  const zoom = 10;
  const lat = location.latitude;
  const lon = location.longitude;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.1}%2C${lat - 0.1}%2C${lon + 0.1}%2C${lat + 0.1}&amp;layer=mapnik&amp;marker=${lat}%2C${lon}`;

  return (
    <SpaceBetween size="s">
      <div style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}>
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          title="Weather Map"
          aria-label="Weather location map"
        ></iframe>
      </div>

      <Box textAlign="center">
        <Link
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`}
          external
          externalIconAriaLabel="Opens in a new tab"
        >
          View larger map
        </Link>
      </Box>
    </SpaceBetween>
  );
}

export const weatherMap: WeatherWidgetConfig = {
  data: {
    title: 'Weather Map',
    description: 'Map showing weather location',
    header: WeatherMapHeader,
    content: WeatherMapContent,
  },
};
