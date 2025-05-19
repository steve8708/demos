// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextContent from '@cloudscape-design/components/text-content';

import { fetchParkByCode } from '../services/nps-api';
import { Park } from '../types';

interface WeatherWidgetProps {
  parkCode: string;
}

export function WeatherWidget({ parkCode }: WeatherWidgetProps) {
  const [weatherInfo, setWeatherInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeatherInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchParkByCode(parkCode);

        if (response.data && response.data.length > 0) {
          const park: Park = response.data[0];
          setWeatherInfo(park.weatherInfo || 'No weather information available for this park.');
        } else {
          setError('No park details found');
        }
      } catch (err) {
        console.error('Failed to load weather information:', err);
        setError('Failed to load weather information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadWeatherInfo();
  }, [parkCode]);

  if (loading) {
    return (
      <Container header={<Header variant="h2">Weather Information</Header>}>
        <Box textAlign="center" padding={{ top: 'l', bottom: 'l' }}>
          <Spinner size="normal" />
          <Box variant="p" padding={{ top: 's' }}>
            Loading weather information...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Weather Information</Header>}>
        <Alert type="error" header="Error loading weather information">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container header={<Header variant="h2">Weather Information</Header>}>
      <SpaceBetween size="m">
        <TextContent>
          <p>{weatherInfo}</p>
        </TextContent>

        <Box variant="small" color="text-body-secondary">
          Note: This information is provided by the National Park Service. For current weather conditions and forecasts,
          please check the National Weather Service or other weather providers.
        </Box>
      </SpaceBetween>
    </Container>
  );
}
