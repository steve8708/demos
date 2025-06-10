# Weather Dashboard

A comprehensive weather dashboard powered by the Open-Meteo API, built using Cloudscape Design System components.

## Features

### Real-time Weather Data

- Current weather conditions including temperature, wind speed, and weather codes
- Automatic refresh functionality with manual refresh option
- Multiple location support with 6 pre-configured cities worldwide

### Weather Widgets

1. **Current Weather Widget**: Displays current temperature, weather conditions, wind speed and direction
2. **Weather Statistics Widget**: Shows key metrics including daily high/low, humidity, and precipitation totals
3. **7-Day Forecast Widget**: Daily weather forecast with temperature ranges, precipitation, and wind data
4. **Hourly Forecast Widget**: Detailed hourly forecast table with toggle for 24h/all hours view
5. **Temperature Trends Widget**: Interactive line charts showing hourly and daily temperature trends

### Technical Features

- TypeScript for type safety
- Responsive design using Cloudscape Grid components
- Error handling with user-friendly error messages
- Loading states for all data fetching operations
- Status indicators showing last update time

## API Integration

The dashboard uses the free Open-Meteo API (https://open-meteo.com) which provides:

- No API key required
- Global weather coverage
- Current weather conditions
- Hourly and daily forecasts
- Multiple weather parameters (temperature, humidity, precipitation, wind)

## Available Locations

The dashboard includes 6 pre-configured locations:

- New York, USA
- London, UK
- Tokyo, Japan
- Sydney, Australia
- Paris, France
- Berlin, Germany

## Weather Codes

The application includes a comprehensive mapping of Open-Meteo weather codes to human-readable descriptions covering:

- Clear and cloudy conditions
- Various types of precipitation (rain, snow, sleet)
- Fog and atmospheric conditions
- Thunderstorms and severe weather

## File Structure

```
src/pages/weather-dashboard/
├── components/
│   ├── widgets/
│   │   ├── current-weather.tsx      # Current conditions widget
│   │   ├── weather-stats.tsx        # Key statistics widget
│   │   ├── daily-forecast.tsx       # 7-day forecast widget
│   │   ├── hourly-forecast.tsx      # Hourly forecast table
│   │   └── temperature-trend.tsx    # Temperature charts
│   ├── content.tsx                  # Main dashboard content layout
│   ├── header.tsx                   # Dashboard header with controls
│   └── index.ts                     # Component exports
├── app.tsx                          # Main app component
├── index.tsx                        # Route entry point
├── types.ts                         # TypeScript interfaces
├── weather-service.ts               # API service layer
└── README.md                        # This file
```

## Usage

The weather dashboard is accessible at `/weather-dashboard` and is automatically included in the main demo homepage under the "Dashboards" category.
