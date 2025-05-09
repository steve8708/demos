// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import HelpPanel from '@cloudscape-design/components/help-panel';
import Link from '@cloudscape-design/components/link';

import { ExternalLinkGroup, InfoLink, useHelpPanel } from '../../commons';

export function WeatherInfoPanel() {
  return (
    <HelpPanel
      header={<h2>Weather Dashboard</h2>}
      footer={
        <ExternalLinkGroup
          items={[
            { href: 'https://open-meteo.com/en/docs', text: 'Open-Meteo API Documentation' },
            { href: 'https://open-meteo.com/en/docs/forecast-api', text: 'Forecast API Reference' },
          ]}
        />
      }
    >
      <p>
        This weather dashboard uses the Open-Meteo API to provide accurate weather forecasts. Open-Meteo is an
        open-source weather API offering free access to weather forecast data worldwide.
      </p>
      <h3>Features</h3>
      <ul>
        <li>Current weather conditions</li>
        <li>7-day forecast</li>
        <li>Hourly temperature and precipitation charts</li>
        <li>Location search</li>
      </ul>
      <p>
        The dashboard displays temperature, precipitation, wind speed, humidity, and more. All data is sourced from
        Open-Meteo's forecast API at{' '}
        <Link href="https://api.open-meteo.com/v1/forecast" external>
          api.open-meteo.com/v1/forecast
        </Link>
        .
      </p>
    </HelpPanel>
  );
}

export function WeatherDashboardHeader({ location, actions }: { location: string; actions: React.ReactNode }) {
  const loadHelpPanelContent = useHelpPanel();
  return (
    <Header
      variant="h1"
      info={<InfoLink onFollow={() => loadHelpPanelContent(<WeatherInfoPanel />)} />}
      actions={actions}
    >
      Weather Dashboard - {location}
    </Header>
  );
}
