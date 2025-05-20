// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Cards from '@cloudscape-design/components/cards';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { DailyWeather, DailyUnits, getWeatherInfo, formatDate, formatTemperature } from './weather-utils';

interface WeatherForecastProps {
  data: DailyWeather;
  units: DailyUnits;
}

export default function WeatherForecast({ data, units }: WeatherForecastProps) {
  // Create forecast items for each day
  const forecastItems = data.time.map((time, index) => {
    const weather = getWeatherInfo(data.weather_code[index]);
    return {
      date: time,
      formattedDate: formatDate(time),
      maxTemp: data.temperature_2m_max[index],
      minTemp: data.temperature_2m_min[index],
      precipitation: data.precipitation_sum[index],
      weatherCode: data.weather_code[index],
      weatherIcon: weather.icon,
      weatherDescription: weather.description,
    };
  });

  return (
    <Container header={<Header variant="h2">7-Day Forecast</Header>}>
      <Cards
        items={forecastItems}
        cardDefinition={{
          header: item => (
            <div className="forecast-card-header">
              <span className="forecast-day">{item.formattedDate}</span>
            </div>
          ),
          sections: [
            {
              id: 'weather',
              content: item => (
                <div className="forecast-weather">
                  <span className="forecast-icon">{item.weatherIcon}</span>
                  <StatusIndicator type="info">{item.weatherDescription}</StatusIndicator>
                </div>
              ),
            },
            {
              id: 'temperature',
              header: 'Temperature',
              content: item => (
                <div className="forecast-temperature">
                  <div className="max-temp">
                    <span className="temp-label">High:</span>
                    <span className="temp-value">{formatTemperature(item.maxTemp, units.temperature_2m_max)}</span>
                  </div>
                  <div className="min-temp">
                    <span className="temp-label">Low:</span>
                    <span className="temp-value">{formatTemperature(item.minTemp, units.temperature_2m_min)}</span>
                  </div>
                </div>
              ),
            },
            {
              id: 'precipitation',
              header: 'Precipitation',
              content: item => (
                <div className="forecast-precipitation">
                  {item.precipitation} {units.precipitation_sum}
                </div>
              ),
            },
          ],
        }}
        cardsPerRow={[
          { cards: 1, minWidth: 0 },
          { cards: 2, minWidth: 400 },
          { cards: 3, minWidth: 600 },
          { cards: 4, minWidth: 900 },
          { cards: 7, minWidth: 1200 },
        ]}
        trackBy="date"
        empty={<div className="forecast-empty">No forecast data available</div>}
      />
    </Container>
  );
}
