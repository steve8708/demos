// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

export function BitcoinDashboardInfo() {
  return (
    <div>
      <Box variant="h2">Bitcoin Price Dashboard</Box>
      <p>This dashboard displays real-time Bitcoin price data from the CoinDesk Bitcoin Price Index (BPI).</p>

      <h3>Features:</h3>
      <ul>
        <li>Real-time Bitcoin prices in USD, GBP, and EUR</li>
        <li>Historical price tracking during the session</li>
        <li>Price chart visualization</li>
        <li>Auto-refresh every 60 seconds</li>
      </ul>

      <h3>API Information:</h3>
      <p>
        This demo uses the CoinDesk Bitcoin Price Index API. The BPI is a simple price index that averages the price of
        Bitcoin across leading global exchanges.
      </p>

      <SpaceBetween size="s">
        <Link external href="https://api.coindesk.com/v1/bpi/currentprice.json">
          View Raw API Data
        </Link>

        <Link external href="https://www.coindesk.com/price/bitcoin">
          Visit CoinDesk for More Information
        </Link>
      </SpaceBetween>

      <Box variant="small" padding={{ top: 'l' }}>
        <i>Powered by CoinDesk</i>
      </Box>
    </div>
  );
}
