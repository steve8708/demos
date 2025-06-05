// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  rain: number[];
  showers: number[];
  snowfall: number[];
  snow_depth: number[];
  weather_code: number[];
  pressure_msl: number[];
  surface_pressure: number[];
  cloud_cover: number[];
  visibility: number[];
  evapotranspiration: number[];
  et0_fao_evapotranspiration: number[];
  vapour_pressure_deficit: number[];
  wind_speed_10m: number[];
  wind_speed_80m: number[];
  wind_speed_120m: number[];
  wind_speed_180m: number[];
  wind_direction_10m: number[];
  wind_direction_80m: number[];
  wind_direction_120m: number[];
  wind_direction_180m: number[];
  wind_gusts_10m: number[];
  temperature_80m: number[];
  temperature_120m: number[];
  temperature_180m: number[];
  soil_temperature_0cm: number[];
  soil_temperature_6cm: number[];
  soil_temperature_18cm: number[];
  soil_temperature_54cm: number[];
  soil_moisture_0_1cm: number[];
  soil_moisture_1_3cm: number[];
  soil_moisture_3_9cm: number[];
  soil_moisture_9_27cm: number[];
  soil_moisture_27_81cm: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  daylight_duration: number[];
  sunshine_duration: number[];
  uv_index_max: number[];
  uv_index_clear_sky_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  precipitation_probability_min: number[];
  precipitation_probability_mean: number[];
  weather_code_max: number[];
  weather_code_min: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
  shortwave_radiation_sum: number[];
  et0_fao_evapotranspiration: number[];
}

export interface WeatherUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  is_day: string;
  precipitation: string;
  rain: string;
  showers: string;
  snowfall: string;
  weather_code: string;
  cloud_cover: string;
  pressure_msl: string;
  surface_pressure: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  wind_gusts_10m: string;
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: WeatherUnits;
  current: CurrentWeather;
  hourly_units?: WeatherUnits;
  hourly?: HourlyWeather;
  daily_units?: WeatherUnits;
  daily?: DailyWeather;
}

export interface WeatherDisplayData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
    precipitation: number;
    time: string;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    precipitationProbability: number;
    windSpeed: number;
  }>;
  hourlyForecast: Array<{
    time: string;
    temperature: number;
    precipitation: number;
    humidity: number;
    windSpeed: number;
  }>;
}

export interface WeatherError {
  error: boolean;
  reason: string;
}

// Weather condition mappings based on WMO Weather interpretation codes
export const WEATHER_CONDITIONS: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: 'status-positive' },
  1: { description: 'Mainly clear', icon: 'status-positive' },
  2: { description: 'Partly cloudy', icon: 'status-info' },
  3: { description: 'Overcast', icon: 'status-warning' },
  45: { description: 'Fog', icon: 'status-warning' },
  48: { description: 'Depositing rime fog', icon: 'status-warning' },
  51: { description: 'Light drizzle', icon: 'status-info' },
  53: { description: 'Moderate drizzle', icon: 'status-info' },
  55: { description: 'Dense drizzle', icon: 'status-warning' },
  56: { description: 'Light freezing drizzle', icon: 'status-warning' },
  57: { description: 'Dense freezing drizzle', icon: 'status-negative' },
  61: { description: 'Slight rain', icon: 'status-info' },
  63: { description: 'Moderate rain', icon: 'status-warning' },
  65: { description: 'Heavy rain', icon: 'status-negative' },
  66: { description: 'Light freezing rain', icon: 'status-warning' },
  67: { description: 'Heavy freezing rain', icon: 'status-negative' },
  71: { description: 'Slight snow fall', icon: 'status-info' },
  73: { description: 'Moderate snow fall', icon: 'status-warning' },
  75: { description: 'Heavy snow fall', icon: 'status-negative' },
  77: { description: 'Snow grains', icon: 'status-warning' },
  80: { description: 'Slight rain showers', icon: 'status-info' },
  81: { description: 'Moderate rain showers', icon: 'status-warning' },
  82: { description: 'Violent rain showers', icon: 'status-negative' },
  85: { description: 'Slight snow showers', icon: 'status-info' },
  86: { description: 'Heavy snow showers', icon: 'status-negative' },
  95: { description: 'Thunderstorm', icon: 'status-negative' },
  96: { description: 'Thunderstorm with slight hail', icon: 'status-negative' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'status-negative' },
};
