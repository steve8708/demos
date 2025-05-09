// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';

interface LoadingStatusProps {
  resourceName: string;
}

export function LoadingStatus({ resourceName }: LoadingStatusProps) {
  return (
    <Grid gridDefinition={[{ colspan: { default: 12 } }]}>
      <Container>
        <SpaceBetween size="m" direction="vertical" alignItems="center">
          <Box margin={{ top: 'xxxl' }}>
            <Spinner size="large" />
          </Box>
          <Box variant="h2" padding={{ bottom: 'xxl' }} textAlign="center">
            Loading {resourceName}...
          </Box>
        </SpaceBetween>
      </Container>
    </Grid>
  );
}
