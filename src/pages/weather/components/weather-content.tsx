// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';

import { CitySelection } from './city-selection';
import { CurrentWeather } from './current-weather';
import { WeatherForecast } from './weather-forecast';
import { useWeatherData } from '../utils/use-weather-data';
import { HourlyForecast } from './hourly-forecast';
import { City } from '../utils/types';

export function WeatherContent() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const { currentWeather, hourlyForecast, dailyForecast, loading, error } = useWeatherData(selectedCity);

  const handleCitySelected = (city: City) => {
    setSelectedCity(city);
  };

  return (
    <SpaceBetween size="l">
      <Container>
        <SpaceBetween size="m">
          <CitySelection onCitySelected={handleCitySelected} />

          {error && (
            <Alert type="error" header="Error loading weather data">
              {error}
            </Alert>
          )}

          {loading && !error && (
            <Box textAlign="center" padding={{ top: 'xl', bottom: 'xl' }}>
              <Spinner size="large" />
              <Box variant="h3" padding={{ top: 's' }}>
                Loading weather data...
              </Box>
            </Box>
          )}

          {!loading && !error && selectedCity && currentWeather && (
            <Grid
              gridDefinition={[
                { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 12, xl: 12 } },
                { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 6, xl: 6 } },
                { colspan: { default: 12, xs: 12, s: 12, m: 12, l: 6, xl: 6 } },
              ]}
            >
              <div>
                <CurrentWeather city={selectedCity} data={currentWeather} />
              </div>
              <div>
                <Container
                  header={
                    <Header variant="h2" description="24-hour forecast breakdown">
                      Hourly Forecast
                    </Header>
                  }
                >
                  <HourlyForecast data={hourlyForecast} />
                </Container>
              </div>
              <div>
                <Container
                  header={
                    <Header variant="h2" description="7-day weather outlook">
                      Daily Forecast
                    </Header>
                  }
                >
                  <WeatherForecast data={dailyForecast} />
                </Container>
              </div>
            </Grid>
          )}

          {!loading && !error && !selectedCity && (
            <Box textAlign="center" padding={{ top: 'xxl', bottom: 'xxl' }}>
              <Box variant="h3">Select a city to view weather information</Box>
              <Box variant="p" padding={{ top: 's' }}>
                Enter a city name in the search box above to get started
              </Box>
            </Box>
          )}
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
