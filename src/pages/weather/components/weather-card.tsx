// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';

interface WeatherCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: string;
}

export function WeatherCard({ title, value, description, icon = 'status-info' }: WeatherCardProps) {
  return (
    <Container>
      <SpaceBetween size="s">
        <Box variant="awsui-key-label">{title}</Box>
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
          <Icon name={icon} />
          <Box variant="h3" margin="none">
            {value}
          </Box>
        </SpaceBetween>
        {description && (
          <Box variant="small" color="text-status-inactive">
            {description}
          </Box>
        )}
      </SpaceBetween>
    </Container>
  );
}
