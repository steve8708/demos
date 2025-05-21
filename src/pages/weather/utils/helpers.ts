// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { WEATHER_CODES } from './constants';

// Format a temperature with the appropriate unit
export function formatTemperature(temp: number, unit: 'metric' | 'imperial'): string {
  return `${Math.round(temp)}${unit === 'metric' ? '°C' : '°F'}`;
}

// Format wind speed with the appropriate unit
export function formatWindSpeed(speed: number, unit: 'metric' | 'imperial'): string {
  return `${Math.round(speed)} ${unit === 'metric' ? 'km/h' : 'mph'}`;
}

// Format precipitation with the appropriate unit
export function formatPrecipitation(amount: number, unit: 'metric' | 'imperial'): string {
  return `${amount.toFixed(1)} ${unit === 'metric' ? 'mm' : 'in'}`;
}

// Format a date in a user-friendly way
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

// Format a time in a user-friendly way
export function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// Get a description for a weather code
export function getWeatherDescription(code: number): string {
  return WEATHER_CODES[code as keyof typeof WEATHER_CODES]?.description || 'Unknown';
}

// Convert degrees to a compass direction
export function degreesToDirection(degrees: number): string {
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
    'N',
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Format UV index with a corresponding risk level
export function formatUVIndex(uvIndex: number): { value: number; level: string } {
  let level = 'Low';

  if (uvIndex >= 3 && uvIndex < 6) {
    level = 'Moderate';
  } else if (uvIndex >= 6 && uvIndex < 8) {
    level = 'High';
  } else if (uvIndex >= 8 && uvIndex < 11) {
    level = 'Very High';
  } else if (uvIndex >= 11) {
    level = 'Extreme';
  }

  return { value: uvIndex, level };
}

// Format a percentage
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

// Get hourly data for the current day
export function getCurrentDayHourlyData(hourlyData: any, hourlyTimeData: string[]): any[] {
  if (!hourlyData || !hourlyTimeData || hourlyTimeData.length === 0) {
    return [];
  }

  const now = new Date();
  const currentDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentDayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const hourlyEntries = hourlyTimeData.map((time, index) => {
    const timeDate = new Date(time);
    return {
      time: timeDate,
      // Map all hourly data properties for this time
      ...Object.keys(hourlyData).reduce(
        (obj, key) => {
          obj[key] = hourlyData[key][index];
          return obj;
        },
        {} as Record<string, any>,
      ),
    };
  });

  return hourlyEntries.filter(entry => entry.time >= currentDayStart && entry.time < currentDayEnd);
}

// Prepare data for charts
export function prepareChartData(hourlyTimeData: string[], temperatureData: number[]): any[] {
  if (!hourlyTimeData || !temperatureData || hourlyTimeData.length === 0) {
    return [];
  }

  return hourlyTimeData.slice(0, 24).map((time, index) => ({
    x: formatTime(time),
    y: Math.round(temperatureData[index]),
  }));
}
