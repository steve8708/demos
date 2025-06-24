// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// Area chart data - representing two sites over time
export const areaChartData = [
  {
    title: 'Site 1',
    type: 'area',
    data: [
      { x: new Date('2024-01-01'), y: 20 },
      { x: new Date('2024-01-02'), y: 30 },
      { x: new Date('2024-01-03'), y: 25 },
      { x: new Date('2024-01-04'), y: 35 },
      { x: new Date('2024-01-05'), y: 40 },
      { x: new Date('2024-01-06'), y: 45 },
      { x: new Date('2024-01-07'), y: 38 },
      { x: new Date('2024-01-08'), y: 42 },
      { x: new Date('2024-01-09'), y: 48 },
      { x: new Date('2024-01-10'), y: 50 },
      { x: new Date('2024-01-11'), y: 45 },
      { x: new Date('2024-01-12'), y: 52 },
    ],
    color: '#688AE8',
  },
  {
    title: 'Site 2',
    type: 'area',
    data: [
      { x: new Date('2024-01-01'), y: 15 },
      { x: new Date('2024-01-02'), y: 18 },
      { x: new Date('2024-01-03'), y: 22 },
      { x: new Date('2024-01-04'), y: 20 },
      { x: new Date('2024-01-05'), y: 25 },
      { x: new Date('2024-01-06'), y: 28 },
      { x: new Date('2024-01-07'), y: 32 },
      { x: new Date('2024-01-08'), y: 30 },
      { x: new Date('2024-01-09'), y: 35 },
      { x: new Date('2024-01-10'), y: 38 },
      { x: new Date('2024-01-11'), y: 40 },
      { x: new Date('2024-01-12'), y: 42 },
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
      { x: 'Q1', y: 35 },
      { x: 'Q2', y: 52 },
      { x: 'Q3', y: 41 },
      { x: 'Q4', y: 22 },
      { x: 'Q5', y: 44 },
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
