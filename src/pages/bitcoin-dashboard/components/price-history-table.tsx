// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

import { PriceHistory } from '../types';

interface PriceHistoryTableProps {
  priceHistory: PriceHistory[];
}

export function PriceHistoryTable({ priceHistory }: PriceHistoryTableProps) {
  const [filterText, setFilterText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);

  const itemsPerPage = 10;

  const filteredItems = priceHistory.filter(
    item => filterText === '' || item.currency.toLowerCase().includes(filterText.toLowerCase()),
  );

  // Calculate pagination
  const pagesCount = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPageIndex - 1) * itemsPerPage;
  const displayedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format price for display
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Table
      columnDefinitions={[
        {
          id: 'timestamp',
          header: 'Time',
          cell: item => formatTimestamp(item.timestamp),
          sortingField: 'timestamp',
        },
        {
          id: 'currency',
          header: 'Currency',
          cell: item => item.currency,
          sortingField: 'currency',
        },
        {
          id: 'price',
          header: 'Price',
          cell: item => formatPrice(item.price, item.currency),
          sortingField: 'price',
        },
      ]}
      items={displayedItems}
      sortingDisabled={false}
      trackBy="timestamp"
      empty={
        <Box textAlign="center" padding="l">
          <SpaceBetween size="xs" direction="vertical" alignItems="center">
            <Box variant="h3">No price history</Box>
            <Box variant="p">Price history will appear after refreshing the data.</Box>
          </SpaceBetween>
        </Box>
      }
      filter={
        <TextFilter
          filteringText={filterText}
          filteringPlaceholder="Filter by currency"
          filteringAriaLabel="Filter price history"
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
      header={
        <Box padding="s" textAlign="center">
          <h2>Price History</h2>
        </Box>
      }
    />
  );
}
