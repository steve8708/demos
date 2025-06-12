// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { createContext, useContext, useState, ReactNode } from 'react';

import { WeatherLocation } from '../widgets/interfaces';
import { DEFAULT_LOCATIONS } from '../services/weather-api';

interface WeatherContextType {
  currentLocation: WeatherLocation;
  setCurrentLocation: (location: WeatherLocation) => void;
  searchLoading: boolean;
  setSearchLoading: (loading: boolean) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
}

interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [currentLocation, setCurrentLocation] = useState<WeatherLocation>(DEFAULT_LOCATIONS[0]); // Default to New York
  const [searchLoading, setSearchLoading] = useState(false);

  return (
    <WeatherContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        searchLoading,
        setSearchLoading,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
