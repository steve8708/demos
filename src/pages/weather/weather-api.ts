// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WeatherData {
  current: {
    temperature: number;
    windSpeed: number;
    humidity: number;
    weatherCode: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature: number[];
    humidity: number[];
    windSpeed: number[];
    weatherCode: number[];
  };
  daily: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
    weatherCode: number[];
    windSpeed: number[];
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

const WEATHER_CODE_DESCRIPTIONS: Record<number, { description: string; icon: string; emoji: string }> = {
  0: { description: 'Clear sky', icon: 'weather-sunny', emoji: '☀️' },
  1: { description: 'Mainly clear', icon: 'weather-sunny', emoji: '🌤️' },
  2: { description: 'Partly cloudy', icon: 'weather-partly-cloudy', emoji: '⛅' },
  3: { description: 'Overcast', icon: 'weather-cloudy', emoji: '☁️' },
  45: { description: 'Fog', icon: 'weather-fog', emoji: '🌫️' },
  48: { description: 'Depositing rime fog', icon: 'weather-fog', emoji: '🌫️' },
  51: { description: 'Light drizzle', icon: 'weather-drizzle', emoji: '🌦️' },
  53: { description: 'Moderate drizzle', icon: 'weather-drizzle', emoji: '🌦️' },
  55: { description: 'Dense drizzle', icon: 'weather-drizzle', emoji: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: 'weather-drizzle', emoji: '🌨️' },
  57: { description: 'Dense freezing drizzle', icon: 'weather-drizzle', emoji: '🌨️' },
  61: { description: 'Slight rain', icon: 'weather-rain', emoji: '🌧️' },
  63: { description: 'Moderate rain', icon: 'weather-rain', emoji: '🌧️' },
  65: { description: 'Heavy rain', icon: 'weather-rain', emoji: '⛈️' },
  66: { description: 'Light freezing rain', icon: 'weather-rain', emoji: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: 'weather-rain', emoji: '🌨️' },
  71: { description: 'Slight snow fall', icon: 'weather-snow', emoji: '🌨️' },
  73: { description: 'Moderate snow fall', icon: 'weather-snow', emoji: '❄️' },
  75: { description: 'Heavy snow fall', icon: 'weather-snow', emoji: '🌨️' },
  77: { description: 'Snow grains', icon: 'weather-snow', emoji: '❄️' },
  80: { description: 'Slight rain showers', icon: 'weather-rain', emoji: '🌦️' },
  81: { description: 'Moderate rain showers', icon: 'weather-rain', emoji: '🌧️' },
  82: { description: 'Violent rain showers', icon: 'weather-rain', emoji: '⛈️' },
  85: { description: 'Slight snow showers', icon: 'weather-snow', emoji: '🌨️' },
  86: { description: 'Heavy snow showers', icon: 'weather-snow', emoji: '❄️' },
  95: { description: 'Thunderstorm', icon: 'weather-thunderstorm', emoji: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: 'weather-thunderstorm', emoji: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'weather-thunderstorm', emoji: '⛈️' },
};

export function getWeatherDescription(code: number): { description: string; icon: string; emoji: string } {
  return WEATHER_CODE_DESCRIPTIONS[code] || { description: 'Unknown', icon: 'status-info', emoji: '❓' };
}

export async function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Fallback to New York
      resolve({
        latitude: 40.7128,
        longitude: -74.006,
        name: 'New York',
        country: 'US',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        try {
          // Get location name from coordinates using reverse geocoding
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1`,
          );
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            resolve({
              latitude,
              longitude,
              name: result.name || result.admin1 || 'Unknown Location',
              country: result.country_code || 'Unknown',
            });
          } else {
            resolve({
              latitude,
              longitude,
              name: 'Current Location',
              country: '',
            });
          }
        } catch (error) {
          resolve({
            latitude,
            longitude,
            name: 'Current Location',
            country: '',
          });
        }
      },
      () => {
        // Fallback to New York if geolocation fails
        resolve({
          latitude: 40.7128,
          longitude: -74.006,
          name: 'New York',
          country: 'US',
        });
      },
      { timeout: 10000 },
    );
  });
}

export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  const currentTime = new Date();
  const endTime = new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max',
    timezone: 'auto',
    start_date: currentTime.toISOString().split('T')[0],
    end_date: endTime.toISOString().split('T')[0],
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    current: {
      temperature: Math.round(data.current.temperature_2m),
      windSpeed: Math.round(data.current.wind_speed_10m),
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      time: data.current.time,
    },
    hourly: {
      time: data.hourly.time.slice(0, 24), // Next 24 hours
      temperature: data.hourly.temperature_2m.slice(0, 24).map((temp: number) => Math.round(temp)),
      humidity: data.hourly.relative_humidity_2m.slice(0, 24),
      windSpeed: data.hourly.wind_speed_10m.slice(0, 24).map((speed: number) => Math.round(speed)),
      weatherCode: data.hourly.weather_code.slice(0, 24),
    },
    daily: {
      time: data.daily.time,
      temperatureMax: data.daily.temperature_2m_max.map((temp: number) => Math.round(temp)),
      temperatureMin: data.daily.temperature_2m_min.map((temp: number) => Math.round(temp)),
      weatherCode: data.daily.weather_code,
      windSpeed: data.daily.wind_speed_10m_max.map((speed: number) => Math.round(speed)),
    },
  };
}

export async function searchLocations(query: string): Promise<LocationData[]> {
  if (!query.trim()) {
    return [];
  }

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`,
  );

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results) {
    return [];
  }

  return data.results.map((result: any) => ({
    latitude: result.latitude,
    longitude: result.longitude,
    name: result.name,
    country: result.country_code || result.country || '',
  }));
}
