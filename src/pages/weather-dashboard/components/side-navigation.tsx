// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation from '@cloudscape-design/components/side-navigation';

import { SideNavigationProps } from '@cloudscape-design/components/side-navigation';

export function WeatherSideNavigation() {
  const handleFollow: SideNavigationProps['onFollow'] = event => {
    // This is just a demo, so we prevent navigation
    event.preventDefault();
  };

  return (
    <SideNavigation
      activeHref="#/"
      header={{ href: '#/', text: 'Weather Service' }}
      onFollow={handleFollow}
      items={[
        { type: 'link', text: 'Dashboard', href: '#/' },
        { type: 'divider' },
        {
          type: 'section',
          text: 'Locations',
          items: [
            { type: 'link', text: 'New York', href: '#/locations/new-york' },
            { type: 'link', text: 'London', href: '#/locations/london' },
            { type: 'link', text: 'Tokyo', href: '#/locations/tokyo' },
            { type: 'link', text: 'Sydney', href: '#/locations/sydney' },
          ],
        },
        { type: 'divider' },
        {
          type: 'section',
          text: 'Weather Data',
          items: [
            { type: 'link', text: 'Current Conditions', href: '#/current' },
            { type: 'link', text: 'Forecasts', href: '#/forecasts' },
            { type: 'link', text: 'Historical Data', href: '#/historical' },
            { type: 'link', text: 'Alerts', href: '#/alerts' },
          ],
        },
        { type: 'divider' },
        {
          type: 'section',
          text: 'Settings',
          items: [
            { type: 'link', text: 'Preferences', href: '#/preferences' },
            { type: 'link', text: 'API Configuration', href: '#/api-config' },
          ],
        },
      ]}
    />
  );
}
