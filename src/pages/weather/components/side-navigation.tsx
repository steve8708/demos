// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation, { SideNavigationProps } from '@cloudscape-design/components/side-navigation';

export function WeatherDashboardSideNavigation() {
  const navItems: SideNavigationProps['items'] = [
    {
      type: 'section',
      text: 'Weather Dashboard',
      items: [
        { type: 'link', text: 'Current Weather', href: '#/weather' },
        { type: 'link', text: 'Forecast', href: '#/weather?view=forecast' },
        { type: 'link', text: 'Historical Data', href: '#/weather?view=historical' },
      ],
    },
    {
      type: 'section',
      text: 'Popular Locations',
      items: [
        {
          type: 'link',
          text: 'Seattle',
          href: '#/weather?lat=47.6062&lng=-122.3321&name=Seattle,WA,United States',
        },
        {
          type: 'link',
          text: 'New York',
          href: '#/weather?lat=40.7128&lng=-74.0060&name=New York,NY,United States',
        },
        {
          type: 'link',
          text: 'London',
          href: '#/weather?lat=51.5074&lng=-0.1278&name=London,England,United Kingdom',
        },
        {
          type: 'link',
          text: 'Tokyo',
          href: '#/weather?lat=35.6762&lng=139.6503&name=Tokyo,Tokyo,Japan',
        },
        {
          type: 'link',
          text: 'Sydney',
          href: '#/weather?lat=-33.8688&lng=151.2093&name=Sydney,New South Wales,Australia',
        },
        {
          type: 'link',
          text: 'Rio de Janeiro',
          href: '#/weather?lat=-22.9068&lng=-43.1729&name=Rio de Janeiro,Rio de Janeiro,Brazil',
        },
      ],
    },
    {
      type: 'section',
      text: 'Resources',
      items: [
        { type: 'link', text: 'Open Meteo API', href: 'https://open-meteo.com/en/docs', external: true },
        {
          type: 'link',
          text: 'Open Meteo Geocoding API',
          href: 'https://open-meteo.com/en/docs/geocoding-api',
          external: true,
        },
        { type: 'link', text: 'Weather Symbols', href: 'https://open-meteo.com/en/docs/weather-api', external: true },
      ],
    },
  ];

  return (
    <SideNavigation items={navItems} activeHref="#/weather" header={{ text: 'Weather Dashboard', href: '#/weather' }} />
  );
}
