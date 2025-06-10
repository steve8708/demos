// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { WeatherCondition } from '../types';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: 'small' | 'medium' | 'large';
  showDescription?: boolean;
  showStatusIndicator?: boolean;
}

export function WeatherIcon({
  condition,
  size = 'medium',
  showDescription = true,
  showStatusIndicator = false,
}: WeatherIconProps) {
  const emojiSizes = {
    small: '1.2rem',
    medium: '1.8rem',
    large: '2.5rem',
  };

  const descriptionVariants = {
    small: 'small',
    medium: 'p',
    large: 'h3',
  } as const;

  return (
    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
      <Box
        fontSize={emojiSizes[size]}
        display="inline-block"
        margin={{ right: 'xs' }}
        role="img"
        aria-label={condition.description}
      >
        {condition.emoji}
      </Box>

      {showDescription && (
        <Box variant={descriptionVariants[size]} color="inherit">
          {condition.description}
        </Box>
      )}

      {showStatusIndicator && <StatusIndicator type={condition.statusType}>{condition.description}</StatusIndicator>}
    </SpaceBetween>
  );
}

interface SimpleWeatherIconProps {
  condition: WeatherCondition;
  size?: 'small' | 'medium' | 'large';
}

export function SimpleWeatherIcon({ condition, size = 'medium' }: SimpleWeatherIconProps) {
  const emojiSizes = {
    small: '1rem',
    medium: '1.5rem',
    large: '2rem',
  };

  return (
    <Box
      fontSize={emojiSizes[size]}
      display="inline-block"
      role="img"
      aria-label={condition.description}
      textAlign="center"
    >
      {condition.emoji}
    </Box>
  );
}
