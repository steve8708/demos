// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { Content } from './components/content';
import { WeatherHeader, WeatherMainInfo } from './components/header';
import { WeatherSideNavigation } from './components/side-navigation';
import { WeatherProvider, useWeatherContext } from './context/weather-context';
import { WeatherLocation } from './widgets/interfaces';

import '@cloudscape-design/global-styles/dark-mode-utils.css';

function WeatherApp() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <WeatherMainInfo />);
  const appLayout = useRef<AppLayoutProps.Ref>(null);
  const { currentLocation, setCurrentLocation, searchLoading, setSearchLoading } = useWeatherContext();

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
    appLayout.current?.focusToolsClose();
  };

  const handleLocationSelect = async (location: WeatherLocation) => {
    setSearchLoading(true);
    try {
      setCurrentLocation(location);
      // The widgets will automatically update due to the context change
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <HelpPanelProvider value={handleToolsContentChange}>
      <CustomAppLayout
        ref={appLayout}
        content={
          <SpaceBetween size="m">
            <WeatherHeader
              actions={<Button variant="primary">Add Location</Button>}
              onLocationSelect={handleLocationSelect}
              searchLoading={searchLoading}
            />
            <Content />
          </SpaceBetween>
        }
        breadcrumbs={
          <Breadcrumbs
            items={[
              { text: 'Weather Dashboard', href: '#/' },
              { text: currentLocation.name, href: '#/' },
            ]}
          />
        }
        navigation={<WeatherSideNavigation />}
        tools={toolsContent}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
      />
    </HelpPanelProvider>
  );
}

export function App() {
  return (
    <WeatherProvider>
      <WeatherApp />
    </WeatherProvider>
  );
}
