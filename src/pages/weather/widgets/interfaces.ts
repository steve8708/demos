// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { BoardProps } from '@cloudscape-design/board-components/board';

import * as icons from '../icons';

export interface WidgetDataType {
  icon: keyof typeof icons;
  title: string;
  description: string;
  disableContentPaddings?: boolean;
  provider?: React.JSXElementConstructor<{ children: React.ReactElement }>;
  header: React.JSXElementConstructor<Record<string, never>>;
  content: React.JSXElementConstructor<Record<string, never>>;
  footer?: React.JSXElementConstructor<Record<string, never>>;
  staticMinHeight?: number;
}

export type WeatherDashboardWidgetItem = BoardProps.Item<WidgetDataType>;

export type WidgetConfig = Pick<WeatherDashboardWidgetItem, 'definition' | 'data'>;

export interface CurrentWeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  apparentTemperature: number;
  precipitation: number;
  time: string;
  isDay: number;
}

export interface DailyForecastData {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  sunrise: string;
  sunset: string;
  precipitationSum: number;
  precipitationProbabilityMax: number;
}

export interface WeatherData {
  current: CurrentWeatherData;
  daily: DailyForecastData[];
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  name: string;
  isLoading: boolean;
  error: string | null;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  name: string;
}

export const weatherCodeToDescription: { [key: number]: string } = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};
