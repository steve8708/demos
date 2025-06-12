// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { BoardProps } from '@cloudscape-design/board-components/board';

export interface WeatherDataType {
  icon: string;
  title: string;
  description: string;
  disableContentPaddings?: boolean;
  provider?: React.JSXElementConstructor<{ children: React.ReactElement }>;
  header: React.JSXElementConstructor<Record<string, never>>;
  content: React.JSXElementConstructor<Record<string, never>>;
  footer?: React.JSXElementConstructor<Record<string, never>>;
  staticMinHeight?: number;
}

export type WeatherWidgetItem = BoardProps.Item<WeatherDataType>;

export type WeatherWidgetConfig = Pick<WeatherWidgetItem, 'definition' | 'data'>;

export interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  weatherCode: number;
  isDay: boolean;
  time: string;
}

export interface ForecastData {
  time: string[];
  temperature: number[];
  humidity: number[];
  precipitation: number[];
  windSpeed: number[];
  weatherCode: number[];
}

export interface WeatherAPIResponse {
  current: CurrentWeatherData;
  hourly: ForecastData;
  daily: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
    precipitation: number[];
    windSpeedMax: number[];
    weatherCode: number[];
  };
}
