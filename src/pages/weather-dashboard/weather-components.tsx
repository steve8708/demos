// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';
import Box from '@cloudscape-design/components/box';
import Cards from '@cloudscape-design/components/cards';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import Select from '@cloudscape-design/components/select';
import Spinner from '@cloudscape-design/components/spinner';
import Badge from '@cloudscape-design/components/badge';
import Alert from '@cloudscape-design/components/alert';

import { WeatherLocation, WeatherResponse, WEATHER_CODES, CurrentWeather, DailyWeather } from './weather-types';

export function LocationSearchComponent({
  onLocationSelect,
  loading,
}: {
  onLocationSelect: (location: WeatherLocation) => void;
  loading: boolean;
}) {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ label: string; value: string } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`,
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(searchText);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const locationOptions = searchResults.map(location => ({
    label: `${location.name}, ${location.admin1 ? `${location.admin1}, ` : ''}${location.country}`,
    value: location.id.toString(),
  }));

  const handleLocationSelect = () => {
    if (selectedLocation) {
      const location = searchResults.find(l => l.id.toString() === selectedLocation.value);
      if (location) {
        onLocationSelect(location);
      }
    }
  };

  return (
    <Container header={<Header variant="h2">Location Search</Header>}>
      <SpaceBetween size="m">
        <Box>
          <Input
            value={searchText}
            onChange={({ detail }) => setSearchText(detail.value)}
            placeholder="Search for a city..."
            disabled={loading}
          />
        </Box>

        {searchLoading && (
          <Box textAlign="center">
            <Spinner />
          </Box>
        )}

        {locationOptions.length > 0 && (
          <SpaceBetween size="s">
            <Select
              selectedOption={selectedLocation}
              onChange={({ detail }) => setSelectedLocation(detail.selectedOption)}
              options={locationOptions}
              placeholder="Select a location"
              disabled={loading}
            />
            <Button variant="primary" onClick={handleLocationSelect} disabled={!selectedLocation || loading}>
              Get Weather
            </Button>
          </SpaceBetween>
        )}
      </SpaceBetween>
    </Container>
  );
}

export function CurrentWeatherCard({
  weather,
  location,
  timezone,
}: {
  weather: CurrentWeather;
  location: WeatherLocation;
  timezone: string;
}) {
  const weatherInfo = WEATHER_CODES[weather.weather_code] || { description: 'Unknown', icon: 'cloud' };
  const temperature = Math.round(weather.temperature);
  const feelsLike = Math.round(weather.temperature + (weather.humidity - 50) * 0.1);

  return (
    <Container header={<Header variant="h2">Current Weather</Header>}>
      <SpaceBetween size="m">
        <Box>
          <SpaceBetween size="s">
            <Box variant="h1" fontSize="display-l">
              {temperature}°C
            </Box>
            <Box variant="h3" color="text-status-info">
              {weatherInfo.description}
            </Box>
            <Box variant="small" color="text-body-secondary">
              {location.name}, {location.country}
            </Box>
            <Box variant="small" color="text-body-secondary">
              Last updated:{' '}
              {new Date(weather.time).toLocaleTimeString('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Box>
          </SpaceBetween>
        </Box>

        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
          <SpaceBetween size="s">
            <Box>
              <Box variant="awsui-key-label">Feels like</Box>
              <Box variant="h3">{feelsLike}°C</Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Humidity</Box>
              <Box variant="h3">{weather.humidity}%</Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Pressure</Box>
              <Box variant="h3">{weather.pressure} hPa</Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">UV Index</Box>
              <Box variant="h3">
                <Badge color={weather.uv_index > 7 ? 'red' : weather.uv_index > 5 ? 'blue' : 'green'}>
                  {weather.uv_index}
                </Badge>
              </Box>
            </Box>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box>
              <Box variant="awsui-key-label">Wind Speed</Box>
              <Box variant="h3">{weather.wind_speed} km/h</Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Wind Direction</Box>
              <Box variant="h3">{weather.wind_direction}°</Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Visibility</Box>
              <Box variant="h3">{weather.visibility} km</Box>
            </Box>
          </SpaceBetween>
        </Grid>
      </SpaceBetween>
    </Container>
  );
}

export function HourlyForecastComponent({ hourly, timezone }: { hourly: WeatherResponse['hourly']; timezone: string }) {
  const next24Hours = hourly.time.slice(0, 24).map((time, index) => ({
    time,
    temperature: hourly.temperature_2m[index],
    precipitation: hourly.precipitation_probability[index],
    weatherCode: hourly.weather_code[index],
    windSpeed: hourly.wind_speed_10m[index],
  }));

  return (
    <Container header={<Header variant="h2">24-Hour Forecast</Header>}>
      <Cards
        cardDefinition={{
          header: item => {
            const hour = new Date(item.time).toLocaleTimeString('en-US', {
              timeZone: timezone,
              hour: 'numeric',
              hour12: true,
            });
            return hour;
          },
          sections: [
            {
              id: 'temperature',
              content: item => <Box variant="h3">{Math.round(item.temperature)}°C</Box>,
            },
            {
              id: 'weather',
              content: item => {
                const weather = WEATHER_CODES[item.weatherCode] || { description: 'Unknown', icon: 'cloud' };
                return (
                  <SpaceBetween size="xs">
                    <Box variant="small">{weather.description}</Box>
                    {item.precipitation > 0 && <Badge color="blue">{item.precipitation}% rain</Badge>}
                  </SpaceBetween>
                );
              },
            },
          ],
        }}
        cardsPerRow={[
          { cards: 2, minWidth: 0 },
          { cards: 4, minWidth: 600 },
          { cards: 6, minWidth: 900 },
          { cards: 8, minWidth: 1200 },
        ]}
        items={next24Hours}
        trackBy="time"
        visibleSections={['temperature', 'weather']}
      />
    </Container>
  );
}

export function DailyForecastComponent({ daily, timezone }: { daily: DailyWeather; timezone: string }) {
  const forecast = daily.time.slice(0, 7).map((date, index) => ({
    date,
    weatherCode: daily.weather_code[index],
    maxTemp: daily.temperature_2m_max[index],
    minTemp: daily.temperature_2m_min[index],
    precipitation: daily.precipitation_probability_max[index],
    windSpeed: daily.wind_speed_10m_max[index],
    uvIndex: daily.uv_index_max[index],
  }));

  return (
    <Container header={<Header variant="h2">7-Day Forecast</Header>}>
      <Cards
        cardDefinition={{
          header: item => {
            const dayName = new Date(item.date).toLocaleDateString('en-US', {
              timeZone: timezone,
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            });
            return dayName;
          },
          sections: [
            {
              id: 'temperature',
              content: item => (
                <SpaceBetween size="xs" direction="horizontal">
                  <Box variant="h3">{Math.round(item.maxTemp)}°</Box>
                  <Box variant="p" color="text-body-secondary">
                    {Math.round(item.minTemp)}°
                  </Box>
                </SpaceBetween>
              ),
            },
            {
              id: 'weather',
              content: item => {
                const weather = WEATHER_CODES[item.weatherCode] || { description: 'Unknown', icon: 'cloud' };
                return (
                  <SpaceBetween size="xs">
                    <Box variant="small">{weather.description}</Box>
                    <SpaceBetween size="xs" direction="horizontal">
                      {item.precipitation > 0 && <Badge color="blue">{item.precipitation}%</Badge>}
                      <Badge color={item.uvIndex > 7 ? 'red' : item.uvIndex > 5 ? 'blue' : 'green'}>
                        UV {item.uvIndex}
                      </Badge>
                    </SpaceBetween>
                  </SpaceBetween>
                );
              },
            },
          ],
        }}
        cardsPerRow={[
          { cards: 1, minWidth: 0 },
          { cards: 2, minWidth: 600 },
          { cards: 3, minWidth: 900 },
          { cards: 7, minWidth: 1200 },
        ]}
        items={forecast}
        trackBy="date"
        visibleSections={['temperature', 'weather']}
      />
    </Container>
  );
}

export function WeatherLoadingState() {
  return (
    <Container>
      <Box textAlign="center" padding="xxl">
        <SpaceBetween size="m">
          <Spinner size="large" />
          <Box variant="h3">Loading weather data...</Box>
        </SpaceBetween>
      </Box>
    </Container>
  );
}

export function WeatherErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Alert
      statusIconAriaLabel="Error"
      type="error"
      header="Weather data could not be loaded"
      action={<Button onClick={onRetry}>Retry</Button>}
    >
      {error}
    </Alert>
  );
}
