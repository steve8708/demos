// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SideNavigation from '@cloudscape-design/components/side-navigation';

export function DashboardSideNavigation() {
  return (
    <SideNavigation
      activeHref="#/random-users"
      header={{ text: 'Random User Demo', href: '#/' }}
      items={[
        { type: 'link', text: 'Dashboard', href: '#/random-users' },
        { type: 'divider' },
        {
          type: 'link',
          text: 'Documentation',
          href: 'https://randomuser.me/documentation',
          external: true,
        },
        {
          type: 'link',
          text: 'API',
          href: 'https://randomuser.me/api',
          external: true,
        },
      ]}
    />
  );
}
