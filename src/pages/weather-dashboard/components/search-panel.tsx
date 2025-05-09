// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Button from '@cloudscape-design/components/button';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';

// List of popular cities with their coordinates
const popularLocations = [
  { name: 'New York, NY', latitude: 40.7128, longitude: -74.006 },
  { name: 'Los Angeles, CA', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Chicago, IL', latitude: 41.8781, longitude: -87.6298 },
  { name: 'Seattle, WA', latitude: 47.6062, longitude: -122.3321 },
  { name: 'Miami, FL', latitude: 25.7617, longitude: -80.1918 },
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Paris, France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Rio de Janeiro, Brazil', latitude: -22.9068, longitude: -43.1729 },
];

interface SearchPanelProps {
  onLocationChange: (location: { latitude: number; longitude: number; name: string }) => void;
}

export function SearchPanel({ onLocationChange }: SearchPanelProps) {
  const [visible, setVisible] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!latitude || !longitude || !customLocation) {
      setError('Please fill in all fields');
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      setError('Latitude and longitude must be valid numbers');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90 degrees');
      return;
    }

    if (lon < -180 || lon > 180) {
      setError('Longitude must be between -180 and 180 degrees');
      return;
    }

    onLocationChange({
      latitude: lat,
      longitude: lon,
      name: customLocation,
    });

    setVisible(false);
  };

  const selectLocation = (location: (typeof popularLocations)[0]) => {
    onLocationChange(location);
    setVisible(false);
  };

  return (
    <>
      <Button iconName="search" onClick={() => setVisible(true)}>
        Change location
      </Button>

      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        header="Select location"
        size="medium"
        footer={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Apply
            </Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="l">
          <Form
            errorText={error}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  onClick={() => {
                    setError('');
                    setCustomLocation('');
                    setLatitude('');
                    setLongitude('');
                  }}
                >
                  Clear
                </Button>
              </SpaceBetween>
            }
          >
            <SpaceBetween size="m">
              <FormField label="Location name">
                <Input
                  value={customLocation}
                  onChange={({ detail }) => setCustomLocation(detail.value)}
                  placeholder="E.g., San Francisco, CA"
                />
              </FormField>

              <FormField label="Latitude">
                <Input
                  value={latitude}
                  onChange={({ detail }) => setLatitude(detail.value)}
                  placeholder="E.g., 37.7749"
                  type="number"
                  step="0.0001"
                  min="-90"
                  max="90"
                />
              </FormField>

              <FormField label="Longitude">
                <Input
                  value={longitude}
                  onChange={({ detail }) => setLongitude(detail.value)}
                  placeholder="E.g., -122.4194"
                  type="number"
                  step="0.0001"
                  min="-180"
                  max="180"
                />
              </FormField>
            </SpaceBetween>
          </Form>

          <SpaceBetween size="xs">
            <h4>Popular locations</h4>
            <SpaceBetween size="xs" direction="horizontal" className="popular-locations">
              {popularLocations.map(location => (
                <Button key={location.name} variant="link" onClick={() => selectLocation(location)}>
                  {location.name}
                </Button>
              ))}
            </SpaceBetween>
          </SpaceBetween>
        </SpaceBetween>
      </Modal>
    </>
  );
}
