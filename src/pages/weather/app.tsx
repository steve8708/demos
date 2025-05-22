// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { Content } from './components/content';
import { WeatherDashboardHeader, WeatherDashboardMainInfo } from './components/header';
import { WeatherDashboardSideNavigation } from './components/side-navigation';

import '@cloudscape-design/global-styles/dark-mode-utils.css';

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <WeatherDashboardMainInfo />);
  const appLayout = useRef<AppLayoutProps.Ref>(null);
  const [coordinates, setCoordinates] = useState({
    latitude: 47.6062,
    longitude: -122.3321,
    name: 'Seattle, WA',
  });

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
    appLayout.current?.focusToolsClose();
  };

  const refreshWeather = () => {
    // This will trigger a re-render, causing the weather data to be refreshed
    setCoordinates({ ...coordinates });
  };

  return (
    <HelpPanelProvider value={handleToolsContentChange}>
      <CustomAppLayout
        ref={appLayout}
        content={
          <SpaceBetween size="m">
            <WeatherDashboardHeader
              coordinates={coordinates}
              onCoordinatesChange={setCoordinates}
              actions={
                <Button variant="primary" onClick={refreshWeather}>
                  Refresh Weather
                </Button>
              }
            />
            <Content coordinates={coordinates} />
          </SpaceBetween>
        }
        breadcrumbs={<Breadcrumbs items={[{ text: 'Weather Dashboard', href: '#/weather' }]} />}
        navigation={<WeatherDashboardSideNavigation />}
        tools={toolsContent}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
      />
    </HelpPanelProvider>
  );
}
