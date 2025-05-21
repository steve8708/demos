// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DEFAULT_LOCATION } from '../utils/constants';
import { useWeatherData } from '../hooks/use-weather';

export interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
}

interface WeatherContextType {
  location: WeatherLocation;
  setLocation: (location: WeatherLocation) => void;
  units: 'metric' | 'imperial';
  setUnits: (units: 'metric' | 'imperial') => void;
  weatherData: any;
  loading: boolean;
  error: string | null;
  fetchWeatherData: (location?: WeatherLocation) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<WeatherLocation>(DEFAULT_LOCATION);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  const { data: weatherData, loading, error, fetchWeatherData: fetchData } = useWeatherData();

  useEffect(() => {
    fetchData(location, units);
  }, [units]);

  const fetchWeatherData = (locationOverride?: WeatherLocation) => {
    const locationToUse = locationOverride || location;
    fetchData(locationToUse, units);
  };

  const value = {
    location,
    setLocation,
    units,
    setUnits,
    weatherData,
    loading,
    error,
    fetchWeatherData,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export const useWeatherContext = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
};
