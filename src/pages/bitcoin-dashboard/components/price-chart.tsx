// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';
import { colorChartsThematic09, colorChartsThematic03 } from '@cloudscape-design/design-tokens';

import { BitcoinPriceData } from '../hooks/use-bitcoin-data';
import { formatCurrency } from '../utils/formatters';

interface PriceChartProps {
  priceHistory: BitcoinPriceData[];
  loading: boolean;
}

export function PriceChart({ priceHistory, loading }: PriceChartProps) {
  // Ensure priceHistory is never undefined
  const safeHistory = priceHistory || [];

  const domain =
    safeHistory.length > 0 ? [safeHistory[0].date, safeHistory[safeHistory.length - 1].date] : [new Date(), new Date()];

  const series = [
    {
      title: 'Bitcoin Price (USD)',
      type: 'line' as const,
      data: safeHistory.map(item => ({
        x: item.date,
        y: item.price || 0,
      })),
      valueFormatter: (value: number) => formatCurrency(value),
      color: colorChartsThematic09,
    },
    {
      title: 'Market Cap (Billions USD)',
      type: 'line' as const,
      data: safeHistory.map(item => ({
        x: item.date,
        y: (item.marketCap || 0) / 1000000000,
      })),
      valueFormatter: (value: number) => `$${value.toFixed(2)}B`,
      color: colorChartsThematic03,
    },
  ];

  const dateFormatter = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container
      header={
        <Header variant="h2" description="30-day price history and market capitalization">
          Bitcoin Price Chart
        </Header>
      }
    >
      <LineChart
        series={series}
        xDomain={domain}
        yDomain={undefined}
        xScaleType="time"
        statusType={loading ? 'loading' : 'finished'}
        loadingText="Loading chart data..."
        recoveryText="Retry"
        errorText="Error loading Bitcoin data"
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'line chart',
          xAxisAriaRoleDescription: 'x axis',
          yAxisAriaRoleDescription: 'y axis',
          xTickFormatter: dateFormatter,
        }}
        ariaLabel="Bitcoin price chart"
        ariaDescription="Line chart showing Bitcoin price and market cap over the last 30 days."
        hideFilter
        height={300}
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data available</b>
            <Box variant="p" color="inherit">
              There is no Bitcoin price data available
            </Box>
          </Box>
        }
        noMatch={
          <Box textAlign="center" color="inherit">
            <b>No matching data</b>
            <Box variant="p" color="inherit">
              There is no matching data to display
            </Box>
          </Box>
        }
      />
    </Container>
  );
}
