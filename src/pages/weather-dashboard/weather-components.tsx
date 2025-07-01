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
import Button from '@cloudscape-design/components/button';
import Spinner from '@cloudscape-design/components/spinner';
import Badge from '@cloudscape-design/components/badge';
import Alert from '@cloudscape-design/components/alert';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import LineChart from '@cloudscape-design/components/line-chart';
import BarChart from '@cloudscape-design/components/bar-chart';

import { WeatherLocation, WeatherResponse, WEATHER_CODES, CurrentWeather, DailyWeather } from './weather-types';

export function LocationSearchComponent({
  onLocationSelect,
  loading,
}: {
  onLocationSelect: (location: WeatherLocation) => void;
  loading: boolean;
}) {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([]);
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
      searchLocations(searchValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const suggestions = searchResults.map(location => ({
    value: `${location.name}, ${location.admin1 ? `${location.admin1}, ` : ''}${location.country}`,
    data: location,
  }));

  const handleSelect = (option: { value: string; data: WeatherLocation }) => {
    setSearchValue(option.value);
    onLocationSelect(option.data);
  };

  return (
    <Container header={<Header variant="h2">Search Location</Header>}>
      <Autosuggest
        value={searchValue}
        onChange={({ detail }) => setSearchValue(detail.value)}
        onSelect={({ detail }) => handleSelect(detail.selectedOption)}
        options={suggestions}
        placeholder="Type a city name..."
        ariaLabel="City search"
        statusType={searchLoading ? 'loading' : 'finished'}
        loadingText="Searching for cities..."
        disabled={loading}
        empty="No cities found"
        enteredTextLabel={value => `Use: "${value}"`}
      />
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

  // Prepare chart data
  const temperatureData = next24Hours.map(item => ({
    x: new Date(item.time),
    y: item.temperature,
  }));

  const precipitationData = next24Hours.map(item => ({
    x: new Date(item.time),
    y: item.precipitation,
  }));

  const chartCommonProps = {
    height: 200,
    xDomain: [new Date(next24Hours[0].time), new Date(next24Hours[next24Hours.length - 1].time)],
    xTitle: 'Time',
    i18nStrings: {
      filterLabel: 'Filter data',
      filterPlaceholder: 'Filter data',
      filterSelectedAriaLabel: 'selected',
      legendAriaLabel: 'Legend',
      chartAriaRoleDescription: 'line chart',
      xAxisAriaRoleDescription: 'x axis',
      yAxisAriaRoleDescription: 'y axis',
    },
    loadingText: 'Loading chart',
    errorText: 'Error loading data.',
    empty: <Box textAlign="center">No data available</Box>,
  };

  return (
    <Container header={<Header variant="h2">24-Hour Forecast</Header>}>
      <SpaceBetween size="m">
        {/* Temperature Chart */}
        <Container header={<Header variant="h3">Temperature Trend</Header>}>
          <LineChart
            {...chartCommonProps}
            series={[
              {
                title: 'Temperature (°C)',
                type: 'line',
                data: temperatureData,
                color: '#0073bb',
              },
            ]}
            yTitle="Temperature (°C)"
            xScaleType="time"
          />
        </Container>

        {/* Precipitation Chart */}
        <Container header={<Header variant="h3">Precipitation Probability</Header>}>
          <BarChart
            {...chartCommonProps}
            series={[
              {
                title: 'Precipitation (%)',
                type: 'bar',
                data: precipitationData,
                color: '#1f77b4',
              },
            ]}
            yTitle="Precipitation (%)"
            xScaleType="time"
          />
        </Container>

        {/* Cards view for detailed hourly data */}
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
      </SpaceBetween>
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

  // Prepare chart data
  const maxTempData = forecast.map(item => ({
    x: new Date(item.date),
    y: item.maxTemp,
  }));

  const minTempData = forecast.map(item => ({
    x: new Date(item.date),
    y: item.minTemp,
  }));

  const precipitationData = forecast.map(item => ({
    x: new Date(item.date),
    y: item.precipitation,
  }));

  const chartCommonProps = {
    height: 200,
    xDomain: [new Date(forecast[0].date), new Date(forecast[forecast.length - 1].date)],
    xTitle: 'Date',
    i18nStrings: {
      filterLabel: 'Filter data',
      filterPlaceholder: 'Filter data',
      filterSelectedAriaLabel: 'selected',
      legendAriaLabel: 'Legend',
      chartAriaRoleDescription: 'line chart',
      xAxisAriaRoleDescription: 'x axis',
      yAxisAriaRoleDescription: 'y axis',
    },
    loadingText: 'Loading chart',
    errorText: 'Error loading data.',
    empty: <Box textAlign="center">No data available</Box>,
  };

  return (
    <Container header={<Header variant="h2">7-Day Forecast</Header>}>
      <SpaceBetween size="m">
        {/* Temperature Range Chart */}
        <Container header={<Header variant="h3">Temperature Range</Header>}>
          <LineChart
            {...chartCommonProps}
            series={[
              {
                title: 'Max Temperature (°C)',
                type: 'line',
                data: maxTempData,
                color: '#d62b28',
              },
              {
                title: 'Min Temperature (°C)',
                type: 'line',
                data: minTempData,
                color: '#0073bb',
              },
            ]}
            yTitle="Temperature (°C)"
            xScaleType="time"
          />
        </Container>

        {/* Precipitation Chart */}
        <Container header={<Header variant="h3">Precipitation Probability</Header>}>
          <BarChart
            {...chartCommonProps}
            series={[
              {
                title: 'Precipitation (%)',
                type: 'bar',
                data: precipitationData,
                color: '#1f77b4',
              },
            ]}
            yTitle="Precipitation (%)"
            xScaleType="time"
          />
        </Container>

        {/* Scrollable daily cards */}
        <Box>
          <Header variant="h3">Daily Details</Header>
          <Box style={{ overflowX: 'auto', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '16px', minWidth: 'fit-content', padding: '8px 0' }}>
              {forecast.map((item, index) => {
                const dayName = new Date(item.date).toLocaleDateString('en-US', {
                  timeZone: timezone,
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });
                const weather = WEATHER_CODES[item.weatherCode] || { description: 'Unknown', icon: 'cloud' };

                return (
                  <div
                    key={item.date}
                    style={{
                      minWidth: '160px',
                      padding: '16px',
                      border: '1px solid #e9ebed',
                      borderRadius: '8px',
                      backgroundColor: '#fafbfc',
                      textAlign: 'center',
                    }}
                  >
                    <SpaceBetween size="s">
                      <Box variant="h4">{dayName}</Box>
                      <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                        <Box variant="h3" color="text-status-error">
                          {Math.round(item.maxTemp)}°
                        </Box>
                        <Box variant="p" color="text-body-secondary">
                          {Math.round(item.minTemp)}°
                        </Box>
                      </SpaceBetween>
                      <Box variant="small">{weather.description}</Box>
                      <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                        {item.precipitation > 0 && <Badge color="blue">{item.precipitation}%</Badge>}
                        <Badge color={item.uvIndex > 7 ? 'red' : item.uvIndex > 5 ? 'blue' : 'green'}>
                          UV {Math.round(item.uvIndex)}
                        </Badge>
                      </SpaceBetween>
                    </SpaceBetween>
                  </div>
                );
              })}
            </div>
          </Box>
        </Box>
      </SpaceBetween>
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
