// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Icon from '@cloudscape-design/components/icon';

interface WeatherCardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  actions?: React.ReactNode;
}

export function WeatherCard({ title, children, icon, actions }: WeatherCardProps) {
  return (
    <Container
      header={
        <Header variant="h2" actions={actions}>
          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
            {icon && <Icon name={icon} />}
            {title}
          </SpaceBetween>
        </Header>
      }
    >
      {children}
    </Container>
  );
}

interface MetricItemProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
}

export function MetricItem({ label, value, unit, icon }: MetricItemProps) {
  return (
    <Box>
      <Box variant="awsui-key-label" margin={{ bottom: 'xxs' }}>
        <SpaceBetween direction="horizontal" size="xs" alignItems="center">
          {icon && <Icon name={icon} size="small" />}
          {label}
        </SpaceBetween>
      </Box>
      <Box fontSize="heading-l">
        {value}
        {unit && (
          <Box variant="span" fontSize="body-m" color="text-body-secondary">
            {unit}
          </Box>
        )}
      </Box>
    </Box>
  );
}

interface WeatherMetricsGridProps {
  metrics: Array<{
    label: string;
    value: string | number;
    unit?: string;
    icon?: string;
  }>;
}

export function WeatherMetricsGrid({ metrics }: WeatherMetricsGridProps) {
  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 12, xxs: 6, xs: 4, s: 3, m: 2, l: 2 } },
        { colspan: { default: 12, xxs: 6, xs: 4, s: 3, m: 2, l: 2 } },
        { colspan: { default: 12, xxs: 6, xs: 4, s: 3, m: 2, l: 2 } },
        { colspan: { default: 12, xxs: 6, xs: 4, s: 3, m: 2, l: 2 } },
        { colspan: { default: 12, xxs: 6, xs: 4, s: 3, m: 2, l: 2 } },
        { colspan: { default: 12, xxs: 6, xs: 4, s: 3, m: 2, l: 2 } },
      ]}
    >
      {metrics.map((metric, index) => (
        <MetricItem key={index} label={metric.label} value={metric.value} unit={metric.unit} icon={metric.icon} />
      ))}
    </Grid>
  );
}
