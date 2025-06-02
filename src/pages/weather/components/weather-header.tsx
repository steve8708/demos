// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';

interface WeatherHeaderProps {
  actions?: React.ReactNode;
}

export function WeatherHeader({ actions }: WeatherHeaderProps) {
  return (
    <Header
      variant="h1"
      description="Real-time weather information and 7-day forecast powered by Open Meteo API"
      actions={actions}
    >
      Weather Dashboard
    </Header>
  );
}
