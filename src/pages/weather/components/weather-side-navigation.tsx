// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation from '@cloudscape-design/components/side-navigation';

export function WeatherSideNavigation() {
  return (
    <SideNavigation
      activeHref="#/weather"
      header={{ href: '#/', text: 'Weather Service' }}
      items={[
        { type: 'link', text: 'Dashboard', href: '#/weather' },
        { type: 'divider' },
        {
          type: 'link',
          text: 'Current Weather',
          href: '#/weather#current',
        },
        {
          type: 'link',
          text: 'Forecast',
          href: '#/weather#forecast',
        },
        { type: 'divider' },
        {
          type: 'link',
          text: 'Open Meteo API',
          href: 'https://open-meteo.com/',
          external: true,
          externalIconAriaLabel: 'Opens in a new tab',
        },
        {
          type: 'link',
          text: 'Documentation',
          href: 'https://open-meteo.com/en/docs',
          external: true,
          externalIconAriaLabel: 'Opens in a new tab',
        },
      ]}
    />
  );
}
