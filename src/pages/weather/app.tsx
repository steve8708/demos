// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { Content } from './components/content';
import { WeatherHeader } from './components/header';
import { WeatherSideNavigation } from './components/side-navigation';
import { WeatherHelpPanel } from './components/help-panel';
import { WeatherProvider } from './context/weather-context';

import '@cloudscape-design/global-styles/dark-mode-utils.css';

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <WeatherHelpPanel />);
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
    appLayout.current?.focusToolsClose();
  };

  return (
    <WeatherProvider>
      <HelpPanelProvider value={handleToolsContentChange}>
        <CustomAppLayout
          ref={appLayout}
          content={
            <SpaceBetween size="m">
              <WeatherHeader />
              <Content />
            </SpaceBetween>
          }
          breadcrumbs={<Breadcrumbs items={[{ text: 'Weather Dashboard', href: '#/weather' }]} />}
          navigation={<WeatherSideNavigation />}
          tools={toolsContent}
          toolsOpen={toolsOpen}
          onToolsChange={({ detail }) => setToolsOpen(detail.open)}
          notifications={<Notifications />}
        />
      </HelpPanelProvider>
    </WeatherProvider>
  );
}
