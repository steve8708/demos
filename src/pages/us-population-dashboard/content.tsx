// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Grid from '@cloudscape-design/components/grid';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { MetricsCards } from './components/metrics-cards';
import { PopulationChart } from './components/population-chart';
import { PopulationTable } from './components/population-table';
import { StateSelector } from './components/state-selector';
import { StatePieChart } from './components/state-pie-chart';

export function Content() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  return (
    <SpaceBetween size="l">
      <Alert type="info" header="Data Source Information">
        This dashboard displays US population data from DataUSA.io. The data is sourced from the US Census Bureau.
      </Alert>

      <Grid
        gridDefinition={[
          { colspan: { default: 12, l: 3, m: 4, s: 12 } },
          { colspan: { default: 12, l: 9, m: 8, s: 12 } },
          { colspan: { default: 12, l: 12, m: 12, s: 12 } },
          { colspan: { default: 12, l: 8, m: 8, s: 12 } },
          { colspan: { default: 12, l: 4, m: 4, s: 12 } },
        ]}
      >
        {/* Filters Panel */}
        <StateSelector
          onYearChange={setSelectedYear}
          onStatesChange={setSelectedStates}
          selectedStates={selectedStates}
          selectedYear={selectedYear}
        />

        {/* Key Metrics */}
        <MetricsCards title="Key Population Metrics" />

        {/* Population Trend Chart */}
        <PopulationChart title="US Population Trend Over Time" />

        {/* Population By State Table */}
        <PopulationTable title="Population by State" selectedYear={selectedYear || undefined} />

        {/* State Population Distribution Pie Chart */}
        <StatePieChart
          title="Population Distribution"
          selectedYear={selectedYear || undefined}
          selectedStates={selectedStates}
        />
      </Grid>
    </SpaceBetween>
  );
}
