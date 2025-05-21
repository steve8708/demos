// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { z } from 'zod';

// Define API schemas with zod for type validation
const CurrentWeatherSchema = z.object({
  temperature: z.number(),
  windspeed: z.number(),
  winddirection: z.number(),
  weathercode: z.number(),
  time: z.string(),
  is_day: z.number().optional(),
  apparent_temperature: z.number().optional(),
  precipitation: z.number().optional(),
  humidity: z.number().optional(),
  cloudcover: z.number().optional(),
  pressure_msl: z.number().optional(),
  surface_pressure: z.number().optional(),
  visibility: z.number().optional(),
});

const DailyUnitsSchema = z.object({
  time: z.string(),
  weathercode: z.string(),
  temperature_2m_max: z.string(),
  temperature_2m_min: z.string(),
  sunrise: z.string(),
  sunset: z.string(),
  precipitation_sum: z.string().optional(),
  precipitation_probability_max: z.string().optional(),
});

const DailyWeatherSchema = z.object({
  time: z.array(z.string()),
  weathercode: z.array(z.number()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
  sunrise: z.array(z.string()),
  sunset: z.array(z.string()),
  precipitation_sum: z.array(z.number()).optional(),
  precipitation_probability_max: z.array(z.number()).optional(),
});

const HourlyUnitsSchema = z.object({
  time: z.string(),
  temperature_2m: z.string(),
  weathercode: z.string(),
  windspeed_10m: z.string(),
  winddirection_10m: z.string(),
  precipitation_probability: z.string().optional(),
  precipitation: z.string().optional(),
});

const HourlyWeatherSchema = z.object({
  time: z.array(z.string()),
  temperature_2m: z.array(z.number()),
  weathercode: z.array(z.number()),
  windspeed_10m: z.array(z.number()),
  winddirection_10m: z.array(z.number()),
  precipitation_probability: z.array(z.number()).optional(),
  precipitation: z.array(z.number()).optional(),
});

const WeatherResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number(),
  utc_offset_seconds: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  elevation: z.number(),
  current_units: z.object({}).optional(),
  current: CurrentWeatherSchema.optional(),
  daily_units: DailyUnitsSchema.optional(),
  daily: DailyWeatherSchema.optional(),
  hourly_units: HourlyUnitsSchema.optional(),
  hourly: HourlyWeatherSchema.optional(),
});

// Export types
export type CurrentWeather = z.infer<typeof CurrentWeatherSchema>;
export type DailyUnits = z.infer<typeof DailyUnitsSchema>;
export type DailyWeather = z.infer<typeof DailyWeatherSchema>;
export type HourlyUnits = z.infer<typeof HourlyUnitsSchema>;
export type HourlyWeather = z.infer<typeof HourlyWeatherSchema>;
export type WeatherResponse = z.infer<typeof WeatherResponseSchema>;

// Default locations for quick selection
export const predefinedLocations = [
  { name: 'New York', latitude: 40.7128, longitude: -74.006 },
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Berlin', latitude: 52.52, longitude: 13.405 },
  { name: 'Cairo', latitude: 30.0444, longitude: 31.2357 },
  { name: 'Rio de Janeiro', latitude: -22.9068, longitude: -43.1729 },
  { name: 'Moscow', latitude: 55.7558, longitude: 37.6173 },
  { name: 'Mumbai', latitude: 19.076, longitude: 72.8777 },
];

// Weather conditions mapping for displaying human-readable weather conditions
export const weatherCodeMapping: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: 'sun' },
  1: { label: 'Mainly clear', icon: 'sun' },
  2: { label: 'Partly cloudy', icon: 'cloud' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'cloud' },
  48: { label: 'Depositing rime fog', icon: 'cloud' },
  51: { label: 'Light drizzle', icon: 'rain' },
  53: { label: 'Moderate drizzle', icon: 'rain' },
  55: { label: 'Dense drizzle', icon: 'rain' },
  56: { label: 'Light freezing drizzle', icon: 'snow' },
  57: { label: 'Dense freezing drizzle', icon: 'snow' },
  61: { label: 'Slight rain', icon: 'rain' },
  63: { label: 'Moderate rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  66: { label: 'Light freezing rain', icon: 'snow' },
  67: { label: 'Heavy freezing rain', icon: 'snow' },
  71: { label: 'Slight snow fall', icon: 'snow' },
  73: { label: 'Moderate snow fall', icon: 'snow' },
  75: { label: 'Heavy snow fall', icon: 'snow' },
  77: { label: 'Snow grains', icon: 'snow' },
  80: { label: 'Slight rain showers', icon: 'rain' },
  81: { label: 'Moderate rain showers', icon: 'rain' },
  82: { label: 'Violent rain showers', icon: 'rain' },
  85: { label: 'Slight snow showers', icon: 'snow' },
  86: { label: 'Heavy snow showers', icon: 'snow' },
  95: { label: 'Thunderstorm', icon: 'lightning' },
  96: { label: 'Thunderstorm with slight hail', icon: 'lightning' },
  99: { label: 'Thunderstorm with heavy hail', icon: 'lightning' },
};

// Formats a date string to a readable format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Formats a timestamp to a readable time format
export function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Returns the appropriate weather code information based on the weather code
export function getWeatherInfo(code: number): { label: string; icon: string } {
  return weatherCodeMapping[code] || { label: 'Unknown', icon: 'question' };
}

// Interface for API request parameters
export interface FetchWeatherParams {
  latitude: number;
  longitude: number;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  windSpeedUnit?: 'kmh' | 'ms' | 'mph' | 'kn';
  precipitationUnit?: 'mm' | 'inch';
  timeZone?: string;
  forecastDays?: number;
}

// Fetches weather data from the Open Meteo API
export async function fetchWeatherData({
  latitude,
  longitude,
  temperatureUnit = 'celsius',
  windSpeedUnit = 'kmh',
  precipitationUnit = 'mm',
  timeZone = 'auto',
  forecastDays = 7,
}: FetchWeatherParams): Promise<WeatherResponse> {
  try {
    console.log(`Fetching weather data for coordinates: ${latitude}, ${longitude}`);

    const url = new URL('https://api.open-meteo.com/v1/forecast');

    // Add required parameters
    url.searchParams.append('latitude', latitude.toString());
    url.searchParams.append('longitude', longitude.toString());
    url.searchParams.append('timezone', timeZone);
    url.searchParams.append('forecast_days', forecastDays.toString());

    // Add units
    url.searchParams.append('temperature_unit', temperatureUnit);
    url.searchParams.append('wind_speed_unit', windSpeedUnit);
    url.searchParams.append('precipitation_unit', precipitationUnit);

    // Add data parameters
    url.searchParams.append(
      'current',
      'temperature,windspeed,winddirection,weathercode,is_day,apparent_temperature,precipitation,humidity,cloudcover,pressure_msl,surface_pressure,visibility',
    );
    url.searchParams.append(
      'hourly',
      'temperature_2m,weathercode,windspeed_10m,winddirection_10m,precipitation_probability,precipitation',
    );
    url.searchParams.append(
      'daily',
      'weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max',
    );

    console.log(`API request URL: ${url.toString()}`);

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);

    try {
      const parsedData = WeatherResponseSchema.parse(data);
      console.log('Successfully parsed weather data');
      return parsedData;
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Error in fetchWeatherData:', error);
    throw error;
  }
}

// Searches for a location by name using the Open Meteo Geocoding API
export async function searchLocation(query: string): Promise<{ name: string; latitude: number; longitude: number }[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    console.log(`Searching for location: ${query}`);

    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.append('name', query);
    url.searchParams.append('count', '10');
    url.searchParams.append('language', 'en');
    url.searchParams.append('format', 'json');

    console.log(`Geocoding API request URL: ${url.toString()}`);

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Geocoding API response:', data);

    if (!data.results) {
      return [];
    }

    return data.results.map((result: any) => ({
      name: result.name + (result.admin1 ? `, ${result.admin1}` : '') + (result.country ? `, ${result.country}` : ''),
      latitude: result.latitude,
      longitude: result.longitude,
    }));
  } catch (error) {
    console.error('Error in searchLocation:', error);
    return [];
  }
}
