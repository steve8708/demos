// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    is_day: boolean;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    wind_speed_10m: number[];
    relative_humidity_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
  };
}

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: WeatherData['current'];
  hourly: WeatherData['hourly'];
  daily: WeatherData['daily'];
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

export interface GeocodingApiResponse {
  results?: GeocodingResult[];
}
