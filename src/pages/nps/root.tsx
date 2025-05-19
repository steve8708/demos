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
import Alert from '@cloudscape-design/components/alert';
import Modal from '@cloudscape-design/components/modal';
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
  const [deletedParks, setDeletedParks] = useState<string[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadParks = async () => {
      try {
        setLoading(true);
        const parksData = await fetchParks();

        // Map the parks data to the format expected by the Select component
        const parkOptions = parksData.data
          .filter((park: Park) => !deletedParks.includes(park.parkCode))
          .map((park: Park) => ({
            label: park.fullName,
            value: park.parkCode,
          }));

        setParks(parkOptions);

        // If there are parks available, select the first one by default
        if (parkOptions.length > 0 && !selectedPark) {
          setSelectedPark(parkOptions[0]);
        } else if (selectedPark && deletedParks.includes(selectedPark.value)) {
          // If the currently selected park was deleted, reset selection
          setSelectedPark(parkOptions.length > 0 ? parkOptions[0] : null);
        }
      } catch (err) {
        console.error('Failed to load parks:', err);
        setError('Failed to load National Parks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadParks();
  }, [deletedParks]);

  const handleParkChange = (option: { label: string; value: string } | null) => {
    setSelectedPark(option);
  };

  const handleDeletePark = () => {
    if (selectedPark) {
      setIsDeleteModalVisible(true);
    }
  };

  const confirmDeletePark = () => {
    if (selectedPark) {
      // Add the current park to the deleted parks list
      setDeletedParks(prev => [...prev, selectedPark.value]);
      // Show success message
      setDeleteSuccess(`${selectedPark.label} has been deleted.`);
      // Close the modal
      setIsDeleteModalVisible(false);

      // Clear the success message after a few seconds
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 5000);
    }
  };

  const cancelDeletePark = () => {
    setIsDeleteModalVisible(false);
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
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button
                      href="https://www.nps.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      iconAlign="right"
                      iconName="external"
                    >
                      Visit NPS Website
                    </Button>
                  </SpaceBetween>
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

              {deleteSuccess && (
                <Flashbar
                  items={[
                    {
                      type: 'success',
                      content: deleteSuccess,
                      dismissible: true,
                      onDismiss: () => setDeleteSuccess(null),
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
                  {selectedPark && (
                    <Button variant="normal" iconName="remove" onClick={handleDeletePark}>
                      Delete Park
                    </Button>
                  )}
                </SpaceBetween>
              </Box>
            </SpaceBetween>
          }
        >
          {selectedPark ? (
            <DashboardContent parkCode={selectedPark.value} parkName={selectedPark.label} />
          ) : deletedParks.length > 0 ? (
            <Box textAlign="center" padding={{ top: 'xxl', bottom: 'xxl' }}>
              <Alert type="info" header="No parks available">
                {parks.length === 0
                  ? "You've deleted all available parks. Please refresh the page to reset the dashboard."
                  : 'The selected park was deleted. Please select another park from the dropdown.'}
              </Alert>
            </Box>
          ) : (
            <Box textAlign="center" padding={{ top: 'xxl', bottom: 'xxl' }}>
              {loading ? (
                <Box variant="h3">Loading National Parks...</Box>
              ) : (
                <Box variant="h3">Select a park to view its information</Box>
              )}
            </Box>
          )}

          {/* Confirmation Modal for Park Deletion */}
          <Modal
            visible={isDeleteModalVisible}
            onDismiss={cancelDeletePark}
            header="Confirm Deletion"
            closeAriaLabel="Close modal"
            footer={
              <Box float="right">
                <SpaceBetween direction="horizontal" size="xs">
                  <Button variant="link" onClick={cancelDeletePark}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={confirmDeletePark}>
                    Delete
                  </Button>
                </SpaceBetween>
              </Box>
            }
          >
            {selectedPark && (
              <Alert type="warning" header="Warning">
                Are you sure you want to delete <b>{selectedPark.label}</b>? This action cannot be undone.
              </Alert>
            )}
          </Modal>
        </ContentLayout>
      }
    />
  );
}
