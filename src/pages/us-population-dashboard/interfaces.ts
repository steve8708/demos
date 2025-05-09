// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface PopulationData {
  'ID Nation': string;
  Nation: string;
  'ID Year': number;
  Year: string;
  Population: number;
  'Slug Nation': string;
}

export interface StatePopulationData {
  'ID State': string;
  State: string;
  'ID Year': number;
  Year: string;
  Population: number;
  'Slug State': string;
}

export interface PopulationTrendData {
  year: number;
  population: number;
}

export interface PopulationByStateData {
  state: string;
  population: number;
  year: number;
}

export interface PopulationMetricData {
  title: string;
  value: string | number;
  previousValue?: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  unit?: string;
}

export interface FilterState {
  selectedYears: number[];
  selectedStates: string[];
  comparisonYear: number | null;
}
