// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';

import { Navigation } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import WeatherDashboard from './index';

export default function WeatherDashboardRoot() {
  return (
    <CustomAppLayout
      content={<WeatherDashboard />}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Home', href: '/' },
            { text: 'Weather Dashboard', href: '/weather' },
          ]}
          expandAriaLabel="Show path"
          ariaLabel="Breadcrumbs"
        />
      }
      navigation={<Navigation activeHref="/weather" />}
      navigationOpen={false}
      toolsHide={true}
    />
  );
}
