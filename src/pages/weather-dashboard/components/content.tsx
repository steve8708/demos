// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Grid from '@cloudscape-design/components/grid';

import {
  BaseWeatherWidget,
  currentWeather,
  forecast,
  temperature,
  precipitation,
  wind,
  humidity,
  weatherAlerts,
  locations,
} from '../widgets';

export function Content() {
  return (
    <Grid
      gridDefinition={[
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 8, m: 8, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 12, m: 12, default: 12 } },
      ]}
    >
      {[currentWeather, forecast, temperature, weatherAlerts, precipitation, wind, humidity, locations].map(
        (widget, index) => (
          <BaseWeatherWidget key={index} config={widget.data} />
        ),
      )}
    </Grid>
  );
}
