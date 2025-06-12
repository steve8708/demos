// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';

interface HumidityMeterProps {
  humidity: number;
  color: string;
}

export function HumidityMeter({ humidity, color }: HumidityMeterProps) {
  const meterWidth = 200;
  const fillWidth = (humidity / 100) * meterWidth;

  return (
    <Box textAlign="center" margin={{ bottom: 'l' }}>
      <div
        style={{
          width: `${meterWidth}px`,
          height: '20px',
          backgroundColor: '#f1f1f1',
          borderRadius: '10px',
          position: 'relative',
          margin: '0 auto',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${fillWidth}px`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '10px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <Box variant="small" margin={{ top: 'xs' }}>
        Humidity Level
      </Box>
    </Box>
  );
}
