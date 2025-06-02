// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed: number;
  wind_direction: number;
  time: string;
}

export interface ForecastData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
}
