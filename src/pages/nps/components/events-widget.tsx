// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';

import { fetchEvents } from '../services/nps-api';
import { Event } from '../types';

interface EventsWidgetProps {
  parkCode: string;
}

export function EventsWidget({ parkCode }: EventsWidgetProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchEvents(parkCode);
        setEvents(response.data || []);
      } catch (err) {
        console.error('Failed to load events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [parkCode]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return '';

    // Handle cases where time is in various formats
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${period}`;
    }

    return timeString;
  };

  // Truncate long text
  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Container header={<Header variant="h2">Upcoming Events</Header>}>
        <Box textAlign="center" padding={{ top: 'l', bottom: 'l' }}>
          <Spinner size="normal" />
          <Box variant="p" padding={{ top: 's' }}>
            Loading events...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Upcoming Events</Header>}>
        <Alert type="error" header="Error loading events">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      header={
        <Header variant="h2" counter={events.length > 0 ? `(${events.length})` : undefined}>
          Upcoming Events
        </Header>
      }
    >
      {events.length === 0 ? (
        <Box textAlign="center" padding={{ top: 'm', bottom: 'm' }}>
          <Box variant="p">No upcoming events scheduled for this park.</Box>
        </Box>
      ) : (
        <SpaceBetween size="l">
          {events.map(event => (
            <div key={event.id}>
              <Box variant="h4" padding={{ bottom: 'xxs' }}>
                {event.title}
              </Box>
              <ColumnLayout columns={2} variant="text-grid">
                <div>
                  <Box variant="small" color="text-label">
                    Date
                  </Box>
                  <Box variant="p">
                    {event.dateStart === event.dateEnd
                      ? formatDate(event.dateStart)
                      : `${formatDate(event.dateStart)} - ${formatDate(event.dateEnd)}`}
                  </Box>
                </div>
                <div>
                  <Box variant="small" color="text-label">
                    Time
                  </Box>
                  <Box variant="p">
                    {event.isAllDay === 'true'
                      ? 'All Day'
                      : `${formatTime(event.timeStart)} - ${formatTime(event.timeEnd)}`}
                  </Box>
                </div>
              </ColumnLayout>

              <Box variant="small" color="text-label" padding={{ top: 's' }}>
                Location
              </Box>
              <Box variant="p">{event.location || 'Location not specified'}</Box>

              <Box variant="small" color="text-label" padding={{ top: 's' }}>
                Description
              </Box>
              <Box variant="p">
                {truncateText(event.description, 150)}
                {event.description && event.description.length > 150 && (
                  <Link href={event.url} external>
                    {' '}
                    Read more
                  </Link>
                )}
              </Box>

              {event.feeInfo && (
                <Box variant="small" padding={{ top: 's' }}>
                  <strong>Fee Information:</strong> {event.feeInfo}
                </Box>
              )}
            </div>
          ))}
        </SpaceBetween>
      )}
    </Container>
  );
}
