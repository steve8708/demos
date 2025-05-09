// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { CurrencyData } from '../types';

interface PriceCardProps {
  currencyCode: string;
  data: CurrencyData;
  lastUpdated: string;
}

export function PriceCard({ currencyCode, data, lastUpdated }: PriceCardProps) {
  // Format the rate as a currency with the specific currency symbol
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(data.rate_float);

  // Calculate time elapsed since last update
  const lastUpdateTime = new Date(lastUpdated);
  const now = new Date();
  const secondsElapsed = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 1000);

  let updateStatus;
  if (secondsElapsed < 30) {
    updateStatus = <StatusIndicator type="success">Updated just now</StatusIndicator>;
  } else if (secondsElapsed < 120) {
    updateStatus = <StatusIndicator type="success">Updated {secondsElapsed} seconds ago</StatusIndicator>;
  } else if (secondsElapsed < 300) {
    updateStatus = <StatusIndicator type="info">Updated {Math.floor(secondsElapsed / 60)} minutes ago</StatusIndicator>;
  } else {
    updateStatus = (
      <StatusIndicator type="warning">Updated {Math.floor(secondsElapsed / 60)} minutes ago</StatusIndicator>
    );
  }

  return (
    <Container header={<Header variant="h2">Bitcoin Price ({currencyCode})</Header>}>
      <SpaceBetween size="m">
        <Box variant="h1" textAlign="center" padding="l">
          {formattedPrice}
        </Box>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Box variant="small" color="text-body-secondary">
              {data.description}
            </Box>
          </div>
          <div>{updateStatus}</div>
        </div>
      </SpaceBetween>
    </Container>
  );
}
