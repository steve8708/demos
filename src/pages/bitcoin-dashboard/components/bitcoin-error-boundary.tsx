// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { Component, ErrorInfo, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class BitcoinErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Bitcoin Dashboard error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container header={<Header variant="h2">Error Loading Bitcoin Dashboard</Header>}>
          <Alert type="error" header="An error occurred while loading the Bitcoin dashboard">
            <Box variant="p">We encountered a problem while loading the Bitcoin price data. This might be due to:</Box>
            <ul>
              <li>API rate limiting from CoinGecko</li>
              <li>Network connectivity issues</li>
              <li>Unexpected data format changes</li>
            </ul>
            <Box variant="p">Error details: {this.state.error?.message || 'Unknown error'}</Box>
            <Box padding={{ top: 'l' }}>
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
              >
                Retry
              </Button>
            </Box>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}
