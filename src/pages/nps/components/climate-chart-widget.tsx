// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import LineChart from '@cloudscape-design/components/line-chart';

import { fetchParkByCode } from '../services/nps-api';

interface ClimateChartWidgetProps {
  parkCode: string;
}

export function ClimateChartWidget({ parkCode }: ClimateChartWidgetProps) {
  const [parkData, setParkData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParkData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchParkByCode(parkCode);

        if (response.data && response.data.length > 0) {
          setParkData(response.data[0]);
        } else {
          setError('No park details found');
        }
      } catch (err) {
        console.error('Failed to load park data:', err);
        setError('Failed to load park data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadParkData();
  }, [parkCode]);

  // Generate simulated climate data based on park location (latitude)
  const generateClimateData = () => {
    if (!parkData || !parkData.latitude) return [];

    const latitude = parseFloat(parkData.latitude);
    const isNorthern = latitude > 0;
    const magnitude = Math.min(Math.abs(latitude) / 90, 1); // 0-1 scale based on distance from equator

    // Generate temperature data with seasonal variations based on hemisphere
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Base temperatures - will be adjusted based on latitude
    const baseTempNorthern = [30, 34, 45, 55, 65, 75, 80, 78, 70, 55, 45, 35]; // Fahrenheit
    const baseTempSouthern = [80, 78, 70, 60, 50, 40, 35, 38, 45, 55, 65, 75]; // Fahrenheit

    // Precipitation pattern (inches) - adjusted based on park type and location
    const basePrecip = [2.5, 2.2, 2.8, 3.2, 3.5, 2.2, 1.5, 1.2, 1.8, 2.4, 2.8, 3.0];

    // Adjust temperature based on latitude
    let tempData = isNorthern ? baseTempNorthern : baseTempSouthern;

    // More extreme seasons with higher latitude
    tempData = tempData.map(temp => {
      const midpoint = isNorthern ? 55 : 60;
      return midpoint + (temp - midpoint) * magnitude;
    });

    // Adjust precipitation based on park name hints
    let precipData = [...basePrecip];
    const parkName = parkData.name.toLowerCase();

    if (parkName.includes('rain') || parkName.includes('forest') || parkName.includes('olympic')) {
      // Rainier areas
      precipData = precipData.map(p => p * 2.2);
    } else if (parkName.includes('desert') || parkName.includes('canyon') || parkName.includes('arch')) {
      // Drier areas
      precipData = precipData.map(p => p * 0.4);
    } else if (parkName.includes('mountain') || parkName.includes('glacier')) {
      // Mountain areas - more precipitation in winter
      precipData = precipData.map((p, i) => {
        // Increase winter precipitation for mountain regions
        if (isNorthern ? i < 3 || i > 9 : i > 3 && i < 10) {
          return p * 2;
        }
        return p;
      });
    }

    // Format for chart
    return months.map((month, i) => ({
      x: month,
      y: Math.round(tempData[i]),
      precipitation: precipData[i].toFixed(1),
    }));
  };

  if (loading) {
    return (
      <Container header={<Header variant="h2">Average Climate Conditions</Header>}>
        <Box textAlign="center" padding={{ top: 'l', bottom: 'l' }}>
          <Spinner size="normal" />
          <Box variant="p" padding={{ top: 's' }}>
            Loading climate data...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Average Climate Conditions</Header>}>
        <Alert type="error" header="Error loading climate data">
          {error}
        </Alert>
      </Container>
    );
  }

  const climateData = generateClimateData();

  if (climateData.length === 0) {
    return (
      <Container header={<Header variant="h2">Average Climate Conditions</Header>}>
        <Box textAlign="center" padding={{ top: 'm', bottom: 'm' }}>
          <Box variant="p">No climate data available for this park.</Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      header={
        <Header variant="h2" description="Simulated data based on geographic location">
          Average Climate Conditions
        </Header>
      }
    >
      <LineChart
        series={[
          {
            title: 'Temperature (°F)',
            type: 'line',
            data: climateData.map(item => ({ x: item.x, y: item.y })),
            valueFormatter: value => `${value}°F`,
          },
          {
            title: 'Precipitation (in)',
            type: 'bar',
            data: climateData.map(item => ({ x: item.x, y: parseFloat(item.precipitation) })),
            valueFormatter: value => `${value} in`,
          },
        ]}
        xScaleType="categorical"
        yDomain={[0, Math.max(...climateData.map(d => d.y)) + 10]}
        i18nStrings={{
          chartAriaRoleDescription: 'Line chart',
          xTickFormatter: tick => tick,
          yTickFormatter: tick => `${tick}`,
        }}
        ariaLabel="Average monthly temperature and precipitation"
        height={300}
        hideFilter
        hideLegend={false}
        legendPosition="bottom"
        statusType="finished"
        xTitle="Month"
        yTitle="Value"
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data available</b>
            <Box variant="p" color="inherit">
              Climate data is not available for this park.
            </Box>
          </Box>
        }
      />
      <Box variant="small" color="text-body-secondary" padding={{ top: 's' }}>
        Note: This is simulated climate data based on the park's geographic location. For accurate climate information,
        please check the official National Park Service website.
      </Box>
    </Container>
  );
}
