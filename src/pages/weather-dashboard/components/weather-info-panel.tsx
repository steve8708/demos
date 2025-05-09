// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import HelpPanel from '@cloudscape-design/components/help-panel';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { ExternalLinkGroup } from '../../commons';

export function WeatherInfoPanel() {
  return (
    <HelpPanel
      header={<h2>Weather Dashboard</h2>}
      footer={
        <ExternalLinkGroup
          items={[
            { href: 'https://open-meteo.com/en/docs', text: 'Open-Meteo API Documentation' },
            { href: 'https://open-meteo.com/en/docs/forecast-api', text: 'Forecast API Reference' },
            { href: 'https://github.com/open-meteo/open-meteo', text: 'Open-Meteo GitHub Repository' },
          ]}
        />
      }
    >
      <SpaceBetween size="m">
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

        <h3>Weather data</h3>
        <p>The dashboard displays:</p>
        <ul>
          <li>Temperature (in °C)</li>
          <li>Weather conditions (sunny, cloudy, rainy, etc.)</li>
          <li>Wind speed and direction</li>
          <li>Humidity levels</li>
          <li>Precipitation amounts and probabilities</li>
          <li>Sunrise and sunset times</li>
        </ul>

        <h3>Data source</h3>
        <p>
          All data is sourced from Open-Meteo's forecast API at{' '}
          <Link href="https://api.open-meteo.com/v1/forecast" external>
            api.open-meteo.com/v1/forecast
          </Link>
        </p>

        <h3>About Open-Meteo</h3>
        <p>
          Open-Meteo is a free, open-source weather API offering hyperlocal weather forecasts. The API combines data
          from multiple weather models and provides it in a simple, developer-friendly format without authentication or
          API keys needed for non-commercial use.
        </p>
      </SpaceBetween>
    </HelpPanel>
  );
}
