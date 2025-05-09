// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation from '@cloudscape-design/components/side-navigation';

export function DashboardSideNavigation() {
  return (
    <SideNavigation
      activeHref="#/bitcoin"
      header={{ text: 'Bitcoin Price Demo', href: '#/' }}
      items={[
        { type: 'link', text: 'Dashboard', href: '#/bitcoin' },
        { type: 'divider' },
        {
          type: 'link',
          text: 'CoinDesk',
          href: 'https://www.coindesk.com/price/bitcoin',
          external: true,
        },
        {
          type: 'link',
          text: 'API Documentation',
          href: 'https://www.coindesk.com/coindesk-api',
          external: true,
        },
      ]}
    />
  );
}
