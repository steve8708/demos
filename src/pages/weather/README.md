# Weather Dashboard

A comprehensive weather dashboard built with Cloudscape Design System that provides real-time weather information and 7-day forecasts using the Open Meteo APIs.

## Features

- **Current Weather Display**: Shows current temperature, weather conditions, humidity, wind speed, and direction
- **Location Search**: Search for any city worldwide using the geocoding API
- **7-Day Forecast**: Detailed weekly forecast with high/low temperatures, precipitation, and wind data
- **Responsive Design**: Fully responsive using Cloudscape Design System components
- **Error Handling**: Proper error states and loading indicators
- **Accessibility**: Built with semantic HTML and ARIA attributes

## APIs Used

- **Open Meteo Weather API**: Free weather data without API key requirements
  - Current weather: `https://api.open-meteo.com/v1/forecast`
  - Location search: `https://geocoding-api.open-meteo.com/v1/search`

## Components

- `WeatherCard`: Displays current weather conditions
- `ForecastTable`: Shows 7-day weather forecast in a table format
- `LocationSearch`: Autocomplete search for locations

## Usage

Navigate to `/weather` to access the weather dashboard. The default location is London, UK. Use the search field to find weather information for any city worldwide.

## Technical Details

- Built with React and TypeScript
- Uses Cloudscape Design System components
- Follows the project's established patterns and conventions
- Includes proper error handling and loading states
- Styled with SCSS for responsive design
