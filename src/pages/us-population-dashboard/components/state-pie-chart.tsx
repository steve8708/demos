// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import PieChart from '@cloudscape-design/components/pie-chart';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { PopulationByStateData } from '../interfaces';
import dataProvider from '../data-provider';

interface StatePieChartProps {
  title?: string;
  selectedYear?: number;
  selectedStates: string[];
}

export function StatePieChart({ title = 'Population Distribution', selectedYear, selectedStates }: StatePieChartProps) {
  const [data, setData] = useState<PopulationByStateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This useEffect will run whenever selectedYear or selectedStates changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stateData = await dataProvider.getPopulationByState(selectedYear);

        // If specific states are selected, filter the data
        const filteredData =
          selectedStates.length > 0
            ? stateData.filter(item => selectedStates.includes(item.state))
            : stateData.slice(0, 10); // Show top 10 if no states selected

        setData(filteredData);
        setLoading(false);
      } catch (err) {
        setError('Error loading state population data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [selectedYear, selectedStates]); // Add both dependencies to trigger refresh when either changes

  if (loading) {
    return (
      <Container header={<Header variant="h2">{title}</Header>}>
        <SpaceBetween size="m">
          <ProgressBar
            label="Loading population data"
            description="Please wait while we load the state population data"
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

  // Format data for the pie chart
  const chartData = data.map(item => ({
    title: item.state,
    value: item.population,
  }));

  // Sort data by population in descending order
  chartData.sort((a, b) => b.value - a.value);

  const yearLabel = selectedYear ? ` (${selectedYear})` : '';
  const displayTitle =
    selectedStates.length > 0 ? `${title} - Selected States${yearLabel}` : `${title} - Top 10 States${yearLabel}`;

  return (
    <Container header={<Header variant="h2">{displayTitle}</Header>}>
      <PieChart
        data={chartData}
        detailPopoverContent={(datum, sum) => [
          { key: 'State', value: datum.title },
          { key: 'Population', value: datum.value.toLocaleString() },
          {
            key: 'Percentage',
            value: `${((datum.value / sum) * 100).toFixed(1)}%`,
          },
        ]}
        i18nStrings={{
          detailsValue: 'Value',
          detailsPercentage: 'Percentage',
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          detailPopoverDismissAriaLabel: 'Dismiss',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'pie chart',
          segmentAriaRoleDescription: 'segment',
        }}
        ariaDescription="Pie chart showing population distribution across states."
        ariaLabel="State Population Distribution Pie Chart"
        hideFilter
        size="large"
        variant="donut"
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data available</b>
            <Box padding={{ bottom: 's' }} variant="p" color="inherit">
              There is no population data available for the selected filters.
            </Box>
          </Box>
        }
      />
    </Container>
  );
}
