// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import PieChart from '@cloudscape-design/components/pie-chart';

import { fetchParkByCode } from '../services/nps-api';
import { Park } from '../types';

interface ActivitiesChartWidgetProps {
  parkCode: string;
}

export function ActivitiesChartWidget({ parkCode }: ActivitiesChartWidgetProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchParkByCode(parkCode);

        if (response.data && response.data.length > 0) {
          const park: Park = response.data[0];
          setActivities(park.activities || []);
        } else {
          setError('No park details found');
        }
      } catch (err) {
        console.error('Failed to load park activities:', err);
        setError('Failed to load park activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [parkCode]);

  // Group activities by category
  const prepareChartData = () => {
    if (!activities || activities.length === 0) return [];

    // Define categories and their keywords
    const categories = {
      'Trails & Hiking': ['Hiking', 'Biking', 'Horse Trekking', 'Walking', 'Trail', 'Climbing'],
      'Water Activities': [
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
      'Winter Sports': ['Skiing', 'Snowshoeing', 'Snow Play', 'Ice', 'Winter'],
      Educational: [
        'Museum',
        'Guided Tours',
        'Junior Ranger Program',
        'Park Film',
        'Astronomy',
        'Stargazing',
        'Living History',
        'Arts and Culture',
      ],
      'Wildlife Viewing': ['Wildlife', 'Birdwatching', 'Animal', 'Bird', 'Viewing', 'Nature'],
      Other: [],
    };

    // Count activities by category
    const categoryCounts: Record<string, number> = {};

    for (const category in categories) {
      categoryCounts[category] = 0;
    }

    activities.forEach(activity => {
      let categoryFound = false;

      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => activity.name.includes(keyword))) {
          categoryCounts[category]++;
          categoryFound = true;
          break;
        }
      }

      if (!categoryFound) {
        categoryCounts['Other']++;
      }
    });

    // Convert to chart data format
    return Object.entries(categoryCounts)
      .filter(([_, count]) => count > 0)
      .map(([category, count]) => ({
        title: category,
        value: count,
      }));
  };

  if (loading) {
    return (
      <Container header={<Header variant="h2">Park Activities Breakdown</Header>}>
        <Box textAlign="center" padding={{ top: 'l', bottom: 'l' }}>
          <Spinner size="normal" />
          <Box variant="p" padding={{ top: 's' }}>
            Loading activities data...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Park Activities Breakdown</Header>}>
        <Alert type="error" header="Error loading activities data">
          {error}
        </Alert>
      </Container>
    );
  }

  const chartData = prepareChartData();

  if (chartData.length === 0) {
    return (
      <Container header={<Header variant="h2">Park Activities Breakdown</Header>}>
        <Box textAlign="center" padding={{ top: 'm', bottom: 'm' }}>
          <Box variant="p">No activities data available for this park.</Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container header={<Header variant="h2">Park Activities Breakdown</Header>}>
      <PieChart
        data={chartData}
        segmentDescription={(datum, sum) => {
          const percentage = Math.round((datum.value / sum) * 100);
          return `${datum.title}: ${datum.value} activities (${percentage}%)`;
        }}
        i18nStrings={{
          detailsValue: 'Activities count',
          detailsPercentage: 'Percentage',
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: 'selected',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'pie chart',
          segmentAriaRoleDescription: 'segment',
        }}
        ariaDescription="Pie chart showing the distribution of park activities by category."
        hideFilter
        size="medium"
        variant="donut"
        innerMetricDescription="Activities"
        innerMetricValue={activities.length.toString()}
      />
    </Container>
  );
}
