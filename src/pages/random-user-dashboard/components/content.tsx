// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

import { RandomUser } from '../types';
import { DashboardFilters } from './header';
import { UserDetails } from './user-details';

interface ContentProps {
  users: RandomUser[];
  loading: boolean;
  error: string | null;
  filter: any;
  onFilterChange: (filter: any) => void;
}

export function Content({ users, loading, error, filter, onFilterChange }: ContentProps) {
  const [selectedUser, setSelectedUser] = useState<RandomUser | null>(null);
  const [filterText, setFilterText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [selectedItems, setSelectedItems] = useState<RandomUser[]>([]);

  const itemsPerPage = 10;

  const filteredUsers = users.filter(
    user =>
      filterText === '' ||
      user.name.first.toLowerCase().includes(filterText.toLowerCase()) ||
      user.name.last.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(filterText.toLowerCase()) ||
      user.location.country.toLowerCase().includes(filterText.toLowerCase()),
  );

  // Calculate pagination
  const pagesCount = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPageIndex - 1) * itemsPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <SpaceBetween size="l">
      {error && (
        <Alert type="error" header="Error fetching user data">
          {error}
        </Alert>
      )}

      <DashboardFilters filter={filter} onFilterChange={onFilterChange} />

      <Table
        loading={loading}
        loadingText="Loading users"
        columnDefinitions={[
          {
            id: 'photo',
            header: 'Photo',
            cell: item => (
              <img
                src={item.picture.thumbnail}
                alt={`${item.name.first} ${item.name.last}`}
                style={{ width: 40, height: 40, borderRadius: '50%' }}
              />
            ),
            sortingField: 'name.last',
            width: 80,
          },
          {
            id: 'name',
            header: 'Name',
            cell: item => `${item.name.first} ${item.name.last}`,
            sortingField: 'name.last',
          },
          {
            id: 'email',
            header: 'Email',
            cell: item => item.email,
            sortingField: 'email',
          },
          {
            id: 'gender',
            header: 'Gender',
            cell: item => item.gender,
            sortingField: 'gender',
          },
          {
            id: 'location',
            header: 'Location',
            cell: item => `${item.location.city}, ${item.location.country}`,
            sortingField: 'location.country',
          },
          {
            id: 'phone',
            header: 'Phone',
            cell: item => item.phone,
            sortingField: 'phone',
          },
          {
            id: 'age',
            header: 'Age',
            cell: item => item.dob.age,
            sortingField: 'dob.age',
          },
          {
            id: 'nationality',
            header: 'Nationality',
            cell: item => item.nat,
            sortingField: 'nat',
          },
        ]}
        items={displayedUsers}
        selectionType="single"
        selectedItems={selectedItems}
        onSelectionChange={({ detail }) => {
          setSelectedItems(detail.selectedItems);
          if (detail.selectedItems.length > 0) {
            setSelectedUser(detail.selectedItems[0]);
          }
        }}
        empty={
          <Box textAlign="center" padding="l">
            <SpaceBetween size="xs" direction="vertical" alignItems="center">
              <Box variant="h3">No users found</Box>
              <Box variant="p">Try adjusting your filters or refresh to get new random users.</Box>
              <Button onClick={() => onFilterChange({ resultsCount: 12 })}>Reset filters</Button>
            </SpaceBetween>
          </Box>
        }
        filter={
          <TextFilter
            filteringText={filterText}
            filteringPlaceholder="Search users"
            filteringAriaLabel="Filter users"
            onChange={({ detail }) => setFilterText(detail.filteringText)}
          />
        }
        pagination={
          <Pagination
            currentPageIndex={currentPageIndex}
            pagesCount={pagesCount}
            onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
          />
        }
        stickyHeader={true}
        header={
          <Box padding="s" textAlign="center">
            <h2>User Directory</h2>
          </Box>
        }
      />

      {selectedUser && (
        <Modal
          visible={true}
          header={`${selectedUser.name.first} ${selectedUser.name.last}'s Details`}
          onDismiss={() => {
            setSelectedUser(null);
            setSelectedItems([]);
          }}
          size="large"
        >
          <UserDetails user={selectedUser} />
        </Modal>
      )}
    </SpaceBetween>
  );
}
