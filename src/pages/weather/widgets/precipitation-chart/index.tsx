// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import BarChart from '@cloudscape-design/components/bar-chart';

import { useWeatherContext } from '../../context/weather-context';
import { formatTime } from '../../utils/helpers';
import { WeatherWidgetConfig } from '../interfaces';

function PrecipitationChartHeader() {
  return <Header>Precipitation Forecast</Header>;
}

function PrecipitationChartContent() {
  const { weatherData, units, loading } = useWeatherContext();

  if (loading || !weatherData) {
    return (
      <Box textAlign="center" padding={{ vertical: 'xxl' }}>
        <StatusIndicator type="loading">Loading precipitation chart data</StatusIndicator>
      </Box>
    );
  }

  const { hourly } = weatherData;

  // Prepare data for the bar chart
  const times = hourly.time.slice(0, 24);
  const precipProbs = hourly.precipitation_probability.slice(0, 24);
  const precipAmounts = hourly.precipitation.slice(0, 24);

  const precipProbData = times.map((time: string, i: number) => ({
    x: formatTime(time),
    y: precipProbs[i],
  }));

  const precipAmountData = times.map((time: string, i: number) => ({
    x: formatTime(time),
    y: parseFloat(precipAmounts[i].toFixed(1)),
  }));

  return (
    <BarChart
      series={[
        {
          title: 'Probability (%)',
          type: 'bar',
          data: precipProbData,
          valueFormatter: (value: number) => `${value}%`,
          color: 'blue',
        },
        {
          title: `Amount (${units === 'metric' ? 'mm' : 'in'})`,
          type: 'bar',
          data: precipAmountData,
          valueFormatter: (value: number) => `${value} ${units === 'metric' ? 'mm' : 'in'}`,
          color: 'purple',
        },
      ]}
      xDomain={times.slice(0, 24).map((time: string) => formatTime(time))}
      yDomain={[0, 100]}
      i18nStrings={{
        xTickFormatter: (value: string) => value,
        yTickFormatter: (value: number) => `${value}`,
      }}
      ariaLabel="Precipitation forecast chart"
      height={300}
      hideFilter
      hideLegend={false}
      horizontalBars={false}
      stackedBars={false}
      statusType="finished"
      empty={
        <Box textAlign="center" color="inherit">
          <b>No data available</b>
          <Box variant="p" color="inherit">
            There is no data available for the selected time period.
          </Box>
        </Box>
      }
      noMatch={
        <Box textAlign="center" color="inherit">
          <b>No matching data</b>
          <Box variant="p" color="inherit">
            There is no matching data for the selected filters.
          </Box>
        </Box>
      }
    />
  );
}

export const precipitationChart: WeatherWidgetConfig = {
  data: {
    title: 'Precipitation Chart',
    description: 'Precipitation forecast chart',
    header: PrecipitationChartHeader,
    content: PrecipitationChartContent,
  },
};
