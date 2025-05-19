// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { fetchAlerts } from '../services/nps-api';
import { Alert as AlertType } from '../types';

interface AlertsWidgetProps {
  parkCode: string;
}

export function AlertsWidget({ parkCode }: AlertsWidgetProps) {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAlerts(parkCode);
        setAlerts(response.data || []);
      } catch (err) {
        console.error('Failed to load alerts:', err);
        setError('Failed to load alerts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, [parkCode]);

  // Function to determine status type based on alert category
  const getAlertStatus = (category: string) => {
    switch (category.toLowerCase()) {
      case 'danger':
        return 'error';
      case 'caution':
      case 'park closure':
      case 'information':
        return 'warning';
      default:
        return 'info';
    }
  };

  // Truncate long text
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Container header={<Header variant="h2">Current Alerts</Header>}>
        <Box textAlign="center" padding={{ top: 'l', bottom: 'l' }}>
          <Spinner size="normal" />
          <Box variant="p" padding={{ top: 's' }}>
            Loading alerts...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Current Alerts</Header>}>
        <Alert type="error" header="Error loading alerts">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      header={
        <Header variant="h2" counter={alerts.length > 0 ? `(${alerts.length})` : undefined}>
          Current Alerts
        </Header>
      }
    >
      {alerts.length === 0 ? (
        <Box textAlign="center" padding={{ top: 'm', bottom: 'm' }}>
          <StatusIndicator type="success" />
          <Box variant="p" padding={{ top: 's' }}>
            No current alerts for this park.
          </Box>
        </Box>
      ) : (
        <SpaceBetween size="m">
          {alerts.map(alert => (
            <div key={alert.id}>
              <Box variant="h5">
                <StatusIndicator type={getAlertStatus(alert.category)} /> {alert.title}
              </Box>
              <Box variant="p" padding={{ top: 'xxs' }}>
                {truncateText(alert.description)}
                {alert.description.length > 100 && (
                  <Link href={alert.url} external>
                    {' '}
                    Read more
                  </Link>
                )}
              </Box>
              <Box variant="small" color="text-body-secondary">
                Category: {alert.category}
              </Box>
            </div>
          ))}
        </SpaceBetween>
      )}
    </Container>
  );
}
