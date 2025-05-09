// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { PriceChart } from './price-chart';
import { MetricsBox } from './metrics-box';
import { MarketDataCard } from './market-data-card';
import { useBitcoinData } from '../hooks/use-bitcoin-data';

export function Content() {
  const { priceHistory, loading, marketCap, volume, circulatingSupply, allTimeHigh } = useBitcoinData();

  return (
    <SpaceBetween size="l">
      <Grid
        gridDefinition={[
          { colspan: { default: 12, l: 8 } },
          { colspan: { default: 12, l: 4 } },
          { colspan: { default: 12, s: 6, l: 3 } },
          { colspan: { default: 12, s: 6, l: 3 } },
          { colspan: { default: 12, s: 6, l: 3 } },
          { colspan: { default: 12, s: 6, l: 3 } },
        ]}
      >
        <PriceChart priceHistory={priceHistory} loading={loading} />
        <MetricsBox loading={loading} />
        <MarketDataCard title="Market Cap" value={marketCap} loading={loading} type="currency" />
        <MarketDataCard title="24h Volume" value={volume} loading={loading} type="currency" />
        <MarketDataCard
          title="Circulating Supply"
          value={circulatingSupply}
          loading={loading}
          type="number"
          suffix=" BTC"
        />
        <MarketDataCard title="All Time High" value={allTimeHigh} loading={loading} type="currency" />
      </Grid>
    </SpaceBetween>
  );
}
