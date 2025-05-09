// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { Content } from './components/content';
import { DashboardHeader } from './components/header';
import { DashboardSideNavigation } from './components/side-navigation';
import { BitcoinDashboardInfo } from './components/dashboard-info';
import { useBitcoinPrice } from './hooks/use-bitcoin-price';

import '@cloudscape-design/global-styles/dark-mode-utils.css';

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <BitcoinDashboardInfo />);
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const { priceData, loading, error, priceHistory, refreshPriceData } = useBitcoinPrice();

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
          <SpaceBetween size="m">
            <DashboardHeader
              onRefresh={refreshPriceData}
              loading={loading}
              lastUpdated={priceData?.time.updatedISO || null}
            />
            <Content priceData={priceData} loading={loading} error={error} priceHistory={priceHistory} />
          </SpaceBetween>
        }
        breadcrumbs={<Breadcrumbs items={[{ text: 'Bitcoin Price Dashboard', href: '#/' }]} />}
        navigation={<DashboardSideNavigation />}
        tools={toolsContent}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
      />
    </HelpPanelProvider>
  );
}
