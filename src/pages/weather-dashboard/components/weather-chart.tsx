// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';

import { TemperatureChart } from './temperature-chart';

interface WeatherChartProps {
  data: Array<{
    time: Date;
    temperature: number;
  }>;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    x: item.time,
    y: item.temperature,
  }));

  const domain: [number, number] = [
    Math.floor(Math.min(...data.map(item => item.temperature))),
    Math.ceil(Math.max(...data.map(item => item.temperature))),
  ];

  return (
    <Container
      header={
        <Header variant="h2" description="24-hour temperature forecast">
          Temperature
        </Header>
      }
    >
      <TemperatureChart data={chartData} domain={domain} />
    </Container>
  );
};
