// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Grid from '@cloudscape-design/components/grid';

import { Coordinates } from '../widgets/interfaces';
import { BaseStaticWidget } from '../widgets';
import { createCurrentWeatherWidget } from '../widgets/current-weather';
import { createDailyForecastWidget } from '../widgets/daily-forecast';
import { createTemperatureChartWidget } from '../widgets/temperature-chart';
import { createWeatherDetailsWidget } from '../widgets/weather-details';
import { createLocationInfoWidget } from '../widgets/location-info';

interface ContentProps {
  coordinates: Coordinates;
}

export function Content({ coordinates }: ContentProps) {
  // Create widgets with the current coordinates
  const currentWeatherWidget = createCurrentWeatherWidget(coordinates);
  const dailyForecastWidget = createDailyForecastWidget(coordinates);
  const temperatureChartWidget = createTemperatureChartWidget(coordinates);
  const weatherDetailsWidget = createWeatherDetailsWidget(coordinates);
  const locationInfoWidget = createLocationInfoWidget(coordinates);

  return (
    <Grid
      gridDefinition={[
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
      ]}
    >
      <BaseStaticWidget config={currentWeatherWidget.data} />
      <BaseStaticWidget config={weatherDetailsWidget.data} />
      <BaseStaticWidget config={locationInfoWidget.data} />
      <BaseStaticWidget config={dailyForecastWidget.data} />
      <BaseStaticWidget config={temperatureChartWidget.data} />
    </Grid>
  );
}
