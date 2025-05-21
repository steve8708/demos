// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';
import LineChart from '@cloudscape-design/components/line-chart';
import BarChart from '@cloudscape-design/components/bar-chart';

import { HourlyForecast, WEATHER_CODES } from '../types';
import { formatTime } from '../api';

interface WeatherChartProps {
  hourlyForecast: HourlyForecast;
}

export function WeatherChart({ hourlyForecast }: WeatherChartProps) {
  const [dataRange, setDataRange] = React.useState<'24h' | '48h' | 'all'>('24h');

  // Determine how many hours to display based on the selected range
  const hoursToShow = dataRange === '24h' ? 24 : dataRange === '48h' ? 48 : hourlyForecast.time.length;

  // Get only the timeframe we want to display
  const times = hourlyForecast.time.slice(0, hoursToShow);
  const temperatures = hourlyForecast.temperature_2m.slice(0, hoursToShow);
  const precipitation = hourlyForecast.precipitation.slice(0, hoursToShow);
  const windspeed = hourlyForecast.windspeed_10m.slice(0, hoursToShow);
  const weathercodes = hourlyForecast.weathercode.slice(0, hoursToShow);

  // Format the data for charts
  const temperatureData = times.map((time, index) => ({
    x: formatTime(time),
    y: temperatures[index],
  }));

  const precipitationData = times.map((time, index) => ({
    x: formatTime(time),
    y: precipitation[index],
  }));

  const windspeedData = times.map((time, index) => ({
    x: formatTime(time),
    y: windspeed[index],
  }));

  // Find min/max for y-axis scaling
  const minTemp = Math.floor(Math.min(...temperatures)) - 1;
  const maxTemp = Math.ceil(Math.max(...temperatures)) + 1;

  const maxPrecip = Math.max(...precipitation) > 0 ? Math.ceil(Math.max(...precipitation) * 1.1) : 1;

  const maxWind = Math.ceil(Math.max(...windspeed) * 1.1);

  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={
            <SegmentedControl
              selectedId={dataRange}
              onChange={({ detail }) => setDataRange(detail.selectedId as '24h' | '48h' | 'all')}
              options={[
                { id: '24h', text: '24 hours' },
                { id: '48h', text: '48 hours' },
                { id: 'all', text: '5 days' },
              ]}
            />
          }
        >
          Hourly Forecast
        </Header>
      }
    >
      <Tabs
        tabs={[
          {
            id: 'temperature',
            label: 'Temperature',
            content: (
              <Box padding={{ vertical: 'm' }}>
                <LineChart
                  series={[
                    {
                      title: 'Temperature',
                      type: 'line',
                      data: temperatureData,
                      valueFormatter: value => `${value}°C`,
                    },
                  ]}
                  xDomain={times.map(time => formatTime(time))}
                  yDomain={[minTemp, maxTemp]}
                  i18nStrings={{
                    xTickFormatter: value => value,
                    yTickFormatter: value => `${value}°C`,
                  }}
                  height={300}
                  hideFilter
                  hideLegend
                  xTitle="Time"
                  yTitle="Temperature (°C)"
                  xScaleType="categorical"
                />
              </Box>
            ),
          },
          {
            id: 'precipitation',
            label: 'Precipitation',
            content: (
              <Box padding={{ vertical: 'm' }}>
                <BarChart
                  series={[
                    {
                      title: 'Precipitation',
                      type: 'bar',
                      data: precipitationData,
                      valueFormatter: value => `${value} mm`,
                    },
                  ]}
                  xDomain={times.map(time => formatTime(time))}
                  yDomain={[0, maxPrecip]}
                  i18nStrings={{
                    xTickFormatter: value => value,
                    yTickFormatter: value => `${value} mm`,
                  }}
                  height={300}
                  hideFilter
                  hideLegend
                  xTitle="Time"
                  yTitle="Precipitation (mm)"
                  xScaleType="categorical"
                />
              </Box>
            ),
          },
          {
            id: 'wind',
            label: 'Wind',
            content: (
              <Box padding={{ vertical: 'm' }}>
                <LineChart
                  series={[
                    {
                      title: 'Wind Speed',
                      type: 'line',
                      data: windspeedData,
                      valueFormatter: value => `${value} km/h`,
                    },
                  ]}
                  xDomain={times.map(time => formatTime(time))}
                  yDomain={[0, maxWind]}
                  i18nStrings={{
                    xTickFormatter: value => value,
                    yTickFormatter: value => `${value} km/h`,
                  }}
                  height={300}
                  hideFilter
                  hideLegend
                  xTitle="Time"
                  yTitle="Wind Speed (km/h)"
                  xScaleType="categorical"
                />
              </Box>
            ),
          },
          {
            id: 'conditions',
            label: 'Conditions',
            content: (
              <Box padding={{ vertical: 'm' }}>
                <ColumnLayout columns={6} variant="text-grid">
                  {times.slice(0, 24).map((time, index) => {
                    const weatherCode = WEATHER_CODES[weathercodes[index]] || WEATHER_CODES[0];
                    return (
                      <Box textAlign="center" key={time}>
                        <SpaceBetween size="xxs">
                          <Box variant="small">{formatTime(time)}</Box>
                          <Box fontSize="display-l">
                            <Box>{weatherCode.icon && <i className={`icon ${weatherCode.icon}`} />}</Box>
                          </Box>
                          <Box variant="small">{weatherCode.description}</Box>
                        </SpaceBetween>
                      </Box>
                    );
                  })}
                </ColumnLayout>
              </Box>
            ),
          },
        ]}
      />
    </Container>
  );
}
