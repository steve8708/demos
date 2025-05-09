// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { PriceHistory } from '../types';

interface PriceChartProps {
  priceHistory: PriceHistory[];
}

export function PriceChart({ priceHistory }: PriceChartProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  // Get unique currencies from history
  const currencies = Array.from(new Set(priceHistory.map(item => item.currency)));

  // Filter history by selected currency and sort by timestamp (oldest first)
  const filteredHistory = priceHistory
    .filter(item => item.currency === selectedCurrency)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Prepare chart data
  const chartData = filteredHistory.map(item => ({
    timestamp: new Date(item.timestamp).getTime(),
    price: item.price,
  }));

  // Find min and max prices for y-axis scaling
  const prices = chartData.map(item => item.price);
  const minPrice = Math.min(...prices) * 0.995; // Add 0.5% padding
  const maxPrice = Math.max(...prices) * 1.005; // Add 0.5% padding

  // Canvas dimensions
  const width = 900;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 30, left: 80 };

  // Convert data point to x,y coordinates
  const getX = (timestamp: number) => {
    if (chartData.length <= 1) return padding.left;
    const minTime = chartData[0].timestamp;
    const maxTime = chartData[chartData.length - 1].timestamp;
    const timeRange = maxTime - minTime;
    return padding.left + ((timestamp - minTime) / timeRange) * (width - padding.left - padding.right);
  };

  const getY = (price: number) => {
    if (maxPrice === minPrice) return height / 2; // Center if no range
    return (
      height - padding.bottom - ((price - minPrice) / (maxPrice - minPrice)) * (height - padding.top - padding.bottom)
    );
  };

  // Generate path for the line
  const generateLinePath = () => {
    if (chartData.length === 0) return '';

    return chartData.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return path + `${command}${getX(point.timestamp)},${getY(point.price)} `;
    }, '');
  };

  // Format price for y-axis
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Generate y-axis ticks
  const generateYTicks = () => {
    const tickCount = 5;
    const ticks = [];

    for (let i = 0; i < tickCount; i++) {
      const price = minPrice + (i / (tickCount - 1)) * (maxPrice - minPrice);
      ticks.push(price);
    }

    return ticks;
  };

  const yTicks = generateYTicks();

  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={
            <SegmentedControl
              selectedId={selectedCurrency}
              onChange={({ detail }) => setSelectedCurrency(detail.selectedId)}
              options={currencies.map(currency => ({ id: currency, text: currency }))}
            />
          }
        >
          Bitcoin Price Trend
        </Header>
      }
    >
      <SpaceBetween size="m">
        {priceHistory.length === 0 ? (
          <Box textAlign="center" padding="l">
            Waiting for price data...
          </Box>
        ) : (
          <div>
            <svg width={width} height={height} style={{ overflow: 'visible' }}>
              {/* X and Y axes */}
              <line
                x1={padding.left}
                y1={height - padding.bottom}
                x2={width - padding.right}
                y2={height - padding.bottom}
                stroke="#cccccc"
                strokeWidth={1}
              />
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={height - padding.bottom}
                stroke="#cccccc"
                strokeWidth={1}
              />

              {/* Y-axis ticks and labels */}
              {yTicks.map((tick, index) => (
                <React.Fragment key={index}>
                  <line
                    x1={padding.left - 5}
                    y1={getY(tick)}
                    x2={padding.left}
                    y2={getY(tick)}
                    stroke="#cccccc"
                    strokeWidth={1}
                  />
                  <text
                    x={padding.left - 10}
                    y={getY(tick)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={12}
                    fill="#666666"
                  >
                    {formatPrice(tick)}
                  </text>
                </React.Fragment>
              ))}

              {/* Line chart */}
              <path d={generateLinePath()} fill="none" stroke="#0073bb" strokeWidth={2} />

              {/* Data points */}
              {chartData.map((point, index) => (
                <circle key={index} cx={getX(point.timestamp)} cy={getY(point.price)} r={3} fill="#0073bb" />
              ))}
            </svg>

            <Box textAlign="center" padding="s" fontSize="body-s" color="text-body-secondary">
              Price chart shows data points collected during this session
            </Box>
          </div>
        )}
      </SpaceBetween>
    </Container>
  );
}
