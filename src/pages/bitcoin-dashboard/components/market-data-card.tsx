// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { formatCurrency, formatNumber } from '../utils/formatters';

interface MarketDataCardProps {
  title: string;
  value: number;
  loading: boolean;
  type: 'currency' | 'number' | 'percentage';
  suffix?: string;
}

export function MarketDataCard({ title, value, loading, type, suffix = '' }: MarketDataCardProps) {
  const formattedValue = () => {
    if (loading) return 'Loading...';

    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'number':
      default:
        return formatNumber(value) + suffix;
    }
  };

  return (
    <Container header={<Header variant="h3">{title}</Header>}>
      <SpaceBetween size="s">
        <Box textAlign="center" fontSize="heading-xl" padding={{ top: 's', bottom: 's' }}>
          {formattedValue()}
        </Box>

        {!loading && (
          <Box textAlign="center">
            <StatusIndicator type="success">Updated</StatusIndicator>
          </Box>
        )}
      </SpaceBetween>
    </Container>
  );
}
