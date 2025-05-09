// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import BarChart from '@cloudscape-design/components/bar-chart';
import LineChart from '@cloudscape-design/components/line-chart';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';

import { HourlyForecast } from '../utils/types';
import { formatHour } from '../utils/api';

interface HourlyForecastChartProps {
  hourlyData: HourlyForecast[];
}

export function HourlyForecastChart({ hourlyData }: HourlyForecastChartProps) {
  const [selectedMetric, setSelectedMetric] = React.useState('temperature');

  // Format data for temperature chart
  const temperatureData = {
    series: [
      {
        title: 'Temperature',
        type: 'line',
        data: hourlyData.map(hour => ({
          x: formatHour(hour.time),
          y: hour.temperature,
        })),
        valueFormatter: (value: number) => `${value.toFixed(1)}°C`,
        color: '#FF9900', // AWS orange color
      },
    ],
    xDomain: hourlyData.map(hour => formatHour(hour.time)),
    yDomain: [Math.min(...hourlyData.map(h => h.temperature)) - 2, Math.max(...hourlyData.map(h => h.temperature)) + 2],
  };

  // Format data for precipitation chart
  const precipitationData = {
    series: [
      {
        title: 'Precipitation',
        type: 'bar',
        data: hourlyData.map(hour => ({
          x: formatHour(hour.time),
          y: hour.precipitation,
        })),
        valueFormatter: (value: number) => `${value.toFixed(1)} mm`,
        color: '#0073BB', // Blue color for precipitation
      },
    ],
    xDomain: hourlyData.map(hour => formatHour(hour.time)),
    yDomain: [0, Math.max(...hourlyData.map(h => h.precipitation)) + 0.5],
  };

  // Format data for humidity chart
  const humidityData = {
    series: [
      {
        title: 'Humidity',
        type: 'line',
        data: hourlyData.map(hour => ({
          x: formatHour(hour.time),
          y: hour.humidity,
        })),
        valueFormatter: (value: number) => `${value.toFixed(0)}%`,
        color: '#16A2C8', // Teal color for humidity
      },
    ],
    xDomain: hourlyData.map(hour => formatHour(hour.time)),
    yDomain: [0, 100],
  };

  // Format data for wind speed chart
  const windSpeedData = {
    series: [
      {
        title: 'Wind Speed',
        type: 'bar',
        data: hourlyData.map(hour => ({
          x: formatHour(hour.time),
          y: hour.windSpeed,
        })),
        valueFormatter: (value: number) => `${value.toFixed(1)} km/h`,
        color: '#879596', // Gray color for wind
      },
    ],
    xDomain: hourlyData.map(hour => formatHour(hour.time)),
    yDomain: [0, Math.max(...hourlyData.map(h => h.windSpeed)) + 5],
  };

  const renderChart = () => {
    switch (selectedMetric) {
      case 'temperature':
        return (
          <LineChart
            series={temperatureData.series}
            xDomain={temperatureData.xDomain}
            yDomain={temperatureData.yDomain}
            xTitle="Hour"
            yTitle="Temperature (°C)"
            hideFilter
            height={300}
            xScaleType="categorical"
            ariaLabel="Hourly temperature forecast"
            i18nStrings={{
              filterLabel: 'Filter',
              filterPlaceholder: 'Filter data',
              xTickFormatter: value => value,
            }}
            emphasizeBaselineZero={false}
            highlightedSeries={0}
            statusType="finished"
          />
        );
      case 'precipitation':
        return (
          <BarChart
            series={precipitationData.series}
            xDomain={precipitationData.xDomain}
            yDomain={precipitationData.yDomain}
            xTitle="Hour"
            yTitle="Precipitation (mm)"
            hideFilter
            height={300}
            xScaleType="categorical"
            ariaLabel="Hourly precipitation forecast"
            i18nStrings={{
              filterLabel: 'Filter',
              filterPlaceholder: 'Filter data',
              xTickFormatter: value => value,
            }}
            emphasizeBaselineZero={true}
            highlightedSeries={0}
            statusType="finished"
          />
        );
      case 'humidity':
        return (
          <LineChart
            series={humidityData.series}
            xDomain={humidityData.xDomain}
            yDomain={humidityData.yDomain}
            xTitle="Hour"
            yTitle="Humidity (%)"
            hideFilter
            height={300}
            xScaleType="categorical"
            ariaLabel="Hourly humidity forecast"
            i18nStrings={{
              filterLabel: 'Filter',
              filterPlaceholder: 'Filter data',
              xTickFormatter: value => value,
            }}
            emphasizeBaselineZero={false}
            highlightedSeries={0}
            statusType="finished"
          />
        );
      case 'wind':
        return (
          <BarChart
            series={windSpeedData.series}
            xDomain={windSpeedData.xDomain}
            yDomain={windSpeedData.yDomain}
            xTitle="Hour"
            yTitle="Wind Speed (km/h)"
            hideFilter
            height={300}
            xScaleType="categorical"
            ariaLabel="Hourly wind speed forecast"
            i18nStrings={{
              filterLabel: 'Filter',
              filterPlaceholder: 'Filter data',
              xTickFormatter: value => value,
            }}
            emphasizeBaselineZero={true}
            highlightedSeries={0}
            statusType="finished"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container header={<Header variant="h2">24-hour forecast</Header>}>
      <SpaceBetween size="l">
        <Tabs
          tabs={[
            {
              id: 'temperature',
              label: 'Temperature',
              content: (
                <Grid gridDefinition={[{ colspan: { default: 12 } }]}>
                  <Box>{renderChart()}</Box>
                </Grid>
              ),
            },
            {
              id: 'precipitation',
              label: 'Precipitation',
              content: (
                <Grid gridDefinition={[{ colspan: { default: 12 } }]}>
                  <Box>{renderChart()}</Box>
                </Grid>
              ),
            },
            {
              id: 'humidity',
              label: 'Humidity',
              content: (
                <Grid gridDefinition={[{ colspan: { default: 12 } }]}>
                  <Box>{renderChart()}</Box>
                </Grid>
              ),
            },
            {
              id: 'wind',
              label: 'Wind',
              content: (
                <Grid gridDefinition={[{ colspan: { default: 12 } }]}>
                  <Box>{renderChart()}</Box>
                </Grid>
              ),
            },
          ]}
          activeTabId={selectedMetric}
          onChange={({ detail }) => setSelectedMetric(detail.activeTabId)}
          ariaLabel="24-hour weather metrics"
        />
      </SpaceBetween>
    </Container>
  );
}
