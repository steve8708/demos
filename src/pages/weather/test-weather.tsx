// Test component to debug Open-Meteo API
import React, { useState } from 'react';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

export function TestWeather() {
  const [result, setResult] = useState<string>('');

  const testAPI = async () => {
    try {
      setResult('Testing...');

      // Very simple test
      const url =
        'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m&timezone=auto';
      console.log('Testing URL:', url);

      const response = await fetch(url);
      console.log('Response:', response);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Data:', data);

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Test failed:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <SpaceBetween size="m">
      <Button onClick={testAPI}>Test Open-Meteo API</Button>
      <Box>
        <pre style={{ fontSize: '12px', maxHeight: '400px', overflow: 'auto' }}>{result}</pre>
      </Box>
    </SpaceBetween>
  );
}
