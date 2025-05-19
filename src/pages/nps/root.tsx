// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Flashbar from '@cloudscape-design/components/flashbar';
import Button from '@cloudscape-design/components/button';
import Select from '@cloudscape-design/components/select';
import Box from '@cloudscape-design/components/box';
import { useDisclaimerFlashbarItem } from '../commons/disclaimer-flashbar-item';

import { DashboardContent } from './components/dashboard-content';
import { fetchParks } from './services/nps-api';
import { Park } from './types';

export function NPSDashboard() {
  const [disclaimerDismissed, dismissDisclaimer] = useState(false);
  const disclaimerItem = useDisclaimerFlashbarItem(() => dismissDisclaimer(true));

  const [selectedPark, setSelectedPark] = useState<{ label: string; value: string } | null>(null);
  const [parks, setParks] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParks = async () => {
      try {
        setLoading(true);
        const parksData = await fetchParks();

        // Map the parks data to the format expected by the Select component
        const parkOptions = parksData.data.map((park: Park) => ({
          label: park.fullName,
          value: park.parkCode,
        }));

        setParks(parkOptions);

        // If there are parks available, select the first one by default
        if (parkOptions.length > 0) {
          setSelectedPark(parkOptions[0]);
        }
      } catch (err) {
        console.error('Failed to load parks:', err);
        setError('Failed to load National Parks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadParks();
  }, []);

  const handleParkChange = (option: { label: string; value: string } | null) => {
    setSelectedPark(option);
  };

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <SpaceBetween size="m">
              <Header
                variant="h1"
                actions={
                  <Button
                    href="https://www.nps.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    iconAlign="right"
                    iconName="external"
                  >
                    Visit NPS Website
                  </Button>
                }
              >
                National Parks Service Dashboard
              </Header>

              {!disclaimerDismissed && disclaimerItem && <Flashbar items={[disclaimerItem]} />}

              {error && (
                <Flashbar
                  items={[
                    {
                      type: 'error',
                      content: error,
                      dismissible: true,
                      onDismiss: () => setError(null),
                    },
                  ]}
                />
              )}

              <Box padding={{ top: 's', bottom: 's' }}>
                <SpaceBetween size="m" direction="horizontal" alignItems="center">
                  <Box fontSize="heading-m">Select a National Park:</Box>
                  <div style={{ width: '350px' }}>
                    <Select
                      selectedOption={selectedPark}
                      onChange={({ detail }) => handleParkChange(detail.selectedOption)}
                      options={parks}
                      placeholder="Choose a park"
                      filteringType="auto"
                      statusType={loading ? 'loading' : 'finished'}
                      loadingText="Loading parks"
                      emptyText="No parks found"
                      disabled={loading}
                    />
                  </div>
                </SpaceBetween>
              </Box>
            </SpaceBetween>
          }
        >
          {selectedPark ? (
            <DashboardContent parkCode={selectedPark.value} parkName={selectedPark.label} />
          ) : (
            <Box textAlign="center" padding={{ top: 'xxl', bottom: 'xxl' }}>
              {loading ? (
                <Box variant="h3">Loading National Parks...</Box>
              ) : (
                <Box variant="h3">Select a park to view its information</Box>
              )}
            </Box>
          )}
        </ContentLayout>
      }
    />
  );
}
