// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WeatherResponse, SelectedLocation } from './types';
import { formatTemperature, formatWindDirection } from './api';

export const createWeatherDetailsItems = (
  location: SelectedLocation,
  current: WeatherResponse['current'],
  current_units: WeatherResponse['current_units'],
) => [
  {
    label: 'Location',
    value: `${location.name}, ${location.admin1 ? `${location.admin1}, ` : ''}${location.country}`,
  },
  {
    label: 'Feels like',
    value: formatTemperature(current.apparent_temperature, current_units.apparent_temperature),
  },
  {
    label: 'Humidity',
    value: `${current.relative_humidity_2m}${current_units.relative_humidity_2m}`,
  },
  {
    label: 'Precipitation',
    value: `${current.precipitation}${current_units.precipitation}`,
  },
  {
    label: 'Wind',
    value: `${current.wind_speed_10m}${current_units.wind_speed_10m} ${formatWindDirection(current.wind_direction_10m)}`,
  },
  {
    label: 'Wind gusts',
    value: `${current.wind_gusts_10m}${current_units.wind_gusts_10m}`,
  },
  {
    label: 'Pressure',
    value: `${Math.round(current.pressure_msl)}${current_units.pressure_msl}`,
  },
  {
    label: 'Cloud cover',
    value: `${current.cloud_cover}${current_units.cloud_cover}`,
  },
];
