// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

interface DashboardHeaderProps {
  onRefresh: () => void;
  loading: boolean;
  lastUpdated: string | null;
}

export function DashboardHeader({ onRefresh, loading, lastUpdated }: DashboardHeaderProps) {
  // Format the last update time
  const formattedTime = lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never';

  return (
    <Header
      variant="h1"
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button onClick={onRefresh} loading={loading}>
            Refresh
          </Button>
        </SpaceBetween>
      }
      description="Real-time Bitcoin price data from the CoinDesk Bitcoin Price Index (BPI)."
      info={
        <Box color="text-body-secondary" fontSize="body-s">
          Last updated: {formattedTime}
        </Box>
      }
    >
      Bitcoin Price Dashboard
    </Header>
  );
}
