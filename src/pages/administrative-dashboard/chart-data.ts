// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// Area chart data - representing two sites over time
export const areaChartData = [
  {
    title: 'Site 1',
    type: 'area',
    data: [
      { x: 'x1', y: 25 },
      { x: 'x2', y: 30 },
      { x: 'x3', y: 35 },
      { x: 'x4', y: 40 },
      { x: 'x5', y: 42 },
      { x: 'x6', y: 45 },
      { x: 'x7', y: 40 },
      { x: 'x8', y: 35 },
      { x: 'x9', y: 30 },
      { x: 'x10', y: 28 },
      { x: 'x11', y: 32 },
      { x: 'x12', y: 38 },
    ],
    color: '#688AE8',
  },
  {
    title: 'Site 2',
    type: 'area',
    data: [
      { x: 'x1', y: 45 },
      { x: 'x2', y: 48 },
      { x: 'x3', y: 50 },
      { x: 'x4', y: 52 },
      { x: 'x5', y: 48 },
      { x: 'x6', y: 45 },
      { x: 'x7', y: 42 },
      { x: 'x8', y: 40 },
      { x: 'x9', y: 38 },
      { x: 'x10', y: 35 },
      { x: 'x11', y: 40 },
      { x: 'x12', y: 42 },
    ],
    color: '#C33D69',
  },
];

// Bar chart data
export const barChartData = [
  {
    title: 'Site 1',
    type: 'bar',
    data: [
      { x: 'x1', y: 35 },
      { x: 'x2', y: 52 },
      { x: 'x3', y: 41 },
      { x: 'x4', y: 22 },
      { x: 'x5', y: 44 },
    ],
    color: '#688AE8',
  },
];

// Performance goal threshold
export const performanceGoal = {
  y: 35,
  color: '#5F6B7A',
  pattern: 'dashed',
};
