// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { WeatherData, ForecastData } from '../types';

const BASE_URL = 'https://api.open-meteo.com/v1';

// Alternative simpler implementation
export async function getCurrentWeatherSimple(latitude: number, longitude: number): Promise<WeatherData> {
  const url = new URL(`${BASE_URL}/forecast`);
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set('timezone', 'auto');

  console.log('Fetching simple current weather from:', url.toString());

  try {
    const response = await fetch(url.toString());

    console.log('Simple response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Simple API Error Response:', errorText);
      throw new Error(`Weather API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Simple weather data:', data);

    if (!data.current_weather) {
      throw new Error('Invalid response format from weather API - no current_weather data found');
    }

    // Convert from simple format to our expected format
    return {
      temperature: data.current_weather.temperature ?? 0,
      humidity: 50, // Not available in simple format, using placeholder
      apparent_temperature: data.current_weather.temperature ?? 0, // Not available, using temperature
      weather_code: data.current_weather.weathercode ?? 0,
      wind_speed: data.current_weather.windspeed ?? 0,
      wind_direction: data.current_weather.winddirection ?? 0,
      time: data.current_weather.time ?? new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching simple current weather:', error);
    throw error;
  }
}
