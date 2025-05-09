// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Cards from '@cloudscape-design/components/cards';
import Badge from '@cloudscape-design/components/badge';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import Tabs from '@cloudscape-design/components/tabs';
import Container from '@cloudscape-design/components/container';
import Icon from '@cloudscape-design/components/icon';
import Flashbar from '@cloudscape-design/components/flashbar';
import Link from '@cloudscape-design/components/link';

// Demo definitions with category information
const demos = [
  {
    route: '/bitcoin-dashboard',
    title: 'Bitcoin Price Dashboard',
    description: 'Real-time Bitcoin price tracking dashboard.',
    category: 'Dashboards',
  },
  { route: '/cards', title: 'Card View', description: 'Demo of Cloudscape Cards component.', category: 'Components' },
  { route: '/chat', title: 'Chat', description: 'Chat UI demo.', category: 'Applications' },
  {
    route: '/configurable-dashboard',
    title: 'Configurable Dashboard',
    description: 'Dashboard with configurable widgets.',
    category: 'Dashboards',
  },
  { route: '/dashboard', title: 'Service Dashboard', description: 'Dashboard layout demo.', category: 'Dashboards' },
  {
    route: '/delete-one-click',
    title: 'One-click Delete',
    description: 'Delete with a single click.',
    category: 'Forms',
  },
  {
    route: '/delete-with-additional-confirmation',
    title: 'Delete with Additional Confirmation',
    description: 'Delete with extra confirmation step.',
    category: 'Forms',
  },
  {
    route: '/delete-with-simple-confirmation',
    title: 'Delete with Simple Confirmation',
    description: 'Delete with simple confirmation.',
    category: 'Forms',
  },
  { route: '/details', title: 'Details Page', description: 'Resource details page.', category: 'Details' },
  { route: '/details-hub', title: 'Details Hub', description: 'Details page as a hub.', category: 'Details' },
  { route: '/details-tabs', title: 'Details with Tabs', description: 'Details page with tabs.', category: 'Details' },
  { route: '/edit', title: 'Edit Resource', description: 'Edit resource demo.', category: 'Forms' },
  { route: '/form', title: 'Single Page Create', description: 'Single page form demo.', category: 'Forms' },
  {
    route: '/form-unsaved-changes',
    title: 'Unsaved Changes',
    description: 'Communicate unsaved changes.',
    category: 'Forms',
  },
  { route: '/form-validation', title: 'Form Validation', description: 'Form validation demo.', category: 'Forms' },
  { route: '/manage-tags', title: 'Manage Tags', description: 'Tag management demo.', category: 'Components' },
  {
    route: '/non-console',
    title: 'Top Navigation',
    description: 'Non-console top navigation.',
    category: 'Navigation',
  },
  { route: '/onboarding', title: 'Onboarding', description: 'Hands-on tutorials.', category: 'Onboarding' },
  {
    route: '/product-detail-page',
    title: 'Product Detail Page',
    description: 'Product details demo.',
    category: 'Applications',
  },
  { route: '/read-from-s3', title: 'Read from S3', description: 'Read data from Amazon S3.', category: 'Integration' },
  {
    route: '/server-side-table',
    title: 'Server-side Table',
    description: 'Table view (server-side).',
    category: 'Tables',
  },
  {
    route: '/server-side-table-property-filter',
    title: 'Server-side Table Property Filter',
    description: 'Table property filter (server-side).',
    category: 'Tables',
  },
  {
    route: '/split-panel-comparison',
    title: 'Split Panel Comparison',
    description: 'Split view with details comparison.',
    category: 'Panels',
  },
  { route: '/split-panel-multiple', title: 'Split Panel Multiple', description: 'Split view.', category: 'Panels' },
  { route: '/table', title: 'Table View', description: 'Demo of Cloudscape Table component.', category: 'Tables' },
  {
    route: '/table-date-filter',
    title: 'Table Date Filter',
    description: 'Table with date range picker filter.',
    category: 'Tables',
  },
  { route: '/table-editable', title: 'Editable Table', description: 'Table with inline editing.', category: 'Tables' },
  {
    route: '/table-expandable',
    title: 'Expandable Table',
    description: 'Table with expandable rows.',
    category: 'Tables',
  },
  {
    route: '/table-property-filter',
    title: 'Table Property Filter',
    description: 'Table with property filter.',
    category: 'Tables',
  },
  {
    route: '/table-saved-filters',
    title: 'Table Saved Filters',
    description: 'Table with saved filter sets.',
    category: 'Tables',
  },
  {
    route: '/table-select-filter',
    title: 'Table Select Filter',
    description: 'Table with select filter.',
    category: 'Tables',
  },
  { route: '/wizard', title: 'Wizard', description: 'Multi-step wizard demo.', category: 'Forms' },
  { route: '/write-to-s3', title: 'Write to S3', description: 'Write data to Amazon S3.', category: 'Integration' },
];

// Get unique categories
const categories = [...new Set(demos.map(demo => demo.category))];

export default function Home() {
  const [filterText, setFilterText] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const itemsPerPage = 12;

  // Filter demos based on filter text and selected category
  const filteredDemos = demos.filter(
    demo =>
      (demo.title.toLowerCase().includes(filterText.toLowerCase()) ||
        demo.description.toLowerCase().includes(filterText.toLowerCase())) &&
      (activeCategory === 'All' || demo.category === activeCategory),
  );

  // Paginate the filtered demos
  const paginatedDemos = filteredDemos.slice((currentPageIndex - 1) * itemsPerPage, currentPageIndex * itemsPerPage);

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <SpaceBetween size="m">
              <Header
                variant="h1"
                actions={
                  <Button variant="primary" iconAlign="right" iconName="external">
                    Launch new demo
                  </Button>
                }
              >
                Cloudscape Design System Demos
              </Header>

              <Flashbar
                items={[
                  {
                    type: 'info',
                    content:
                      'Welcome to the Cloudscape Design System demo collection. These patterns and components showcase modern cloud application experiences.',
                    dismissible: true,
                    buttonText: 'Learn more',
                    onButtonClick: () => window.open('https://cloudscape.design', '_blank'),
                  },
                ]}
              />
            </SpaceBetween>
          }
        >
          <SpaceBetween size="l">
            <Container>
              <Box variant="h2">Demo catalog</Box>
              <Box variant="p" padding={{ bottom: 'm' }}>
                Browse {demos.length} examples of Cloudscape Design System patterns and components. Each demo shows best
                practices for cloud application experiences.
              </Box>

              <Grid gridDefinition={[{ colspan: { default: 12, xs: 12, s: 12, m: 8, l: 8, xl: 8 } }]}>
                <TextFilter
                  filteringText={filterText}
                  filteringPlaceholder="Find demos"
                  filteringAriaLabel="Filter demos"
                  countText={`${filteredDemos.length} matches`}
                  onChange={({ detail }) => {
                    setFilterText(detail.filteringText);
                    setCurrentPageIndex(1);
                  }}
                />
              </Grid>
            </Container>

            <Tabs
              tabs={[
                {
                  id: 'All',
                  label: 'All',
                  content: null,
                },
                ...categories.map(category => ({
                  id: category,
                  label: category,
                  content: null,
                })),
              ]}
              activeTabId={activeCategory}
              onChange={({ detail }) => {
                setActiveCategory(detail.activeTabId);
                setCurrentPageIndex(1);
              }}
            />

            <Cards
              ariaLabels={{
                itemSelectionLabel: (e, n) => `select ${n.title}`,
                selectionGroupLabel: 'Demo selection',
              }}
              cardDefinition={{
                header: item => <Link href={item.route}>{item.title}</Link>,
                sections: [
                  {
                    id: 'description',
                    content: item => item.description,
                  },

                  {
                    id: 'actions',
                    content: item => (
                      <Button href={item.route} iconAlign="right" iconName="external" variant="primary">
                        Open demo
                      </Button>
                    ),
                  },
                ],
              }}
              cardsPerRow={[
                { cards: 1, minWidth: 0 },
                { cards: 2, minWidth: 600 },
                { cards: 3, minWidth: 900 },
                { cards: 4, minWidth: 1200 },
              ]}
              items={paginatedDemos}
              loadingText="Loading demos"
              trackBy="title"
              visibleSections={['description', 'type', 'actions']}
              empty={
                <Box textAlign="center" color="inherit" margin={{ top: 'xxl', bottom: 'xxl' }}>
                  <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                    <Icon name="search" size="large" />
                  </Box>
                  <Box variant="h3" padding={{ bottom: 'xs' }}>
                    No demos match the filters
                  </Box>
                  <Box variant="p">Try changing the filters or search term</Box>
                </Box>
              }
              pagination={
                <Pagination
                  currentPageIndex={currentPageIndex}
                  onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
                  pagesCount={Math.ceil(filteredDemos.length / itemsPerPage)}
                  ariaLabels={{
                    nextPageLabel: 'Next page',
                    previousPageLabel: 'Previous page',
                    pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
                  }}
                />
              }
              header={
                <Header counter={filteredDemos.length > 0 ? `(${filteredDemos.length})` : undefined}>
                  Available demos
                </Header>
              }
            />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
