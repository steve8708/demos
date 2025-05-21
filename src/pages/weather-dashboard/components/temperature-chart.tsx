// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import LineChart from '@cloudscape-design/components/line-chart';

interface TemperatureChartProps {
  data: Array<{
    x: Date;
    y: number;
  }>;
  domain?: [number, number];
  height?: number;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, domain, height = 120 }) => {
  return (
    <Box margin={{ bottom: 'l' }}>
      <LineChart
        series={[
          {
            title: 'Temperature',
            type: 'line',
            data: data,
            valueFormatter: value => value.toFixed(1) + '°',
          },
        ]}
        xDomain={[data[0]?.x ?? new Date(), data[data.length - 1]?.x ?? new Date()]}
        yDomain={domain}
        height={height}
        hideFilter
        hideLegend
        xScaleType="time"
        i18nStrings={{
          xTickFormatter: e =>
            e
              .toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })
              .toLowerCase(),
        }}
      />
    </Box>
  );
};
