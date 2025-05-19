// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import BarChart from '@cloudscape-design/components/bar-chart';

import { fetchVisitorStats } from '../services/nps-api';

interface VisitorStatsWidgetProps {
  parkCode: string;
}

export function VisitorStatsWidget({ parkCode }: VisitorStatsWidgetProps) {
  const [visitorStats, setVisitorStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVisitorStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchVisitorStats(parkCode);
        setVisitorStats(response.data);
      } catch (err) {
        console.error('Failed to load visitor statistics:', err);
        setError('Failed to load visitor statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadVisitorStats();
  }, [parkCode]);

  // Format numbers with commas
  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Prepare data for chart
  const prepareChartData = () => {
    if (!visitorStats || !visitorStats.monthlyVisitors) return [];

    return visitorStats.monthlyVisitors.map((month: any) => ({
      title: month.month,
      value: month.visitors,
      type: `${month.year}`,
    }));
  };

  if (loading) {
    return (
      <Container header={<Header variant="h2">Visitor Statistics</Header>}>
        <Box textAlign="center" padding={{ top: 'l', bottom: 'l' }}>
          <Spinner size="normal" />
          <Box variant="p" padding={{ top: 's' }}>
            Loading visitor statistics...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Visitor Statistics</Header>}>
        <Alert type="error" header="Error loading visitor statistics">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!visitorStats) {
    return (
      <Container header={<Header variant="h2">Visitor Statistics</Header>}>
        <Box textAlign="center" padding={{ top: 'm', bottom: 'm' }}>
          <Box variant="p">No visitor statistics available for this park.</Box>
        </Box>
      </Container>
    );
  }

  const chartData = prepareChartData();

  return (
    <Container header={<Header variant="h2">Visitor Statistics</Header>}>
      <ColumnLayout columns={3} variant="text-grid">
        <div>
          <Box variant="awsui-key-label">Annual Visitors</Box>
          <Box variant="h2" color="text-body-secondary">
            {formatNumber(visitorStats.annualVisitors)}
          </Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Average Monthly</Box>
          <Box variant="h2" color="text-body-secondary">
            {formatNumber(visitorStats.averageMonthlyVisitors)}
          </Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Peak Month</Box>
          <Box variant="h2" color="text-body-secondary">
            {visitorStats.peakMonth.month}
          </Box>
          <Box variant="small" color="text-body-secondary">
            {formatNumber(visitorStats.peakMonth.visitors)} visitors
          </Box>
        </div>
      </ColumnLayout>

      <Box padding={{ top: 'l' }}>
        <BarChart
          series={[{ title: 'Monthly Visitors', type: 'bar', data: chartData }]}
          i18nStrings={{
            chartAriaRoleDescription: 'Bar chart',
            xTickFormatter: title => title,
            yTickFormatter: value => formatNumber(value),
          }}
          ariaLabel="Monthly Visitors Bar Chart"
          hideFilter
          hideLegend
          xScaleType="categorical"
          xTitle="Month"
          yTitle="Visitors"
          height={250}
        />
      </Box>

      <Box variant="small" color="text-body-secondary" padding={{ top: 's' }}>
        Note: Visitor statistics are estimates and may not reflect actual visitor counts.
      </Box>
    </Container>
  );
}
