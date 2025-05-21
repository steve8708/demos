// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Grid from '@cloudscape-design/components/grid';

import { useWeatherContext } from '../context/weather-context';
import { BaseWeatherWidget } from '../widgets/base-widget';
import { currentWeather } from '../widgets/current-weather';
import { dailyForecast } from '../widgets/daily-forecast';
import { hourlyForecast } from '../widgets/hourly-forecast';
import { temperatureChart } from '../widgets/temperature-chart';
import { precipitationChart } from '../widgets/precipitation-chart';
import { weatherMap } from '../widgets/weather-map';
import { airQuality } from '../widgets/air-quality';
import { sunAndMoon } from '../widgets/sun-moon';

export function Content() {
  const { loading } = useWeatherContext();

  return (
    <Grid
      gridDefinition={[
        { colspan: { l: 8, m: 8, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 8, m: 8, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
      ]}
    >
      {loading ? (
        <div>Loading weather data...</div>
      ) : (
        [
          currentWeather,
          weatherMap,
          temperatureChart,
          hourlyForecast,
          precipitationChart,
          dailyForecast,
          airQuality,
          sunAndMoon,
        ].map((widget, index) => <BaseWeatherWidget key={index} config={widget.data} />)
      )}
    </Grid>
  );
}
