// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';

import { useBitcoinData } from '../hooks/use-bitcoin-data';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface MetricsBoxProps {
  loading: boolean;
}

export function MetricsBox({ loading }: MetricsBoxProps) {
  const {
    currentPrice = 0,
    priceChange24h = 0,
    priceChange7d = 0,
    priceChange30d = 0,
    priceChangePercentage24h = 0,
    priceChangePercentage7d = 0,
    priceChangePercentage30d = 0,
    loading: dataLoading = true,
  } = useBitcoinData() || {};

  // Use either the passed loading prop or the data loading state
  const isLoading = loading || dataLoading;

  return (
    <Container
      header={
        <Header variant="h2" description="Price changes over different time periods">
          Price Metrics
        </Header>
      }
    >
      {loading ? (
        <Box textAlign="center" padding="m">
          Loading metrics...
        </Box>
      ) : (
        <SpaceBetween size="l">
          <Box variant="h3">Current Price: {formatCurrency(currentPrice)}</Box>

          <SpaceBetween size="m">
            <Box variant="h4">Price Change</Box>
            <ColumnLayout columns={2} variant="text-grid">
              <Box>24h Change</Box>
              <Box color={priceChange24h >= 0 ? 'green' : 'red'}>
                {formatCurrency(priceChange24h)} ({formatPercentage(priceChangePercentage24h)})
              </Box>

              <Box>7d Change</Box>
              <Box color={priceChange7d >= 0 ? 'green' : 'red'}>
                {formatCurrency(priceChange7d)} ({formatPercentage(priceChangePercentage7d)})
              </Box>

              <Box>30d Change</Box>
              <Box color={priceChange30d >= 0 ? 'green' : 'red'}>
                {formatCurrency(priceChange30d)} ({formatPercentage(priceChangePercentage30d)})
              </Box>
            </ColumnLayout>
          </SpaceBetween>

          <SpaceBetween size="m">
            <Box variant="h4">Performance</Box>

            <SpaceBetween size="xs">
              <Box>24h Performance</Box>
              <ProgressBar
                value={Math.min(Math.abs(priceChangePercentage24h), 100)}
                label=""
                description=""
                status={priceChangePercentage24h >= 0 ? 'success' : 'error'}
              />
            </SpaceBetween>

            <SpaceBetween size="xs">
              <Box>7d Performance</Box>
              <ProgressBar
                value={Math.min(Math.abs(priceChangePercentage7d), 100)}
                label=""
                description=""
                status={priceChangePercentage7d >= 0 ? 'success' : 'error'}
              />
            </SpaceBetween>

            <SpaceBetween size="xs">
              <Box>30d Performance</Box>
              <ProgressBar
                value={Math.min(Math.abs(priceChangePercentage30d), 100)}
                label=""
                description=""
                status={priceChangePercentage30d >= 0 ? 'success' : 'error'}
              />
            </SpaceBetween>
          </SpaceBetween>
        </SpaceBetween>
      )}
    </Container>
  );
}
