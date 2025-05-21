// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Link from '@cloudscape-design/components/link';
import { IconWind } from '@tabler/icons-react';

import { useWeatherContext } from '../../context/weather-context';
import { formatUVIndex } from '../../utils/helpers';
import { WeatherWidgetConfig } from '../interfaces';

function AirQualityHeader() {
  return <Header>Air Quality & UV Index</Header>;
}

function getUVIndexStatusType(uvIndex: number) {
  if (uvIndex < 3) return 'success';
  if (uvIndex < 6) return 'info';
  if (uvIndex < 8) return 'warning';
  return 'error';
}

function AirQualityContent() {
  const { weatherData, loading } = useWeatherContext();

  if (loading || !weatherData) {
    return (
      <Box textAlign="center" padding={{ vertical: 'xxl' }}>
        <StatusIndicator type="loading">Loading air quality data</StatusIndicator>
      </Box>
    );
  }

  const { daily, hourly, current } = weatherData;

  // We don't have direct air quality from the API in the free tier
  // Using UV index and visibility as proxies
  const uvIndex = daily.uv_index_max[0];
  const formattedUV = formatUVIndex(uvIndex);
  const visibility = hourly.visibility[0] / 1000; // Convert to km

  return (
    <SpaceBetween size="l">
      <ColumnLayout columns={2} variant="text-grid">
        <SpaceBetween size="s">
          <Box fontSize="heading-m">UV Index</Box>
          <StatusIndicator type={getUVIndexStatusType(formattedUV.value)}>
            {formattedUV.value} - {formattedUV.level}
          </StatusIndicator>
          <Box variant="p">
            {formattedUV.level === 'Low' && 'No protection needed for most skin types.'}
            {formattedUV.level === 'Moderate' && 'Wear sunscreen and protective clothing.'}
            {formattedUV.level === 'High' && 'Reduce time in the sun between 11am and 3pm.'}
            {formattedUV.level === 'Very High' && 'Avoid being outside during midday hours!'}
            {formattedUV.level === 'Extreme' && 'Take all precautions - unprotected skin can burn quickly!'}
          </Box>
        </SpaceBetween>

        <SpaceBetween size="s">
          <Box fontSize="heading-m">Visibility</Box>
          <Box fontSize="display-s">
            <IconWind size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {visibility.toFixed(1)} km
          </Box>
          <Box variant="p">
            {visibility > 10
              ? 'Excellent visibility conditions'
              : visibility > 5
                ? 'Good visibility conditions'
                : visibility > 2
                  ? 'Moderate visibility conditions'
                  : 'Poor visibility conditions'}
          </Box>
        </SpaceBetween>
      </ColumnLayout>

      <Box textAlign="center">
        <Link href="https://www.epa.gov/sunsafety/uv-index-scale-0" external externalIconAriaLabel="Opens in a new tab">
          Learn more about UV index
        </Link>
      </Box>
    </SpaceBetween>
  );
}

export const airQuality: WeatherWidgetConfig = {
  data: {
    title: 'Air Quality & UV Index',
    description: 'Air quality information and UV index',
    header: AirQualityHeader,
    content: AirQualityContent,
  },
};
