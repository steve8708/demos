// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

export function WeatherHelpContent() {
  return (
    <div>
      <h2>About Weather Dashboard</h2>
      <p>
        This weather dashboard provides current conditions and forecasts using data from Open-Meteo, a free weather API
        service.
      </p>
      <h3>Features</h3>
      <ul>
        <li>Current weather conditions</li>
        <li>24-hour hourly forecast</li>
        <li>7-day daily forecast</li>
        <li>Location search and geolocation support</li>
      </ul>
      <h3>Data Source</h3>
      <p>
        Weather data is provided by <strong>Open-Meteo</strong>, which offers free access to weather APIs without
        requiring an API key.
      </p>
    </div>
  );
}
