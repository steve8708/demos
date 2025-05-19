// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import TextContent from '@cloudscape-design/components/text-content';
import Badge from '@cloudscape-design/components/badge';

import { fetchParkByCode } from '../services/nps-api';
import { Park } from '../types';

interface ParkOverviewProps {
  parkCode: string;
}

export function ParkOverview({ parkCode }: ParkOverviewProps) {
  const [park, setPark] = useState<Park | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParkDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchParkByCode(parkCode);

        if (response.data && response.data.length > 0) {
          setPark(response.data[0]);
        } else {
          setError('No park details found');
        }
      } catch (err) {
        console.error('Failed to load park details:', err);
        setError('Failed to load park details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadParkDetails();
  }, [parkCode]);

  if (loading) {
    return (
      <Container header={<Header variant="h2">Park Overview</Header>}>
        <Box textAlign="center" padding={{ top: 'l', bottom: 'l' }}>
          <Spinner size="large" />
          <Box variant="p" padding={{ top: 'm' }}>
            Loading park information...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error || !park) {
    return (
      <Container header={<Header variant="h2">Park Overview</Header>}>
        <Alert type="error" header="Error loading park information">
          {error || 'Failed to load park information. Please try again later.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      header={
        <Header
          variant="h2"
          description={`${park.states} • ${park.designation}`}
          actions={
            <Link external href={park.url} ariaLabel={`Visit ${park.fullName} official page`}>
              Visit official page
            </Link>
          }
        >
          Park Overview
        </Header>
      }
    >
      <SpaceBetween size="l">
        <TextContent>
          <p>{park.description}</p>
        </TextContent>

        <ExpandableSection headerText="Park Details" variant="container">
          <SpaceBetween size="m">
            {park.directionsInfo && (
              <div>
                <Box variant="h4">Directions</Box>
                <TextContent>
                  <p>{park.directionsInfo}</p>
                  {park.directionsUrl && (
                    <p>
                      <Link external href={park.directionsUrl}>
                        Get detailed directions
                      </Link>
                    </p>
                  )}
                </TextContent>
              </div>
            )}

            <div>
              <Box variant="h4">Activities</Box>
              <Box display="flex" flexDirection="row" flexWrap="wrap" gap="xs">
                {park.activities.slice(0, 15).map(activity => (
                  <Badge key={activity.id} color="blue">
                    {activity.name}
                  </Badge>
                ))}
                {park.activities.length > 15 && <Badge color="grey">+{park.activities.length - 15} more</Badge>}
              </Box>
            </div>

            {park.operatingHours && park.operatingHours.length > 0 && (
              <div>
                <Box variant="h4">Operating Hours</Box>
                <TextContent>
                  <p>{park.operatingHours[0].description}</p>
                  <ul>
                    <li>
                      <strong>Monday:</strong> {park.operatingHours[0].standardHours.monday}
                    </li>
                    <li>
                      <strong>Tuesday:</strong> {park.operatingHours[0].standardHours.tuesday}
                    </li>
                    <li>
                      <strong>Wednesday:</strong> {park.operatingHours[0].standardHours.wednesday}
                    </li>
                    <li>
                      <strong>Thursday:</strong> {park.operatingHours[0].standardHours.thursday}
                    </li>
                    <li>
                      <strong>Friday:</strong> {park.operatingHours[0].standardHours.friday}
                    </li>
                    <li>
                      <strong>Saturday:</strong> {park.operatingHours[0].standardHours.saturday}
                    </li>
                    <li>
                      <strong>Sunday:</strong> {park.operatingHours[0].standardHours.sunday}
                    </li>
                  </ul>
                </TextContent>
              </div>
            )}

            {park.entranceFees && park.entranceFees.length > 0 && (
              <div>
                <Box variant="h4">Entrance Fees</Box>
                {park.entranceFees.map((fee, index) => (
                  <div key={index}>
                    <Box variant="h5" padding={{ top: 'xs', bottom: 'xxs' }}>
                      {fee.title} - ${fee.cost}
                    </Box>
                    <TextContent>
                      <p>{fee.description}</p>
                    </TextContent>
                  </div>
                ))}
              </div>
            )}

            {park.contacts && (
              <div>
                <Box variant="h4">Contact Information</Box>
                {park.contacts.phoneNumbers && park.contacts.phoneNumbers.length > 0 && (
                  <div>
                    <Box variant="h5" padding={{ bottom: 'xxs' }}>
                      Phone Numbers
                    </Box>
                    <ul>
                      {park.contacts.phoneNumbers.map((phone, idx) => (
                        <li key={idx}>
                          {phone.type}: {phone.phoneNumber} {phone.extension ? `ext. ${phone.extension}` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {park.contacts.emailAddresses && park.contacts.emailAddresses.length > 0 && (
                  <div>
                    <Box variant="h5" padding={{ bottom: 'xxs' }}>
                      Email Addresses
                    </Box>
                    <ul>
                      {park.contacts.emailAddresses.map((email, idx) => (
                        <li key={idx}>
                          <Link href={`mailto:${email.emailAddress}`}>{email.emailAddress}</Link>
                          {email.description && ` (${email.description})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </SpaceBetween>
        </ExpandableSection>
      </SpaceBetween>
    </Container>
  );
}
