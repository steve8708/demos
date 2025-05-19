// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { fetchAmenities, fetchVisitorCenters, fetchCampgrounds } from '../services/nps-api';
import { VisitorCenter } from '../types';

interface AmenitiesWidgetProps {
  parkCode: string;
}

export function AmenitiesWidget({ parkCode }: AmenitiesWidgetProps) {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [visitorCenters, setVisitorCenters] = useState<VisitorCenter[]>([]);
  const [campgrounds, setCampgrounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAmenities = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch amenities, visitor centers, and campgrounds in parallel
        const [amenitiesRes, visitorCentersRes, campgroundsRes] = await Promise.all([
          fetchAmenities(parkCode),
          fetchVisitorCenters(parkCode),
          fetchCampgrounds(parkCode),
        ]);

        setAmenities(amenitiesRes.data || []);
        setVisitorCenters(visitorCentersRes.data || []);
        setCampgrounds(campgroundsRes.data || []);
      } catch (err) {
        console.error('Failed to load amenities:', err);
        setError('Failed to load amenities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAmenities();
  }, [parkCode]);

  // Group amenities into categories
  const groupAmenities = () => {
    // Common categories for activities
    const categories = {
      trails: ['Hiking', 'Biking', 'Horse Trekking', 'Walking', 'Trail', 'Climbing'],
      water: [
        'Swimming',
        'Boating',
        'Paddling',
        'Fishing',
        'Water',
        'Scuba Diving',
        'Snorkeling',
        'Surfing',
        'Kayaking',
        'Canoeing',
      ],
      winter: ['Skiing', 'Snowshoeing', 'Snow Play', 'Ice', 'Winter'],
      educational: [
        'Museum',
        'Guided Tours',
        'Junior Ranger Program',
        'Park Film',
        'Astronomy',
        'Stargazing',
        'Living History',
        'Arts and Culture',
      ],
      other: [],
    };

    const groupedAmenities: Record<string, any[]> = {
      trails: [],
      water: [],
      winter: [],
      educational: [],
      other: [],
    };

    amenities.forEach(amenity => {
      let categoryFound = false;

      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => amenity.name.includes(keyword))) {
          groupedAmenities[category].push(amenity);
          categoryFound = true;
          break;
        }
      }

      if (!categoryFound) {
        groupedAmenities.other.push(amenity);
      }
    });

    return groupedAmenities;
  };

  const renderAmenityGroup = (title: string, items: any[]) => {
    if (items.length === 0) return null;

    return (
      <div>
        <Box variant="h5" padding={{ bottom: 'xxs' }}>
          {title}
        </Box>
        <ColumnLayout columns={2} variant="text-grid">
          {items.map(item => (
            <div key={item.id}>
              <StatusIndicator type="success" /> {item.name}
            </div>
          ))}
        </ColumnLayout>
      </div>
    );
  };

  if (loading) {
    return (
      <Container header={<Header variant="h2">Park Amenities</Header>}>
        <Box textAlign="center" padding={{ top: 'l', bottom: 'l' }}>
          <Spinner size="normal" />
          <Box variant="p" padding={{ top: 's' }}>
            Loading amenities...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Park Amenities</Header>}>
        <Alert type="error" header="Error loading amenities">
          {error}
        </Alert>
      </Container>
    );
  }

  const groupedAmenities = groupAmenities();

  return (
    <Container header={<Header variant="h2">Park Amenities</Header>}>
      {amenities.length === 0 && visitorCenters.length === 0 && campgrounds.length === 0 ? (
        <Box textAlign="center" padding={{ top: 'm', bottom: 'm' }}>
          <Box variant="p">No amenities information available for this park.</Box>
        </Box>
      ) : (
        <Box>
          {visitorCenters.length > 0 && (
            <div>
              <Box variant="h4" padding={{ bottom: 's' }}>
                Visitor Centers ({visitorCenters.length})
              </Box>
              <ColumnLayout columns={1} variant="text-grid">
                {visitorCenters.map(center => (
                  <div key={center.id}>
                    <Box variant="h5">{center.name}</Box>
                    <Box variant="p">
                      {center.description
                        ? center.description.substring(0, 100) + (center.description.length > 100 ? '...' : '')
                        : 'No description available.'}
                    </Box>
                  </div>
                ))}
              </ColumnLayout>
            </div>
          )}

          {campgrounds.length > 0 && (
            <div>
              <Box variant="h4" padding={{ top: 'm', bottom: 's' }}>
                Campgrounds ({campgrounds.length})
              </Box>
              <ColumnLayout columns={2} variant="text-grid">
                {campgrounds.map(camp => (
                  <div key={camp.id}>
                    <StatusIndicator type="success" /> {camp.name}
                  </div>
                ))}
              </ColumnLayout>
            </div>
          )}

          {amenities.length > 0 && (
            <div>
              <Box variant="h4" padding={{ top: 'm', bottom: 's' }}>
                Activities
              </Box>
              {renderAmenityGroup('Trails & Hiking', groupedAmenities.trails)}
              {renderAmenityGroup('Water Activities', groupedAmenities.water)}
              {renderAmenityGroup('Winter Activities', groupedAmenities.winter)}
              {renderAmenityGroup('Educational Activities', groupedAmenities.educational)}
              {renderAmenityGroup('Other Activities', groupedAmenities.other)}
            </div>
          )}
        </Box>
      )}
    </Container>
  );
}
