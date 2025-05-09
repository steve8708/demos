// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { RandomUser } from '../types';

interface UserDetailsProps {
  user: RandomUser;
}

export function UserDetails({ user }: UserDetailsProps) {
  const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">User information</Header>}>
        <SpaceBetween size="l">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={user.picture.large}
              alt={fullName}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                marginRight: 24,
              }}
            />
            <div>
              <Box variant="h1" padding="n">
                {fullName}
              </Box>
              <Box variant="p" padding="n">
                <Link external href={`mailto:${user.email}`}>
                  {user.email}
                </Link>
              </Box>
              <Box variant="p" padding="n">
                Username: {user.login.username}
              </Box>
            </div>
          </div>

          <ColumnLayout columns={2} variant="text-grid">
            <SpaceBetween size="l">
              <div>
                <Box variant="h3">Contact information</Box>
                <Box variant="p">
                  <strong>Email:</strong> {user.email}
                </Box>
                <Box variant="p">
                  <strong>Phone:</strong> {user.phone}
                </Box>
                <Box variant="p">
                  <strong>Cell:</strong> {user.cell}
                </Box>
              </div>

              <div>
                <Box variant="h3">Personal information</Box>
                <Box variant="p">
                  <strong>Gender:</strong> {user.gender}
                </Box>
                <Box variant="p">
                  <strong>Date of birth:</strong> {formatDate(user.dob.date)} ({user.dob.age} years)
                </Box>
                <Box variant="p">
                  <strong>Nationality:</strong> {user.nat}
                </Box>
              </div>
            </SpaceBetween>

            <SpaceBetween size="l">
              <div>
                <Box variant="h3">Address</Box>
                <Box variant="p">
                  <strong>Street:</strong> {user.location.street.number} {user.location.street.name}
                </Box>
                <Box variant="p">
                  <strong>City:</strong> {user.location.city}
                </Box>
                <Box variant="p">
                  <strong>State:</strong> {user.location.state}
                </Box>
                <Box variant="p">
                  <strong>Country:</strong> {user.location.country}
                </Box>
                <Box variant="p">
                  <strong>Postcode:</strong> {user.location.postcode}
                </Box>
              </div>

              <div>
                <Box variant="h3">Account information</Box>
                <Box variant="p">
                  <strong>UUID:</strong> {user.login.uuid}
                </Box>
                <Box variant="p">
                  <strong>Username:</strong> {user.login.username}
                </Box>
              </div>
            </SpaceBetween>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
