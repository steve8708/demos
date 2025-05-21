// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// Default location (Seattle)
export const DEFAULT_LOCATION = {
  name: 'Seattle',
  latitude: 47.6062,
  longitude: -122.3321,
};

// List of predefined locations
export const PREDEFINED_LOCATIONS = [
  DEFAULT_LOCATION,
  {
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    name: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    name: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
  },
  {
    name: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    name: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
  },
];

// Temperature and unit related constants
export const UNITS = {
  metric: {
    temperature: '°C',
    speed: 'km/h',
    distance: 'km',
    precipitation: 'mm',
  },
  imperial: {
    temperature: '°F',
    speed: 'mph',
    distance: 'mi',
    precipitation: 'in',
  },
};

// Weather code mapping to descriptive text and icon names
export const WEATHER_CODES = {
  0: { description: 'Clear sky', icon: 'sun' },
  1: { description: 'Mainly clear', icon: 'cloud-sun' },
  2: { description: 'Partly cloudy', icon: 'cloud-sun' },
  3: { description: 'Overcast', icon: 'cloud' },
  45: { description: 'Fog', icon: 'fog' },
  48: { description: 'Depositing rime fog', icon: 'fog' },
  51: { description: 'Light drizzle', icon: 'cloud-drizzle' },
  53: { description: 'Moderate drizzle', icon: 'cloud-drizzle' },
  55: { description: 'Dense drizzle', icon: 'cloud-drizzle' },
  56: { description: 'Light freezing drizzle', icon: 'snowflake' },
  57: { description: 'Dense freezing drizzle', icon: 'snowflake' },
  61: { description: 'Slight rain', icon: 'cloud-rain' },
  63: { description: 'Moderate rain', icon: 'cloud-rain' },
  65: { description: 'Heavy rain', icon: 'cloud-rain' },
  66: { description: 'Light freezing rain', icon: 'snowflake' },
  67: { description: 'Heavy freezing rain', icon: 'snowflake' },
  71: { description: 'Slight snow fall', icon: 'snowflake' },
  73: { description: 'Moderate snow fall', icon: 'snowflake' },
  75: { description: 'Heavy snow fall', icon: 'snowflake' },
  77: { description: 'Snow grains', icon: 'snowflake' },
  80: { description: 'Slight rain showers', icon: 'cloud-rain' },
  81: { description: 'Moderate rain showers', icon: 'cloud-rain' },
  82: { description: 'Violent rain showers', icon: 'cloud-rain' },
  85: { description: 'Slight snow showers', icon: 'snowflake' },
  86: { description: 'Heavy snow showers', icon: 'snowflake' },
  95: { description: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { description: 'Thunderstorm with slight hail', icon: 'cloud-lightning' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
};
