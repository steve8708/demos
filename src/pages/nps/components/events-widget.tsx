// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

interface EventsWidgetProps {
  parkCode: string;
}

export function EventsWidget({ parkCode }: EventsWidgetProps) {
  return (
    <Container header={<Header variant="h2">Upcoming Events</Header>}>
      <Alert
        type="info"
        header="Direct access to events data not available"
        action={
          <Link href={`https://www.nps.gov/findapark/event-search.htm?parkCode=${parkCode}`} external>
            View events on NPS website
          </Link>
        }
      >
        Due to API restrictions, events data cannot be loaded directly. Please visit the official National Park Service
        website to view upcoming events.
      </Alert>
    </Container>
  );
}
