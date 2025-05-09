// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import {
  PopulationByStateData,
  PopulationData,
  PopulationMetricData,
  PopulationTrendData,
  StatePopulationData,
} from './interfaces';

// Base API URL for DataUSA
const BASE_URL = 'https://datausa.io/api/data';

class USPopulationDataProvider {
  // Fetch national population data
  async getNationalPopulationData(): Promise<PopulationData[]> {
    console.log('Fetching national population data');

    const params = new URLSearchParams({
      drilldowns: 'Nation',
      measures: 'Population',
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Response error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  // Fetch state population data
  async getStatePopulationData(): Promise<StatePopulationData[]> {
    console.log('Fetching state population data');

    const params = new URLSearchParams({
      drilldowns: 'State',
      measures: 'Population',
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Response error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  // Get population trend data (formatted for charts)
  async getPopulationTrend(): Promise<PopulationTrendData[]> {
    console.log('Getting population trend data');

    const nationalData = await this.getNationalPopulationData();

    // Sort by year (ascending)
    const sortedData = [...nationalData].sort((a, b) => parseInt(a.Year) - parseInt(b.Year));

    return sortedData.map(item => ({
      year: parseInt(item.Year),
      population: item.Population,
    }));
  }

  // Get population data by state (for the most recent available year or specified year)
  async getPopulationByState(year?: number): Promise<PopulationByStateData[]> {
    console.log('Getting population by state data for year:', year);

    const stateData = await this.getStatePopulationData();

    // Filter by specified year or get the most recent year
    let targetYear = year;
    if (!targetYear) {
      const years = stateData.map(item => parseInt(item.Year));
      targetYear = Math.max(...years);
      console.log('No year specified, using most recent year:', targetYear);
    }

    const filteredData = stateData.filter(item => parseInt(item.Year) === targetYear);
    console.log(`Found ${filteredData.length} states for year ${targetYear}`);

    return filteredData.map(item => ({
      state: item.State,
      population: item.Population,
      year: parseInt(item.Year),
    }));
  }

  // Calculate population growth rate
  async getPopulationGrowthRate(): Promise<number> {
    console.log('Calculating population growth rate');

    const trendData = await this.getPopulationTrend();

    if (trendData.length < 2) {
      return 0;
    }

    // Sort by year in ascending order
    const sortedData = [...trendData].sort((a, b) => a.year - b.year);

    // Get the two most recent years
    const current = sortedData[sortedData.length - 1];
    const previous = sortedData[sortedData.length - 2];

    // Calculate growth rate
    const growthRate = ((current.population - previous.population) / previous.population) * 100;
    console.log(`Growth rate calculated: ${growthRate.toFixed(2)}%`);

    return growthRate;
  }

  // Get key metrics for the dashboard
  async getKeyMetrics(): Promise<PopulationMetricData[]> {
    console.log('Getting key metrics');

    const trendData = await this.getPopulationTrend();
    const growthRate = await this.getPopulationGrowthRate();

    // Sort by year in ascending order
    const sortedData = [...trendData].sort((a, b) => a.year - b.year);

    if (sortedData.length < 2) {
      return [];
    }

    // Get the two most recent years
    const current = sortedData[sortedData.length - 1];
    const previous = sortedData[sortedData.length - 2];

    // Format population numbers
    const formatter = new Intl.NumberFormat('en-US');

    return [
      {
        title: 'Total Population',
        value: formatter.format(current.population),
        previousValue: formatter.format(previous.population),
        change: ((current.population - previous.population) / previous.population) * 100,
        changeType: current.population - previous.population > 0 ? 'positive' : 'negative',
        unit: '',
      },
      {
        title: 'Growth Rate',
        value: `${growthRate.toFixed(2)}%`,
        changeType: growthRate > 0 ? 'positive' : 'negative',
        unit: '%',
      },
      {
        title: 'Current Year',
        value: current.year,
        previousValue: previous.year,
        unit: '',
      },
    ];
  }

  // Get all available years from the dataset
  async getAvailableYears(): Promise<number[]> {
    console.log('Getting available years');

    const nationalData = await this.getNationalPopulationData();
    const years = nationalData.map(item => parseInt(item.Year));
    const uniqueSortedYears = [...new Set(years)].sort((a, b) => b - a); // Sort years in descending order

    console.log('Available years:', uniqueSortedYears);
    return uniqueSortedYears;
  }

  // Get all state names from the dataset
  async getAvailableStates(): Promise<string[]> {
    console.log('Getting available states');

    const stateData = await this.getStatePopulationData();
    const states = stateData.map(item => item.State);
    const uniqueSortedStates = [...new Set(states)].sort(); // Sort states alphabetically

    console.log(`Found ${uniqueSortedStates.length} unique states`);
    return uniqueSortedStates;
  }
}

export default new USPopulationDataProvider();
