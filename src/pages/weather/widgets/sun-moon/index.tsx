import React from 'react';
import { useWeatherContext } from '../../../context/weather-context';
import { BaseWidget } from '../base-widget';
import { SunMoonContent } from './components/sun-moon-content';

export const SunMoon = () => {
  const { data } = useWeatherContext();

  if (!data) {
    return null;
  }

  const { sunrise, sunset, moonrise, moonset } = data.daily[0];

  return (
    <BaseWidget title="Sun & Moon">
      <SunMoonContent sunrise={sunrise} sunset={sunset} moonrise={moonrise} moonset={moonset} />
    </BaseWidget>
  );
};
