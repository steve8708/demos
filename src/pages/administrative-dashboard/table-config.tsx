// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { TableProps } from '@cloudscape-design/components/table';

export interface AdminItem {
  id: string;
  name: string;
  status: string;
  department: string;
  region: string;
  lastActivity: string;
  value: number;
  priority: string;
}

export const tableData: AdminItem[] = [
  {
    id: '1',
    name: 'Resource Alpha',
    status: 'Active',
    department: 'Engineering',
    region: 'us-east-1',
    lastActivity: '2024-01-15',
    value: 150,
    priority: 'High',
  },
  {
    id: '2',
    name: 'Resource Beta',
    status: 'Inactive',
    department: 'Marketing',
    region: 'us-west-2',
    lastActivity: '2024-01-14',
    value: 75,
    priority: 'Medium',
  },
  {
    id: '3',
    name: 'Resource Gamma',
    status: 'Active',
    department: 'Sales',
    region: 'eu-west-1',
    lastActivity: '2024-01-16',
    value: 200,
    priority: 'Low',
  },
  {
    id: '4',
    name: 'Resource Delta',
    status: 'Active',
    department: 'Engineering',
    region: 'ap-southeast-1',
    lastActivity: '2024-01-13',
    value: 125,
    priority: 'High',
  },
  {
    id: '5',
    name: 'Resource Epsilon',
    status: 'Maintenance',
    department: 'Operations',
    region: 'us-east-1',
    lastActivity: '2024-01-12',
    value: 90,
    priority: 'Medium',
  },
  {
    id: '6',
    name: 'Resource Zeta',
    status: 'Active',
    department: 'Finance',
    region: 'us-west-2',
    lastActivity: '2024-01-17',
    value: 175,
    priority: 'Low',
  },
  {
    id: '7',
    name: 'Resource Eta',
    status: 'Active',
    department: 'HR',
    region: 'eu-central-1',
    lastActivity: '2024-01-11',
    value: 110,
    priority: 'High',
  },
  {
    id: '8',
    name: 'Resource Theta',
    status: 'Inactive',
    department: 'Engineering',
    region: 'ap-northeast-1',
    lastActivity: '2024-01-10',
    value: 65,
    priority: 'Medium',
  },
  {
    id: '9',
    name: 'Resource Iota',
    status: 'Active',
    department: 'Marketing',
    region: 'us-east-1',
    lastActivity: '2024-01-18',
    value: 140,
    priority: 'Low',
  },
  {
    id: '10',
    name: 'Resource Kappa',
    status: 'Active',
    department: 'Sales',
    region: 'eu-west-3',
    lastActivity: '2024-01-09',
    value: 85,
    priority: 'High',
  },
];

export const columnDefinitions: TableProps.ColumnDefinition<AdminItem>[] = [
  {
    id: 'name',
    header: 'Resource Name',
    cell: item => item.name,
    sortingField: 'name',
    isRowHeader: true,
    width: 200,
    minWidth: 150,
  },
  {
    id: 'status',
    header: 'Status',
    cell: item => item.status,
    sortingField: 'status',
    width: 120,
    minWidth: 100,
  },
  {
    id: 'department',
    header: 'Department',
    cell: item => item.department,
    sortingField: 'department',
    width: 150,
    minWidth: 120,
  },
  {
    id: 'region',
    header: 'Region',
    cell: item => item.region,
    sortingField: 'region',
    width: 140,
    minWidth: 120,
  },
  {
    id: 'lastActivity',
    header: 'Last Activity',
    cell: item => new Date(item.lastActivity).toLocaleDateString(),
    sortingField: 'lastActivity',
    width: 130,
    minWidth: 110,
  },
  {
    id: 'value',
    header: 'Value',
    cell: item => `$${item.value.toLocaleString()}`,
    sortingField: 'value',
    width: 100,
    minWidth: 80,
  },
  {
    id: 'priority',
    header: 'Priority',
    cell: item => item.priority,
    sortingField: 'priority',
    width: 100,
    minWidth: 80,
  },
];
