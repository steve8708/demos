// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

import { PopulationByStateData, StatePopulationData } from '../interfaces';
import dataProvider from '../data-provider';

interface PopulationTableProps {
  title?: string;
  selectedYear?: number;
}

export function PopulationTable({ title = 'Population by State', selectedYear }: PopulationTableProps) {
  const [data, setData] = useState<PopulationByStateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [displayYear, setDisplayYear] = useState<number | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stateData = await dataProvider.getPopulationByState(selectedYear);
        setData(stateData);
        setDisplayYear(stateData[0]?.year || null);
        setLoading(false);
      } catch (err) {
        setError('Error loading state population data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Filter data based on search text
  const filteredData = data.filter(item => item.state.toLowerCase().includes(filterText.toLowerCase()));

  // Paginate data
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Format population number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <Container header={<Header variant="h2">{title}</Header>}>
        <SpaceBetween size="m">
          <ProgressBar
            label="Loading population data"
            description="Please wait while we load the state population data"
            value={-1}
          />
        </SpaceBetween>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">{title}</Header>}>
        <Box color="text-status-error">{error}</Box>
      </Container>
    );
  }

  return (
    <Container
      header={
        <Header variant="h2" counter={data.length > 0 ? `(${data.length})` : undefined}>
          {displayYear ? `${title} (${displayYear})` : title}
        </Header>
      }
    >
      <SpaceBetween size="m">
        <TextFilter
          filteringText={filterText}
          filteringPlaceholder="Find state"
          filteringAriaLabel="Filter states"
          onChange={({ detail }) => {
            setFilterText(detail.filteringText);
            setCurrentPage(1);
          }}
          countText={`${filteredData.length} matches`}
          disabled={data.length === 0}
        />
        <Table
          columnDefinitions={[
            {
              id: 'state',
              header: 'State',
              cell: item => item.state,
              sortingField: 'state',
            },
            {
              id: 'population',
              header: 'Population',
              cell: item => formatNumber(item.population),
              sortingField: 'population',
            },
          ]}
          items={paginatedData}
          trackBy="state"
          loading={loading}
          loadingText="Loading state population data"
          sortingDescending
          sortingColumn="population"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No data available</b>
              <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                There is no population data available for the selected filters.
              </Box>
            </Box>
          }
          wrapLines
          header={<div>State population data</div>}
          pagination={
            <Pagination
              currentPageIndex={currentPage}
              onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
              pagesCount={Math.max(1, Math.ceil(filteredData.length / itemsPerPage))}
              ariaLabels={{
                nextPageLabel: 'Next page',
                previousPageLabel: 'Previous page',
                pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
              }}
            />
          }
        />
      </SpaceBetween>
    </Container>
  );
}
