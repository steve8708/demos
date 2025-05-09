// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { RandomUser } from '../types';

interface UserCardProps {
  user: RandomUser;
  onShowDetails: (user: RandomUser) => void;
}

export function UserCard({ user, onShowDetails }: UserCardProps) {
  const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`;

  return (
    <Container
      header={
        <Header
          variant="h3"
          actions={
            <Button onClick={() => onShowDetails(user)} variant="normal">
              View details
            </Button>
          }
        >
          {fullName}
        </Header>
      }
    >
      <SpaceBetween size="m">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={user.picture.medium}
            alt={fullName}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              marginRight: 16,
            }}
          />
          <div>
            <Box variant="h3" padding="n">
              {fullName}
            </Box>
            <Box variant="p" padding="n">
              <Link external href={`mailto:${user.email}`}>
                {user.email}
              </Link>
            </Box>
            <Box variant="p" padding="n">
              <StatusIndicator type="success">Active</StatusIndicator>
            </Box>
          </div>
        </div>

        <SpaceBetween size="xs">
          <Box variant="p">
            <strong>Location:</strong> {user.location.city}, {user.location.country}
          </Box>
          <Box variant="p">
            <strong>Phone:</strong> {user.phone}
          </Box>
          <Box variant="p">
            <strong>Age:</strong> {user.dob.age}
          </Box>
          <Box variant="p">
            <strong>Nationality:</strong> {user.nat}
          </Box>
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
}
