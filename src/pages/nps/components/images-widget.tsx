// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import Cards from '@cloudscape-design/components/cards';
import Link from '@cloudscape-design/components/link';
import Pagination from '@cloudscape-design/components/pagination';

import { fetchParkByCode } from '../services/nps-api';

interface ImagesWidgetProps {
  parkCode: string;
}

export function ImagesWidget({ parkCode }: ImagesWidgetProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchParkByCode(parkCode);

        if (response.data && response.data.length > 0) {
          setImages(response.data[0].images || []);
        } else {
          setError('No park images found');
        }
      } catch (err) {
        console.error('Failed to load park images:', err);
        setError('Failed to load park images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [parkCode]);

  // Calculate paginated images
  const paginatedImages = images.slice((currentPageIndex - 1) * itemsPerPage, currentPageIndex * itemsPerPage);

  if (loading) {
    return (
      <Container header={<Header variant="h2">Park Images</Header>}>
        <Box textAlign="center" padding={{ top: 'l', bottom: 'l' }}>
          <Spinner size="normal" />
          <Box variant="p" padding={{ top: 's' }}>
            Loading park images...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container header={<Header variant="h2">Park Images</Header>}>
        <Alert type="error" header="Error loading park images">
          {error}
        </Alert>
      </Container>
    );
  }

  if (images.length === 0) {
    return (
      <Container header={<Header variant="h2">Park Images</Header>}>
        <Box textAlign="center" padding={{ top: 'm', bottom: 'm' }}>
          <Box variant="p">No images available for this park.</Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      header={
        <Header variant="h2" counter={images.length > 0 ? `(${images.length})` : undefined}>
          Park Images
        </Header>
      }
    >
      <Cards
        cardDefinition={{
          header: item => (
            <Box fontWeight="bold" fontSize="heading-m">
              {item.title}
            </Box>
          ),
          sections: [
            {
              id: 'image',
              content: item => (
                <img
                  src={item.url}
                  alt={item.altText || item.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              ),
            },
            {
              id: 'description',
              header: 'Caption',
              content: item => item.caption || 'No caption available',
            },
            {
              id: 'credit',
              header: 'Credit',
              content: item => item.credit || 'Unknown',
            },
            {
              id: 'link',
              content: item => (
                <Link href={item.url} external>
                  View full-size image
                </Link>
              ),
            },
          ],
        }}
        cardsPerRow={[
          { cards: 1, minWidth: 0 },
          { cards: 2, minWidth: 500 },
          { cards: 3, minWidth: 900 },
        ]}
        items={paginatedImages}
        loadingText="Loading park images"
        trackBy="url"
        empty={
          <Box textAlign="center" color="inherit" padding={{ top: 'l', bottom: 'l' }}>
            <Box variant="p">No images available for this park.</Box>
          </Box>
        }
        pagination={
          <Pagination
            currentPageIndex={currentPageIndex}
            onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
            pagesCount={Math.ceil(images.length / itemsPerPage)}
            ariaLabels={{
              nextPageLabel: 'Next page',
              previousPageLabel: 'Previous page',
              pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
            }}
          />
        }
      />
    </Container>
  );
}
