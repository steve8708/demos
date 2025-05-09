// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { PopulationMetricData } from '../interfaces';
import dataProvider from '../data-provider';

interface MetricsCardsProps {
  title?: string;
}

export function MetricsCards({ title = 'Population Metrics' }: MetricsCardsProps) {
  const [metrics, setMetrics] = useState<PopulationMetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const metricsData = await dataProvider.getKeyMetrics();
        setMetrics(metricsData);
        setLoading(false);
      } catch (err) {
        setError('Error loading population metrics');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container header={<Header variant="h2">{title}</Header>}>
        <SpaceBetween size="m">
          <ProgressBar
            label="Loading metrics"
            description="Please wait while we load the population metrics"
            value={-1}
          />
        </SpaceBetween>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">{title}</Header>}>
        <Box color="text-status-error">{error}</Box>
      </Container>
    );
  }

  return (
    <Container header={<Header variant="h2">{title}</Header>}>
      <Grid
        gridDefinition={[
          { colspan: { default: 12, xs: 12, s: 6, m: 4, l: 4, xl: 4 } },
          { colspan: { default: 12, xs: 12, s: 6, m: 4, l: 4, xl: 4 } },
          { colspan: { default: 12, xs: 12, s: 6, m: 4, l: 4, xl: 4 } },
        ]}
      >
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </Grid>
    </Container>
  );
}

interface MetricCardProps {
  metric: PopulationMetricData;
}

function MetricCard({ metric }: MetricCardProps) {
  return (
    <div className="metric-card">
      <Box variant="h3">{metric.title}</Box>
      <Box variant="h1" padding={{ top: 'xs', bottom: 'xs' }}>
        {metric.value}
      </Box>

      {metric.previousValue && (
        <Box variant="p" color="text-body-secondary">
          Previous: {metric.previousValue}
        </Box>
      )}

      {metric.change !== undefined && metric.changeType && (
        <Box padding={{ top: 'xs' }}>
          <StatusIndicator
            type={metric.changeType === 'positive' ? 'success' : metric.changeType === 'negative' ? 'error' : 'info'}
          >
            {metric.change > 0 ? '+' : ''}
            {metric.change.toFixed(2)}% from previous
          </StatusIndicator>
        </Box>
      )}
    </div>
  );
}
