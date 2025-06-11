// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import Toggle from '@cloudscape-design/components/toggle';
import FormField from '@cloudscape-design/components/form-field';

interface TemperatureToggleProps {
  useFahrenheit: boolean;
  onChange: (useFahrenheit: boolean) => void;
}

export function TemperatureToggle({ useFahrenheit, onChange }: TemperatureToggleProps) {
  return (
    <FormField label="Temperature Unit" description="Switch between Celsius and Fahrenheit">
      <Toggle checked={useFahrenheit} onChange={({ detail }) => onChange(detail.checked)}>
        {useFahrenheit ? '°F (Fahrenheit)' : '°C (Celsius)'}
      </Toggle>
    </FormField>
  );
}
