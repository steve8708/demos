// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import HelpPanel from '@cloudscape-design/components/help-panel';

import { ExternalLinkGroup, InfoLink, useHelpPanel } from '../../commons';

export function USPopulationDashboardMainInfo() {
  return (
    <HelpPanel
      header={<h2>US Population Dashboard</h2>}
      footer={
        <ExternalLinkGroup
          items={[
            { href: 'https://datausa.io/about/api/', text: 'DataUSA API Documentation' },
            { href: 'https://github.com/DataUSA/datausa-api/wiki', text: 'DataUSA API Wiki' },
            { href: 'https://www.census.gov/', text: 'US Census Bureau' },
          ]}
        />
      }
    >
      <p>
        This dashboard displays population data for the United States, sourced from the DataUSA API. The data includes
        national population trends over time and population statistics by state.
      </p>
      <p>
        <strong>Features:</strong>
      </p>
      <ul>
        <li>View total US population and growth trends</li>
        <li>Compare population data across different states</li>
        <li>Analyze population changes over time</li>
        <li>Filter data by year and state</li>
      </ul>
      <p>The data is sourced from the US Census Bureau and made available through the DataUSA API.</p>
    </HelpPanel>
  );
}

export function USPopulationDashboardHeader({ actions }: { actions?: React.ReactNode }) {
  const loadHelpPanelContent = useHelpPanel();
  return (
    <Header
      variant="h1"
      info={<InfoLink onFollow={() => loadHelpPanelContent(<USPopulationDashboardMainInfo />)} />}
      actions={actions}
    >
      US Population Dashboard
    </Header>
  );
}
