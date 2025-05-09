// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { BitcoinPriceResponse, PriceHistory } from '../types';
import { PriceCard } from './price-card';
import { PriceHistoryTable } from './price-history-table';
import { PriceChart } from './price-chart';

interface ContentProps {
  priceData: BitcoinPriceResponse | null;
  loading: boolean;
  error: string | null;
  priceHistory: PriceHistory[];
}

export function Content({ priceData, loading, error, priceHistory }: ContentProps) {
  if (error) {
    return (
      <Alert type="error" header="Error fetching Bitcoin price data">
        {error}
      </Alert>
    );
  }

  if (loading && !priceData) {
    return (
      <Alert type="info" header="Loading Bitcoin price data">
        Please wait while we fetch the latest Bitcoin prices...
      </Alert>
    );
  }

  if (!priceData) {
    return (
      <Alert type="warning" header="No price data available">
        No Bitcoin price data is currently available. Please try refreshing the page.
      </Alert>
    );
  }

  const lastUpdated = priceData.time.updatedISO;

  return (
    <SpaceBetween size="l">
      {/* Currency Price Cards */}
      <Grid
        gridDefinition={[
          { colspan: { xl: 4, l: 4, m: 4, s: 12, xs: 12, default: 12 } },
          { colspan: { xl: 4, l: 4, m: 4, s: 12, xs: 12, default: 12 } },
          { colspan: { xl: 4, l: 4, m: 4, s: 12, xs: 12, default: 12 } },
        ]}
      >
        <PriceCard currencyCode="USD" data={priceData.bpi.USD} lastUpdated={lastUpdated} />
        <PriceCard currencyCode="GBP" data={priceData.bpi.GBP} lastUpdated={lastUpdated} />
        <PriceCard currencyCode="EUR" data={priceData.bpi.EUR} lastUpdated={lastUpdated} />
      </Grid>

      {/* Price Chart */}
      <PriceChart priceHistory={priceHistory} />

      {/* Price History Table */}
      <PriceHistoryTable priceHistory={priceHistory} />

      {/* Attribution */}
      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>{priceData.disclaimer}</div>
    </SpaceBetween>
  );
}
