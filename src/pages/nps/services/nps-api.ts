// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { NPSResponse, Park, Alert, Event, VisitorCenter } from '../types';

const API_KEY = '58IiAxB4LHJoUGCtdQfUJjZhkh7r0E0pqsrcUzPd';
const BASE_URL = 'https://developer.nps.gov/api/v1';

// Helper function to make API requests
async function fetchFromNPS<T>(endpoint: string, params: Record<string, string> = {}): Promise<NPSResponse<T>> {
  const queryParams = new URLSearchParams({
    ...params,
    api_key: API_KEY,
  });

  const url = `${BASE_URL}/${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NPS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as NPSResponse<T>;
  } catch (error) {
    console.error(`Error fetching from NPS API (${endpoint}):`, error);
    throw error;
  }
}

// Fetch list of parks
export async function fetchParks(): Promise<NPSResponse<Park>> {
  return fetchFromNPS<Park>('parks', { limit: '500' }); // Large limit to get all parks
}

// Fetch a specific park by park code
export async function fetchParkByCode(parkCode: string): Promise<NPSResponse<Park>> {
  return fetchFromNPS<Park>('parks', { parkCode });
}

// Fetch alerts for a specific park
export async function fetchAlerts(parkCode: string): Promise<NPSResponse<Alert>> {
  return fetchFromNPS<Alert>('alerts', { parkCode });
}

// Fetch events for a specific park
export async function fetchEvents(parkCode: string): Promise<NPSResponse<Event>> {
  return fetchFromNPS<Event>('events', { parkCode, limit: '10' });
}

// Fetch visitor centers for a specific park
export async function fetchVisitorCenters(parkCode: string): Promise<NPSResponse<VisitorCenter>> {
  return fetchFromNPS<VisitorCenter>('visitorcenters', { parkCode });
}

// Fetch thingstodo for a specific park
export async function fetchThingsToDo(parkCode: string): Promise<NPSResponse<any>> {
  return fetchFromNPS('thingstodo', { parkCode, limit: '10' });
}

// Fetch campgrounds for a specific park
export async function fetchCampgrounds(parkCode: string): Promise<NPSResponse<any>> {
  return fetchFromNPS('campgrounds', { parkCode });
}

// Fetch amenities for a specific park - this is harder to get from the API, so we'll create a simulated function
export async function fetchAmenities(parkCode: string): Promise<any> {
  // First, fetch the park details to get activities
  const parkData = await fetchParkByCode(parkCode);

  if (parkData.data.length === 0) {
    return { data: [] };
  }

  const park = parkData.data[0];

  // Convert activities to amenities format
  const amenities = park.activities.map(activity => ({
    id: activity.id,
    name: activity.name,
    available: true,
  }));

  return { data: amenities };
}

// Get visitor statistics (this endpoint doesn't exist in the NPS API, so we'll create simulated data)
export async function fetchVisitorStats(parkCode: string): Promise<any> {
  // Simulate a fetch call
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate random visitor stats
  const currentYear = new Date().getFullYear();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Create visitor data for the past 12 months with realistic seasonal patterns
  const visitorData = months.map((month, index) => {
    // Create seasonal patterns - more visitors in summer, fewer in winter
    let seasonalFactor = 1;
    if (index >= 4 && index <= 8) {
      // May through September (summer)
      seasonalFactor = 3;
    } else if (index <= 1 || index >= 10) {
      // Winter months
      seasonalFactor = 0.5;
    }

    // Base number with some randomness
    const baseVisitors = Math.floor(30000 * seasonalFactor * (0.8 + Math.random() * 0.4));

    return {
      month,
      visitors: baseVisitors,
      year: index < new Date().getMonth() ? currentYear : currentYear - 1,
    };
  });

  // Total annual visitors (sum of all monthly values)
  const annualVisitors = visitorData.reduce((sum, month) => sum + month.visitors, 0);

  return {
    data: {
      monthlyVisitors: visitorData,
      annualVisitors,
      averageMonthlyVisitors: Math.round(annualVisitors / 12),
      peakMonth: visitorData.reduce((max, month) => (max.visitors > month.visitors ? max : month), visitorData[0]),
    },
  };
}
