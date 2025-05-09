// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { BitcoinErrorBoundary } from './components/bitcoin-error-boundary';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { Content } from './components/content';
import { BitcoinDashboardHeader, BitcoinInfo } from './components/header';
import { BitcoinDashboardSideNavigation } from './components/side-navigation';

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <BitcoinInfo />);
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
    appLayout.current?.focusToolsClose();
  };

  return (
    <HelpPanelProvider value={handleToolsContentChange}>
      <CustomAppLayout
        ref={appLayout}
        content={
          <BitcoinErrorBoundary>
            <SpaceBetween size="m">
              <BitcoinDashboardHeader
                actions={
                  <Button variant="primary" href="https://www.coingecko.com/en/coins/bitcoin" external>
                    View on CoinGecko
                  </Button>
                }
              />
              <Content />
            </SpaceBetween>
          </BitcoinErrorBoundary>
        }
        breadcrumbs={
          <Breadcrumbs
            items={[
              { text: 'Dashboard', href: '#/' },
              { text: 'Bitcoin Price', href: '#/bitcoin-dashboard' },
            ]}
          />
        }
        navigation={<BitcoinDashboardSideNavigation />}
        tools={toolsContent}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
      />
    </HelpPanelProvider>
  );
}
