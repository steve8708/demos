import React from 'react';
import { IconSunHigh, IconMoonStars } from '@tabler/icons-react';

interface SunMoonContentProps {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
}

export const SunMoonContent: React.FC<SunMoonContentProps> = ({ sunrise, sunset, moonrise, moonset }) => {
  return (
    <div className="sun-moon-content">
      <div className="sun-section">
        <div className="icon-container">
          <IconSunHigh size={24} />
        </div>
        <div className="times-container">
          <div className="time-item">
            <span className="label">Sunrise</span>
            <span className="time">{sunrise}</span>
          </div>
          <div className="time-item">
            <span className="label">Sunset</span>
            <span className="time">{sunset}</span>
          </div>
        </div>
      </div>
      <div className="moon-section">
        <div className="icon-container">
          <IconMoonStars size={24} />
        </div>
        <div className="times-container">
          <div className="time-item">
            <span className="label">Moonrise</span>
            <span className="time">{moonrise}</span>
          </div>
          <div className="time-item">
            <span className="label">Moonset</span>
            <span className="time">{moonset}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
