// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { Navigation } from '../../commons/navigation';
import { SideNavigationProps } from '@cloudscape-design/components/side-navigation';

const navHeader = { text: 'Weather Service', href: '#/weather' };
const navItems: SideNavigationProps['items'] = [
  {
    type: 'section',
    text: 'Weather dashboards',
    items: [
      { type: 'link', text: 'World weather', href: '#/weather' },
      { type: 'link', text: 'Saved locations', href: '#/weather/saved' },
      { type: 'link', text: 'Weather maps', href: '#/weather/maps' },
    ],
  },
  {
    type: 'section',
    text: 'Weather analytics',
    items: [
      { type: 'link', text: 'Historical data', href: '#/weather/historical' },
      { type: 'link', text: 'Weather trends', href: '#/weather/trends' },
      { type: 'link', text: 'Climate predictions', href: '#/weather/predictions' },
    ],
  },
];

interface WeatherSideNavigationProps {
  activeHref?: string;
}

export function WeatherSideNavigation({ activeHref }: WeatherSideNavigationProps) {
  return <Navigation activeHref={activeHref} header={navHeader} items={navItems} />;
}
