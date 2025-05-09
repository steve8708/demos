// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useBitcoinData } from '../hooks/use-bitcoin-data';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface BitcoinDashboardHeaderProps {
  actions?: React.ReactNode;
}

export function BitcoinDashboardHeader({ actions }: BitcoinDashboardHeaderProps) {
  const { currentPrice, priceChange24h, loading } = useBitcoinData();

  const priceColor = priceChange24h >= 0 ? 'green' : 'red';

  return (
    <Container
      header={
        <Header variant="h1" actions={actions} description="Real-time Bitcoin price and historical data">
          Bitcoin Price Dashboard
        </Header>
      }
    >
      <SpaceBetween size="m">
        <Box variant="h2">Current Price: {loading ? 'Loading...' : formatCurrency(currentPrice)}</Box>
        {!loading && (
          <Box variant="h3" color={priceColor}>
            24h Change: {formatPercentage(priceChange24h)}
          </Box>
        )}
      </SpaceBetween>
    </Container>
  );
}

export function BitcoinInfo() {
  const { currentPrice, priceChange24h, marketCap, volume, loading } = useBitcoinData();

  if (loading) {
    return <Box>Loading Bitcoin data...</Box>;
  }

  return (
    <SpaceBetween size="l">
      <Header variant="h2">Bitcoin Market Information</Header>

      <SpaceBetween size="m">
        <Box variant="h3">Price Information</Box>
        <Box variant="p">Current Price: {formatCurrency(currentPrice)}</Box>
        <Box variant="p">24h Change: {formatPercentage(priceChange24h)}</Box>
      </SpaceBetween>

      <SpaceBetween size="m">
        <Box variant="h3">Market Information</Box>
        <Box variant="p">Market Cap: {formatCurrency(marketCap)}</Box>
        <Box variant="p">24h Trading Volume: {formatCurrency(volume)}</Box>
      </SpaceBetween>

      <Box variant="p">
        The Bitcoin price data is sourced from the CoinGecko API, which provides real-time cryptocurrency data. This
        dashboard displays the current price, 24-hour price change, market capitalization, and trading volume for
        Bitcoin.
      </Box>

      <Box variant="p">
        <Button href="https://www.coingecko.com/en/api/documentation" external>
          CoinGecko API Documentation
        </Button>
      </Box>
    </SpaceBetween>
  );
}
