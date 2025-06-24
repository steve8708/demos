// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import AppLayout from '@cloudscape-design/components/app-layout';
import AreaChart from '@cloudscape-design/components/area-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

import { Navigation } from '../commons/navigation';
import { areaChartData, barChartData, performanceGoal } from './chart-data';
import { AdminItem, columnDefinitions, tableData } from './table-config';
import styles from './styles.module.scss';

export function App() {
  const [selectedItems, setSelectedItems] = useState<AdminItem[]>([]);
  const [filterText, setFilterText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [showWarning, setShowWarning] = useState(true);
  const itemsPerPage = 10;

  // Filter and paginate table data
  const filteredItems = tableData.filter(
    item =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.department.toLowerCase().includes(filterText.toLowerCase()) ||
      item.status.toLowerCase().includes(filterText.toLowerCase()),
  );

  const paginatedItems = filteredItems.slice((currentPageIndex - 1) * itemsPerPage, currentPageIndex * itemsPerPage);

  const refreshData = () => {
    console.log('Refreshing dashboard data...');
    // In a real app, this would trigger data refresh
  };

  return (
    <AppLayout
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Service', href: '#' },
            { text: 'Administrative Dashboard', href: '#' },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      navigation={<Navigation activeHref="#/administrative-dashboard" />}
      toolsHide
      content={
        <SpaceBetween size="l">
          {/* Header */}
          <Header
            variant="h1"
            actions={
              <Button variant="primary" iconName="refresh" onClick={refreshData}>
                Refresh Data
              </Button>
            }
            description="Collection description"
          >
            Administration Dashboard
          </Header>

          {/* Warning Banner */}
          {showWarning && (
            <Flashbar
              items={[
                {
                  type: 'warning',
                  content: 'This is a warning message',
                  dismissible: true,
                  onDismiss: () => setShowWarning(false),
                },
              ]}
            />
          )}

          {/* Search and Pagination Controls */}
          <Container>
            <Grid
              gridDefinition={[
                { colspan: { default: 12, xs: 12, s: 8, m: 8, l: 8, xl: 8 } },
                { colspan: { default: 12, xs: 12, s: 4, m: 4, l: 4, xl: 4 } },
              ]}
            >
              <TextFilter
                filteringText={filterText}
                filteringPlaceholder="Placeholder"
                filteringAriaLabel="Filter items"
                countText={`${filteredItems.length} match${filteredItems.length !== 1 ? 'es' : ''}`}
                onChange={({ detail }) => {
                  setFilterText(detail.filteringText);
                  setCurrentPageIndex(1);
                }}
              />
              <Box display="flex" justifyContent="flex-end">
                <SpaceBetween direction="horizontal" size="s">
                  <Pagination
                    currentPageIndex={currentPageIndex}
                    onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
                    pagesCount={Math.ceil(filteredItems.length / itemsPerPage)}
                    ariaLabels={{
                      nextPageLabel: 'Next page',
                      previousPageLabel: 'Previous page',
                      pageLabel: pageNumber => `Page ${pageNumber}`,
                    }}
                  />
                  <Box borderLeft="divider-default" paddingLeft="s">
                    <Button iconName="settings" variant="icon" ariaLabel="Settings" />
                  </Box>
                </SpaceBetween>
              </Box>
            </Grid>
          </Container>

          {/* Charts Section */}
          <Grid
            gridDefinition={[
              { colspan: { default: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
              { colspan: { default: 12, xs: 12, s: 12, m: 6, l: 6, xl: 6 } },
            ]}
          >
            {/* Area Chart */}
            <Container>
              <SpaceBetween size="m">
                <Header variant="h3">y-axis label</Header>
                <AreaChart
                  series={areaChartData}
                  xDomain={['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8', 'x9', 'x10', 'x11', 'x12']}
                  yDomain={[0, 60]}
                  height={300}
                  xTitle="X-axis label"
                  yTitle=""
                  ariaLabel="Area chart showing performance over time"
                  ariaDescription="Area chart with two data series showing performance metrics over a 12-period timeline"
                  legendTitle=""
                  hideFilter={false}
                  fitHeight={false}
                  threshold={{
                    y: 35,
                    label: 'Performance goal',
                  }}
                  i18nStrings={{
                    filterLabel: 'Filter displayed data series',
                    filterPlaceholder: 'Search data series',
                    filterSelectedAriaLabel: 'selected',
                    legendAriaLabel: 'Legend',
                    chartAriaRoleDescription: 'area chart',
                    xAxisAriaRoleDescription: 'x axis',
                    yAxisAriaRoleDescription: 'y axis',
                  }}
                />
              </SpaceBetween>
            </Container>

            {/* Bar Chart */}
            <Container>
              <SpaceBetween size="m">
                <Header variant="h3">y-axis label</Header>
                <BarChart
                  series={barChartData}
                  xDomain={['x1', 'x2', 'x3', 'x4', 'x5']}
                  yDomain={[0, 60]}
                  height={300}
                  xTitle="X-axis label"
                  yTitle=""
                  ariaLabel="Bar chart showing performance metrics"
                  ariaDescription="Bar chart showing performance metrics across five categories"
                  legendTitle=""
                  hideFilter={false}
                  fitHeight={false}
                  threshold={{
                    y: 35,
                    label: 'Performance goal',
                  }}
                  i18nStrings={{
                    filterLabel: 'Filter displayed data series',
                    filterPlaceholder: 'Search data series',
                    filterSelectedAriaLabel: 'selected',
                    legendAriaLabel: 'Legend',
                    chartAriaRoleDescription: 'bar chart',
                    xAxisAriaRoleDescription: 'x axis',
                    yAxisAriaRoleDescription: 'y axis',
                  }}
                />
              </SpaceBetween>
            </Container>
          </Grid>

          {/* Data Table */}
          <Table
            columnDefinitions={columnDefinitions}
            items={paginatedItems}
            loadingText="Loading resources"
            selectedItems={selectedItems}
            onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
            selectionType="multi"
            resizableColumns
            stickyHeader
            stripedRows
            trackBy="id"
            variant="container"
            ariaLabels={{
              selectionGroupLabel: 'Items selection',
              allItemsSelectionLabel: ({ selectedItems }) =>
                `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected`,
              itemSelectionLabel: ({ selectedItems }, item) => {
                const isItemSelected = selectedItems.filter(i => i.id === item.id).length;
                return `${item.name} is ${isItemSelected ? '' : 'not '}selected`;
              },
            }}
            header={
              <Header
                counter={
                  selectedItems.length
                    ? `(${selectedItems.length}/${filteredItems.length})`
                    : `(${filteredItems.length})`
                }
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button disabled={selectedItems.length === 0}>Edit</Button>
                    <Button disabled={selectedItems.length === 0}>Delete</Button>
                  </SpaceBetween>
                }
              >
                Administrative Resources
              </Header>
            }
            empty={
              <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
                <SpaceBetween size="m">
                  <b>No resources</b>
                  <Button variant="primary">Create resource</Button>
                </SpaceBetween>
              </Box>
            }
            footer={
              <Pagination
                currentPageIndex={currentPageIndex}
                onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
                pagesCount={Math.ceil(filteredItems.length / itemsPerPage)}
                ariaLabels={{
                  nextPageLabel: 'Next page',
                  previousPageLabel: 'Previous page',
                  pageLabel: pageNumber => `Page ${pageNumber}`,
                }}
              />
            }
          />
        </SpaceBetween>
      }
    />
  );
}
