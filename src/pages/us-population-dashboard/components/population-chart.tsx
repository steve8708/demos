// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { PopulationTrendData } from '../interfaces';
import dataProvider from '../data-provider';

interface PopulationChartProps {
  title?: string;
}

export function PopulationChart({ title = 'Population Trend Over Time' }: PopulationChartProps) {
  const [data, setData] = useState<PopulationTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const populationData = await dataProvider.getPopulationTrend();
        setData(populationData);
        setLoading(false);
      } catch (err) {
        setError('Error loading population trend data');
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
            label="Loading population data"
            description="Please wait while we load the population trend data"
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

  // Format data for the bar chart
  const chartData = data.map(item => ({
    x: item.year.toString(),
    y: item.population,
  }));

  // Sort data by year in ascending order
  chartData.sort((a, b) => parseInt(a.x) - parseInt(b.x));

  return (
    <Container header={<Header variant="h2">{title}</Header>}>
      <BarChart
        series={[
          {
            title: 'Population',
            type: 'bar',
            data: chartData,
          },
        ]}
        xTitle="Year"
        yTitle="Population"
        xScaleType="categorical"
        hideFilter
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data available</b>
            <Box padding={{ bottom: 's' }} variant="p" color="inherit">
              There is no population data available for the selected filters.
            </Box>
          </Box>
        }
        height={300}
        ariaLabel="Population trend over time"
        ariaDescription="Bar chart showing US population trend over multiple years."
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'bar chart',
          xAxisAriaRoleDescription: 'year',
          yAxisAriaRoleDescription: 'population',
        }}
      />
    </Container>
  );
}
