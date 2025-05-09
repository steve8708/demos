// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { useQueryParams } from '../../common/use-query-params';
import { WeatherDashboardContent } from './components/content';
import { SearchPanel } from './components/search-panel';
import { WeatherDashboardHeader } from './components/header';
import { WeatherInfoPanel } from './components/weather-info-panel';
import { Location } from './utils/types';

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <WeatherInfoPanel />);
  const appLayout = useRef<AppLayoutProps.Ref>(null);
  const { queryParams, getQueryParam, setQueryParam } = useQueryParams();

  // Parse location from URL parameters
  const [location, setLocation] = useState<Location>({
    latitude: parseFloat(getQueryParam('lat') || '47.6062'),
    longitude: parseFloat(getQueryParam('lon') || '-122.3321'),
    name: getQueryParam('location') || 'Seattle, WA',
  });

  // Update location state when URL parameters change
  useEffect(() => {
    const lat = parseFloat(getQueryParam('lat') || '47.6062');
    const lon = parseFloat(getQueryParam('lon') || '-122.3321');
    const name = getQueryParam('location') || 'Seattle, WA';

    setLocation({
      latitude: lat,
      longitude: lon,
      name: name,
    });
  }, [getQueryParam, queryParams]);

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
    appLayout.current?.focusToolsClose();
  };

  const handleLocationChange = (newLocation: Location) => {
    setQueryParam('lat', newLocation.latitude.toString());
    setQueryParam('lon', newLocation.longitude.toString());
    setQueryParam('location', newLocation.name);
  };

  return (
    <HelpPanelProvider value={handleToolsContentChange}>
      <CustomAppLayout
        ref={appLayout}
        content={
          <SpaceBetween size="m">
            <WeatherDashboardHeader
              location={location.name}
              actions={<SearchPanel onLocationChange={handleLocationChange} />}
            />
            <WeatherDashboardContent location={location} />
          </SpaceBetween>
        }
        breadcrumbs={<Breadcrumbs items={[{ text: 'Weather Dashboard', href: '#/' }]} />}
        tools={toolsContent}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
        navigationHide={true}
      />
    </HelpPanelProvider>
  );
}
