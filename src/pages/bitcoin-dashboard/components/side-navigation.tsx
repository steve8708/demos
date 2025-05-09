// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation from '@cloudscape-design/components/side-navigation';
import { IconCoin, IconChartInfographic, IconInfoCircle } from '@tabler/icons-react';

export function BitcoinDashboardSideNavigation() {
  return (
    <SideNavigation
      activeHref="#/bitcoin-dashboard"
      header={{ text: 'Bitcoin Dashboard', href: '#/bitcoin-dashboard' }}
      items={[
        {
          type: 'section',
          text: 'Bitcoin Data',
          items: [
            {
              type: 'link',
              text: 'Price Dashboard',
              href: '#/bitcoin-dashboard',
              info: <IconCoin size={20} />,
            },
            {
              type: 'link',
              text: 'Historical Performance',
              href: '#/bitcoin-dashboard/history',
              info: <IconChartInfographic size={20} />,
            },
          ],
        },
        {
          type: 'section',
          text: 'Resources',
          items: [
            {
              type: 'link',
              text: 'About Bitcoin',
              href: '#/bitcoin-dashboard/about',
              info: <IconInfoCircle size={20} />,
            },
          ],
        },
      ]}
    />
  );
}
